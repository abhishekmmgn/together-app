import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
	return (
		<div className="space-y-2">
			<Skeleton className="w-1/2 h-[20px] rounded-full" />
			<Skeleton className="w-full h-[20px] rounded-full" />
		</div>
	);
}
