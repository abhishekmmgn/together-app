"use client";

import { useState, useEffect } from "react";
import ResetPasswordForm from "./reset-password-form";
import { toast } from "react-hot-toast";

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
				console.log(error.reponse.data);
				toast.error(error.response.data.message);
			}
		}
		if (token.length > 0 && !verified && !error) {
			verifyMail();
		}
	}, [token]);

	return (
		<>
			<h1 className="text-center text-3xl font-semibold md:text-4xl lg:text-5xl mb-7 md:mb-10">
				{token.length > 0 && verified && !error && "Reset Password"}
				{token.length > 0 && !verified && !error && "Verifying..."}
				{error && "Email verification failed"}
			</h1>
			{verified && !error && <ResetPasswordForm userId={userId!} />}
		</>
	);
}
