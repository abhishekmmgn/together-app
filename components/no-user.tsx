import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export default function NoUser(props: { title: string }) {
	return (
		<div className="px-6 w-full h-full flex flex-col justify-center gap-6 text-center">
			<div>
				<h1 className="font-semibold text-3xl md:text-4xl">
					You&apos;re not logged in.
				</h1>
				<p className="text-tertiary-foreground md:+">
					Sign in to view your <span className="lowercase">{props.title}</span>.
				</p>
			</div>
			<Link
				href="/auth/login"
				className={cn(
					"max-w-md mx-auto",
					buttonVariants({
						variant: "default",
					}),
				)}
			>
				Sign In
			</Link>
		</div>
	);
}
