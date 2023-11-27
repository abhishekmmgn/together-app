"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Post from "@/components/post/post";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Params = {
  params: { id: string };
};

export default function ExternalProfile({ params }: Params) {
  const [userData, setUserData] = useState<{
    name: string;
    profilePhoto: string;
    bio: string;
    posts: [];
    isFriend: boolean;
  }>({
    name: "",
    profilePhoto: "",
    bio: "",
    posts: [],
    isFriend: false,
  });

  async function getData() {
    try {
      const res = await fetch(`/api/user/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setUserData({
          name: data.data.name,
          profilePhoto: data.data.profilePhoto,
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
        setUserData({
          ...userData,
          isFriend: !userData.isFriend,
        });
      } else {
        console.log(res.statusText);
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
    }
  }
  function handleCopyLink(
    event: React.MouseEvent<HTMLElement>,
  ) {
    event.preventDefault();
    try {
      navigator.clipboard.writeText(`https:togetherx.app${window.location.pathname}`);
      toast.success("Link copied successfully");
    } catch (error) {
      toast.error("Failed to copy link");
      return false;
    }
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
          <h1 className="-mt-1 font-medium text-2xl md:text-3xl">
            {userData?.name}
          </h1>
          <p className="-mt-1 mb-1 text-tertiary-foreground line-clamp-2">
            {userData?.bio}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {userData?.isFriend && (
            <Button variant="outline" className="mx-auto">
              Message
            </Button>
          )}
          {!userData?.isFriend && (
            <Button className="mx-auto" onClick={() => changeFriendList("add")}>
              Add as Friend
            </Button>
          )}
          <Button
            variant="secondary"
            className="mx-auto"
            onClick={handleCopyLink}
          >
            Share Profile
          </Button>
          {userData?.isFriend && (
            <Button
              variant="secondary"
              className="mx-auto"
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
          {userData?.posts?.map((post: any, index) => (
            <Post paddingX={true} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
