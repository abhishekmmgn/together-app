"use client";

import { useState } from "react";
import SearchBar from "@/components/searchbar";
import { useSearchParams } from "next/navigation";
import SearchSuggestions from "@/components/explore/search-suggestions";
import SearchDefault from "@/components/explore/search-default";
import SearchResults from "@/components/explore/search-results";

export default function SearchPage() {
  const [isActive, setIsActive] = useState(false);
  const searchParams = useSearchParams();

  const searchQuery = searchParams ? searchParams.get("query") : null;

  return (
    <>
      <SearchBar
        searchActive={isActive}
        setSearchActive={setIsActive}
        placeholder="Search for friends, family and more"
      />

      {searchQuery && !isActive && <SearchResults query={searchQuery} />}
      {!searchQuery && !isActive && <SearchDefault />}
      {isActive && <SearchSuggestions />}
    </>
  );
}
