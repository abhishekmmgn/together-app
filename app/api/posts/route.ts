import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/posts";
import Users from "@/models/users";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const curUserId = await getDataFromToken(request);

    // Get the page number from the query parameters
    const page = Number(request.nextUrl.searchParams.get("page")) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    // Return a specific page of posts from the posts collection for infinite scroll
    const posts = await Post.find().skip(skip).limit(limit);

    const updatedPost = await Promise.all(
      posts.map(async (post) => {
        const creator = await Users.findOne({ _id: post.creator });
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
