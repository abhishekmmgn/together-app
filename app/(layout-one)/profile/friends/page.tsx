"use client";

import Back from "@/components/back";
import ProfileCard from "@/components/explore/profile-card";
import { PersonProfileType } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function FriendsPage() {
  const [friends, setFriends] = useState<PersonProfileType[]>([]);

  async function getData() {
    try {
      const res = await fetch("/api/user/friends/", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setFriends(data.data);
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-full h-full px-5 lg:px-0">
      <Back />
      {friends.length > 0 ? (
        <>
          {friends.map((user) => (
            <ProfileCard
              key={user._id}
              _id={user._id}
              name={user.name}
              profilePhoto={user.profilePhoto}
              bio={user.bio}
            />
          ))}
        </>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center gap-3">
          <h1 className="text-2xl font-medium text-clip">
            You don&apos;t have any friends yet.
          </h1>
          <Link href="/explore" className="w-full flex justify-center">
            <Button className="max-w-md">Search new friends</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
