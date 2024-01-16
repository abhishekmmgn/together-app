"use client";

import { useState } from "react";
import ForgotPasswordForm from "./forgot-password-form";
import { IoMailOutline } from "react-icons/io5";

export default function ForgotPasswordPage() {
  const [formFilled, setFormFilled] = useState(false);

  return (
    <>
      {formFilled ? (
        <>
          <IoMailOutline className="mx-auto text-5xl md:text-6xl mb-2" />
          <h1 className="text-center leading-tight text-2xl font-medium md:text-3xl mb-7 md:mb-10">
            A mail has been sent to you with the link to reset password.
          </h1>
        </>
      ) : (
        <>
          <h1 className="text-center text-3xl font-semibold md:text-4xl mb-7">
            Forgot Password
          </h1>
          <ForgotPasswordForm setFormFilled={setFormFilled} />
        </>
      )}
    </>
  );
}
