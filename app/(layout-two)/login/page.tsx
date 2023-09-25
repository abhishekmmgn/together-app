import Link from "next/link";
import LoginForm from "./login-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <div className="relative container w-full px-5 pt-20 pb-5  h-screen flex flex-col items-center justify-start md:py-40 lg:py-0 md:px-0 lg:justify-center">
      <div className="w-full max-w-2xl">
        <div className="mx-auto flex w-full flex-col justify-center sm:w-[364px]">
          <h1 className="text-center text-3xl font-semibold md:text-4xl lg:text-5xl mb-7 md:mb-10">
            Sign In
          </h1>
          <LoginForm />
          <Link
            href="/register"
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
            href="/forgot-password"
            className={cn(
              "mt-2",
              buttonVariants({
                variant: "link",
              })
            )}
          >
            Forgot Password
          </Link>
        </div>
        <p className="absolute mt-8 inset-x-0 px-8 text-center text-sm text-muted-foreground lg:mt-0 lg:bottom-10">
          By clicking continue, you agree to our{" "}
          <Link href="/" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
