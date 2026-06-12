"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldError,
} from "@/components/ui/field";
import { AuthCard } from "@/components/auth-card";
import { useState } from "react";
import { toast } from "react-hot-toast";

const formSchema = z
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

type formSchemaType = z.infer<typeof formSchema>;

export default function RegisterForm() {
	const router = useRouter();
	const [disabled, setDisabled] = useState<boolean>(false);

	const form = useForm<formSchemaType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: formSchemaType) {
		setDisabled(true);
		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: data.name,
					email: data.email,
					password: data.password,
				}),
			});
			if (res.ok) {
				console.log("Success");
				toast.success("Verification link sent to your mail.");
				form.reset();
				router.push("/auth/verify-mail");
			} else if (res.status === 400) {
				toast.error("Email already registered.");
			}
		} catch (err: any) {
			console.log("Error: ", err.message);
			toast.error(err.message);
		} finally {
			setDisabled(false);
		}
	}

	return (
		<AuthCard
			title="Create an account"
			description="Enter your details below to create your account"
			footerText={
				<>
					Already have an account?{" "}
					<Link
						href="/auth/login"
						className="underline underline-offset-4 hover:text-primary"
					>
						Sign In
					</Link>
				</>
			}
			showConsent
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
					<FieldGroup>
						<FormField
							control={form.control}
							name="name"
							render={({ field, fieldState }) => (
								<Field data-invalid={!!fieldState.error}>
									<FieldLabel htmlFor="name">Name</FieldLabel>
									<Input
										id="name"
										type="text"
										autoComplete="name"
										placeholder="John Doe"
										disabled={disabled}
										{...field}
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field, fieldState }) => (
								<Field data-invalid={!!fieldState.error}>
									<FieldLabel htmlFor="email">Email</FieldLabel>
									<Input
										id="email"
										type="email"
										autoComplete="email"
										placeholder="johndoe@email.com"
										disabled={disabled}
										{...field}
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field, fieldState }) => (
								<Field data-invalid={!!fieldState.error}>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<Input
										id="password"
										type="password"
										placeholder="********"
										autoComplete="new-password"
										disabled={disabled}
										{...field}
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field, fieldState }) => (
								<Field data-invalid={!!fieldState.error}>
									<FieldLabel htmlFor="confirmPassword">
										Confirm Password
									</FieldLabel>
									<Input
										id="confirmPassword"
										type="password"
										autoComplete="new-password"
										placeholder="********"
										disabled={disabled}
										{...field}
									/>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>
						<Field>
							<Button
								type="submit"
								loading={disabled}
								loadingText="Creating Account"
							>
								Create Account
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</Form>
		</AuthCard>
	);
}
