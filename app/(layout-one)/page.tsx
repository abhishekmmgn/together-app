import Header from "@/components/header";
import EventPost from "@/components/event-post";
import Post from "@/components/post";

export default function Home() {
  return (
    <>
      <Header />
      <div>
        <Post />
        <EventPost />
      </div>
    </>
  );
}
