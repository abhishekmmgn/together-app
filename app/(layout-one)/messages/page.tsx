"use client";

import { useState } from "react";
import Conversation from "@/components/messages/conversation";
import SearchBar from "@/components/searchbar";

export default function ConversationsPage() {
  const [isActive, setActive] = useState(false);

  function handleSearchBarToggle() {
    setActive(!isActive);
  }
  function toggleSearchBarOn() {
    setActive(true);
  }
  return (
    <>
      <SearchBar
        active={isActive}
        placeholder="Search conversation"
        handleClick={handleSearchBarToggle}
        handleFocus={toggleSearchBarOn}
      />
      {isActive ? (
        <div className="w-full h-full py-2 transition-all ease-in-out duration-300">
          <Conversation />
          <Conversation />
        </div>
      ) : (
        <>
          <Conversation />
          <Conversation />
        </>
      )}
    </>
  );
}
