"use client";

import { useState } from "react";
import Notification from "@/components/notifications/notification";

export default function Notifications() {
  const [allRead, setAllRead] = useState(false);
  return (
    <div className="lg:py-2">
      <div
        className={`flex justify-end py-2 px-5 lg:px-0 ${allRead && "hidden"}`}
      >
        <div
          className="cursor-pointer text-primary"
          onClick={() => setAllRead(true)}
        >
          Mark all as read
        </div>
      </div>
      <div className="h-screen w-full">
        <Notification message="" time={new Date()} link="" />
        <Notification message="" time={new Date()} link="" />
        <Notification message="" time={new Date()} link="" />
        <Notification message="" time={new Date()} link="" />
      </div>
    </div>
  );
}
