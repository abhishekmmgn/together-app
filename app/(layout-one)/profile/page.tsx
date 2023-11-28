"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ProfileCard from "@/components/profile/profile-card";
import { Separator } from "@/components/ui/separator";
import Post from "@/components/post/post";
import TableRow from "@/components/table-row";
import { useEffect, useState } from "react";
import { PostType } from "@/types";

export default function ProfilePage() {
  const [userData, setUserData] = useState<{
    name: string;
    profilePhoto: string;
    bio: string;
  }>({
    name: "",
    profilePhoto: "",
    bio: "",
  });
  const [postsData, setPostsData] = useState<PostType[]>([]);

  async function getData() {
    try {
      const res = await fetch("/api/user/", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setUserData({
          name: data.data[0].name,
          profilePhoto: data.data[0].profilePhoto,
          bio: data.data[0].bio,
        });
        setPostsData(data.data[1]);
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
        <h2 className="font-medium text-2xl">Activity</h2>
        {postsData?.length > 0 ? (
          <>
            {postsData.map((post) => (
              <Post key={post._id} post={post} paddingX={true} />
            ))}
          </>
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
