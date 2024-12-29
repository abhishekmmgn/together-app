import { type NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import { getDataFromToken } from "@/lib/getDataFromToken";
import { cookies } from "next/headers";
import Posts from "@/models/posts";
import type { BasicPostInterface } from "@/types";

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const curUserId = await getDataFromToken(request);
		const user = await User.findOne({ _id: curUserId }).select(
			"name profilePhoto posts",
		);

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
			posts: formattedPosts,
		};

		return NextResponse.json({
			message: "Posts found",
			data,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
