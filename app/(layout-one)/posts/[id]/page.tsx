import Post from "@/components/post/post";
import { PostType } from "@/types";
import Back from "@/components/back";

type Props = {
  params: { id: string };
};

export default async function Home({ params }: Props) {
  const res = await fetch(`http://localhost:3000/api/post/${params.id}`, {
    cache: "no-cache",
  });
  const data = await res.json();
  const post: PostType = data.data;

  return (
    <>
      <Back />
      {post && <Post post={post} />}
    </>
  );
}
