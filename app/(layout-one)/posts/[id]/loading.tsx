import PostSkeleton from "@/components/post/post-skeleton";
import CommentsSkeleton from "@/components/post/comments-skeleton";

export default function Loading() {
  return (
    <div className="p-5 space-y-4">
      <PostSkeleton />
      <CommentsSkeleton />
    </div>
  );
}
