import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log("It worked.")
    
    const hashedPass = await bcrypt.hash(password, 20);
    await connectMongoDB();
    const user = new User({ email, password: hashedPass });

    console.log("It also worked")
    
    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error registering user" },
      { status: 500 }
    );
  }
}
