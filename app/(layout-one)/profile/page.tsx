"use client";

import Link from "next/link";
import ProfileCard from "@/components/profile/profile-card";
import { Separator } from "@/components/ui/separator";
import Post from "@/components/post/post";
import TableRow from "@/components/table-row";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [userData, setUserData] = useState<{
    _id: string | any;
    name: string;
    photo: string;
    bio: string;
    posts: [];
  }>({
    _id: "",
    name: "",
    photo: "",
    bio: "",
    posts: [],
  });

  async function getData() {
    try {
      const res = await fetch("/api/profile/read-profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUserData({
          _id: data.data._id,
          name: data.data.name,
          photo: data.data.photo,
          bio: data.data.bio,
          posts: data.data.posts,
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
        photo={userData?.photo}
        name={userData?.name}
        bio={userData?.bio}
        last={true}
      />
      <Separator />
      <Link href="/friends">
        <TableRow title="Friends" textColor={false} />
      </Link>
      <Link href="/settings">
        <TableRow title="Settings" textColor={false} />
      </Link>
      <div className="pt-6 px-5 lg:px-0 space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-2xl">Activity</h2>
          {userData?.posts && (
            <Link href="/">
              <p className="text-primary text-sm">See All</p>
            </Link>
          )}
        </div>
        {userData?.posts?.map((post: any, index) => (
          <Post paddingX={true} key={index} />
        ))}
      </div>
    </div>
  );
}
