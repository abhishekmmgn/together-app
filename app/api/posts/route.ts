import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/posts";
import Users from "@/models/users";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const curUserId = await getDataFromToken(request);

    // return 5 posts from posts collection for infinite scroll
    const posts = await Post.find().limit(5);

    const updatedPost = await Promise.all(
      posts.map(async (post) => {
        // find the creator details of each post and update the posts
        const creator = await Users.findOne({ _id: post.creator });
        // check if post has been liked by current user
        const isLiked = post.likes.includes(curUserId);
        return {
          ...post.toJSON(),
          liked: isLiked,
          creator: {
            _id: creator?._id,
            name: creator?.name,
            profilePhoto: creator?.profilePhoto,
          },
        };
      })
    );

    return NextResponse.json({
      message: "Posts found",
      data: updatedPost,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
