"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<>
			<Header />
			<main className="text-center grid h-screen place-items-center horizontal-padding vertical-padding">
				<div className="space-y-4">
					<h1 className="heading-2">Something went wrong!</h1>
					<Button variant="secondary" onClick={() => reset()}>
						Try again
					</Button>
				</div>
			</main>
		</>
	);
}
