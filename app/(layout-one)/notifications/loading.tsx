import NotificationSkeleton from "@/components/notifications/notification-skeleton";

export default function Loading() {
  return (
    <div className="p-5 space-y-4 ">
      {Array(8)
        .fill(null)
        .map((_, i) => (
          <NotificationSkeleton key={i} />
        ))}
    </div>
  );
}
