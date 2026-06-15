import ProfileCardSkeleton from "@/components/explore/profile-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function FriendsLoading() {
	return (
		<div className="w-full h-full px-5 lg:px-0">
			{/* Back button */}
			<div className="h-11 flex items-center gap-1">
				<Skeleton className="h-5 w-5 rounded-full" />
				<Skeleton className="h-4 w-8 rounded-sm" />
			</div>

			{Array.from({ length: 6 }).map((_, i) => (
				<ProfileCardSkeleton key={i} />
			))}
		</div>
	);
}
