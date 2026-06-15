import { Separator } from "@/components/ui/separator";
import { Skeleton, SkeletonButton } from "@/components/ui/skeleton";
import PostSkeleton from "@/components/post/post-skeleton";

export default function ProfileLoading() {
	return (
		<div className="py-4 lg:pb-8 lg:px-5">
			{/* ProfileCard */}
			<div className="w-full px-5 flex items-center justify-between lg:px-0 py-2">
				<div className="flex gap-3 items-center w-full">
					<Skeleton className="h-14 w-14 rounded-full shrink-0" />
					<div className="space-y-1.5">
						<Skeleton className="h-5 w-36" />
						<Skeleton className="h-4 w-44" />
					</div>
				</div>
				<SkeletonButton size="icon" className="shrink-0" />
			</div>

			<Separator />

			{/* Friends row */}
			<div className="px-5 w-full h-11 flex items-center justify-between lg:px-0">
				<Skeleton className="h-4 w-16" />
				<Skeleton className="h-5 w-5 rounded-full" />
			</div>

			<Separator />

			{/* Activity section */}
			<div className="pt-6 px-5 lg:px-0">
				<Skeleton className="h-7 w-24 mb-4" />
				<PostSkeleton />
			</div>
		</div>
	);
}
