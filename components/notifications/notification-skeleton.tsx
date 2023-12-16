import { Skeleton } from "@/components/ui/skeleton";

export default function NotificationSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-14 rounded-[var(--radius)]" />
      <div className="w-full space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}
