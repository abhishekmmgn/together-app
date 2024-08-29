"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IoHeart,
  IoHeartOutline,
  IoEllipsisHorizontal,
  IoArrowRedoOutline,
} from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import type { PostType } from "@/types";
import copyLink from "@/lib/copyLink";
import formatPostDate from "@/lib/formatDate";
import formatAvatarName from "@/lib/formatAvatarName";
import { FaRegComments } from "react-icons/fa";
import { checkLoggedIn } from "@/lib/checkLoggedIn";
import { useRouter } from "next/navigation";

export default function Post(props: {
  post: PostType;
  paddingX?: boolean;
  canDelete?: boolean;
}) {
  const [liked, setLiked] = useState(false || props.post.liked);
  const [isDeleted, setIsDeleted] = useState(false);
  const [numberofLikes, setNumberofLikes] = useState(props.post?.likes.length);

  const { replace } = useRouter();
  
  const formattedDate = formatPostDate(props.post?.createdAt);

  async function changeLike() {
    // check if logged in
    if (!(await checkLoggedIn())) {
      replace("/auth/login");
    }
    const res = await fetch(`/api/post/${props.post._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ like: true }),
    });
    if (res.ok) {
      setLiked(!liked);
      if (liked) {
        setNumberofLikes(numberofLikes - 1);
      } else {
        setNumberofLikes(numberofLikes + 1);
      }
    }
  }

  async function deletePost() {
    const res = await fetch(`/api/post/${props.post._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId: props.post._id }),
    });
    if (res.ok) {
      setIsDeleted(true);
    }
  }

  if (isDeleted) {
    return <></>;
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
            <Link href={`/profile/${props.post.creator._id}`}>
              <Avatar className="h-11 w-11">
                <AvatarImage
                  src={props.post.creator.profilePhoto}
                  alt={props.post.creator.name}
                />
                <AvatarFallback>
                  {formatAvatarName(props.post.creator.name)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="w-full flex flex-col gap-[2px]">
              <h1 className="line-clamp-1 font-medium">
                {props.post?.creator.name}
              </h1>
              <p className="text-sm line-clamp-1 text-muted-foreground">
                {formattedDate}
              </p>
            </div>
            <Menubar className="border-0 bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="hover:text-cursor">
                  <IoEllipsisHorizontal className="text-2xl" />
                </MenubarTrigger>
                <MenubarContent className="border-border">
                  <MenubarItem
                    className="text-primary"
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
                  {props.canDelete && (
                    <>
                      <MenubarSeparator />
                      <MenubarItem
                        className="text-destructive"
                        onClick={() => {
                          deletePost();
                        }}
                      >
                        Delete post
                      </MenubarItem>
                    </>
                  )}
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
        {props.post?.image[0].length > 0 && (
          <Image
            src={props.post?.image[0]}
            alt="Post Photo"
            width={480}
            height={360}
            className="object-cover w-full aspect-[3/2] bg-secondary shadow-sm"
          />
        )}
        <div
          className={`${
            !props.paddingX && "px-4 lg:px-0"
          } h-11 w-full flex gap-4 items-center`}
        >
          {liked ? (
            <IoHeart
              className="text-2xl text-primary cursor-pointer"
              onClick={() => changeLike()}
            />
          ) : (
            <IoHeartOutline
              className="text-2xl text-muted-foreground cursor-pointer"
              onClick={() => changeLike()}
            />
          )}
          <Link href={`/posts/${props.post?._id}`}>
            <FaRegComments className="text-xl text-muted-foreground cursor-pointer" />
          </Link>
          <IoArrowRedoOutline
            className="text-2xl text-muted-foreground cursor-pointer"
            onClick={() => copyLink(`/posts/${props.post?._id}`)}
          />
        </div>
        <div
          className={`${
            !props.paddingX && "px-4 lg:px-0"
          } h-8 w-full flex gap-4 items-start`}
        >
          <p className="text-sm text-muted-foreground">{numberofLikes} Likes</p>
          <p className="text-sm text-muted-foreground">
            {props.post.comments.length} Comments
          </p>
        </div>
      </div>
      <Separator />
    </>
  );
}
