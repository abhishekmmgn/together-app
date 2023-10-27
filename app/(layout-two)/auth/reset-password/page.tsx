"use client";

import { useState, useEffect } from "react";
import ResetPasswordForm from "./reset-password-form";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";

export default function ResetPasswordPage() {
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
        router.push("/");
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
    <div className="relative container w-full px-5 pt-16 pb-5  h-screen flex flex-col items-center justify-start md:py-40 lg:py-0 md:px-0 lg:justify-center">
      <div className="w-full max-w-2xl">
        <div className="mx-auto flex w-full flex-col justify-center sm:w-[364px]">
          <h1 className="text-center text-3xl font-semibold md:text-4xl lg:text-5xl mb-7 md:mb-10">
            {token.length > 0
              ? verified
                ? "Reset Password"
                : "Email verification failed"
              : "Verifiying..."}
          </h1>
          {token.length > 0 && verified && <ResetPasswordForm token={token} />}
        </div>
      </div>
    </div>
  );
}
