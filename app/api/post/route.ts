import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/posts";
import User from "@/models/users";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function GET(request: NextRequest, params: { id: string }) {
  try {
    await connectDB();

    const _id = params.id;
    const post = await Post.findOne({ _id });

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    // check if post has been liked by current user
    const curUserId = await getDataFromToken(request);
    const isLiked = post.likes.includes(curUserId);

    const updatedPost = {
      ...post.toJSON(),
      liked: isLiked,
    };

    return NextResponse.json({
      message: "Post found",
      data: updatedPost,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    let { image, thread, tags } = await request.json();

    const _id = await getDataFromToken(request);

    //check if user already exists
    const user = await User.findOne({ _id });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }

    tags = tags.split(" ");
    const post = new Post({
      image,
      thread,
      tags,
      creator: _id,
    });

    const savedPost = await post.save();

    user.posts.push(savedPost._id);
    const savedUser = await user.save();

    // check if user and post saved successfully
    if (!savedUser || !savedPost) {
      return NextResponse.json({ error: "Error saving post" }, { status: 500 });
    }
    const data = {
      postId: savedPost._id,
      userId: _id,
    };

    return NextResponse.json(
      {
        message: "Post created successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
