"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { GoShare } from "react-icons/go";
import { Separator } from "@/components/ui/separator";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { PostType } from "@/types";
import copyLink from "@/helpers/copyLink";

type PropsType = {
  paddingX?: boolean;
};

export default function Post(props: { post: PostType; paddingX?: boolean }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const postDate = new Date(props.post?.createdAt);
  const currentDate = new Date();

  let formattedDate = "";
  if (postDate.toDateString() === currentDate.toDateString()) {
    formattedDate = postDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } else {
    formattedDate = postDate.toLocaleDateString();
  }

  async function changeLike() {
    const res = await fetch("/api/post/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId: props.post?._id }),
    });
    if (res.ok) {
      setLiked(!liked);
    }
  }

  return (
    <>
      <div className="pt-1 pb-3">
        <div
          className={`${
            !props.paddingX && "px-4"
          } py-2 flex items-center justify-between lg:px-0`}
        >
          <div className="w-full flex items-center gap-3">
            <Link href={`/profile/${props.post?.creator}`}>
              <Avatar className="h-11 w-11">
                <AvatarImage
                  src="https://www.unsplash.com/random"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <div className="w-full flex flex-col gap-[2px]">
              <h1 className="line-clamp-1 font-medium">
                <Link href="/organization/1">DKMS UK</Link>
              </h1>
              <p className="text-sm line-clamp-1 text-muted-foreground">
                {formattedDate}
              </p>
            </div>
            <Menubar className="border-0 bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="hover:text-cursor">
                  <FiMoreHorizontal className="text-2xl" />
                </MenubarTrigger>
                <MenubarContent className="border-border">
                  <MenubarItem
                    onClick={() => copyLink(`/posts/${props.post?._id}`)}
                  >
                    Share
                  </MenubarItem>
                  <MenubarSeparator />
                  <Link href={`/posts/${props.post?._id}`}>
                    <MenubarItem>Go to Post</MenubarItem>
                  </Link>
                  <MenubarSeparator />
                  <MenubarItem>Not Intrested</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        </div>
        <p
          className={`${
            !props.paddingX && "px-4"
          } mb-2 text-sm line-clamp-3 md:mb-3 md:mt-1 md:text-sm+ lg:px-0`}
        >
          {props.post?.thread}
        </p>
        {props.post?.image && (
          <Image
            src=""
            alt="Post Photo"
            width={480}
            height={360}
            className="w-full aspect-[3/2] bg-secondary shadow-sm"
          />
        )}
        <div
          className={`${
            !props.paddingX && "px-4 lg:px-0"
          } h-11 w-full flex gap-4 items-center`}
        >
          {liked ? (
            <AiFillLike
              className="text-2xl text-[#007aff] cursor-pointer"
              onClick={() => changeLike()}
            />
          ) : (
            <AiOutlineLike
              className="text-2xl text-muted-foreground cursor-pointer"
              onClick={() => changeLike()}
            />
          )}
          <FaRegComment className="text-xl text-muted-foreground cursor-pointer" />
          <GoShare className="text-xl text-muted-foreground cursor-pointer" />
        </div>
        <div
          className={`${
            !props.paddingX && "px-4 lg:px-0"
          } h-8 w-full flex gap-4 items-start`}
        >
          <p className="text-sm text-muted-foreground">
            {props.post?.likes.length} Likes
          </p>
          <p
            className="text-sm text-muted-foreground"
            onClick={() => setShowComments(true)}
          >
            {props.post?.comments.length} Comments
          </p>
        </div>
      </div>
      <Separator />
    </>
  );
}
