"use client";

import { useState } from "react";
import Notification from "@/components/notifications/notification";
import { NotificationType } from "@/types";

export default function Notifications() {
  const [allRead, setAllRead] = useState(false);
  const [notifications, setNotifications] = useState([]);

  async function fetchNotifications() {
    const response = await fetch("/api/notifications");
    const data = await response.json();
    setNotifications(data);
  }
  return (
    <div className="lg:py-2">
      {notifications.length > 0 && (
        <div
          className={`flex justify-end py-2 px-5 lg:px-0 ${
            allRead && "hidden"
          }`}
        >
          <div
            className="cursor-pointer text-primary"
            onClick={() => setAllRead(true)}
          >
            Mark all as read
          </div>
        </div>
      )}
      <div className="h-screen w-full">
        {notifications.length > 0 ? (
          <div className="flex flex-col space-y-3">
            {notifications.map((notification: NotificationType) => (
              <Notification
                key={notification._id}
                message={notification.message}
                read={notification.read}
                time={notification.time}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-[90%] flex flex-col justify-center items-center">
            <h1 className="text-2xl font-medium text-center">
              No new notifications.
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
