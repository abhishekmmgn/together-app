import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="relative container w-full px-5 pt-16 pb-5  h-screen flex flex-col items-center justify-start md:py-40 lg:py-0 md:px-0 lg:justify-center">
      <div className="w-full max-w-2xl">
        <div className="mx-auto flex w-full flex-col justify-center sm:w-[364px]">
          <h1 className="text-center text-3xl font-semibold md:text-4xl lg:text-5xl mb-7 md:mb-10">
            Reset Password
          </h1>
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
