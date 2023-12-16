"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoArrowUpCircle } from "react-icons/io5";
import { useState } from "react";
import { Comment } from "./comment";
import { CommentsType } from "@/types";

export default function Comments({
  postId,
  comments,
}: {
  postId: string;
  comments: CommentsType[];
}) {
  const [message, setMessage] = useState<string>("");
  const [userComments, setUserComments] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });
      if (res.ok) {
        console.log(res);
        setUserComments((prev) => {
          return [...prev, message];
        });
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
    } finally {
      setMessage("");
    }
  }
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        {comments.map((comment: CommentsType, index) => (
          <Comment
            type="recieved"
            comment={comment.message}
            createdBy={comment.createdBy}
            key={index}
          />
        ))}
        {userComments?.map((comment, index) => (
          <Comment
            type="sent"
            comment={comment}
            createdBy={{
              _id: "",
              name: "You",
              profilePhoto: "",
            }}
            key={index}
          />
        ))}
      </div>
      <form className="flex gap-3" onSubmit={handleSubmit}>
        <Input
          type="text"
          value={message}
          placeholder="Write a comment"
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          size="icon"
          variant="ghost"
          disabled={message.length === 0}
          className="w-12 hover:bg-transparent"
        >
          <IoArrowUpCircle className="w-7 h-7 text-primary" />
        </Button>
      </form>
    </div>
  );
}
