import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Users from "@/models/users";
import Posts from "@/models/posts";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const searchQuery = url.searchParams.get("query");

    const userResults = await Users.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .select("_id name bio profilePhoto")
      .limit(10);

    const postResults = await Posts.find({
      // search query in tags regardless of case.
      tags: { $regex: searchQuery, $options: "i" },
    }).limit(4);

    const updatedPost = await Promise.all(
      postResults.map(async (post) => {
        // find the creator details of each post and update the posts
        const creator = await Users.findOne({ _id: post.creator });
        return {
          ...post.toJSON(),
          creator: {
            _id: creator?._id,
            name: creator?.name,
            profilePhoto: creator?.profilePhoto,
          },
        };
      })
    );

    return NextResponse.json({
      message: "Search results",
      data: {
        users: userResults,
        posts: updatedPost,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
