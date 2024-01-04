import Link from "next/link";
import RegisterForm from "./register-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-center text-3xl font-semibold md:text-4xl lg:text-5xl mb-7 md:mb-10">
        Create Account
      </h1>
      <RegisterForm />
      <Link
        href="/auth/login"
        className={cn(
          "mt-3",
          buttonVariants({
            variant: "outline",
          })
        )}
      >
        Sign In
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
