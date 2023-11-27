import { Separator } from "@/components/ui/separator";
import { Skeleton } from "../ui/skeleton";

export default function ProfileCardSkeleton() {
  return (
    <>
      <div className="w-full h-16 flex items-center gap-3">
        <Skeleton className="h-12 w-12 aspect-square" />
        <div className="w-full space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <Separator />
    </>
  );
}
