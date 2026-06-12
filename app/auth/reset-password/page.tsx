"use client";

import { useState, useEffect } from "react";
import ResetPasswordForm from "./reset-password-form";
import { toast } from "react-hot-toast";
import { AuthCard } from "@/components/auth-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ResetPasswordPage() {
	const [token, setToken] = useState("");
	const [verified, setVerified] = useState(false);
	const [error, setError] = useState(false);
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		const urlToken = window.location.search.split("=")[1];
		setToken(urlToken || "");
	}, []);

	useEffect(() => {
		async function verifyMail() {
			try {
				const res = await fetch("/api/auth/verify-password-reset", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						token: token,
					}),
				});
				if (res.ok) {
					const user = await res.json();
					console.log("Email verification successful");
					setVerified(true);
					setUserId(user.userId);
				} else if (res.status === 400) {
					toast.error("Invalid token or token expired");
					setError(true);
				}
			} catch (error: any) {
				setError(true);
				console.log(error);
				toast.error("Something went wrong");
			}
		}
		if (token.length > 0 && !verified && !error) {
			verifyMail();
		}
	}, [token, verified, error]);

	return (
		<>
			{token.length > 0 && verified && !error ? (
				<ResetPasswordForm userId={userId!} />
			) : (
				<AuthCard
					title={
						error
							? "Verification Failed"
							: token.length > 0
								? "Verifying Link"
								: "Invalid Request"
					}
					description={
						error
							? "The password reset token is invalid or has expired."
							: token.length > 0
								? "Please wait while we check your verification link..."
								: "No reset token provided."
					}
				>
					{error && (
						<div className="flex flex-col items-center justify-center gap-4 py-2">
							<Link href="/auth/login" className="w-full">
								<Button className="w-full" variant="outline">
									Back to Sign In
								</Button>
							</Link>
						</div>
					)}
				</AuthCard>
			)}
		</>
	);
}
