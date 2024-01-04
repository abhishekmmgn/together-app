import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const _id = await getDataFromToken(request);
    const user = await User.findOne({ _id });
    
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 400 });
    }
    
    return NextResponse.json({
      message: "User found",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 501 });
  }
}
