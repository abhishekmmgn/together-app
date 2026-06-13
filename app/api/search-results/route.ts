import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, posts } from "@/lib/db/schema";
import { eq, ilike, or, sql } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
	try {
		const curUserId = await getDataFromToken(request);

		const url = new URL(request.url);
		const searchQuery = url.searchParams.get("query") || "";
		const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
		const type = url.searchParams.get("type") || "posts";
		const offset = (page - 1) * PAGE_SIZE;

		if (type === "users") {
			const userResults = await db
				.select({
					id: users.id,
					name: users.name,
					username: users.username,
					bio: users.bio,
					profilePhoto: users.profilePhoto,
				})
				.from(users)
				.where(
					or(
						ilike(users.name, `%${searchQuery}%`),
						ilike(users.email, `%${searchQuery}%`),
						ilike(users.bio, `%${searchQuery}%`),
					),
				)
				.offset(offset)
				.limit(PAGE_SIZE + 1);

			const hasMore = userResults.length > PAGE_SIZE;
			const formattedUsers = userResults.slice(0, PAGE_SIZE).map((u) => ({
				_id: u.id,
				name: u.name,
				username: u.username,
				bio: u.bio,
				profilePhoto: u.profilePhoto,
			}));

			return NextResponse.json({
				data: { users: formattedUsers, hasMore },
			});
		}

		// type === "posts"
		const postResults = await db
			.select({
				id: posts.id,
				thread: posts.thread,
				image: posts.image,
				createdAt: posts.createdAt,
				creatorId: posts.creatorId,
				creatorName: users.name,
				creatorUsername: users.username,
				creatorPhoto: users.profilePhoto,
				likesCount: sql<number>`(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = ${posts.id})::int`,
				commentsCount: sql<number>`(SELECT COUNT(*) FROM comments WHERE comments.post_id = ${posts.id})::int`,
				liked: curUserId
					? sql<boolean>`EXISTS(SELECT 1 FROM post_likes WHERE post_likes.post_id = ${posts.id} AND post_likes.user_id = ${curUserId})`
					: sql<boolean>`false`,
			})
			.from(posts)
			.leftJoin(users, eq(posts.creatorId, users.id))
			.where(
				or(
					ilike(posts.thread, `%${searchQuery}%`),
					sql`EXISTS (SELECT 1 FROM unnest(${posts.tags}) AS tag WHERE tag ILIKE ${"%" + searchQuery + "%"})`,
				),
			)
			.offset(offset)
			.limit(PAGE_SIZE + 1);

		const hasMore = postResults.length > PAGE_SIZE;
		const formattedPosts = postResults.slice(0, PAGE_SIZE).map((row) => ({
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
				username: row.creatorUsername || "",
				profilePhoto: row.creatorPhoto || "",
			},
		}));

		return NextResponse.json({
			data: { posts: formattedPosts, hasMore },
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
