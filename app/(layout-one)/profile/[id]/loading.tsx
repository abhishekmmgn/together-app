import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import PostSkeleton from "@/components/post/post-skeleton";

export default function LoadingDynamicProfile() {
  return (
    <div className="p-5">
      <div className="grid gap-4 pb-4">
        <Skeleton className="w-28 lg:w-32 aspect-square rounded-md" />
        <div>
          <Skeleton className="-mt-1 h-3 w-24" />
          <Skeleton className="mb-1 h-3 w-48" />
        </div>
        <div className="flex flex-col gap-3">
          <Button disabled variant="outline" className="mx-auto">
            Message
          </Button>
          <Button disabled className="mx-auto">
            Add as Friend
          </Button>
          <Button disabled variant="secondary" className="mx-auto">
            Share Profile
          </Button>
        </div>
      </div>
      <Separator />
      <div className="py-6 space-y-4">
        <div className="space-y-2">
          <h1 className="font-medium text-2xl">Activity</h1>
          <PostSkeleton />
        </div>
      </div>
    </div>
  );
}
