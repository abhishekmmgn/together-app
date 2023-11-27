"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ProfileCard from "@/components/profile/profile-card";
import { Separator } from "@/components/ui/separator";
import Post from "@/components/post/post";
import TableRow from "@/components/table-row";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [userData, setUserData] = useState<{
    name: string;
    profilePhoto: string;
    bio: string;
    firstPost: object;
  }>({
    name: "",
    profilePhoto: "",
    bio: "",
    firstPost: {},
  });

  async function getData() {
    try {
      const res = await fetch("/api/user/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUserData({
          name: data.data.name,
          profilePhoto: data.data.profilePhoto,
          bio: data.data.bio,
          firstPost: data.data.firstPost,
        });
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="py-4 lg:pb-8 lg:px-5">
      <ProfileCard
        photo={userData?.profilePhoto}
        name={userData?.name}
        bio={userData?.bio}
        last={true}
      />
      <Separator />
      <Link href="/profile/friends">
        <TableRow title="Friends" textColor={false} />
      </Link>
      <div className="pt-6 px-5 lg:px-0 space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-2xl">Activity</h2>
          <Link href="/">
            <p className="text-primary text-sm">See All</p>
          </Link>
        </div>
        {userData.firstPost ? (
          <Post paddingX={true} />
        ) : (
          <div className="py-10">
            <h3 className="text-center font-medium text-xl">
              You don&apos;t have any posts yet.
            </h3>
            <Link
              href="/"
              className={cn(
                buttonVariants({
                  variant: "link",
                })
              )}
            >
              New Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
