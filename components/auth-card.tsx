import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface AuthCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
	title: string;
	description?: string;
	footerText?: React.ReactNode;
	showConsent?: boolean;
	children: React.ReactNode;
}

export function AuthCard({
	title,
	description,
	footerText,
	showConsent = false,
	children,
	className,
	...props
}: AuthCardProps) {
	return (
		<div
			className={cn("flex flex-col gap-6 w-full max-w-sm mx-auto", className)}
		>
			<Card {...props}>
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-medium">{title}</CardTitle>
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>
				<CardContent className="grid gap-6">
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
				</CardContent>
			</Card>
		</div>
	);
}
