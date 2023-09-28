import { Skeleton } from "@/components/ui/skeleton";

export default function ConversationSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-md" />
      <div className="w-full space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
