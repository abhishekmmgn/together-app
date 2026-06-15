import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, posts, comments, postLikes } from "@/lib/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

function s3KeyFromUrl(url: string): string | null {
	try {
		const { pathname } = new URL(url);
		return pathname.startsWith("/") ? pathname.slice(1) : pathname;
	} catch {
		return null;
	}
}

type Props = {
	params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, props: Props) {
	const params = await props.params;
	try {
		const id = params.id;
		const [post] = await db
			.select({
				id: posts.id,
				thread: posts.thread,
				image: posts.image,
				creatorId: posts.creatorId,
				createdAt: posts.createdAt,
				likesCount: sql<number>`(SELECT COUNT(*) FROM post_likes WHERE post_likes.post_id = ${posts.id})::int`,
				commentsCount: sql<number>`(SELECT COUNT(*) FROM comments WHERE comments.post_id = ${posts.id})::int`,
			})
			.from(posts)
			.where(eq(posts.id, id));

		if (!post) {
			return NextResponse.json({ error: "Post not found." }, { status: 404 });
		}

		const curUserId = await getDataFromToken(request);
		const [likedStatus] = curUserId
			? await db
					.select()
					.from(postLikes)
					.where(
						and(eq(postLikes.postId, post.id), eq(postLikes.userId, curUserId)),
					)
			: [null];

		// find the creator details
		const [creator] = await db
			.select({
				id: users.id,
				name: users.name,
				username: users.username,
				profilePhoto: users.profilePhoto,
			})
			.from(users)
			.where(eq(users.id, post.creatorId));

		// find the comments
		const postComments = await db
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
			.where(eq(comments.postId, post.id));

		const formattedComments = postComments.map((comment) => ({
			_id: comment.id,
			message: comment.text,
			createdAt: comment.createdAt,
			createdBy: {
				_id: comment.creatorId,
				name: comment.creatorName,
				username: comment.creatorUsername,
				profilePhoto: comment.creatorPhoto,
			},
		}));

		const postData = {
			_id: post.id,
			thread: post.thread,
			image: post.image?.[0] || "",
			likes: post.likesCount,
			commentsLength: post.commentsCount,
			createdAt: post.createdAt,
			liked: !!likedStatus,
			creator: {
				_id: creator?.id,
				name: creator?.name,
				username: creator?.username,
				profilePhoto: creator?.profilePhoto,
			},
			comments: formattedComments,
		};

		return NextResponse.json({
			message: "Post found",
			data: postData,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 501 });
	}
}

export async function PUT(request: NextRequest, props: Props) {
	const params = await props.params;
	try {
		const { like, message } = await request.json();

		const curUserId = await getDataFromToken(request);
		const [user] = await db.select().from(users).where(eq(users.id, curUserId));
		if (!user) {
			return NextResponse.json({ error: "User not found." }, { status: 404 });
		}

		const postId = params.id;
		const [post] = await db.select().from(posts).where(eq(posts.id, postId));
		if (!post) {
			return NextResponse.json({ error: "Post not found." }, { status: 404 });
		}

		// update likes
		if (like) {
			const [existingLike] = await db
				.select()
				.from(postLikes)
				.where(
					and(eq(postLikes.postId, post.id), eq(postLikes.userId, curUserId)),
				);

			if (existingLike) {
				await db
					.delete(postLikes)
					.where(
						and(eq(postLikes.postId, post.id), eq(postLikes.userId, curUserId)),
					);
			} else {
				await db.insert(postLikes).values({
					postId: post.id,
					userId: curUserId,
				});
			}
		}

		// update comments
		if (message) {
			await db.insert(comments).values({
				postId: post.id,
				creatorId: curUserId,
				text: message,
			});
		}

		return NextResponse.json(
			{
				message: "Updated post",
			},
			{ status: 200 },
		);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 501 });
	}
}

export async function DELETE(request: NextRequest, props: Props) {
	try {
		const { postId } = await request.json();
		const userId = await getDataFromToken(request);

		const [user] = await db.select().from(users).where(eq(users.id, userId));
		const [post] = await db.select().from(posts).where(eq(posts.id, postId));

		if (!user || !post) {
			return NextResponse.json(
				{ error: "User or post does not exists" },
				{ status: 400 },
			);
		}

		// Delete media from S3 before removing the DB row
		const bucketName = process.env.S3_BUCKET_NAME;
		const mediaUrls = (post.image ?? []).filter(Boolean);
		if (bucketName && mediaUrls.length > 0) {
			const objects = mediaUrls
				.map((url) => s3KeyFromUrl(url))
				.filter((key): key is string => key !== null)
				.map((key) => ({ Key: key }));

			if (objects.length > 0) {
				try {
					await s3.send(
						new DeleteObjectsCommand({
							Bucket: bucketName,
							Delete: { Objects: objects, Quiet: true },
						}),
					);
				} catch (err) {
					// Non-fatal: log but don't block the delete
					console.error("[DELETE /api/post] S3 cleanup failed:", err);
				}
			}
		}

		// cascade will delete related likes and comments automatically
		await db.delete(posts).where(eq(posts.id, postId));

		return NextResponse.json(
			{ message: "Post deleted successfully." },
			{ status: 200 },
		);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
