import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Post from "@/models/post";

export async function GET(request: NextRequest) {
  console.log(request);
  try {
    await connectDB();

    // console.log(request.url)
    // const { query } = await request.json();
    
    
    const userResults = await User.find({
      $or: [
        { name: { $regex: "b", $options: "i" } },
        { email: { $regex: "b", $options: "i" } },
      ],
    }).select('_id name bio profilePhoto');

    const postResults = await Post.find({
      tags: { $in: ["b"] }, // Search posts by tags
    }).select('_id thread creator image likes comments tags');
    
    console.log(userResults, postResults)
    
    console.log("Q: ");

    return NextResponse.json({
      message: "Search results",
      data: {
        users: userResults,
        posts: postResults,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
