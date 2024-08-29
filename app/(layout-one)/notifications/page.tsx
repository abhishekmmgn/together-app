"use client";

import { useState, useEffect } from "react";
import Notification from "@/components/notifications/notification";
import type { NotificationType } from "@/types";
import NotificationSkeleton from "@/components/notifications/notification-skeleton";

async function fetchNotifications() {
  const response = await fetch("/api/notifications");
  const data = await response.json();
  return data;
}

export default function Notifications() {
  const [allRead, setAllRead] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data.data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchPosts();
  }, []);
  

  useEffect(() => {
    async function markAllRead() {
      const response = await fetch("/api/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ allRead: true }),
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(
          notifications.map((notification) => ({ ...notification, read: true }))
        );
      }
    }
    if (allRead) {
      markAllRead();
    }
  }, [allRead]);

  // console.log("Re rendering...");

  if (isLoading) {
    return (
      <div className="p-5 space-y-4 ">
        {Array(8)
          .fill(null)
          .map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
      </div>
    );
  }

  if (notifications.length > 0) {
    return (
      <div className="lg:py-2">
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
        <div className="h-screen w-full">
          <div className="flex flex-col">
            {notifications.map((notification: NotificationType) => (
              <Notification
                key={notification._id}
                message={notification.message}
                read={notification.read}
                createdAt={new Date(notification.createdAt)}
                destination={notification.destination}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[90%] flex flex-col justify-center items-center">
      <h1 className="text-2xl font-medium text-center">
        No new notifications.
      </h1>
    </div>
  );
}
