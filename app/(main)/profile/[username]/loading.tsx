import { Separator } from "@/components/ui/separator";
import { Skeleton, SkeletonButton } from "@/components/ui/skeleton";
import PostSkeleton from "@/components/post/post-skeleton";

export default function ProfilePageLoading() {
	return (
		<div className="p-5">
			<div className="grid gap-4 pb-4">
				<Skeleton className="w-28 h-28 lg:w-32 lg:h-32 rounded-xl" />
				<div>
					<Skeleton className="h-7 w-40 mb-1" />
					<Skeleton className="h-5 w-56" />
				</div>
				<div className="flex flex-col gap-3">
					<SkeletonButton className="h-9 w-full max-w-md mx-auto" />
					<SkeletonButton className="h-9 w-full max-w-md mx-auto" />
				</div>
			</div>

			<Separator />

			<div className="py-6 space-y-4">
				<Skeleton className="h-7 w-24" />
				<PostSkeleton />
			</div>
		</div>
	);
}
