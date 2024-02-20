"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoMailOutline } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export default function EmailVerificationPage() {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";

  useEffect(() => {
    async function verifyMail(token: string) {
      try {
        const res = await fetch("/api/auth/verify-mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            verificationToken: token,
          }),
        });
        if (res.ok) {
          console.log("Email verification successful");
          setVerified(true);
          router.push("/");
        } else if (res.status === 400) {
          toast.error("Invalid token or token expired");
          setError(true);
        }
      } catch (error: any) {
        setError(true);
        console.log(error.reponse.data);
        toast.error(error.response.data.message);
      }
    }
    if (token.length > 0 && !verified) {
      verifyMail(token);
    }
  }, [token]);
  return (
    <>
      <div>
        <IoMailOutline className="mx-auto text-5xl md:text-6xl mb-2" />
        <h1 className="text-center text-3xl font-semibold md:text-4xl lg:text-5xl">
          {token.length === 0 && !verified && !error && "Verify email"}
          {token.length > 0 && verified && !error && "Email verified "}
          {token.length > 0 && !verified && !error && "Verifying email..."}
          {error && "Verification failed"}
        </h1>
        {token.length < 1 && (
          <p className="text-center text-tertiary-foreground">
            A mail has been sent to you with the verification link.
          </p>
        )}
      </div>
      {verified && (
        <Link href="/" className="mt-10 w-full">
          <Button>Continue</Button>
        </Link>
      )}
    </>
  );
}
