import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    //check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Account does not exist" },
        { status: 404 }
      );
    }

    //check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Password is wrong" }, { status: 400 });
    }
    // console.log(user);

    //create token data
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    //create token
    const tokenSecret = process.env.TOKEN_SECRET || "";
    const token = jwt.sign(tokenData, tokenSecret, {
      expiresIn: "30d",
    });

    console.log(token);

    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    console.log("Cookies after setting token:", cookies());

    return NextResponse.json({
      message: "Login successful",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
