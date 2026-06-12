"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { NotificationPreferencesFormSchema } from "@/lib/definitions";

export default function NotificationsPrefrences() {
	const form = useForm<z.infer<typeof NotificationPreferencesFormSchema>>({
		resolver: zodResolver(NotificationPreferencesFormSchema),
		defaultValues: {
			security_alerts: true,
		},
	});

	function onSubmit(data: z.infer<typeof NotificationPreferencesFormSchema>) {}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full divide-y divide-border/60 flex flex-col"
			>
				<FormField
					control={form.control}
					name="all_notifications"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between p-4 space-y-0">
							<div className="space-y-0.5">
								<FormLabel className="text-base font-medium">
									Turn off Notifications
								</FormLabel>
								<FormDescription className="text-sm text-muted-foreground">
									Turn off notifications about new posts, features, and more.
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="security_alerts"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between p-4 space-y-0">
							<div className="space-y-0.5">
								<FormLabel className="text-base font-medium">
									Security alerts
								</FormLabel>
								<FormDescription className="text-sm text-muted-foreground">
									Receive alerts about your account security.
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled
									aria-readonly
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
}
