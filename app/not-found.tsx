"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/");
		}, 1500);
		return () => clearTimeout(timer);
	});

	return (
		<>
			<main className="grid h-screen place-items-center px-6 py-24 sm:py-32 lg:px-8">
				<div className="text-center">
					<p className="font-semibold text-primary">404</p>
					<h1 className="mt-4 text-3xl font-bold tracking-tight text-secondary-foreground sm:text-5xl">
						Page not found
					</h1>
					<p className="mt-6 leading-7 text-tertiary-foreground">
						Sorry, we couldn’t find the page you’re looking for. Redirecting to
						home page
					</p>
				</div>
			</main>
		</>
	);
}
