import { Skeleton } from "@/components/ui/skeleton";
import ExploreSkeleton from "./explore-skeleton";

export default function Loading() {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-full space-y-2">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <ExploreSkeleton />
      <ExploreSkeleton />
      <ExploreSkeleton />
      <ExploreSkeleton />
      <ExploreSkeleton />
      <ExploreSkeleton />
      <ExploreSkeleton />
      <ExploreSkeleton />
      <ExploreSkeleton />
      <ExploreSkeleton />
      <ExploreSkeleton />
    </div>
  );
}
