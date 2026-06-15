import Link from "next/link";
import { eq, sql } from "drizzle-orm";

import { buttonVariants } from "@/components/ui/button";
import Post from "@/components/post/post";
import { ShortErrorInfo } from "@/components/error-info";
import { db } from "@/lib/db";
import { users, posts } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import type { PostType } from "@/types";

export default async function UserPosts({ userId }: { userId: string }) {
	try {
		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				username: users.username,
				profilePhoto: users.profilePhoto,
			})
			.from(users)
			.where(eq(users.id, userId));

		const userPosts = await db
			.select({
				id: posts.id,
				thread: posts.thread,
				image: posts.image,
				createdAt: posts.createdAt,
				likesCount: sql<number>`(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = ${posts.id})::int`,
				commentsCount: sql<number>`(SELECT COUNT(*) FROM comments WHERE comments.post_id = ${posts.id})::int`,
				liked: sql<boolean>`EXISTS(SELECT 1 FROM post_likes WHERE post_likes.post_id = ${posts.id} AND post_likes.user_id = ${userId})`,
			})
			.from(posts)
			.where(eq(posts.creatorId, userId));

		const formattedPosts: PostType[] = userPosts.map((post) => ({
			_id: post.id,
			thread: post.thread,
			image: post.image?.[0] || "",
			liked: post.liked,
			likes: post.likesCount,
			commentsLength: post.commentsCount,
			createdAt: post.createdAt?.toISOString() || "",
			creator: {
				_id: user.id,
				name: user.name,
				username: user.username || "",
				profilePhoto: user.profilePhoto || "",
			},
		}));

		if (!formattedPosts.length) {
			return (
				<div className="py-10">
					<h3 className="text-center font-medium text-xl">
						You don&apos;t have any posts yet.
					</h3>
					<Link href="/" className={cn(buttonVariants({ variant: "link" }))}>
						New Post
					</Link>
				</div>
			);
		}

		return (
			<>
				{formattedPosts.map((post) => (
					<Post key={post._id} post={post} paddingX={true} canDelete={true} />
				))}
			</>
		);
	} catch {
		return <ShortErrorInfo />;
	}
}
