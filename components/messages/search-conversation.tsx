import React, { useState, useEffect } from "react";
import Conversation from "./conversation";
import { ActiveConversationType, ConversationType } from "@/types";
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

  function getConversation() {
    const filteredConversations = props.conversations.filter((conversation) =>
      conversation.user.name.toLowerCase().includes(searchQuery!.toLowerCase())
    );
    setResults(filteredConversations);
  }

  useEffect(() => {
    if (searchQuery) {
      getConversation();
    } else {
      setResults([]);
    }
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
