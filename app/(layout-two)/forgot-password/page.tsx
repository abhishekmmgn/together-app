import { GoMail } from "react-icons/go";

export default function ForgotPasswordPage() {
  return (
    <div className="relative container w-full px-5 pt-16 pb-5 h-screen flex flex-col items-center justify-center md:py-40 lg:py-0 md:px-0">
      <div className="h-full mx-auto flex w-full flex-col justify-center sm:w-[512px] lg:gap-5">
        <div>
          <GoMail className="mx-auto text-5xl md:text-6xl mb-2" />
          <h1 className="text-center text-2xl font-medium md:text-3xl lg:text-4xl mb-7 md:mb-10">
            We have sent you a mail with link to reset the password.
          </h1>
        </div>
      </div>
    </div>
  );
}
