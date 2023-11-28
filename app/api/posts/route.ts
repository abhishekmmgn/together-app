import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    console.log("It worked.");

    // return 10 posts from posts collection
    const posts = await Post.find().limit(10);

    console.log(posts);

    return NextResponse.json({
      message: "Post found",
      data: posts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}