import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const reqBody = await request.json();
    const { _id } = reqBody;
    // console.log(_id);

    const user = await User.findOne({ _id });

    // console.log("User:", user);

    if (!user) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    // delete user
    

    return NextResponse.json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
