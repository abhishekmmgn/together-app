import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";
import User from "@/models/user";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { postId } = await request.json();

    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }
    console.log(postId)

    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 400 });
    }

    // check if user already liked the post or not
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    const savedPost = await post.save();

    if (!savedPost) {
      return NextResponse.json(
        { error: "Error updating post" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Post updated successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
