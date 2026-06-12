import InfinitePosts from "@/components/post/infinite-posts";
import NewPost from "@/components/post/new-post";
import { getPosts } from "@/lib/get-posts";
import { getUserIdFromCookies } from "@/lib/getDataFromToken";

export default async function Home() {
	const curUserId = await getUserIdFromCookies();
	const data = await getPosts(1, curUserId);

	return (
		<>
			<NewPost />
			<InfinitePosts prerenderedPosts={data} />
		</>
	);
}
