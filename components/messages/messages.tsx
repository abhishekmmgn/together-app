"use client";

import { useState, useEffect } from "react";
import Conversation from "@/components/messages/conversation";
import SearchBar from "@/components/searchbar";
import MessageRoom from "@/components/messages/message-room";
import NewMessage from "@/components/messages/new-message";
import SearchConversation from "@/components/messages/search-conversation";
import type { ActiveConversationType, ConversationType } from "@/types";
import ConversationSkeleton from "@/components/messages/conversation-skeleton";
import { useQuery } from "@tanstack/react-query";

export default function Messages() {
	const [searchActive, setSearchActive] = useState(false);
	const [activeConversation, setActiveConversation] =
		useState<ActiveConversationType>({
			conversationId: "",
			otherUserId: "",
		}); // "0" for conversation not created, otherwise mongodb's conversation _id, defaults to empty string

	const { data, error, isError, isPending } = useQuery({
		queryKey: ["messages"],
		queryFn: async () => {
			const res = await fetch("/api/conversations/");
			const data = await res.json();
			return data.data;
		},
		staleTime: 1000 * 5,
	});

	if (isPending) {
		return (
			<>
				<SearchBar
					searchActive={searchActive}
					setSearchActive={setSearchActive}
					placeholder="Search for friends, family and more"
				/>
				<div className="pt-2 px-5 space-y-4 lg:px-0">
					{Array(8)
						.fill(null)
						.map((_, i) => (
							<ConversationSkeleton key={i} />
						))}
				</div>
			</>
		);
	}

	// message room layout
	if (!searchActive && activeConversation.conversationId.length > 0) {
		return (
			<MessageRoom
				activeConversation={activeConversation}
				setActiveConversation={setActiveConversation}
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

			{/* searching */}
			{searchActive && !activeConversation.conversationId.length && (
				<SearchConversation
					searchActive={searchActive}
					setSearchActive={setSearchActive}
					conversations={data}
					setActiveConversation={setActiveConversation}
				/>
			)}

			{/* default layout */}
			{!searchActive && !activeConversation.conversationId.length && (
				<>
					<NewMessage setActiveConversation={setActiveConversation} />
					{!data.length ? (
						<div className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8">
							<p className="leading-7">No conversations yet. </p>
						</div>
					) : (
						<>
							{data.map((conversation: ConversationType) => (
								<Conversation
									conversationId={conversation.conversationId}
									setActiveConversation={setActiveConversation}
									lastMessage={conversation.lastMessage}
									user={conversation.user}
									key={conversation.conversationId}
								/>
							))}
						</>
					)}
				</>
			)}
		</>
	);
}
