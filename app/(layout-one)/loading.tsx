import PostSkeleton from "@/components/post/post-skeleton";
import { Separator } from "@/components/ui/separator";

export default function Loading() {
  return (
    <main className="p-5 space-y-2">
      <PostSkeleton />
      <Separator />
      <PostSkeleton />
    </main>
  );
}
