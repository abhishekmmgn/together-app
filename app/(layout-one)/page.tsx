import Navbar from "@/components/navbar";
import EventPost from "./post/event-post";
import Post from "./post/post";

export default function Home() {
  return (
    <>
      <Navbar title="Together" />
      <div>
        <Post  />
        <EventPost />
        <Post />
      </div>
    </>
  );
}
