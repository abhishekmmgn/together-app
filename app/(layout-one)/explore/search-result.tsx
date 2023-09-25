"use client ";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type propsType = {
  uid?: string;
};

export default function SearchResult(props: propsType) {
  return (
    <>
      <div className="w-full px-5 h-16 flex items-center gap-3 hover:bg-muted hover:dark:bg-muted">
        <Avatar className="h-14 w-14">
          <AvatarImage src="https://www.unsplash.com/random" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="w-full">
          <h1 className="w-full font-medium line-clamp-1">
            Waste Warriors
          </h1>
          <div className="w-full flex gap-5 items-start">
            <p className="w-fit max-w-[50%] overflow-x-hidden line-clamp-1 text-[#171717] dark:text-[#a1a1a1]">
              Social Work
            </p>
            <p className="w-fit max-w-[50%] overflow-x-hidden line-clamp-1 text-[#171717] dark:text-[#a1a1a1]">
              London, UK
            </p>
          </div>
        </div>
      </div>
      <Separator />
    </>
  );
}
