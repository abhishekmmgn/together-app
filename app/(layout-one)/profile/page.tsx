"use client";

import Link from "next/link";
import ProfileCard from "@/components/profile/profile-card";
import { Separator } from "@/components/ui/separator";
import TableRow from "@/components/table-row";
import { useEffect, useState } from "react";
import LoadingSkeleton from "@/components/loading-skeleton";
import Post from "@/components/post/post";
import type { PostType } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [loading, setLoading] = useState(true);
  const [postsData, setPostsData] = useState<PostType[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch("/api/user/");
        if (res.ok) {
          const data = await res.json();
          setUserData({
            name: data.data[0].name,
            profilePhoto: data.data[0].profilePhoto,
            bio: data.data[0].bio,
          });
          setPostsData(data.data[1]);
        }
      } catch (err: any) {
        console.log("Error: ", err.message);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  if (loading) {
    return (
      <div className="p-5 space-y-4 ">
        {Array(8)
          .fill(null)
          .map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
      </div>
    );
  }

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
              <Post
                key={post._id}
                post={post}
                paddingX={true}
                canDelete={true}
              />
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
