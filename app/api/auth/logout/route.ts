import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    cookies().set("token", "", { httpOnly: true, expires: new Date(0) });

    console.log("Logout successful");

    return NextResponse.json({
      message: "Logout successful",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
