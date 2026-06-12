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
		<div className="w-full h-full flex flex-col overflow-hidden">
			<SearchBar
				searchActive={isActive}
				setSearchActive={setIsActive}
				placeholder="Search for people, posts and more"
				className="relative sm:top-0 shrink-0"
			/>

			{searchQuery && <SearchResults query={searchQuery} />}
			{!searchQuery && children}
		</div>
	);
}
