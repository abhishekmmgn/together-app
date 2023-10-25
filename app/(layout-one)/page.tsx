import Navbar from "@/components/navbar";
import Post from "./post/post";

export default function Home() {
  return (
    <>
      <Navbar title="Together" />
      <div>
        <Post  />
        <Post  />
        <Post />
      </div>
    </>
  );
}
