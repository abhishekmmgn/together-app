"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Conversation from "./conversation";
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
      <Navbar title="Messages" />
      <SearchBar
        active={isActive}
        placeholder="Search organizations"
        handleClick={handleSearchBarToggle}
        handleFocus={toggleSearchBarOn}
      />
        {isActive ? (
          <div className="w-full h-full py-2 transition-all ease-in-out duration-300">
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
