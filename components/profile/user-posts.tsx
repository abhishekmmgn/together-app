import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Post from "@/components/post/post";
import type { PostType } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserPosts({ userId }: { userId: string }) {
  const [postsData, setPostsData] = useState<PostType[]>([]);

  async function getData() {
    try {
      const res = await fetch(`/api/user-posts/${userId}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setPostsData(data.posts);
      }
    } catch (err: any) {
      console.log("Error: ", err.message);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="pt-6 px-5 lg:px-0 space-y-2">
      <h2 className="font-medium text-2xl">Activity</h2>
      {postsData?.length > 0 ? (
        <>
          {postsData.map((post) => (
            <Post key={post._id} post={post} paddingX={true} canDelete={true} />
          ))}
        </>
      ) : (
        <div className="py-10">
          <h3 className="text-center font-medium text-xl">
            You don&apos;t have any posts yet.
          </h3>
          <Link
            href="/"
            className={cn(
              buttonVariants({
                variant: "link",
              })
            )}
          >
            New Post
          </Link>
        </div>
      )}
    </div>
  );
}
