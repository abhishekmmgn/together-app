import Link from "next/link";
import LoginForm from "./login-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Login",
};

export default function LoginPage() {
	return (
		<>
			<h1 className="text-center text-3xl font-semibold md:text-4xl mb-7">
				Sign In
			</h1>
			<LoginForm />
			<Link
				href="/auth/register"
				className={cn(
					"mt-3",
					buttonVariants({
						variant: "outline",
					}),
				)}
			>
				Create Account
			</Link>
			<Link
				href="/auth/forgot-password"
				className={cn(
					"mt-2",
					buttonVariants({
						variant: "ghost",
					}),
				)}
			>
				Forgot Password
			</Link>
			<p className="p-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our{" "}
				<Link href="/" className="underline underline-offset-4">
					Terms of Service
				</Link>{" "}
				and{" "}
				<Link href="/" className="underline underline-offset-4">
					Privacy Policy
				</Link>
				.
			</p>
			<div className="text-muted-foreground absolute py-10 px-4 xl:flex flex-col right-8 top-8 hidden">
				<p className="text-sm md:text-sm+ italic">Guest credentials</p>
				<p className="text-sm md:text-sm+ mt-[2px] mb[1px]">
					Email: jane@x.com
				</p>
				<p className="text-sm md:text-sm+">Password: password</p>
			</div>
		</>
	);
}
