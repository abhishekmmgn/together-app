import Post from "@/components/post/post";
import Comments from "@/components/post/comments";
import ErrorInfo from "@/components/error-info";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { users, posts, comments, postLikes } from "@/lib/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { getUserIdFromCookies } from "@/lib/getDataFromToken";
import type { PostType, CommentsType } from "@/types";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function Page(props: Props) {
	const { id } = await props.params;

	const [post] = await db
		.select({
			id: posts.id,
			thread: posts.thread,
			image: posts.image,
			creatorId: posts.creatorId,
			createdAt: posts.createdAt,
			likesCount:
				sql<number>`(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = ${posts.id})::int`,
			commentsCount:
				sql<number>`(SELECT COUNT(*) FROM comments WHERE comments.post_id = ${posts.id})::int`,
		})
		.from(posts)
		.where(eq(posts.id, id));

	if (!post) notFound();

	const currentUserId =
		(await getUserIdFromCookies()) ??
		"00000000-0000-0000-0000-000000000000";

	const [[likedStatus], [creator], postComments] = await Promise.all([
		db
			.select()
			.from(postLikes)
			.where(
				and(eq(postLikes.postId, post.id), eq(postLikes.userId, currentUserId)),
			),
		db
			.select({
				id: users.id,
				name: users.name,
				username: users.username,
				profilePhoto: users.profilePhoto,
			})
			.from(users)
			.where(eq(users.id, post.creatorId)),
		db
			.select({
				id: comments.id,
				text: comments.text,
				createdAt: comments.createdAt,
				creatorId: comments.creatorId,
				creatorName: users.name,
				creatorUsername: users.username,
				creatorPhoto: users.profilePhoto,
			})
			.from(comments)
			.leftJoin(users, eq(comments.creatorId, users.id))
			.where(eq(comments.postId, post.id)),
	]);

	const formattedComments: CommentsType[] = postComments.map((c) => ({
		_id: c.id,
		message: c.text,
		createdAt: c.createdAt ?? new Date(),
		createdBy: {
			_id: c.creatorId,
			name: c.creatorName ?? "",
			username: c.creatorUsername ?? "",
			profilePhoto: c.creatorPhoto ?? "",
		},
	}));

	const postData: PostType = {
		_id: post.id,
		thread: post.thread,
		image: post.image?.[0] || "",
		likes: post.likesCount,
		commentsLength: post.commentsCount,
		createdAt: post.createdAt?.toISOString() ?? "",
		liked: !!likedStatus,
		creator: {
			_id: creator?.id ?? "",
			name: creator?.name ?? "",
			username: creator?.username ?? "",
			profilePhoto: creator?.profilePhoto ?? "",
		},
	};

	return (
		<>
			<Post post={postData} hideDropdown={true} />
			<div className="p-5 lg:px-0">
				<Comments
					postId={id}
					comments={formattedComments}
					currentUserId={
						currentUserId === "00000000-0000-0000-0000-000000000000"
							? undefined
							: currentUserId
					}
				/>
			</div>
		</>
	);
}
