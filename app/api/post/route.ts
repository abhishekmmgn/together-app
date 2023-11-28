import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";
import User from "@/models/user";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest, params: { id: string }) {
  try {
    await connectDB();

    const _id = params.id;
    const post = await Post.findOne({ _id });

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 400 });
    }

    return NextResponse.json({
      message: "Post found",
      data: post,
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

    return NextResponse.json(
      { error: "Post created successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const postId = await request.json();
    const userId = await getDataFromToken(request);

    const user = await User.findOne({ _id: userId });
    const post = await User.findOne({ _id: postId });

    if (!user || !post) {
      return NextResponse.json(
        { error: "Post does not exists" },
        { status: 400 }
      );
    }

    if (user._id !== post.creator) {
      return NextResponse.json(
        { error: "You are not authorized to delete this post" },
        { status: 401 }
      );
    }

    await Post.deleteOne({ _id: postId });

    // remove post id from user's posts array
    const index = user.posts.indexOf(postId);
    user.posts.splice(index, 1);

    const savedUser = await user.save();

    return NextResponse.json(
      { error: "Post deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
