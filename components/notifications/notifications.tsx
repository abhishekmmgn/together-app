"use client";

import Notification from "@/components/notifications/notification";
import type { NotificationType } from "@/types";
import NotificationSkeleton from "@/components/notifications/notification-skeleton";
import { useQuery } from "@tanstack/react-query";
import ErrorInfo from "@/components/error-info";

export default function Notifications() {
	const { isPending, error, data, isError } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const res = await fetch("/api/notifications");
			if (res.ok) {
				const data = await res.json();
				return data;
			}
		},
		staleTime: 1000 * 60 * 5,
	});

	if (isPending) {
		return (
			<div className="p-5 space-y-4">
				{Array(8)
					.fill(null)
					.map((_, i) => (
						<NotificationSkeleton key={i} />
					))}
			</div>
		);
	}
	if (isError) {
		console.log(error);
		return <ErrorInfo />;
	}
	return (
		<>
			{data.length ? (
				data.map((notification: NotificationType) => (
					<Notification
						key={notification._id}
						message={notification.message}
						read={notification.read}
						createdAt={new Date(notification.createdAt)}
						destination={notification.destination}
					/>
				))
			) : (
				<div className="w-full h-[80vh] flex flex-col justify-center items-center">
					<h1 className="md:+ font-medium text-center">
						No new notifications.
					</h1>
				</div>
			)}
		</>
	);
}
