import PostSkeleton from "./post/post-skeleton";

export default function Loading() {
  return (
    <div className="p-5 space-y-6">
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
}
