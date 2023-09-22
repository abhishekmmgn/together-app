import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import appIcon from "@/public/appIcon.svg";

export default function WelcomePage() {
  return (
    <div className="h-screen w-full px-5 pt-10 pb-5 flex flex-col items-center justify-between">
      <div className="w-full flex flex-col items-center justify-center gap-2">
        <Image src={appIcon} alt="App icon" className="w-20 aspect-square" />
        <div className="text-center w-[80%]">
          <h1 className="font-semibold text-3xl">Together</h1>
          <p className="font-medium text-lg">Create Social Impact</p>
        </div>
      </div>
      <div>
        <Link href="/login">
          <Button variant={"outline"} className="mb-[10px]">Continue with Existing Account</Button>
        </Link>
        <Link href="/register" className="w-full">
          <Button>Create Account</Button>
        </Link>
      </div>
    </div>
  );
}
