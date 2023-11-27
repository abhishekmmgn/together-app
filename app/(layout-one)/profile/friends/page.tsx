"use client";

import { useState, useEffect } from "react";
import ProfileCardSkeleton from "@/components/explore/profile-card-skeleton";
import { useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";
import ProfileCard from "@/components/explore/profile-card";
import { PersonProfileType } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const loadingArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function FriendsPage() {
  const [data, setData] = useState<PersonProfileType[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  async function getData() {
    try {
      const res = await fetch(`/api/user/friends`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setData(data.data);
        setLoading(false);
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="w-full h-full px-5 lg:px-0">
      <div
        className="w-full h-11 lg:px-0 flex items-center"
        onClick={() => router.back()}
      >
        <div className="w-full hover:cursor-pointer flex items-center">
          <IoChevronBack className="h-5 w-5" />
          <p className="text-sm+">Back</p>
        </div>
      </div>

      {loading && (
        <>
          {loadingArray.map((_, i) => (
            <ProfileCardSkeleton key={i} />
          ))}
        </>
      )}
      {data.map((user) => (
        <ProfileCard
          key={user._id}
          _id={user._id}
          name={user.name}
          profilePhoto={user.profilePhoto}
          bio={user.bio}
        />
      ))}
      {data.length === 0 && !loading && (
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
