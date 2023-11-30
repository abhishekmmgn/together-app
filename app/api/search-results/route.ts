import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Users from "@/models/users";
import Posts from "@/models/posts";

type Props = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    await connectDB();

    const query = params.id;

    console.log(query);

    const userResults = await Users.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("_id name bio profilePhoto");

    const postResults = await Posts.find({
      tags: { $in: [query] }, // Search posts by tags
    });

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
