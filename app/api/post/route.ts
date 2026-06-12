import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, users, postLikes, comments } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function GET(request: NextRequest) {
	try {
		const postId = request.nextUrl.searchParams.get("id");
		const curUserId = await getDataFromToken(request);

		const [post] = await db
			.select({
				id: posts.id,
				thread: posts.thread,
				image: posts.image,
				tags: posts.tags,
				creatorId: posts.creatorId,
				createdAt: posts.createdAt,
				updatedAt: posts.updatedAt,
				likesCount: sql<number>`(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = ${posts.id})::int`,
				commentsCount: sql<number>`(SELECT COUNT(*) FROM comments WHERE comments.post_id = ${posts.id})::int`,
				liked: sql<boolean>`EXISTS(SELECT 1 FROM post_likes WHERE post_likes.post_id = ${posts.id} AND post_likes.user_id = ${curUserId || "00000000-0000-0000-0000-000000000000"})`,
			})
			.from(posts)
			.where(eq(posts.id, postId!));

		if (!post) {
			return NextResponse.json({ error: "Post not found." }, { status: 404 });
		}

		const updatedPost = {
			_id: post.id,
			thread: post.thread,
			image: post.image,
			tags: post.tags,
			creator: post.creatorId,
			likes: post.likesCount,
			commentsLength: post.commentsCount,
			liked: post.liked,
			createdAt: post.createdAt,
			updatedAt: post.updatedAt,
		};

		return NextResponse.json({
			message: "Post found",
			data: updatedPost,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}

export async function POST(request: NextRequest) {
	try {
		let { image, thread, tags } = await request.json();

		const _id = await getDataFromToken(request);

		// check if user exists
		const [user] = await db.select().from(users).where(eq(users.id, _id));

		if (!user) {
			return NextResponse.json(
				{ error: "User does not exists" },
				{ status: 400 },
			);
		}

		const tagsArray = typeof tags === "string" ? tags.split(",") : tags;
		const imageArray = Array.isArray(image) ? image : [image];

		const [savedPost] = await db
			.insert(posts)
			.values({
				image: imageArray,
				thread,
				tags: tagsArray,
				creatorId: _id,
			})
			.returning();

		if (!savedPost) {
			return NextResponse.json({ error: "Error saving post" }, { status: 500 });
		}

		return NextResponse.json(
			{
				message: "Post created successfully.",
			},
			{
				status: 200,
			},
		);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
