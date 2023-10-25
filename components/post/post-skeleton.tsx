import { Skeleton } from "@/components/ui/skeleton";

export default function PostSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-14 rounded-md" />
        <div className="w-full space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="w-1/4 h-[20px] rounded-full" />
        <Skeleton className="w-1/3 h-[20px] rounded-full" />
        <Skeleton className="w-1/2 h-[20px] rounded-full" />
        <Skeleton className="w-full h-[200px] rounded-md" />
      </div>
      <div className="flex items-center space-x-1">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-5 w-5" />
      </div>
    </div>
  );
}
