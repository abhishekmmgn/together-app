"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
	useRouter,
	usePathname,
	useSearchParams,
	type ReadonlyURLSearchParams,
} from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Conversation from "@/components/messages/conversation";
import SearchBar from "@/components/searchbar";
import MessageRoom from "@/components/messages/message-room";
import NewMessage from "@/components/messages/new-message";
import SearchConversation from "@/components/messages/search-conversation";
import { useWebSocket, type WsMessage } from "@/hooks/useWebSocket";
import type {
	ActiveConversationType,
	ConversationType,
	ConversationData,
	Message,
} from "@/types";

export default function Messages({
	initialConversations,
	currentUserId,
}: {
	initialConversations: ConversationType[];
	currentUserId: string;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [searchActive, setSearchActive] = useState(false);
	const [activeConversation, setActiveConversationState] =
		useState<ActiveConversationType>(() => activeFromParams(searchParams));
	const queryClient = useQueryClient();

	// Keep a live ref so the URL-aware setter can resolve updater-function form
	// without re-creating the callback on every state change.
	const activeRef = useRef(activeConversation);
	activeRef.current = activeConversation;

	// URL is the source of truth: update state AND the query string together.
	const setActiveConversation = useCallback<
		React.Dispatch<React.SetStateAction<ActiveConversationType>>
	>(
		(action) => {
			const next =
				typeof action === "function" ? action(activeRef.current) : action;
			const qs = paramsForActive(next);
			router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
			setActiveConversationState(next);
		},
		[router, pathname],
	);

	// Re-sync when the URL changes externally (browser back/forward, deep link).
	useEffect(() => {
		const next = activeFromParams(searchParams);
		setActiveConversationState((prev) =>
			prev.conversationId === next.conversationId &&
			prev.otherUserId === next.otherUserId
				? prev
				: next,
		);
	}, [searchParams]);

	const { data: conversations = initialConversations } = useQuery<
		ConversationType[]
	>({
		queryKey: ["conversations"],
		queryFn: fetchConversations,
		initialData: initialConversations,
		staleTime: 30_000,
	});

	const handleWsMessage = useCallback(
		(msg: WsMessage) => {
			// Always refresh the conversation list so the last-message preview updates
			queryClient.invalidateQueries({ queryKey: ["conversations"] });

			// If the user is inside this specific conversation, update messages in place
			const activeConvId = activeConversation.conversationId;
			if (!activeConvId || msg.conversationId !== activeConvId) return;

			const key = ["conversation", activeConvId];
			queryClient.setQueryData<ConversationData>(
				key,
				(prev: ConversationData | undefined) => {
					if (!prev) return prev;
					if (prev.messages.some((m: Message) => m.id === msg.id)) return prev;

					// Replace matching optimistic entry when sender's own echo arrives
					if (msg.senderId === currentUserId) {
						const idx = prev.messages.findLastIndex(
							(m: Message) =>
								m.id.startsWith("opt-") && m.content === msg.content,
						);
						if (idx !== -1) {
							const updated = [...prev.messages];
							updated[idx] = {
								id: msg.id,
								senderId: msg.senderId,
								content: msg.content,
								createdAt: msg.createdAt,
							};
							return { ...prev, messages: updated };
						}
					}

					return {
						...prev,
						messages: [
							...prev.messages,
							{
								id: msg.id,
								senderId: msg.senderId,
								content: msg.content,
								createdAt: msg.createdAt,
							},
						],
					};
				},
			);
		},
		[activeConversation.conversationId, currentUserId, queryClient],
	);

	const { send } = useWebSocket({ onMessage: handleWsMessage, enabled: true });

	if (!searchActive && activeConversation.conversationId.length > 0) {
		return (
			<MessageRoom
				activeConversation={activeConversation}
				setActiveConversation={setActiveConversation}
				currentUserId={currentUserId}
				send={send}
			/>
		);
	}

	return (
		<>
			<SearchBar
				searchActive={searchActive}
				setSearchActive={setSearchActive}
				placeholder="Search for friends, family and more"
			/>

			{searchActive && !activeConversation.conversationId.length && (
				<SearchConversation
					searchActive={searchActive}
					setSearchActive={setSearchActive}
					conversations={conversations}
					setActiveConversation={setActiveConversation}
				/>
			)}

			{!searchActive && !activeConversation.conversationId.length && (
				<>
					<NewMessage setActiveConversation={setActiveConversation} />
					{!conversations.length ? (
						<div className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8">
							<p className="leading-7">No conversations yet</p>
						</div>
					) : (
						conversations.map((conversation: ConversationType) => (
							<Conversation
								conversationId={conversation.conversationId}
								setActiveConversation={setActiveConversation}
								lastMessage={conversation.lastMessage}
								user={conversation.user}
								unreadCount={conversation.unreadCount}
								key={conversation.conversationId}
							/>
						))
					)}
				</>
			)}
		</>
	);
}

async function fetchConversations(): Promise<ConversationType[]> {
	const res = await fetch("/api/conversations");
	if (!res.ok) return [];
	const json = await res.json();
	return json.data ?? [];
}

// The open conversation lives in the URL so a refresh / deep link reopens it:
//   ?c=<conversationId> for an existing conversation
//   ?u=<otherUserId>    for a not-yet-created conversation
// `conversationId: "0"` is the existing "new chat" sentinel (length 1 => looked
// up by user in MessageRoom), so we reuse it for the ?u= case.
function activeFromParams(
	params: URLSearchParams | ReadonlyURLSearchParams,
): ActiveConversationType {
	const c = params.get("c");
	if (c) return { conversationId: c, otherUserId: "" };
	const u = params.get("u");
	if (u) return { conversationId: "0", otherUserId: u };
	return { conversationId: "", otherUserId: "" };
}

function paramsForActive(active: ActiveConversationType): string {
	const params = new URLSearchParams();
	if (active.conversationId && active.conversationId.length > 1) {
		params.set("c", active.conversationId);
	} else if (active.otherUserId) {
		params.set("u", active.otherUserId);
	}
	return params.toString();
}
