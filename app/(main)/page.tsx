import InfinitePosts from "@/components/post/infinite-posts";
import NewPost from "@/components/post/new-post";

export default async function Home() {
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_DOMAIN}/api/posts?page=1`,
		{ cache: "no-store" },
	);
	const { data } = await response.json();
	return (
		<>
			<NewPost />
			<InfinitePosts prerenderedPosts={data ?? []} />
		</>
	);
}
