import ProfileCardSkeleton from "@/components/explore/profile-card-skeleton";
import { Skeleton, SkeletonInput } from "@/components/ui/skeleton";

export default function ExploreLoading() {
	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
			{/* SearchBar */}
			<div className="sticky relative sm:top-0 px-5 py-4 bg-background shrink-0 flex gap-4 items-center lg:px-0">
				<SkeletonInput />
			</div>

			{/* People you may know */}
			<div className="px-5 lg:px-0 flex flex-col overflow-hidden">
				<Skeleton className="h-7 w-48 mb-2 shrink-0" />
				<div className="flex-1 overflow-y-auto">
					{Array.from({ length: 8 }).map((_, i) => (
						<ProfileCardSkeleton key={i} />
					))}
				</div>
			</div>
		</div>
	);
}
