import ConversationSkeleton from "./conversation-skeleton";

export default function Loading() {
  return (
    <div className="p-5 space-y-4 ">
      <ConversationSkeleton />
      <ConversationSkeleton />
      <ConversationSkeleton />
      <ConversationSkeleton />
      <ConversationSkeleton />
      <ConversationSkeleton />
      <ConversationSkeleton />
      <ConversationSkeleton />
    </div>
  );
}
