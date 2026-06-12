"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface ErrorStateProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export function ErrorState({ error, reset }: ErrorStateProps) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center w-full h-full min-h-100 space-y-4">
			<h2 className="text-xl font-semibold">Something went wrong!</h2>
			<Button variant="secondary" onClick={() => reset()}>
				Try again
			</Button>
		</div>
	);
}
