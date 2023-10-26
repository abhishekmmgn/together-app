"use client";

import Link from "next/link";
import ProfileCard from "@/components/profile/profile-card";
import { Separator } from "@/components/ui/separator";
import Post from "@/components/post/post";
import TableRow from "@/components/table-row";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  async function getData() {
    try {
      const res = await fetch("/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        // console.log(res.data)
        console.log("Body: ",res.body)
        // setUser()
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
    }
  }
  useEffect(() => {
    getData();
  });
  return (
    <div className="p-4 lg:pb-8 lg:px-5">
      <ProfileCard last={true} />
      <Separator />
      <div className="w-full h-16 flex items-center justify-between px-5 gap-4 hover:bg-muted">
        <p className="font-medium">Friends</p>
        <p className="text-primary">12</p>
      </div>
      <Separator />
      <div className="pt-6 px-5 lg:px-0 space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-2xl">Activity</h2>
          <Link href="/">
            <p className="text-primary text-sm">See All</p>
          </Link>
        </div>
        <Post paddingX={true} />
      </div>
      <Link href="/settings">
        <TableRow title="Settings" textColor={false} />
      </Link>
    </div>
  );
}
