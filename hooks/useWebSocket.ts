"use client";

import { useEffect, useRef, useCallback } from "react";

export type WsMessage = {
	type: "message";
	id: string;
	conversationId: string;
	senderId: string;
	content: string;
	createdAt: string;
};

type UseWebSocketOptions = {
	onMessage: (msg: WsMessage) => void;
	enabled?: boolean;
};

export function useWebSocket({
	onMessage,
	enabled = true,
}: UseWebSocketOptions) {
	const wsRef = useRef<WebSocket | null>(null);
	const retryDelayRef = useRef(1000);
	const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
		null,
	);
	const mountedRef = useRef(true);
	const onMessageRef = useRef(onMessage);
	onMessageRef.current = onMessage;

	const clearPing = () => {
		if (pingIntervalRef.current) {
			clearInterval(pingIntervalRef.current);
			pingIntervalRef.current = null;
		}
	};

	const scheduleReconnect = useCallback(() => {
		if (!mountedRef.current) return;
		reconnectTimeoutRef.current = setTimeout(() => {
			retryDelayRef.current = Math.min(retryDelayRef.current * 2, 30_000);
			connect();
		}, retryDelayRef.current);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const connect = useCallback(async () => {
		if (!mountedRef.current) return;

		// Fetch a short-lived WS ticket. The ticket endpoint also returns the
		// WS URL (with its `$default` stage path intact) — we can't use a
		// NEXT_PUBLIC env var here because the stage path is mangled when
		// inlined into the client bundle.
		let token: string;
		let wsUrl: string;
		try {
			const res = await fetch("/api/ws-ticket", { method: "POST" });
			if (!res.ok) {
				const body = await res.text().catch(() => "");
				console.error(`[WS] ws-ticket returned ${res.status}:`, body);
				scheduleReconnect();
				return;
			}
			const json = await res.json();
			token = json.token;
			wsUrl = json.url;
			if (!token || !wsUrl) {
				console.error("[WS] ws-ticket response missing token/url field:", json);
				scheduleReconnect();
				return;
			}
		} catch (err) {
			console.error("[WS] ws-ticket fetch threw:", err);
			scheduleReconnect();
			return;
		}

		if (!mountedRef.current) return;

		console.log("[WS] connecting to", wsUrl);
		const ws = new WebSocket(`${wsUrl}?token=${encodeURIComponent(token)}`);
		wsRef.current = ws;

		ws.onopen = () => {
			console.log("[WS] connected");
			retryDelayRef.current = 1000;
			pingIntervalRef.current = setInterval(
				() => {
					if (ws.readyState === WebSocket.OPEN)
						ws.send(JSON.stringify({ action: "ping" }));
				},
				5 * 60 * 1000,
			);
		};

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data) as WsMessage;
				if (data.type === "message") onMessageRef.current(data);
			} catch {
				// ignore malformed frames
			}
		};

		ws.onclose = (ev) => {
			console.log(`[WS] closed — code=${ev.code} reason="${ev.reason}"`);
			clearPing();
			scheduleReconnect();
		};

		ws.onerror = (ev) => {
			console.error("[WS] error", ev);
			ws.close();
		};
	}, [scheduleReconnect]);

	useEffect(() => {
		mountedRef.current = true;
		if (enabled) connect();

		return () => {
			mountedRef.current = false;
			clearPing();
			if (reconnectTimeoutRef.current)
				clearTimeout(reconnectTimeoutRef.current);
			wsRef.current?.close();
		};
	}, [enabled, connect]);

	const send = useCallback((data: Record<string, unknown>) => {
		if (wsRef.current?.readyState === WebSocket.OPEN) {
			wsRef.current.send(JSON.stringify(data));
			return true;
		}
		return false;
	}, []);

	return { send };
}
