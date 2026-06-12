import SearchDefault from "@/components/explore/search-default";
import Search from "@/components/search";
import type { Metadata } from "next";
import { getUserIdFromCookies } from "@/lib/getDataFromToken";
import { getSuggestions } from "@/lib/get-suggestions";

export const metadata: Metadata = {
	title: "Explore",
};

export default async function SearchPage() {
	const curUserId = await getUserIdFromCookies();
	const suggestions = await getSuggestions(curUserId);

	return (
		<Search>
			<SearchDefault suggestions={suggestions} />
		</Search>
	);
}
