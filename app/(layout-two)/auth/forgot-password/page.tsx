"use client";

import { useState } from "react";
import ForgotPasswordForm from "./forgot-password-form";
import { IoMailOutline } from "react-icons/io5";

export default function ForgotPasswordPage() {
  const [formFilled, setFormFilled] = useState(false);

  return (
    <div className="relative container w-full px-5 pt-16 pb-5 h-screen flex flex-col items-center justify-start md:py-40 lg:py-0 md:px-0 lg:justify-center">
      {formFilled ? (
        <div className="h-full mx-auto flex w-full flex-col justify-center sm:w-[512px] lg:gap-5">
          <div>
            <IoMailOutline className="mx-auto text-5xl md:text-6xl mb-2" />
            <h1 className="text-center leading-tight text-2xl font-medium md:text-3xl mb-7 md:mb-10">
              A mail has been sent to you with the link to reset password.
            </h1>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="mx-auto flex w-full flex-col justify-center sm:w-[364px]">
            <h1 className="text-center text-3xl font-semibold md:text-4xl lg:text-5xl mb-7 md:mb-10">
              Forgot Password
            </h1>
            <ForgotPasswordForm setFormFilled={setFormFilled} />
          </div>
        </div>
      )}
    </div>
  );
}
