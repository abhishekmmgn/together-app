import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, posts, friends, postLikes, comments } from "@/lib/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";
import type { BasicPostInterface } from "@/types";

type Params = {
	params: Promise<{ username: string }>;
};

export async function GET(request: NextRequest, props: Params) {
	const params = await props.params;
	try {
		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				username: users.username,
				profilePhoto: users.profilePhoto,
				bio: users.bio,
			})
			.from(users)
			.where(eq(users.username, params.username));

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const curUserId = await getDataFromToken(request);

		// check if they're friends
		const [friendship] = await db
			.select()
			.from(friends)
			.where(and(eq(friends.userId, curUserId), eq(friends.friendId, user.id)));
		const isFriend = !!friendship;

		// get user's posts with counts
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
			.where(eq(posts.creatorId, user.id));

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
			username: user.username,
			profilePhoto: user.profilePhoto,
			bio: user.bio,
			isFriend,
			isOwnProfile: curUserId === user.id,
			posts: formattedPosts,
		};

		return NextResponse.json(
			{
				message: "User found",
				data: data,
			},
			{
				status: 200,
			},
		);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function PUT(request: NextRequest, props: Params) {
	const params = await props.params;
	try {
		const { _id, action } = await request.json();
		const curUserId = await getDataFromToken(request);

		if (action === "remove") {
			// Remove both directions of the friendship
			await db
				.delete(friends)
				.where(and(eq(friends.userId, _id), eq(friends.friendId, curUserId)));
			await db
				.delete(friends)
				.where(and(eq(friends.userId, curUserId), eq(friends.friendId, _id)));

			return NextResponse.json({
				message: "Friend removed successfully.",
				success: true,
			});
		}

		if (action === "add") {
			// Add both directions of the friendship
			await db.insert(friends).values([
				{ userId: _id, friendId: curUserId },
				{ userId: curUserId, friendId: _id },
			]);

			return NextResponse.json({
				message: "Friend added successfully.",
				success: true,
			});
		}
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
