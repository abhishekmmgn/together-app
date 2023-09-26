import Navbar from "@/components/navbar";
import EventPost from "@/components/event-post";
import Post from "@/components/post";
import { CommentSent } from "@/components/comment";

export default function Home() {
  return (
    <>
      <Navbar title="Together" />
      <div className="py-4">
        <Post />
        <EventPost />
        <Post />
        <EventPost />
      </div>
    </>
  );
}
