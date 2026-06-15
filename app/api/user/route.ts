import { db } from "@/lib/db";
import {
	conversationMembers,
	conversations,
	posts,
	users,
} from "@/lib/db/schema";
import { getDataFromToken } from "@/lib/getDataFromToken";
import { eq, inArray } from "drizzle-orm";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

export async function GET(request: NextRequest) {
	try {
		const curUserId = await getDataFromToken(request);
		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				username: users.username,
				email: users.email,
				profilePhoto: users.profilePhoto,
				bio: users.bio,
			})
			.from(users)
			.where(eq(users.id, curUserId));

		const data = {
			_id: user.id,
			name: user.name,
			username: user.username,
			email: user.email,
			profilePhoto: user.profilePhoto,
			bio: user.bio,
		};

		return NextResponse.json({
			message: "Data found",
			data,
		});
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const userId = await getDataFromToken(request);
		const { name, username, profilePhoto, bio } = await request.json();

		const [user] = await db.select().from(users).where(eq(users.id, userId));

		if (!user) {
			return NextResponse.json(
				{ error: "User doesn't exist." },
				{ status: 400 },
			);
		}

		if (username && username !== user.username) {
			// check if username is taken
			const [existing] = await db
				.select()
				.from(users)
				.where(eq(users.username, username));
			if (existing) {
				return NextResponse.json(
					{ error: "Username is already taken." },
					{ status: 400 },
				);
			}
		}

		const result = await db
			.update(users)
			.set({ name, username, profilePhoto, bio })
			.where(eq(users.id, userId))
			.returning();

		if (result.length > 0) {
			console.log("Document updated successfully.");
			return NextResponse.json({
				message: "Profile updated successfully.",
				success: true,
			});
		} else {
			console.log("No document was updated.");
			return NextResponse.json({
				message: "Something went wrong.",
				success: false,
			});
		}
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const userId = await getDataFromToken(request);

		const [user] = await db.select().from(users).where(eq(users.id, userId));

		if (!user) {
			return NextResponse.json({ error: "Invalid id" }, { status: 400 });
		}

		// ── 1. Collect all S3 keys to delete ──────────────────────────────
		const s3Keys: string[] = [];

		const userPosts = await db
			.select({ image: posts.image })
			.from(posts)
			.where(eq(posts.creatorId, userId));

		for (const post of userPosts) {
			for (const url of post.image ?? []) {
				const key = s3KeyFromUrl(url);
				if (key) s3Keys.push(key);
			}
		}

		if (user.profilePhoto) {
			const key = s3KeyFromUrl(user.profilePhoto);
			if (key) s3Keys.push(key);
		}

		// ── 2. Bulk-delete S3 objects ─────────────────────────────────────
		const bucketName = process.env.S3_BUCKET_NAME;
		if (bucketName && s3Keys.length > 0) {
			const batches = toBatches(s3Keys, 1000);
			for (const batch of batches) {
				try {
					await s3.send(
						new DeleteObjectsCommand({
							Bucket: bucketName,
							Delete: {
								Objects: batch.map((key) => ({ Key: key })),
								Quiet: true,
							},
						}),
					);
				} catch (err) {
					console.error("[DELETE /api/user] S3 cleanup failed:", err);
				}
			}
		}

		// ── 3. Delete conversations the user is part of ──────────────────
		const memberships = await db
			.select({ conversationId: conversationMembers.conversationId })
			.from(conversationMembers)
			.where(eq(conversationMembers.userId, userId));

		const conversationIds = memberships.map((m) => m.conversationId);

		if (conversationIds.length > 0) {
			await db
				.delete(conversations)
				.where(inArray(conversations.id, conversationIds));
		}

		// ── 4. Delete all user's posts (cascade → post_likes, comments) ──
		await db.delete(posts).where(eq(posts.creatorId, userId));

		// ── 5. Delete user (cascade → friends, likes, comments, notifications, ws_connections) ──
		await db.delete(users).where(eq(users.id, userId));

		// ── 6. Clear auth cookie ─────────────────────────────────────────
		(await cookies()).set("token", "", {
			httpOnly: true,
			expires: new Date(0),
		});

		return NextResponse.json({
			message: "User deleted successfully",
			success: true,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extract the S3 object key from a full public URL. */
function s3KeyFromUrl(url: string): string | null {
	try {
		const { pathname } = new URL(url);
		return pathname.startsWith("/") ? pathname.slice(1) : pathname;
	} catch {
		return null;
	}
}

/** Split an array into chunks of `size`. */
function toBatches<T>(items: T[], size: number): T[][] {
	const result: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		result.push(items.slice(i, i + size));
	}
	return result;
}
