"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { changePasswordFormSchema } from "@/lib/definitions";

type formSchemaType = z.infer<typeof changePasswordFormSchema>;

type propsType = {
	userId: string;
};

export default function ResetPasswordForm(props: propsType) {
	const router = useRouter();
	const [disabled, setDisabled] = useState<boolean>(false);

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
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-full space-y-4"
				>
					<div className="space-y-2">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="********"
											className=""
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="********"
											className=""
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button type="submit" disabled={disabled}>
						{disabled && (
							<AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
						)}
						Done
					</Button>
				</form>
			</Form>
		</>
	);
}
