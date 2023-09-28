"use client ";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type propsType = {
  uid?: string;
};

export default function MessageHeading(props: propsType) {
  const router = useRouter();
  return (
    <>
      <div className="w-full fixed z-50 top-0 inset-x-0 py-2 font-medium text-lg bg-white backdrop-filter backdrop-blur-xl bg-opacity-80 sm:border-t border-border sm:top-14 sm:w-[calc(100%-210px)] md:w-[calc(100%-232px)] md:max-w-2xl dark:bg-background md:inset-x-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 absolute left-5 top-7 cursor-pointer lg:left-0"
          onClick={() => router.back()}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        <div className="w-full flex flex-col gap-1 items-center justify-center">
          <Avatar className="w-11 h-11">
            <AvatarImage src="https://www.unsplash.com/random" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="line-clamp-1 text-sm font-medium">United Nations</h1>
        </div>
      </div>
    </>
  );
}
