import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn("animate-pulse rounded-2xl bg-muted", className)}
			{...props}
		/>
	);
}

function SkeletonInput({ className }: { className?: string }) {
	return <Skeleton className={cn("h-9 w-full rounded-md", className)} />;
}

function SkeletonButton({
	size = "default",
	className,
}: {
	size?: "default" | "sm" | "icon";
	className?: string;
}) {
	return (
		<Skeleton
			className={cn(
				"rounded-md",
				size === "default" && "h-9 w-20",
				size === "sm" && "h-8 w-16",
				size === "icon" && "size-9",
				className,
			)}
		/>
	);
}

function SkeletonSwitch({ className }: { className?: string }) {
	return <Skeleton className={cn("h-5 w-9 rounded-full", className)} />;
}

export { Skeleton, SkeletonInput, SkeletonButton, SkeletonSwitch };
