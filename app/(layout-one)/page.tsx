"use client";

import Post from "@/components/post/post";
import { PostType } from "@/types";
import NewPost from "@/components/post/new-post";
import { useState, useEffect } from "react";
import PostSkeleton from "@/components/post/post-skeleton";
import { Separator } from "@/components/ui/separator";

async function getPosts() {
  const res = await fetch("http://localhost:3000/api/posts");
  const data = await res.json();
  const posts: PostType[] = data.data;
  return posts;
}

export default function Home() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="p-5 space-y-2">
        <PostSkeleton />
        <Separator />
        <PostSkeleton />
      </div>
    );
  } else {
    return (
      <>
        <NewPost />
        <div>
          {posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      </>
    );
  }
}
