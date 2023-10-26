import Link from "next/link";
import RegisterForm from "./register-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  return (
    <div className="relative container w-full px-5 pt-16 pb-5  h-screen flex flex-col items-center justify-start md:py-40 lg:py-0 md:px-0 lg:justify-center">
      <div className="w-full max-w-md md:max-w-2xl">
        <div className="mx-auto flex w-full flex-col justify-center sm:w-[364px]">
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
        </div>
        <p className="absolute mt-8 inset-x-0 px-8 text-center text-sm text-muted-foreground">
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
      </div>
    </div>
  );
}
