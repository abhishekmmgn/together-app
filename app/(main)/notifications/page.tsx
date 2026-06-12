import Notifications from "@/components/notifications/notifications";
import NotificationSkeleton from "@/components/notifications/notification-skeleton";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
	title: "Notifications",
};

export default function NotificationPage() {
	return (
		<Suspense
			fallback={
				<div className="p-5 space-y-4">
					{Array(8)
						.fill(null)
						.map((_, i) => (
							<NotificationSkeleton key={i} />
						))}
				</div>
			}
		>
			<Notifications />
		</Suspense>
	);
}
