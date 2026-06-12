import SearchDefault from "@/components/explore/search-default";
import Search from "@/components/search";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Explore",
};

export default async function SearchPage() {
	let domain = process.env.NEXT_PUBLIC_DOMAIN || "localhost:3000";
	if (!/^https?:\/\//.test(domain)) domain = `http://${domain}`;

	const suggestions = await fetch(`${domain}/api/explore/suggestions`).then(
		(res) => res.json(),
	);
	return (
		<Search>
			<SearchDefault suggestions={suggestions.data} />
		</Search>
	);
}
