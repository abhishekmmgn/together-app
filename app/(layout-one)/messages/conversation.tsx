"use client ";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type propsType = {
  read?: boolean;
};

export default function conversation(props: propsType) {
  const read = true;
  return (
    <div className="bg-background dark:bg-background">
      <div
        className={`w-full h-[68px] flex items-center px-5 py-2 gap-4 hover:bg-muted hover:dark:bg-muted ${
          !read && "bg-muted dark:bg-muted"
        }`}
      >
        <Avatar className="w-14 h-14">
          <AvatarImage src="https://www.unsplash.com/random" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="w-full flex flex-col justify-center items-center gap-1">
          <div className="w-full flex items-center justify-between gap-5">
            <h1 className="w-[70%] overflow-x-hidden line-clamp-1 text-lg font-medium">
              DKMS UK
            </h1>
            <p className="w-[30%] overflow-x-hidden text-right text-sm line-clamp-1 text-[#3c3c3e] dark:text-[#a1a1a1]">
              12/8/2023
            </p>
          </div>
          <div className="w-full flex items-center justify-between gap-5">
            <p
              className={`${
                !read ? "w-[85%]" : "w-full"
              } overflow-x-hidden line-clamp-1 text-[#171717] dark:text-[#a1a1a1]`}
            >
              Hello, we are looking to see that the new update is working.
            </p>
            {!read && (
              <div className="w-[22px] h-[22px] rounded-full line-clamp-1 text-sm bg-[#007aff] dark:bg-[#007aff] text-white flex items-center justify-center">
                1
              </div>
            )}
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
}
