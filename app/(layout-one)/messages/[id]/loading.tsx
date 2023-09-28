import MessageSkeleton from "./message-skeleton";

export default function Loading() {
  return (
    <div className="p-5 space-y-4 ">
      <MessageSkeleton />
      <MessageSkeleton />
      <MessageSkeleton />
      <MessageSkeleton />
      <MessageSkeleton />
    </div>
  );
}
