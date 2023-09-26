"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function Back() {
  const router = useRouter();

  return (
    <div className="w-full h-12 sticky z-50 top-0 inset-x-0 py-1 font-medium text-lg bg-white backdrop-filter backdrop-blur-xl bg-opacity-80 sm:hidden">
      <div className="container h-full px-5 md:px-10">
        <div
          className="-ml-2 w-fit h-full hover:cursor-pointer flex items-center"
          onClick={() => router.back()}
        >
          <ChevronLeft className="text-sm pb-[0.5px]" />
          <p className="text-sm">Back</p>
        </div>
      </div>
    </div>
  );
}
