"use client ";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

type propsType = {
  read?: boolean;
  message: string;
  createdAt: Date;
  destination: string;
};

export default function Notification(props: propsType) {
  let formatedDate;
  const currentDate = new Date();

  // If the date is today, return the time
  if (props.createdAt.toDateString() === currentDate.toDateString()) {
    formatedDate = props.createdAt.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  // If the date is not today, return the date without the time
  else {
    formatedDate = props.createdAt.toLocaleDateString([], {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <Link href={props.destination}>
      <div
        className={`w-full flex items-center justify-between px-5 py-2 gap-5 hover:bg-muted/50 ${
          !props.read && "bg-secondary/80"
        }`}
      >
        <h1 className="leading-tight line-clamp-3 sm:line-clamp-2">
          {props.message}
        </h1>
        <p className="mt-1 text-sm line-clamp-1 text-tertiary-foreground">
          {formatedDate}
        </p>
      </div>
      <Separator />
    </Link>
  );
}
