import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function PostSkeleton() {
	return (
		<>
			<div className="pt-1 pb-3">
				<div className="px-4 lg:px-0 py-2 flex items-center gap-3">
					<Skeleton className="h-11 w-11 rounded-full shrink-0" />
					<div className="space-y-1.5">
						<Skeleton className="h-3.5 w-28" />
						<Skeleton className="h-3 w-16" />
					</div>
				</div>
				<div className="px-4 lg:px-0 space-y-1.5 mb-2">
					<Skeleton className="h-4 w-4/5" />
					<Skeleton className="h-4 w-3/5" />
					<Skeleton className="h-4 w-2/5" />
				</div>
				<Skeleton className="w-full aspect-3/2 rounded-none" />
				<div className="px-4 lg:px-0 h-11 flex gap-4 items-center">
					<Skeleton className="h-6 w-6 rounded-full" />
					<Skeleton className="h-5 w-5 rounded-full" />
					<Skeleton className="h-6 w-6 rounded-full" />
				</div>
				<div className="px-4 lg:px-0 flex gap-4">
					<Skeleton className="h-3 w-14" />
					<Skeleton className="h-3 w-20" />
				</div>
			</div>
			<Separator />
		</>
	);
}
