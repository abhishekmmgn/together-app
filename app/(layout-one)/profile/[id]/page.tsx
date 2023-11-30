"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Post from "@/components/post/post";
import { useEffect, useState } from "react";
import copyLink from "@/helpers/copyLink";
import { PostType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import PostSkeleton from "@/components/post/post-skeleton";

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
  const [notFound, setNotFound] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  async function getData() {
    try {
      const res = await fetch(`/api/user/${params.id}`, {
        cache: "no-cache",
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setUserData({
          name: data.data[0].name,
          profilePhoto: data.data[0].profilePhoto,
          bio: data.data[0].bio,
        });
        setIsFriend(data.data[2].isFriend);
        setPosts(data.data[1]);
      } else if (res.status === 400) {
        setNotFound(true);
      } else if (res.status === 500) {
        setError(true);
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

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

  if (isLoading) {
    return (
      <div className="p-5">
        <div className="grid gap-4 pb-4">
          <Skeleton className="w-28 lg:w-32 aspect-square rounded-md" />
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
  if (notFound) {
    return (
      <div className="w-full h-[90%] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-medium text-center">User not found.</h1>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-[90%] flex flex-col justify-center items-center">
        <h1 className="text-2xl font-medium text-center">
          Something went wrong. Please try refreshing the page.
        </h1>
      </div>
    );
  }
  return (
    <div className="p-5">
      <div className="grid gap-4 pb-4">
        <Image
          src={userData?.profilePhoto}
          alt={`Profile photo of ${userData?.name}`}
          width={200}
          height={200}
          className="w-28 lg:w-32 aspect-square bg-secondary shadow-sm rounded-md"
        />
        <div>
          <h1 className="-mt-1 capitalize font-medium text-2xl md:text-3xl">
            {userData?.name}
          </h1>
          <p className="-mt-1 mb-1 text-tertiary-foreground">{userData?.bio}</p>
        </div>
        <div className="flex flex-col gap-3">
          {isFriend && (
            <Button variant="outline" className="max-w-md mx-auto">
              Message
            </Button>
          )}
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
