"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoMailOutline } from "react-icons/io5";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { AuthCard } from "@/components/auth-card";

export default function EmailVerificationPage() {
	const [verified, setVerified] = useState(false);
	const [error, setError] = useState(false);

	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams?.get("token") || "";

	useEffect(() => {
		async function verifyMail(token: string) {
			try {
				const res = await fetch("/api/auth/verify-mail", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						verificationToken: token,
					}),
				});
				if (res.ok) {
					console.log("Email verification successful");
					setVerified(true);
					router.push("/");
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
		if (token.length > 0 && !verified) {
			verifyMail(token);
		}
	}, [token, verified, router]);

	let title = "Verify email";
	let description = "Please wait...";
	let statusIcon = (
		<IoMailOutline className="text-5xl text-primary animate-pulse" />
	);

	if (token.length === 0 && !verified && !error) {
		title = "Verify email";
		description = "A verification link has been sent to your email.";
		statusIcon = <IoMailOutline className="text-5xl text-primary" />;
	} else if (token.length > 0 && verified && !error) {
		title = "Email verified";
		description = "Your email has been verified successfully.";
		statusIcon = <IoMailOutline className="text-5xl text-emerald-500" />;
	} else if (token.length > 0 && !verified && !error) {
		title = "Verifying email...";
		description = "Please wait while we verify your email address.";
		statusIcon = <IoMailOutline className="text-5xl text-primary" />;
	} else if (error) {
		title = "Verification failed";
		description = "The verification link is invalid or has expired.";
		statusIcon = <IoMailOutline className="text-5xl text-destructive" />;
	}

	return (
		<AuthCard title={title} description={description}>
			<div className="flex flex-col items-center justify-center gap-4 py-2">
				{statusIcon}
				{token.length === 0 && (
					<p className="text-center text-sm text-muted-foreground leading-normal">
						Please check your inbox (and spam folder) and click the link to
						verify your account.
					</p>
				)}
				{verified && (
					<Link href="/" className="w-full mt-2">
						<Button className="w-full">Continue</Button>
					</Link>
				)}
				{error && (
					<Link href="/auth/login" className="w-full mt-2">
						<Button className="w-full" variant="outline">
							Back to Sign In
						</Button>
					</Link>
				)}
			</div>
		</AuthCard>
	);
}
