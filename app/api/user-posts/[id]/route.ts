import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, posts, postLikes, comments } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

type Params = {
	params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, props: Params) {
	const params = await props.params;
	try {
		const userId = params.id;
		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				profilePhoto: users.profilePhoto,
			})
			.from(users)
			.where(eq(users.id, userId));

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const userPosts = await db
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
				liked: sql<boolean>`EXISTS(SELECT 1 FROM post_likes WHERE post_likes.post_id = ${posts.id} AND post_likes.user_id = ${userId})`,
			})
			.from(posts)
			.where(eq(posts.creatorId, userId));

		// format posts to match existing API shape
		const formattedPosts = userPosts.map((post) => ({
			...post,
			_id: post.id,
			likes: post.likesCount,
			commentsLength: post.commentsCount,
			image: post.image,
			creator: {
				_id: user.id,
				name: user.name,
				profilePhoto: user.profilePhoto,
			},
		}));

		return NextResponse.json({
			message: "Posts found",
			posts: formattedPosts,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
