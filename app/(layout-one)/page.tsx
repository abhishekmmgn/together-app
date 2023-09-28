import Navbar from "@/components/navbar";
import EventPost from "@/components/posts/event-post";
import Post from "@/components/posts/post";

export default function Home() {
  return (
    <>
      <Navbar title="Together" />
      <div className="">
        <Post  />
        <EventPost />
        <Post />
      </div>
    </>
  );
}
