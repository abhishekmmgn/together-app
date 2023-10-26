import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select("-password");
    return NextResponse.json({
      message: "User found",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
