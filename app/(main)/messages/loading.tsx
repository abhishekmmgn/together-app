import ConversationSkeleton from "@/components/messages/conversation-skeleton";
import { SkeletonButton, SkeletonInput } from "@/components/ui/skeleton";

export default function MessagesLoading() {
	return (
		<>
			{/* SearchBar */}
			<div className="sticky inset-x-0 z-40 px-5 py-4 bg-background sm:top-14 lg:px-0">
				<SkeletonInput />
			</div>

			{Array.from({ length: 7 }).map((_, i) => (
				<ConversationSkeleton key={i} />
			))}

			{/* New message FAB */}
			<div className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10">
				<SkeletonButton size="sm" className="h-10 w-28" />
			</div>
		</>
	);
}
