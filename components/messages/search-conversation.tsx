import type React from "react";
import { useState, useEffect } from "react";
import Conversation from "./conversation";
import type { ActiveConversationType, ConversationType } from "@/types";
import { useSearchParams } from "next/navigation";

type PropsType = {
	searchActive: boolean;
	setSearchActive: React.Dispatch<React.SetStateAction<boolean>>;
	conversations: ConversationType[];
	setActiveConversation: React.Dispatch<
		React.SetStateAction<ActiveConversationType>
	>;
};

export default function SearchConversation(props: PropsType) {
	const [results, setResults] = useState<ConversationType[]>([]);
	const searchParams = useSearchParams();
	const searchQuery = searchParams ? searchParams.get("query") : "";

	useEffect(() => {
		function getConversation() {
			const filteredConversations = props.conversations.filter(
				(conversation) =>
					searchQuery &&
					conversation.user.name
						.toLowerCase()
						.includes(searchQuery.toLowerCase()),
			);
			setResults(filteredConversations);
		}
		searchQuery ? getConversation() : setResults([]);
	}, [searchQuery]);
	return (
		<div className="w-full h-full py-2 transition-all ease-in-out duration-300">
			{results.map((conversation: ConversationType) => (
				<Conversation
					conversationId={conversation.conversationId}
					setActiveConversation={props.setActiveConversation}
					lastMessage={conversation.lastMessage}
					user={conversation.user}
					key={conversation.conversationId}
				/>
			))}
		</div>
	);
}
