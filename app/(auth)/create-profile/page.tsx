import Link from "next/link";
import { CreateProfileForm } from "./create-profile-form";

export default function CreateProfilePage() {
  return (
    <div className="relative container w-full px-5 pt-20 pb-5  h-screen flex flex-col items-center justify-start md:py-40 lg:py-0 md:px-0 lg:justify-center">
      <div className="mx-auto flex w-full flex-col justify-center sm:w-[364px]">
        <h1 className="text-center text-3xl font-semibold md:text-4xl lg:text-5xl mb-7 md:mb-10">
          Create Profile
        </h1>
        <CreateProfileForm />
      </div>
    </div>
  );
}
