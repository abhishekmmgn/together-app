import { Skeleton } from "@/components/ui/skeleton";
import PostSkeleton from "@/components/post/post-skeleton";

export default function LoadingDynamicProfile() {
  return (
    <div className="p-5">
      <div className="grid gap-4 pb-4">
        <Skeleton className="w-28 lg:w-32 aspect-square rounded-[var(--radius)]" />
        <div>
          <Skeleton className="mt-1 h-5 w-24" />
          <Skeleton className="mb-1 h-4 w-48" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-10 w-full max-w-md mx-auto" />
          <Skeleton className="h-10 w-full max-w-md mx-auto" />
        </div>
      </div>
      <div className="py-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <PostSkeleton />
        </div>
      </div>
    </div>
  );
}
