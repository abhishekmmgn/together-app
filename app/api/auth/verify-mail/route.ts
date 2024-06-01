import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const reqBody = await request.json();
    const { verificationToken } = reqBody;

    const user = await User.findOne({
      verifyToken: verificationToken,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    await user.save({
      isVerfied: true,
      verifyToken: undefined,
      verifyTokenExpiry: undefined,
    });

    //create token data
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    //create token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "30d",
    });

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({
      message: "Email verification successful",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
