import { Skeleton } from "@/components/ui/skeleton";

export default function PostSkeleton() {
  return (
    <div className="pt-1 pb-2 space-y-3">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-14 rounded-[var(--radius)]" />
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-1/5" />
          <Skeleton className="h-4 w-[10%]" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="w-1/4 h-[20px] rounded-full" />
        <Skeleton className="w-1/3 h-[20px] rounded-full" />
        <Skeleton className="w-1/2 h-[20px] rounded-full" />
        <Skeleton className="w-full aspect-[3/2] rounded-[var(--radius)]" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-5 w-5" />
      </div>
    </div>
  );
}
