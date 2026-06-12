import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, posts, postLikes, comments } from "@/lib/db/schema";
import { eq, ilike, or, sql } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function GET(request: NextRequest) {
	try {
		const curUserId = await getDataFromToken(request);

		const url = new URL(request.url);
		const searchQuery = url.searchParams.get("query") || "";

		const userResults = await db
			.select({
				id: users.id,
				name: users.name,
				bio: users.bio,
				profilePhoto: users.profilePhoto,
			})
			.from(users)
			.where(
				or(
					ilike(users.name, `%${searchQuery}%`),
					ilike(users.email, `%${searchQuery}%`),
				),
			)
			.limit(10);

		const formattedUsers = userResults.map((u) => ({
			_id: u.id,
			name: u.name,
			bio: u.bio,
			profilePhoto: u.profilePhoto,
		}));

		// search posts by tags using array overlap
		const postResults = await db
			.select({
				id: posts.id,
				thread: posts.thread,
				image: posts.image,
				creatorId: posts.creatorId,
				createdAt: posts.createdAt,
				likesCount: sql<number>`(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = ${posts.id})::int`,
				commentsCount: sql<number>`(SELECT COUNT(*) FROM comments WHERE comments.post_id = ${posts.id})::int`,
				liked: sql<boolean>`EXISTS(SELECT 1 FROM post_likes WHERE post_likes.post_id = ${posts.id} AND post_likes.user_id = ${curUserId || "00000000-0000-0000-0000-000000000000"})`,
			})
			.from(posts)
			.where(
				sql`EXISTS (SELECT 1 FROM unnest(${posts.tags}) AS tag WHERE tag ILIKE ${"%" + searchQuery + "%"})`,
			)
			.limit(4);

		const updatedPost = await Promise.all(
			postResults.map(async (post) => {
				const [creator] = await db
					.select({
						id: users.id,
						name: users.name,
						profilePhoto: users.profilePhoto,
					})
					.from(users)
					.where(eq(users.id, post.creatorId));
				return {
					_id: post.id,
					thread: post.thread,
					image: post.image?.[0] || "",
					likes: post.likesCount,
					commentsLength: post.commentsCount,
					createdAt: post.createdAt?.toISOString() || "",
					liked: post.liked,
					creator: {
						_id: creator?.id,
						name: creator?.name,
						profilePhoto: creator?.profilePhoto,
					},
				};
			}),
		);

		return NextResponse.json({
			message: "Search results",
			data: {
				users: formattedUsers,
				posts: updatedPost,
			},
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
