import { ShortErrorInfo } from "@/components/error-info";
import ChangePassword from "@/components/settings/change-password";
import DeleteAccountComponent from "@/components/settings/delete-account";
import LogoutComponent from "@/components/settings/logout";
import NotificationsPrefrences from "@/components/settings/notifications-prefrences";
import { SettingsSection } from "@/components/settings/settings-section";
import ThemeToggle from "@/components/settings/theme-toggler";
import { redirect } from "next/navigation";
import { getUserIdFromCookies } from "@/lib/getDataFromToken";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function SettingsPage() {
	const userId = await getUserIdFromCookies();
	if (!userId) redirect("/auth/login");

	const [user] = await db
		.select({ id: users.id, email: users.email })
		.from(users)
		.where(eq(users.id, userId));

	if (!user) redirect("/auth/login");

	return (
		<div className="p-4 px-5 space-y-6 lg:px-0 pb-10">
			<h1 className="text-3xl font-semibold tracking-tight pb-2 border-b border-border/60">
				Settings
			</h1>

			<div className="space-y-6">
				<SettingsSection title="Account">
					<div className="flex items-center justify-between p-4">
						<div className="space-y-0.5">
							<div className="text-base font-medium">Email Address</div>
							<div className="text-sm text-muted-foreground">
								{user.email || "No email available"}
							</div>
						</div>
					</div>
					<ChangePassword userId={user.id} />
					<LogoutComponent />
					<DeleteAccountComponent />
				</SettingsSection>

				<SettingsSection title="Notifications">
					<NotificationsPrefrences />
				</SettingsSection>

				<SettingsSection title="Appearance">
					<div className="flex items-center justify-between p-4">
						<div className="space-y-0.5">
							<div className="text-base font-medium">Theme</div>
							<div className="text-sm text-muted-foreground">
								Select your interface color theme
							</div>
						</div>
						<ThemeToggle />
					</div>
				</SettingsSection>
			</div>
		</div>
	);
}
