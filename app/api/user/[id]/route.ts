import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Post from "@/models/post";
import { getDataFromToken } from "@/helpers/getDataFromToken";

type Params = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const user = await User.findOne({ _id: params.id }).select(
      "name profilePhoto bio friends posts"
    );

    const curUserId = await getDataFromToken(request);
    const isFriend = user.friends.includes(curUserId);

    const postsList = await Post.find({
      _id: { $in: user.posts },
    });

    const data = [user, postsList, { isFriend }];

    return NextResponse.json({
      message: "User found",
      data: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const { _id, action } = await request.json();

    const user = await User.findOne({ _id }).select("friends");

    console.log(user);

    const curUserId = await getDataFromToken(request);

    if (action === "remove") {
      const result = await User.updateOne(
        { _id },
        { $pull: { friends: curUserId } }
      );

      if (result.modifiedCount > 0) {
        console.log("Document updated successfully.");

        // Update current user's friends list
        await User.updateOne(
          { _id: curUserId },
          { $pull: { friends: params.id } }
        );

        return NextResponse.json({
          message: "Friend removed successfully.",
          success: true,
        });
      } else {
        console.log("No document was updated.");
        return NextResponse.json({
          message: "Something went wrong.",
          success: false,
        });
      }
    } else if (action === "add") {
      const result = await User.updateOne(
        { _id },
        { $push: { friends: curUserId } }
      );

      if (result.modifiedCount > 0) {
        console.log("Document updated successfully.");

        // Update current user's friends list
        await User.updateOne(
          { _id: curUserId },
          { $push: { friends: params.id } }
        );

        return NextResponse.json({
          message: "Friend added successfully.",
          success: true,
        });
      } else {
        console.log("No document was updated.");
        return NextResponse.json({
          message: "Something went wrong.",
          success: false,
        });
      }
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
