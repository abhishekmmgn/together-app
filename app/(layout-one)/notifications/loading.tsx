import NotificationSkeleton from "@/components/notifications/notification-skeleton";

export default function Loading() {
  return (
    <div className="p-5 space-y-4 ">
      <NotificationSkeleton />
      <NotificationSkeleton />
      <NotificationSkeleton />
      <NotificationSkeleton />
      <NotificationSkeleton />
      <NotificationSkeleton />
      <NotificationSkeleton />
      <NotificationSkeleton />
    </div>
  );
}
