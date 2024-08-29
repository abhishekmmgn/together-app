import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/posts";
import { getDataFromToken } from "@/lib/getDataFromToken";
import Users from "@/models/users";
import type { CommentsType } from "@/types";

type Props = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: Props) {
  try {
    await connectDB();

    const id = params.id;
    const post = await Post.findOne({ _id: id });
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 400 });
    }

    // check if post has been liked by current user
    const curUserId = await getDataFromToken(request);
    const isLiked = post.likes.includes(curUserId);

    // find the creator details
    const creator = await Users.findOne({ _id: post.creator });

    // find the creator details of each comments and update the post

    const comments: Array<CommentsType> = [];

    await Promise.all(
      post.comments.map(async (comment: CommentsType) => {
        const creator = await Users.findOne({ _id: comment.createdBy });
        // now push comment to comments array
        comments.push({
          ...comment,
          createdBy: {
            _id: creator._id,
            name: creator.name,
            profilePhoto: creator.profilePhoto,
          },
        });
      })
    );

    const updatedPost = {
      ...post.toJSON(),
      liked: isLiked,
      comments,
      creator: {
        _id: creator?._id,
        name: creator?.name,
        profilePhoto: creator?.profilePhoto,
      },
    };

    return NextResponse.json({
      message: "Post found",
      data: updatedPost,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 501 });
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    await connectDB();

    const { like, message } = await request.json();

    const curUserId = await getDataFromToken(request);
    const user = await Users.findOne({ _id: curUserId });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 400 });
    }

    console.log("Running...");
    const postId = params.id;
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 400 });
    }

    // update likes
    if (like) {
      const isLiked = post.likes.includes(curUserId);
      if (isLiked) {
        post.likes.pull(curUserId);
      } else {
        post.likes.push(curUserId);
      }
    }

    // update comments
    if (message) {
      const comment = { createdBy: curUserId, message, createdAt: new Date() };

      post.comments.push(comment);
    }

    await post.save();

    return NextResponse.json(
      {
        message: "Updated post",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 501 });
  }
}

export async function DELETE(request: NextRequest, params: { id: string }) {
  try {
    await connectDB();

    const { postId } = await request.json();
    const userId = await getDataFromToken(request);

    const user = await Users.findOne({ _id: userId });
    const post = await Post.findOne({ _id: postId });

    if (!user || !post) {
      return NextResponse.json(
        { error: "User or post does not exists" },
        { status: 400 }
      );
    }

    await Post.deleteOne({ _id: postId });

    // remove post id from user's posts array
    const index = user.posts.indexOf(postId);
    user.posts.splice(index, 1);

    await user.save();

    return NextResponse.json(
      { message: "Post deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
