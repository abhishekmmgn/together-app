"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/searchbar";
import TableRow from "@/components/table-row";
import ProfileCard from "@/components/explore/profile-card";

export default function SearchPage() {
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
        placeholder="Search for friends, family and more"
        handleClick={handleSearchBarToggle}
        handleFocus={toggleSearchBarOn}
      />
      {isActive ? (
        <div className="w-full h-screen transition-all ease-in-out duration-300">
          <ProfileCard />
          <ProfileCard />
        </div>
      ) : (
        <>
          <h2 className="py-2 px-5 text-2xl font-medium md:px-0">People you may know</h2>
          <>
            <ProfileCard />
            <ProfileCard />
          </>
        </>
      )}
    </>
  );
}
