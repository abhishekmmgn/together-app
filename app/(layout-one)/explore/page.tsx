"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import SearchBar from "@/components/searchbar";
import TableRow from "@/components/table-row";
import OrgCard from "./org-card";

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
      <Navbar title="Explore" />
      <>
        <SearchBar
          active={isActive}
          placeholder="Search organizations"
          handleClick={handleSearchBarToggle}
          handleFocus={toggleSearchBarOn}
        />
        {isActive ? (
          <div className="w-full h-screen px-5 py-2 transition-all ease-in-out duration-300">
            <OrgCard />
            <OrgCard />
          </div>
        ) : (
          <>
            <h2 className="pt-3 pb-1 px-5 text-2xl font-medium">
              Explore by Cause
            </h2>
            <>
              <TableRow title="Environment" />
              <TableRow title="Social Work" />
              <TableRow title="Education" />
              <TableRow title="Animals" />
              <TableRow title="Health" />
              <TableRow title="Cancer" />
              <TableRow title="Arts" />
              <TableRow title="Human Rights" />
              <TableRow title="International" />
              <TableRow title="Religion" />
              <TableRow title="Community" />
              <TableRow title="Disaster Relief" />
              <TableRow title="Sports" />
              <TableRow title="Other" />
            </>
          </>
        )}
      </>
    </>
  );
}
