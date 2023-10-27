"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { connectDB } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const routeSegment = useSelectedLayoutSegment();
  console.log(routeSegment);

  try {
    await connectDB();

    // fetch userId from url
    const currentUserId = await getDataFromToken(request);
    const user = await User.findOne({ _id: currentUserId }).select("friends");

    //find external user using segment of url
    // find it in mongodb

    // find the posts of external user


    // return all 3
    return NextResponse.json({
      message: "User found",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
