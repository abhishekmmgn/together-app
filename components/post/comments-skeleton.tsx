import { Skeleton, SkeletonInput } from "@/components/ui/skeleton";

export default function CommentsSkeleton() {
	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<Skeleton className="h-4 w-28 rounded-sm" />
				<div className="flex gap-3 items-center">
					<SkeletonInput />
					<Skeleton className="size-9 shrink-0 rounded-md" />
				</div>
			</div>
			<div className="space-y-3">
				<div className="flex gap-2">
					<Skeleton className="h-9 w-9 rounded-full shrink-0" />
					<Skeleton className="h-14 w-3/5 rounded-lg" />
				</div>
				<div className="flex justify-end">
					<Skeleton className="h-10 w-2/5 rounded-lg" />
				</div>
				<div className="flex gap-2">
					<Skeleton className="h-9 w-9 rounded-full shrink-0" />
					<Skeleton className="h-10 w-1/2 rounded-lg" />
				</div>
			</div>
		</div>
	);
}
