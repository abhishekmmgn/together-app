"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Message from "./message";
import Link from "next/link";
import SearchBar from "@/components/searchbar";

export default function MessagesPage() {
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
      <Link href={`/messages/1`}>
        {isActive ? (
          <div className="w-full h-full py-2 transition-all ease-in-out duration-300">
          </div>
        ) : (
          <>
            <Message />
            <Message />
          </>
        )}
      </Link>
    </>
  );
}
