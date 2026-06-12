import InfinitePosts from "@/components/post/infinite-posts";
import NewPost from "@/components/post/new-post";

export default async function Home() {
	let domain = process.env.NEXT_PUBLIC_DOMAIN || "localhost:3000";
	if (!/^https?:\/\//.test(domain)) domain = `http://${domain}`;

	const response = await fetch(`${domain}/api/posts?page=1`, {
		cache: "no-store",
	});

	const { data } = await response.json();
	return (
		<>
			<NewPost />
			<InfinitePosts prerenderedPosts={data ?? []} />
		</>
	);
}
