import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    //check if user already exists
    const user = await User.findOne({ email });

    console.log(user);
    
    if (!user) {
      return NextResponse.json(
        { error: "User doesn't exist." },
        { status: 400 }
      );
    }

    // send verification email
    await sendEmail({ email, emailType: "RESET", userId: user._id });

    return NextResponse.json({
      message: "Email send successfully",
      success: true,
      user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
