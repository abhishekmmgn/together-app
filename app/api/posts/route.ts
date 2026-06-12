import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { posts, users, postLikes, comments } from "@/lib/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";
import type { PostType } from "@/types";

export async function GET(request: NextRequest) {
	try {
		const curUserId = await getDataFromToken(request);

		console.log(curUserId);

		// Get the page number from the query parameters
		const page = Number(request.nextUrl.searchParams.get("page")) || 1;
		const postsLimit = 3;
		const skipPosts = (page - 1) * postsLimit;

		const result = await db
			.select({
				id: posts.id,
				thread: posts.thread,
				image: posts.image,
				createdAt: posts.createdAt,
				creatorId: posts.creatorId,
				creatorName: users.name,
				creatorPhoto: users.profilePhoto,
				likesCount: sql<number>`(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = ${posts.id})::int`,
				commentsCount: sql<number>`(SELECT COUNT(*) FROM comments WHERE comments.post_id = ${posts.id})::int`,
				liked: sql<boolean>`EXISTS(SELECT 1 FROM post_likes WHERE post_likes.post_id = ${posts.id} AND post_likes.user_id = ${curUserId || "00000000-0000-0000-0000-000000000000"})`,
			})
			.from(posts)
			.leftJoin(users, eq(posts.creatorId, users.id))
			.orderBy(desc(posts.createdAt))
			.offset(skipPosts)
			.limit(postsLimit);

		const postsData: PostType[] = result.map((row) => ({
			_id: row.id,
			thread: row.thread,
			image: row.image?.[0] || "",
			likes: row.likesCount,
			commentsLength: row.commentsCount,
			createdAt: row.createdAt?.toISOString() || "",
			liked: row.liked,
			creator: {
				_id: row.creatorId,
				name: row.creatorName || "",
				profilePhoto: row.creatorPhoto || "",
			},
		}));

		return NextResponse.json({
			message: "Posts found",
			data: postsData,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
