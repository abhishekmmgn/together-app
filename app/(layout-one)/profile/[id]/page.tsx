"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Post from "@/components/post/post";
import { useEffect, useState } from "react";

export default function ExternalProfile() {
  const [userData, setUserData] = useState<{
    name: string;
    photo: string;
    bio: string;
    posts: [];
    isFriend: boolean;
  }>({
    name: "",
    photo: "",
    bio: "",
    posts: [],
    isFriend: false,
  });

  async function getData() {
    try {
      const res = await fetch("/api/profile/read-external-profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setUserData({
          name: data.data.name,
          photo: data.data.photo,
          bio: data.data.bio,
          posts: data.data.posts,
          isFriend: data.data.isFriend,
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
    <div className="p-5">
      <div className="grid gap-4 pb-4">
        <Image
          src={userData?.photo}
          alt={`Profile photo of ${userData?.name}`}
          width={200}
          height={200}
          className="w-28 lg:w-32 aspect-square bg-secondary shadow-sm rounded-md"
        />
        <div>
          <h1 className="-mt-1 font-medium text-2xl md:text-3xl">
            {userData?.name}
          </h1>
          <p className="mb-1 text-tertiary-foreground">{userData?.bio}</p>
        </div>
        {userData?.isFriend ? (
          <div className="flex gap-3">
            <Button variant="secondary" className="mx-auto">
              Unfollow
            </Button>
            <Button variant="secondary" className="mx-auto">
              Message
            </Button>
          </div>
        ) : (
          <Button className="mx-auto">Follow</Button>
        )}
      </div>
      <Separator />
      <div className="py-6 space-y-4">
        <div className="space-y-2">
          <h1 className="font-medium text-2xl">Activity</h1>
          {userData?.posts?.map((post: any, index) => (
            <Post paddingX={true} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
