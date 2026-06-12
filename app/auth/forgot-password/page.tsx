"use client";

import { useState } from "react";
import ForgotPasswordForm from "./forgot-password-form";
import { IoMailOutline } from "react-icons/io5";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForgotPasswordPage() {
	const [formFilled, setFormFilled] = useState(false);

	return (
		<>
			{formFilled ? (
				<AuthCard
					title="Mail Sent"
					description="Verification link sent successfully"
				>
					<div className="flex flex-col items-center justify-center gap-4 py-2">
						<IoMailOutline className="text-5xl text-primary animate-pulse" />
						<p className="text-center text-sm text-muted-foreground leading-normal">
							A mail has been sent to you with the link to reset your password.
						</p>
						<Link href="/auth/login" className="w-full mt-2">
							<Button className="w-full" variant="outline">
								Back to Sign In
							</Button>
						</Link>
					</div>
				</AuthCard>
			) : (
				<ForgotPasswordForm setFormFilled={setFormFilled} />
			)}
		</>
	);
}
