"use client";

import { useState } from "react";
import SearchBar from "@/components/searchbar";
import { useSearchParams } from "next/navigation";
import SearchResults from "@/components/explore/search-results";

export default function Search({ children }: { children: React.ReactNode }) {
	const [isActive, setIsActive] = useState(false);
	const searchParams = useSearchParams();
	const searchQuery = searchParams ? searchParams.get("query") : null;

	return (
		<>
			<SearchBar
				searchActive={isActive}
				setSearchActive={setIsActive}
				placeholder="Search for people, posts and more."
			/>

			{searchQuery && !isActive && <SearchResults query={searchQuery} />}
			{!searchQuery && !isActive && children}
		</>
	);
}
