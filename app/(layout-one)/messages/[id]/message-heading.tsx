"use client ";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type propsType = {
  uid?: string;
};

export default function MessageHeading(props: propsType) {
  const router = useRouter();
  return (
    <>
      <div className="w-full sticky z-50 top-0 inset-x-0 py-2 font-medium text-lg bg-white backdrop-filter backdrop-blur-xl bg-opacity-80">
          <ChevronLeft
            className="absolute left-5 top-7 cursor-pointer"
            onClick={() => router.back()}
          />
          <div className="mx-auto w-full flex flex-col gap-1 items-center">
            <Avatar className="w-11 h-11">
              <AvatarImage
                src="https://www.unsplash.com/random"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="line-clamp-1 text-sm font-medium">United Nations</h1>
          </div>
      </div>
    </>
  );
}
