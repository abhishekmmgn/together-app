import SearchDefault from "@/components/explore/search-default";
import Search from "@/components/search";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Explore",
};

export const revalidate = 0;

export default async function SearchPage() {
	const suggestions = await fetch(
		`${process.env.NEXT_PUBLIC_DOMAIN}/api/explore/suggestions`,
	).then((res) => res.json());
	return (
		<Search>
			<SearchDefault suggestions={suggestions.data} />
		</Search>
	);
}
