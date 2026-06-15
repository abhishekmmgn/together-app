import { Skeleton } from "@/components/ui/skeleton";

export default function ConversationSkeleton() {
	return (
		<div className="py-1 px-5 lg:px-0">
			<div className="w-full h-17 flex items-center p-2 gap-4 rounded-xl">
				<Skeleton className="h-14 w-14 rounded-full shrink-0" />
				<div className="w-full space-y-2">
					<div className="flex items-center justify-between gap-5">
						<Skeleton className="h-4 w-[45%]" />
						<Skeleton className="h-3 w-[18%]" />
					</div>
					<Skeleton className="h-3.5 w-4/5" />
				</div>
			</div>
		</div>
	);
}
