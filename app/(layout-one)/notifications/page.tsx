"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Notification from "./notification";

export default function Notifications() {
  const [allRead, setAllRead] = useState(false);
  return (
    <>
      <Navbar title="Notifications" />
      <div
        className={`flex justify-end py-2 px-5 lg:px-0 ${allRead && "hidden"}`}
      >
        <div className="cursor-pointer text-muted-foreground" onClick={() => setAllRead(true)}>Mark all as read</div>
      </div>
      <div className="h-screen w-full">
        <Notification />
        <Notification />
        <Notification />
        <Notification />
        <Notification />
      </div>
    </>
  );
}
