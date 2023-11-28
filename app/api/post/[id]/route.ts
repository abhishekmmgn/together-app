import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/post";

type Props = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: Props) {
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
