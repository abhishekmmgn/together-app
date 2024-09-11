import * as z from "zod";

export const registerFormSchema = z
	.object({
		name: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email(),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(48, "Password must be less than 48 characters"),
		confirmPassword: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(48, "Password must be less than 48 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});

export const loginFormSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(48, "Password must be less than 48 characters"),
});

export type SessionPayload = {
	userId: string | number;
	expiresAt: Date;
};

export const NotificationPreferencesFormSchema = z.object({
	all_notifications: z.boolean().default(false).optional(),
	security_alerts: z.boolean(),
});

export const changePasswordFormSchema = z
	.object({
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(48, "Password must be less than 48 characters"),
		confirmPassword: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.max(48, "Password must be less than 48 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords do not match",
	});
