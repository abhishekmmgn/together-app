"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { toast } from "react-hot-toast";
import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const formSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.max(48, "Password must be less than 48 characters"),
});

type formSchemaType = z.infer<typeof formSchema>;

export default function LoginForm() {
	const router = useRouter();
	const [disabled, setDisabled] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const form = useForm<formSchemaType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(data: formSchemaType) {
		setDisabled(true);
		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: data.email,
					password: data.password,
				}),
			});
			if (res.ok) {
				toast.success("Logged in successfully");
				form.reset();
				router.push("/");
			} else if (res.status === 400) {
				toast.error("Incorrect email or password");
			} else if (res.status === 404) {
				toast.error("Account does not exist");
			} else if (res.status === 500) {
				console.log("Server error");
				toast.error("Server error");
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
			title="Login to your account"
			description="Enter your email below to login to your account"
			footerText={
				<>
					Don&apos;t have an account?{" "}
					<Link
						href="/auth/register"
						className="underline underline-offset-4 hover:text-primary"
					>
						Sign up
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
									<div className="flex items-center">
										<FieldLabel htmlFor="password">Password</FieldLabel>
										<Link
											href="/auth/forgot-password"
											className="ml-auto inline-block text-xs underline underline-offset-4 hover:text-primary"
										>
											Forgot your password?
										</Link>
									</div>
									<div className="relative">
										<Input
											id="password"
											type={showPassword ? "text" : "password"}
											autoComplete="current-password"
											placeholder="********"
											disabled={disabled}
											className="pr-10"
											{...field}
										/>
										<button
											type="button"
											onClick={() => setShowPassword((prev) => !prev)}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none flex items-center justify-center"
										>
											{showPassword ? (
												<IoEyeOffOutline className="h-5 w-5" />
											) : (
												<IoEyeOutline className="h-5 w-5" />
											)}
										</button>
									</div>
									{fieldState.error && (
										<FieldError>{fieldState.error.message}</FieldError>
									)}
								</Field>
							)}
						/>
						<Field>
							<Button type="submit" loading={disabled} loadingText="Signing in">
								Sign In
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</Form>
		</AuthCard>
	);
}
