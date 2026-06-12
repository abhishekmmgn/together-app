import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, posts, postLikes, comments } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";
import type { BasicPostInterface } from "@/types";

export async function GET(request: NextRequest) {
	try {
		const curUserId = await getDataFromToken(request);
		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				profilePhoto: users.profilePhoto,
			})
			.from(users)
			.where(eq(users.id, curUserId));

		const userPosts = await db
			.select({
				id: posts.id,
				thread: posts.thread,
				image: posts.image,
				createdAt: posts.createdAt,
				likesCount: sql<number>`(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = ${posts.id})::int`,
				commentsCount: sql<number>`(SELECT COUNT(*) FROM comments WHERE comments.post_id = ${posts.id})::int`,
				liked: sql<boolean>`EXISTS(SELECT 1 FROM post_likes WHERE post_likes.post_id = ${posts.id} AND post_likes.user_id = ${curUserId || "00000000-0000-0000-0000-000000000000"})`,
			})
			.from(posts)
			.where(eq(posts.creatorId, curUserId));

		// format posts
		const formattedPosts: BasicPostInterface[] = userPosts.map((post) => ({
			_id: post.id,
			thread: post.thread,
			image: post.image?.[0] || "",
			liked: post.liked,
			likes: post.likesCount,
			commentsLength: post.commentsCount,
			createdAt: post.createdAt?.toISOString() || "",
		}));

		const data = {
			_id: user.id,
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
