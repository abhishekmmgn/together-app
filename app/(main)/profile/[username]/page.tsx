import ExternalProfile from "./profile-page-client";
import { notFound, redirect } from "next/navigation";
import { getUserIdFromCookies } from "@/lib/getDataFromToken";
import { db } from "@/lib/db";
import { users, posts, friends } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import type { PostType } from "@/types";

export default async function Page(props: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await props.params;

	const [user] = await db
		.select({
			id: users.id,
			name: users.name,
			username: users.username,
			profilePhoto: users.profilePhoto,
			bio: users.bio,
		})
		.from(users)
		.where(eq(users.username, username));

	if (!user) notFound();

	const currentUserId = await getUserIdFromCookies();

	if (currentUserId === user.id) redirect("/profile");

	const [[friendship], userPosts] = await Promise.all([
		db
			.select()
			.from(friends)
			.where(
				and(
					eq(friends.userId, currentUserId ?? ""),
					eq(friends.friendId, user.id),
				),
			),
		db
			.select({
				id: posts.id,
				thread: posts.thread,
				image: posts.image,
				createdAt: posts.createdAt,
				likesCount:
					sql<number>`(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = ${posts.id})::int`,
				commentsCount:
					sql<number>`(SELECT COUNT(*) FROM comments WHERE comments.post_id = ${posts.id})::int`,
				liked: sql<boolean>`EXISTS(SELECT 1 FROM post_likes WHERE post_likes.post_id = ${posts.id} AND post_likes.user_id = ${currentUserId ?? "00000000-0000-0000-0000-000000000000"})`,
			})
			.from(posts)
			.where(eq(posts.creatorId, user.id)),
	]);

	const formattedPosts: PostType[] = userPosts.map((post) => ({
		_id: post.id,
		thread: post.thread,
		image: post.image?.[0] || "",
		liked: post.liked,
		likes: post.likesCount,
		commentsLength: post.commentsCount,
		createdAt: post.createdAt?.toISOString() ?? "",
		creator: {
			_id: user.id,
			name: user.name,
			username: user.username ?? "",
			profilePhoto: user.profilePhoto ?? "",
		},
	}));

	return (
		<ExternalProfile
			data={{
				_id: user.id,
				name: user.name,
				username: user.username ?? "",
				profilePhoto: user.profilePhoto ?? "",
				bio: user.bio ?? "",
				isFriend: !!friendship,
				posts: formattedPosts,
			}}
		/>
	);
}
