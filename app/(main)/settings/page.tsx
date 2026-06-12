"use client";

import { ShortErrorInfo } from "@/components/error-info";
import ChangePassword from "@/components/settings/change-password";
import DeleteAccountComponent from "@/components/settings/delete-account";
import LogoutComponent from "@/components/settings/logout";
import NotificationsPrefrences from "@/components/settings/notifications-prefrences";
import { SettingsSection } from "@/components/settings/settings-section";
import ThemeToggle from "@/components/settings/theme-toggler";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

export default function SettingsPage() {
	const { isPending, error, data, isError } = useQuery<{
		_id: string;
		name: string;
		email: string;
		profilePhoto: string;
		bio: string;
	}>({
		queryKey: ["user-profile"],
		queryFn: async () => {
			const res = await fetch("/api/user");
			if (res.ok) {
				const data = await res.json();
				return data.data;
			}
			throw new Error("Failed to fetch user data");
		},
		staleTime: 1000 * 60 * 5,
	});

	if (isPending) {
		return (
			<div className="p-4 px-5 space-y-6 lg:px-0 pb-10">
				<h1 className="text-3xl font-semibold tracking-tight pb-2 border-b border-border/60">
					Settings
				</h1>
				<div className="space-y-6">
					{/* Account Section Skeleton */}
					<SettingsSection title="Account">
						<div className="flex items-center justify-between p-4">
							<div className="space-y-3">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-3.5 w-40" />
							</div>
						</div>
						<div className="flex items-center justify-between p-4">
							<div className="space-y-3">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-3.5 w-48" />
							</div>
							<Skeleton className="h-5 w-5 rounded-md" />
						</div>
						<div className="flex items-center justify-between p-4">
							<div className="space-y-3">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-3.5 w-52" />
							</div>
							<Skeleton className="h-5 w-5 rounded-md" />
						</div>
						<div className="flex items-center justify-between p-4">
							<div className="space-y-3">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-3.5 w-72" />
							</div>
							<Skeleton className="h-5 w-5 rounded-md" />
						</div>
					</SettingsSection>

					{/* Notifications Section Skeleton */}
					<SettingsSection title="Notifications">
						<div className="flex items-center justify-between p-4">
							<div className="space-y-3">
								<Skeleton className="h-4 w-40" />
								<Skeleton className="h-3.5 w-72" />
							</div>
							<Skeleton className="h-6 w-10 rounded-full" />
						</div>
						<div className="flex items-center justify-between p-4">
							<div className="space-y-3">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-3.5 w-60" />
							</div>
							<Skeleton className="h-6 w-10 rounded-full" />
						</div>
					</SettingsSection>

					{/* Appearance Section Skeleton */}
					<SettingsSection title="Appearance">
						<div className="flex items-center justify-between p-4">
							<div className="space-y-3">
								<Skeleton className="h-4 w-12" />
								<Skeleton className="h-3.5 w-56" />
							</div>
							<Skeleton className="h-9 w-9 rounded-md" />
						</div>
					</SettingsSection>
				</div>
			</div>
		);
	}

	if (isError) {
		console.error(error);
		return (
			<div className="p-4 px-5 lg:px-0">
				<ShortErrorInfo />
			</div>
		);
	}

	return (
		<div className="p-4 px-5 space-y-6 lg:px-0 pb-10">
			<h1 className="text-3xl font-semibold tracking-tight pb-2 border-b border-border/60">
				Settings
			</h1>

			<div className="space-y-6">
				{/* Account Section */}
				<SettingsSection title="Account">
					<div className="flex items-center justify-between p-4">
						<div className="space-y-0.5">
							<div className="text-base font-medium">Email Address</div>
							<div className="text-sm text-muted-foreground">
								{data?.email || "No email available"}
							</div>
						</div>
					</div>
					<ChangePassword userId={data?._id || ""} />
					<LogoutComponent />
					<DeleteAccountComponent />
				</SettingsSection>

				{/* Notifications Section */}
				<SettingsSection title="Notifications">
					<NotificationsPrefrences />
				</SettingsSection>

				{/* Appearance Section */}
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
