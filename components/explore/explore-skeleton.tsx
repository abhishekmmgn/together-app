import { Skeleton } from "@/components/ui/skeleton";

export default function ExploreSkeleton() {
	return (
		<div className="flex items-center space-x-4">
			<div className="w-full space-y-2">
				<Skeleton className="h-4 w-1/3" />
				<Skeleton className="h-[2px] w-full" />
			</div>
		</div>
	);
}
