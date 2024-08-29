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
          })
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
          })
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
    </>
  );
}
