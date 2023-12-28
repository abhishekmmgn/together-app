import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import Post from "@/models/posts";

type Params = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const userId = params.id;
    const user = await User.findOne({ _id: userId }).select(
      "_id name profilePhoto posts"
    );

    const postsList = await Post.find({
      _id: { $in: user.posts },
    });

    // find the creator details of each post and update the posts
    const posts = await Promise.all(
      postsList.map(async (post) => {
        return {
          ...post.toJSON(),
          creator: {
            _id: user._id,
            name: user.name,
            profilePhoto: user.profilePhoto,
          },
        };
      })
    );

    return NextResponse.json({
      message: "Posts found",
      posts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}