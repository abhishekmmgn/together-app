import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const _id = await getDataFromToken(request);

    const user = await User.findOne({ _id }).select("friends");

    const friendsList = await User.find({
      _id: { $in: user.friends },
    }).select("name bio profilePhoto _id");

    return NextResponse.json({
      message: "User found",
      data: friendsList,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
