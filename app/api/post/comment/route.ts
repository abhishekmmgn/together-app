import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/posts";
import User from "@/models/users";
import Comment from "@/models/comment";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const { postId, comment } = await request.json();

    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }

    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 400 });
    }

    const newComment = new Comment({
      text: comment,
      creator: userId,
      post: postId,
    });

    const savedComment = await newComment.save();

    post.comments.push(savedComment._id);
    const savedPost = await post.save();

    if (!savedComment || !savedPost) {
      return NextResponse.json({ error: "Error saving comment" }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Commented successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
