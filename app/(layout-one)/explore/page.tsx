"use client";

import { useState } from "react";
import SearchBar from "@/components/searchbar";
import { useSearchParams } from "next/navigation";
import SearchSuggestions from "@/components/explore/search-suggestions";
import SearchDefault from "@/components/explore/search-default";
import SearchResults from "@/components/explore/search-results";

export default function SearchPage() {
  const [isActive, setActive] = useState(false);
  const searchParams = useSearchParams();

  const searchQuery = searchParams ? searchParams.get("query") : null;

  function handleSearchBarToggle() {
    setActive(!isActive);
  }
  function toggleSearchBarOn() {
    setActive(true);
  }
  function toggleSearchBarOff() {
    setActive(false);
  }

  return (
    <>
      <SearchBar
        active={isActive}
        placeholder="Search for friends, family and more"
        toggleSearchBarOn={toggleSearchBarOn}
        toggleSearchBarOff={toggleSearchBarOff}
      />

      {searchQuery && !isActive && (
        <SearchResults query={searchQuery} />
      )}
      {!searchQuery && !isActive && <SearchDefault />}
      {isActive && <SearchSuggestions />}
    </>
  );
}
