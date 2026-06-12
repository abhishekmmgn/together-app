import Notification from "@/components/notifications/notification";
import type { NotificationType } from "@/types";
import ErrorInfo from "@/components/error-info";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUserIdFromCookies } from "@/lib/getDataFromToken";

export default async function Notifications() {
	const userId = await getUserIdFromCookies();
	if (!userId) return null;

	try {
		const rows = await db
			.select()
			.from(notifications)
			.where(eq(notifications.userId, userId));

		const data: NotificationType[] = rows.map((n) => ({
			_id: n.id,
			message: n.message,
			read: n.read ?? false,
			destination: n.destination ?? "",
			createdAt: n.createdAt ?? new Date(),
		}));

		if (!data.length) {
			return (
				<div className="w-full h-[80vh] flex flex-col justify-center items-center">
					<h1 className="font-medium text-center">No new notifications.</h1>
				</div>
			);
		}

		return (
			<>
				{data.map((notification) => (
					<Notification
						key={notification._id}
						message={notification.message}
						read={notification.read}
						createdAt={notification.createdAt}
						destination={notification.destination}
					/>
				))}
			</>
		);
	} catch {
		return <ErrorInfo />;
	}
}
