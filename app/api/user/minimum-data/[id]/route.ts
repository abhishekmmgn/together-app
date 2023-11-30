import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Users from "@/models/users";

type Params = {
  params: { id: string };
};

export async function GET({ params }: Params) {
  try {
    await connectDB();

    console.log(params.id);

    const user = await Users.findOne({ _id: params.id }).select(
      "name profilePhoto"
    );
    console.log(user);
    
    return NextResponse.json({
      message: "User found",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
