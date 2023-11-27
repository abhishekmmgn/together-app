"use client ";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

type propsType = {
  read?: boolean;
  message: string;
  time: Date;
  link: string;
};

export default function Notification(props: propsType) {
  const read = true;
  return (
    <Link href="">
      <div
        className={`w-full flex items-center justify-between px-5 py-2 gap-5 lg:px-0 hover:bg-muted/50 ${
          !read && "bg-muted"
        }`}
      >
        <h1 className="leading-tight line-clamp-3 font-medium sm:line-clamp-2">
          Waste Warriors has new event that you might be interested in joining.
        </h1>
        <p className="mt-1 text-sm line-clamp-1 text-[#171717] dark:text-[#a1a1a1]">
          12/8/2023
        </p>
      </div>
      <Separator />
    </Link>
  );
}
