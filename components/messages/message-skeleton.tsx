import { Skeleton } from "@/components/ui/skeleton";

export default function MessageSkeleton() {
  return (
    <div className="flex flex-col space-y-2">
      <Skeleton className="h-5 w-5" />
      <Skeleton className="h-20 w-2/3" />
    </div>
  );
}
