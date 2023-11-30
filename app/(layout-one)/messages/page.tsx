"use client";

import { useState } from "react";
import Conversation from "@/components/messages/conversation";
import SearchBar from "@/components/searchbar";
import MessageRoom from "@/components/messages/message-room";
import NewMessage from "@/components/messages/new-message";

export default function ConversationsPage() {
  const [searchActive, setSearchActive] = useState(false);
  const [conversationActive, setconversationActive] = useState<string>("");

  // message room layout
  if (!searchActive && conversationActive.length > 0) {
    return (
      <MessageRoom
        conversationId={conversationActive}
        setconversationActive={setconversationActive}
      />
    );
  }

  // searching
  if (searchActive && conversationActive.length === 0) {
    return (
      <>
        <SearchBar
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          placeholder="Search for friends, family and more"
        />
        <div className="w-full h-full py-2 transition-all ease-in-out duration-300">
          <Conversation
            conversationId="1"
            setconversationActive={setconversationActive}
          />
        </div>
      </>
    );
  }

  // default layout
  if (!searchActive && conversationActive.length === 0) {
    return (
      <>
        <SearchBar
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          placeholder="Search for friends, family and more"
        />
        <>
          <NewMessage />
          <Conversation
            conversationId="1"
            setconversationActive={setconversationActive}
          />
        </>
      </>
    );
  }
}
