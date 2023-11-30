import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { cookies } from "next/headers";
import Post from "@/models/posts";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getDataFromToken(request);
    const user = await User.findOne({ _id: userId }).select(
      "name profilePhoto bio posts"
    );

    const postsList = await Post.find({
      _id: { $in: user.posts },
    });

    const data = [user, postsList];
    return NextResponse.json({
      message: "User found",
      data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const userId = await getDataFromToken(request);
    const { profilePhoto, bio } = await request.json();

    const _id = userId;
    const user = await User.findOne({ _id });

    if (!user) {
      return NextResponse.json(
        { error: "User doesn't exist." },
        { status: 400 }
      );
    }

    const result = await User.updateOne(
      { _id },
      { $set: { profilePhoto, bio } }
    );
    if (result.modifiedCount > 0) {
      console.log("Document updated successfully.");
      return NextResponse.json({
        message: "Profile updated successfully.",
        success: true,
      });
    } else {
      console.log("No document was updated.");
      return NextResponse.json({
        message: "Something went wrong.",
        success: false,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const _id = await getDataFromToken(request);

    const user = await User.findOne({ _id });

    if (!user) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    // delete user
    await User.deleteOne({ _id });

    // remove token
    cookies().set("token", "", { httpOnly: true, expires: new Date(0) });

    return NextResponse.json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await mongoose.connection.close();
  }
}
