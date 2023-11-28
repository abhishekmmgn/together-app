import Post from "./post";
import { CommentSent, CommentRecieved } from "./comment";
import CreateComment from "./create-comment";

export default function PostInfo() {
  return (
    <div className="p-5">
      {/* <Post paddingX={true} />
      <div className="mt-3 space-y-3">
        {true && (
          <>
            <CommentRecieved comment="This is a comment." />
            <CommentRecieved comment="This is a comment." />
          </>
        )}
      </div>
      <CreateComment /> */}
    </div>
  );
}
