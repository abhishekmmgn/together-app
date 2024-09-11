import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Users from "@/models/users";
import Posts from "@/models/posts";
import { getDataFromToken } from "@/lib/getDataFromToken";
import type { BasicPostInterface } from "@/types";

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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const curUserId = await getDataFromToken(request);
    const isFriend = user.friends.includes(curUserId);

    const posts = await Posts.find({
      _id: { $in: user.posts },
    });

    // format posts
    const formattedPosts: BasicPostInterface[] = [];
    posts.map((post) => {
      formattedPosts.push({
        _id: post._id,
        thread: post.thread,
        image: post.image[0],
        liked: post.likes.includes(user._id),
        likes: post.likes.length,
        commentsLength: post.comments.length,
        createdAt: post.createdAt,
      });
    });

    const data = {
      _id: user._id,
      name: user.name,
      profilePhoto: user.profilePhoto,
      bio: user.bio,
      isFriend,
      posts: formattedPosts,
    };

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
      }
      console.log("No document was updated.");
      return NextResponse.json({
        message: "Something went wrong.",
        success: false,
      });
    }
    if (action === "add") {
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
      }

      console.log("No document was updated.");
      return NextResponse.json({
        message: "Something went wrong.",
        success: false,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
