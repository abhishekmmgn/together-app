"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Field,
	FieldGroup,
	FieldLabel,
	FieldError,
} from "@/components/ui/field";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { changePasswordFormSchema } from "@/lib/definitions";

type formSchemaType = z.infer<typeof changePasswordFormSchema>;

type propsType = {
	userId: string;
};

export default function ResetPasswordForm(props: propsType) {
	const router = useRouter();
	const [disabled, setDisabled] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] =
		useState<boolean>(false);

	const form = useForm<formSchemaType>({
		resolver: zodResolver(changePasswordFormSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: formSchemaType) {
		setDisabled(true);
		try {
			const res = await fetch("/api/auth/change-password", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					password: data.password,
					_id: props.userId,
				}),
			});
			if (res.ok) {
				console.log("Password changed successfully");
				toast.success("Password changed successfully");
				form.reset();
				router.push("/auth/login");
			} else if (res.status === 400) {
				console.log("User doesn't exist");
				toast.error("User doesn't exist");
				router.push("/auth/login");
			} else if (res.status === 500) {
				console.log(res.statusText);
				toast.error("Something went wrong");
			}
		} catch (err: any) {
			console.log("Error: ", err.message);
			toast.error(err.message);
		} finally {
			setDisabled(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
				<FieldGroup>
					<FormField
						control={form.control}
						name="password"
						render={({ field, fieldState }) => (
							<Field data-invalid={!!fieldState.error}>
								<FieldLabel htmlFor="password">New Password</FieldLabel>
								<div className="relative">
									<Input
										id="password"
										type={showPassword ? "text" : "password"}
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
					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field, fieldState }) => (
							<Field data-invalid={!!fieldState.error}>
								<FieldLabel htmlFor="confirmPassword">
									Confirm Password
								</FieldLabel>
								<div className="relative">
									<Input
										id="confirmPassword"
										type={showConfirmPassword ? "text" : "password"}
										placeholder="********"
										disabled={disabled}
										className="pr-10"
										{...field}
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword((prev) => !prev)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none flex items-center justify-center"
									>
										{showConfirmPassword ? (
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
						<Button
							type="submit"
							loading={disabled}
							loadingText="Resetting Password"
						>
							Done
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</Form>
	);
}
