"use client ";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type propsType = {
  read?: boolean;
  uid?: string;
  message?: string;
  date?: string;
};

export default function Notification(props: propsType) {
  const read = true;
  return (
    <>
      <div
        className={`w-full flex items-center px-5 py-2 gap-4 ${
          !read && "bg-muted dark:bg-muted"
        }`}
      >
        <Avatar className="w-12 h-12">
          <AvatarImage src="https://www.unsplash.com/random" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="leading-tight line-clamp-3 font-medium sm:line-clamp-2">
            Waste Warriors has new event that you might be interested in
            joining.
          </h1>
          <p className="mt-1 text-sm line-clamp-1 text-[#171717] dark:text-[#a1a1a1]">
            12/8/2023
          </p>
        </div>
      </div>
      <Separator />
    </>
  );
}
