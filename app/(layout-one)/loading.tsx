import PostSkeleton from "@/components/post/post-skeleton";

export default function Loading() {
  return (
    <div className="p-5 space-y-6">
      <PostSkeleton />
      <PostSkeleton />
    </div>
  );
}
