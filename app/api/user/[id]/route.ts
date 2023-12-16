import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Users from "@/models/users";
import Posts from "@/models/posts";
import { getDataFromToken } from "@/helpers/getDataFromToken";

type Params = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const user = await Users.findOne({ _id: params.id }).select(
      "name profilePhoto bio friends posts"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const curUserId = await getDataFromToken(request);

    const isFriend = user.friends.includes(curUserId);
    const postsList = await Posts.find({
      _id: { $in: user.posts },
    });

    // find the creator details of each post and update the posts
    const postsWithCreator = await Promise.all(
      postsList.map(async (post) => {
        const creator = await Users.findOne({ _id: post.creator });
        return {
          ...post.toJSON(),
          creator: {
            _id: creator?._id,
            name: creator?.name,
            profilePhoto: creator?.profilePhoto,
          },
        };
      })
    );

    const data = [user, postsWithCreator, { isFriend }];

    return NextResponse.json(
      {
        message: "User found",
        data: data,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await connectDB();

    const { _id, action } = await request.json();

    const user = await Users.findOne({ _id }).select("friends");

    console.log(user);

    const curUserId = await getDataFromToken(request);

    if (action === "remove") {
      const result = await Users.updateOne(
        { _id },
        { $pull: { friends: curUserId } }
      );

      if (result.modifiedCount > 0) {
        console.log("Document updated successfully.");

        // Update current user's friends list
        await Users.updateOne(
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
      const result = await Users.updateOne(
        { _id },
        { $push: { friends: curUserId } }
      );

      if (result.modifiedCount > 0) {
        console.log("Document updated successfully.");

        // Update current user's friends list
        await Users.updateOne(
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
