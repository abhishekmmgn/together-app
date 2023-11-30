import Post from "@/components/post/post";
import { PostType } from "@/types";
import NewPost from "@/components/post/new-post";

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-cache",
  });
  const data = await res.json();
  const posts: PostType[] = data.data;

  return (
    <div>
      <NewPost />
      {posts?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}
