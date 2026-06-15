"use client";

import { useCallback, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type {
	ActiveConversationType,
	ConversationData,
	Message,
} from "@/types";

export const MESSAGES_PAGE_SIZE = 25;

export function useConversationMessages(active: ActiveConversationType) {
	const queryClient = useQueryClient();
	const cacheId = active.conversationId || active.otherUserId || "";
	const conversationKey = ["conversation", cacheId];

	const query = useQuery<ConversationData>({
		queryKey: conversationKey,
		queryFn: () => fetchInitial(active),
		// Keep data fresh within a session (live WS updates + pagination mutate the
		// cache in place, so we never want a focus/interval refetch to clobber them)
		// but always revalidate when the room is (re)opened. Messages received while
		// the user was on the list only update the list query, leaving this cache
		// stale — refetchOnMount pulls them in on open.
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnMount: "always",
		retry: false,
	});

	// Synchronous guard so rapid scroll events can't fire overlapping requests.
	const loadingRef = useRef(false);
	const [isLoadingOlder, setIsLoadingOlder] = useState(false);

	const loadOlder = useCallback(async (): Promise<boolean> => {
		const current = queryClient.getQueryData<ConversationData>(conversationKey);
		if (!current || !current.hasMore || loadingRef.current) return false;
		if (current.messages.length === 0) return false;

		// Pagination needs a real conversation id (the "0" sentinel has none yet).
		const convId = current.conversationId;
		if (!convId || convId.length <= 1) return false;

		loadingRef.current = true;
		setIsLoadingOlder(true);
		try {
			const before = current.messages[0].createdAt;
			const res = await fetch(
				`/api/conversation/${convId}?before=${encodeURIComponent(
					before,
				)}&limit=${MESSAGES_PAGE_SIZE}`,
				{ cache: "no-store" },
			);
			if (!res.ok) return false;

			const json = await res.json();
			const older: Message[] = json.data[1] ?? [];
			const hasMore: boolean = json.data[3] ?? false;

			if (older.length === 0) {
				queryClient.setQueryData<ConversationData>(
					conversationKey,
					(prev: ConversationData | undefined) =>
						prev ? { ...prev, hasMore: false } : prev,
				);
				return false;
			}

			queryClient.setQueryData<ConversationData>(
				conversationKey,
				(prev: ConversationData | undefined) => {
					if (!prev) return prev;
					const ids = new Set(prev.messages.map((m: Message) => m.id));
					const deduped = older.filter((m: Message) => !ids.has(m.id));
					return {
						...prev,
						messages: [...deduped, ...prev.messages],
						hasMore,
					};
				},
			);
			return true;
		} finally {
			loadingRef.current = false;
			setIsLoadingOlder(false);
		}
		// conversationKey is derived from cacheId
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [queryClient, cacheId]);

	return {
		data: query.data,
		isLoading: query.isLoading,
		isError: query.isError,
		hasMore: query.data?.hasMore ?? false,
		isLoadingOlder,
		loadOlder,
	};
}

// The room is opened either by an existing conversation id (?c=) or by the
// other user's id (?u=), so we pick the matching endpoint.
// Both return [otherUser, messages, conversationId, hasMore].
async function fetchInitial(
	active: ActiveConversationType,
): Promise<ConversationData> {
	const url =
		active.conversationId.length > 1
			? `/api/conversation/${active.conversationId}?limit=${MESSAGES_PAGE_SIZE}`
			: `/api/conversation-by-user/${active.otherUserId}?limit=${MESSAGES_PAGE_SIZE}`;

	const res = await fetch(url, { cache: "no-store" });
	if (!res.ok) throw new Error("Failed to fetch conversation");
	const json = await res.json();
	const data = json.data;
	return {
		otherUser: data[0],
		messages: data[1] ?? [],
		conversationId: data[2] ?? active.conversationId,
		hasMore: data[3] ?? false,
	};
}
