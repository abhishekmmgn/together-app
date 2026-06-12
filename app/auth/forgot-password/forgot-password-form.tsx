"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import Link from "next/link";

type PropsType = {
	setFormFilled: (value: boolean) => void;
};

const formSchema = z.object({
	email: z.string().email(),
});

type formSchemaType = z.infer<typeof formSchema>;

export default function ForgotPasswordForm(props: PropsType) {
	const [disabled, setDisabled] = useState<boolean>(false);

	const form = useForm<formSchemaType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(data: formSchemaType) {
		setDisabled(true);
		try {
			const res = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: data.email,
				}),
			});
			if (res.ok) {
				console.log("Email verification successful");
				props.setFormFilled(true);
			} else if (res.status === 400) {
				console.log("Email verification failed");
				toast.error("Email not registered");
			}
		} catch (error: any) {
			console.log(error);
			toast.error("An error occurred");
		} finally {
			setDisabled(false);
		}
	}

	return (
		<AuthCard
			title="Forgot Password"
			description="Enter your email to receive a password reset link"
			footerText={
				<Link
					href="/auth/login"
					className="underline underline-offset-4 hover:text-primary"
				>
					Back to Sign In
				</Link>
			}
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
						<Field>
							<Button type="submit" loading={disabled} loadingText="Sending verification link">
								Send verification link
							</Button>
						</Field>
					</FieldGroup>
				</form>
			</Form>
		</AuthCard>
	);
}
