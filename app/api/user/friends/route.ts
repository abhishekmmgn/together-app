import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import { getDataFromToken } from "@/lib/getDataFromToken";
import type { PersonProfileType } from "@/types";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const _id = await getDataFromToken(request);
    const user = await User.findOne({ _id }).select("friends");
    console.log(`user: ${user}`);

    // remove '' from friends array, if any
    const friends = user.friends.filter((item: string) => item !== "");

    const friendsData: PersonProfileType[] = await User.find({
      _id: { $in: friends },
    }).select("name bio profilePhoto _id");

    return NextResponse.json({
      message: "Friends found",
      data: friendsData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
