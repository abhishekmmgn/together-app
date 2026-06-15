import CommentsSkeleton from "@/components/post/comments-skeleton";
import PostSkeleton from "@/components/post/post-skeleton";

export default function PostLoading() {
	return (
		<>
			<PostSkeleton />
			<div className="p-5 lg:px-0">
				<CommentsSkeleton />
			</div>
		</>
	);
}
