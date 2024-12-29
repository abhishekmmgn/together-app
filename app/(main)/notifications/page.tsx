import Notifications from "@/components/notifications/notifications";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Notifications",
};

export default function NotificationPage() {
	return <Notifications />;
}
