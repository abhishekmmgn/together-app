import { Skeleton } from "@/components/ui/skeleton";

export default function CommentsSkeleton() {
	return (
		<div className="space-y-3">
			<div className="space-y-2">
				<Skeleton className="w-1/3 h-8 rounded-[var(--radius)]" />
				<Skeleton className="w-1/4 h-8 rounded-[var(--radius)]" />
			</div>
			<Skeleton className="w-full h-9 rounded-[var(--radius)]" />
		</div>
	);
}
