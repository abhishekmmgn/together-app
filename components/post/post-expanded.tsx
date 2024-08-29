import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaRegComments } from "react-icons/fa";
import Post from "./post";
import { Comment } from "./comment";
import CreateComment from "./comments";
import type { PostType } from "@/types";
import { useEffect, useState } from "react";

async function getPost(postId: string) {
  const res = await fetch(`api/post/${postId}`, {
    cache: "no-cache",
  });
  const data = await res.json();
  return data.data;
}

export default function PostExpanded(props: { postId: string }) {
  const [post, setPost] = useState<PostType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const res = getPost(props.postId);
    console.log(res);

    setLoading(false);
  }, [props.postId]);
  return (
    <Dialog>
      <DialogTrigger>
        <FaRegComments className="text-xl text-muted-foreground cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="flex flex-col overflow-y-auto">
        {loading && <></>}
        {!loading && (
          <>
            <Post post={post!} />
            <div className="p-5">
              <div className="mt-3 space-y-3">
                {true && (
                  <>
                    <Comment
                      createdBy={{
                        name: "",
                        _id: "",
                        profilePhoto:
                          "",
                      }}
                      type="sent"
                      comment="This is a comment."
                    />
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
