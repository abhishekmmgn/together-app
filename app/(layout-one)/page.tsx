import InfinitePosts from "@/components/post/infinite-posts";
import NewPost from "@/components/post/new-post";

export default function Home() {
	return (
		<>
			<NewPost />
			<InfinitePosts />
		</>
	);
}
