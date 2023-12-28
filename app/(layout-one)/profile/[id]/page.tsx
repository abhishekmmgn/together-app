"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Post from "@/components/post/post";
import { useEffect, useState } from "react";
import copyLink from "@/helpers/copyLink";
import { PostType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import PostSkeleton from "@/components/post/post-skeleton";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatAvatarName from "@/helpers/formatAvatarName";

type Params = {
  params: { id: string };
};

export default function ExternalProfile({ params }: Params) {
  const [userData, setUserData] = useState<{
    name: string;
    profilePhoto: string;
    bio: string;
  }>({
    name: "",
    profilePhoto: "",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [profileNotFound, setProfileNotFound] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  async function getData() {
    try {
      const res = await fetch(`/api/user/${params.id}`, {
        cache: "no-cache",
      });
      if (res.ok) {
        const data = await res.json();
        setUserData({
          name: data.data[0].name,
          profilePhoto: data.data[0].profilePhoto,
          bio: data.data[0].bio,
        });
        setIsFriend(data.data[2].isFriend);
        setPosts(data.data[1]);
      } else if (res.status === 400) {
        setProfileNotFound(true);
      } else if (res.status === 500) {
        setError(true);
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function changeFriendList(action: "add" | "remove") {
    try {
      const res = await fetch(`/api/user/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          _id: params.id,
        }),
      });
      if (res.ok) {
        setIsFriend(!isFriend);
      } else {
        console.log(res.statusText);
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
      setError(err.message);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="grid gap-4 pb-4">
          <Skeleton className="w-28 lg:w-32 aspect-square rounded-[var(--radius)]" />
          <div>
            <Skeleton className="mb-1 h-5 w-24" />
            <Skeleton className="mb-1 h-4 w-48" />
          </div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-full max-w-md mx-auto" />
            <Skeleton className="h-10 w-full max-w-md mx-auto" />
          </div>
        </div>
        <div className="py-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <PostSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (profileNotFound) {
    notFound();
  }

  if (error) {
    return (
      <main className="grid place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center space-y-4">
          <p className="text-base font-semibold text-destructive">Error</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Something went wrong.
          </h1>
          <p className="text-base leading-7">Please try refreshing the page.</p>
        </div>
      </main>
    );
  }
  return (
    <div className="p-5">
      <div className="grid gap-4 pb-4">
        <Avatar className="w-28 h-28 lg:h-32 lg:w-32 aspect-square bg-secondary shadow-sm rounded-[var(--radius)]">
          <AvatarImage src={userData?.profilePhoto} alt="Your Profile photo" />
          <AvatarFallback className="text-primary text-4xl lg:text-5xl">
            {formatAvatarName(userData?.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="-mt-1 capitalize font-medium text-2xl md:text-3xl">
            {userData?.name}
          </h1>
          <p className="-mt-1 mb-1 text-tertiary-foreground">{userData?.bio}</p>
        </div>
        <div className="flex flex-col gap-3">
          {!isFriend && (
            <Button
              className="max-w-md mx-auto"
              onClick={() => changeFriendList("add")}
            >
              Add as Friend
            </Button>
          )}
          <Button
            variant="secondary"
            className="max-w-md mx-auto"
            onClick={() => copyLink(window.location.pathname)}
          >
            Share Profile
          </Button>
          {isFriend && (
            <Button
              variant="secondary"
              className="max-w-md mx-auto text-destructive"
              onClick={() => changeFriendList("remove")}
            >
              Remove as friend
            </Button>
          )}
        </div>
      </div>
      <Separator />
      <div className="py-6 space-y-4">
        <div className="space-y-2">
          <h1 className="font-medium text-2xl">Activity</h1>
          {posts?.map((post: PostType) => (
            <Post paddingX={true} key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
