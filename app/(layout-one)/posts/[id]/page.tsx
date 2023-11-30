import Post from "@/components/post/post";
import { PostType } from "@/types";
import Back from "@/components/back";
import { CommentRecieved, CommentSent } from "@/components/post/comment";
import CreateComment from "@/components/post/create-comment";

type Props = {
  params: { id: string };
};

export default async function Home({ params }: Props) {
  // const res = await fetch(`http://localhost:3000/api/post/${params.id}`, {
  //   cache: "no-cache",
  // });
  // const data = await res.json();
  // const post: PostType = data.data;

  return (
    <>
      <Back />
      {/* {post && <Post post={post} />} */}
      <div className="p-5">
        <div className="mt-3 space-y-3">
          {true && (
            <>
              <CommentRecieved comment="This is a comment." />
              <CommentRecieved comment="This is a comment." />
            </>
          )}
        </div>
        <CreateComment />
      </div>
    </>
  );
}
