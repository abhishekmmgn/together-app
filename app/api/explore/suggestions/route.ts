import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Users from "@/models/users";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const curUserId = await getDataFromToken(request);

    const users = await Users.find().select("name profilePhoto _id, bio").limit(4);

    // remove current user from suggestions
    const updatedUsers = users.filter((user) => user._id != curUserId);

    return NextResponse.json({
      message: "Users found",
      data: updatedUsers,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
