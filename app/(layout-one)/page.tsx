"use client";

import Post from "@/components/post/post";
import NewPost from "@/components/post/new-post";
import PostSkeleton from "@/components/post/post-skeleton";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

const fetchPosts = async (page: number) => {
  const response = await fetch(`/api/posts?page=${page}`);
  const { data } = await response.json();
  return data;
};

export default function Home() {
  const { data, isLoading, loader } = useInfiniteScroll(fetchPosts);

  return (
    <>
      <NewPost />
      <div>
        {isLoading ? (
          <div className="p-5">
            <PostSkeleton />
          </div>
        ) : (
          <>
            {data?.map((post, index) => (
              <Post key={post._id} post={post} />
            ))}
            <div ref={loader} />
          </>
        )}
      </div>
    </>
  );
}
