"use client";

import { useState } from "react";
import Conversation from "@/components/messages/conversation";
import SearchBar from "@/components/searchbar";
import MessageRoom from "@/components/messages/message-room";
import NewMessage from "@/components/messages/new-message";
import SearchConversation from "@/components/messages/search-conversation";
import type { ActiveConversationType, ConversationType } from "@/types";

export default function Messages({
	initialConversations,
}: {
	initialConversations: ConversationType[];
}) {
	const [searchActive, setSearchActive] = useState(false);
	const [activeConversation, setActiveConversation] =
		useState<ActiveConversationType>({
			conversationId: "",
			otherUserId: "",
		});

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

			{searchActive && !activeConversation.conversationId.length && (
				<SearchConversation
					searchActive={searchActive}
					setSearchActive={setSearchActive}
					conversations={initialConversations}
					setActiveConversation={setActiveConversation}
				/>
			)}

			{!searchActive && !activeConversation.conversationId.length && (
				<>
					<NewMessage setActiveConversation={setActiveConversation} />
					{!initialConversations.length ? (
						<div className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8">
							<p className="leading-7">No conversations yet. </p>
						</div>
					) : (
						<>
							{initialConversations.map((conversation: ConversationType) => (
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
