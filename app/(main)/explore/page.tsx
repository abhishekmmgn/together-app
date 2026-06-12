import SearchDefault from "@/components/explore/search-default";
import Search from "@/components/search";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
	title: "Explore",
};

export default async function SearchPage() {
	let domain = process.env.NEXT_PUBLIC_DOMAIN || "localhost:3000";
	if (!/^https?:\/\//.test(domain)) domain = `http://${domain}`;

	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value || "";

	const suggestions = await fetch(`${domain}/api/explore/suggestions`, {
		headers: {
			Cookie: `token=${token}`,
		},
	}).then((res) => res.json());
	return (
		<Search>
			<SearchDefault suggestions={suggestions.data || []} />
		</Search>
	);
}
