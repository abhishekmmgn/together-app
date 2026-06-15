import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import type { PostType } from "@/types";

export const POSTS_PER_PAGE = 5;

/** Fetch a page of the feed directly from the DB (shared by the API route and RSC pages). */
export async function getPosts(
	page: number,
	curUserId: string | null,
): Promise<PostType[]> {
	const skipPosts = (page - 1) * POSTS_PER_PAGE;

	const result = await db
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
				? sql<boolean>`EXISTS(SELECT 1 FROM post_likes WHERE post_likes.post_id = ${posts.id} AND post_likes.user_id = ${curUserId}::uuid)`
				: sql<boolean>`false`,
		})
		.from(posts)
		.leftJoin(users, eq(posts.creatorId, users.id))
		.orderBy(desc(posts.createdAt))
		.offset(skipPosts)
		.limit(POSTS_PER_PAGE);

	return result.map((row) => ({
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
}
