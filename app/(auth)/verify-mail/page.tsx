import { Button } from "@/components/ui/button";
import { GoMail } from "react-icons/go";

export default function VerifyMailPage() {
  return (
    <div className="relative container w-full px-5 pt-16 pb-5 h-screen flex flex-col items-center justify-center md:py-40 lg:py-0 md:px-0">
      <div className="h-full mx-auto flex w-full flex-col justify-between lg:justify-center sm:w-[364px] lg:gap-5">
        <div>
          <GoMail className="mx-auto text-5xl md:text-6xl mb-2" />
          <h1 className="text-center text-3xl font-semibold md:text-4xl lg:text-5xl mb-7 md:mb-10">
            Verify Email
          </h1>
        </div>
        <Button variant={"secondary"}>Continue</Button>
      </div>
    </div>
  );
}
