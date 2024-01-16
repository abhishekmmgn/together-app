import ConversationSkeleton from "@/components/messages/conversation-skeleton";

export default function Loading() {
  return (
    <div className="p-5 space-y-4 ">
      {Array(8)
        .fill(null)
        .map((_, i) => (
          <ConversationSkeleton key={i} />
        ))}
    </div>
  );
}
