"use client";

import Post from "@/components/post/post";
import Comments from "@/components/post/comments";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import PostSkeleton from "@/components/post/post-skeleton";
import type { PostType } from "@/types";

type Props = {
  params: { id: string };
};

export default function Home({ params }: Props) {
  const [post, setPost] = useState<PostType>();
  const [postNotFound, setPostNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  async function getPost() {
    try {
      const res = await fetch(`/api/post/${params.id}`, {
        cache: "no-cache",
      });
      if (res.ok) {
        const data = await res.json();
        setPost(data.data);
      } else if (res.status === 400) {
        setPostNotFound(true);
        console.log("Not found");
      } else {
        console.log("Error");
      }
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPost();
  }, []);

  if (loading) {
    return (
      <main className="p-5">
        <PostSkeleton />
      </main>
    );
  }

  if (postNotFound) {
    notFound();
  }
  if (post) {
    return (
      <>
        <Post post={post} />
        <div className="p-5 lg:px-0">
          <Comments postId={params.id} comments={post.comments} />
        </div>
      </>
    );
  }
}
