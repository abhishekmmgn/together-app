import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/posts";
import Users from "@/models/users";
import { getDataFromToken } from "@/lib/getDataFromToken";
import type { PostType } from "@/types";

export async function GET(request: NextRequest) {
	try {
		await connectDB();

		const curUserId = await getDataFromToken(request);

		console.log(curUserId);

		// Get the page number from the query parameters
		const page = Number(request.nextUrl.searchParams.get("page")) || 1;
		const postsLimit = 3;
		const skipPosts = (page - 1) * postsLimit;

		let posts;
		if (curUserId) {
			posts = await Post.find({ creator: { $ne: curUserId } })
				.sort({ createdAt: -1 })
				.skip(skipPosts)
				.limit(postsLimit);
		} else {
			posts = await Post.find()
				.sort({ createdAt: -1 })
				.skip(skipPosts)
				.limit(postsLimit);
		}

		const postsData: PostType[] = await Promise.all(
			posts.map(async (post) => {
				const creator = await Users.findOne({ _id: post.creator }).select(
					"name profilePhoto",
				);
				return {
					_id: post._id,
					thread: post.thread,
					image: post.image[0],
					likes: post.likes.length,
					commentsLength: post.comments.length,
					createdAt: post.createdAt,
					liked: post.likes.includes(curUserId),
					creator,
				};
			}),
		);

		return NextResponse.json({
			message: "Posts found",
			data: postsData,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
