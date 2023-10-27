"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IoMailOutline } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

export default function EmailVerificationPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const verifyMail = async () => {
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      });
      if (res.ok) {
        console.log("Email verification successful");
        setVerified(true);
        router.push("/")

      } else if (res.status === 400) {
        toast.error("Invalid token or token expired");
      }
    } catch (error: any) {
      setError(true);
      console.log(error.reponse.data);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyMail();
    }
  }, [token]);

  return (
    <>
      <Toaster />
      <div className="relative container w-full px-5 pt-16 pb-5 h-screen flex flex-col items-center justify-center md:py-40 lg:py-0 md:px-0">
        <div className="h-full mx-auto flex w-full flex-col items-center justify-center sm:w-[364px] lg:gap-5">
          <div>
            <IoMailOutline className="mx-auto text-5xl md:text-6xl mb-2" />
            <h1 className="text-center text-3xl font-semibold md:text-4xl lg:text-5xl">
              {token.length > 0
                ? verified
                  ? "Email verified"
                  : "Email verification failed"
                : "Verify Email"}
            </h1>
            {token.length < 1 && (
              <p className="text-tertiary-foreground">
                A mail has been sent to you with the verification link.
              </p>
            )}
          </div>
          {verified && (
            <Link href="/" className="mt-10 w-full">
              <Button>Continue</Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
