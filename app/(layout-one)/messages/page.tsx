"use client";

import { useState, useEffect } from "react";
import Conversation from "@/components/messages/conversation";
import SearchBar from "@/components/searchbar";
import MessageRoom from "@/components/messages/message-room";
import NewMessage from "@/components/messages/new-message";
import SearchConversation from "@/components/messages/search-conversation";
import { ActiveConversationType, ConversationType } from "@/types";
import ConversationSkeleton from "@/components/messages/conversation-skeleton";

export default function ConversationsPage() {
  const [searchActive, setSearchActive] = useState(false);
  const [activeConversation, setActiveConversation] =
    useState<ActiveConversationType>({
      conversationId: "",
      otherUserId: "",
    }); // "0" for conversation not created, otherwise mongodb's conversation _id, defaults to empty string
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [loading, setLoading] = useState(true);

  async function getData() {
    try {
      const res = await fetch("/api/conversations/", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setConversations(data.data);
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // loading
  if (loading) {
    return (
      <div className="p-5 space-y-4 ">
        {Array(10)
          .fill(null)
          .map((_, i) => (
            <ConversationSkeleton key={i} />
          ))}
      </div>
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
      {searchActive && activeConversation.conversationId.length === 0 && (
        <SearchConversation
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          conversations={conversations}
          setActiveConversation={setActiveConversation}
        />
      )}

      {/* default layout */}
      {!searchActive && activeConversation.conversationId.length === 0 && (
        <>
          <NewMessage setActiveConversation={setActiveConversation} />
          {conversations.length == 0 ? (
            <div className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8">
              <p className="leading-7">No conversations yet. </p>
            </div>
          ) : (
            <>
              {conversations.map((conversation: ConversationType) => (
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
