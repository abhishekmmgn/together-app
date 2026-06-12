import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function AuthCard({
	title,
	description,
	footerText,
	showConsent = false,
	children,
	className,
	...props
}: {
	title: string;
	description?: string;
	footerText?: React.ReactNode;
	showConsent?: boolean;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn("flex flex-col gap-8 w-full max-w-md mx-auto", className)}
		>
			<div className="text-center space-y-1.5">
				<h1 className="heading-1">{title}</h1>
				{description && <p>{description}</p>}
			</div>
			<div className="grid gap-6">
				{children}
				{footerText && (
					<div className="text-center text-sm text-muted-foreground">
						{footerText}
					</div>
				)}
				{showConsent && (
					<p className="text-center text-xs text-muted-foreground leading-normal">
						By clicking continue, you agree to our{" "}
						<Link
							href=""
							className="underline underline-offset-4 hover:text-primary"
						>
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link
							href=""
							className="underline underline-offset-4 hover:text-primary"
						>
							Privacy Policy
						</Link>
						.
					</p>
				)}
			</div>
		</div>
	);
}
