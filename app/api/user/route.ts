import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { getDataFromToken } from "@/lib/getDataFromToken";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

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
			const [existing] = await db.select().from(users).where(eq(users.username, username));
			if (existing) {
				return NextResponse.json({ error: "Username is already taken." }, { status: 400 });
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
		const _id = await getDataFromToken(request);

		const [user] = await db.select().from(users).where(eq(users.id, _id));

		if (!user) {
			return NextResponse.json({ error: "Invalid id" }, { status: 400 });
		}

		// delete all posts by the user (cascade will handle post_likes, comments)
		await db.delete(posts).where(eq(posts.creatorId, _id));

		// delete user (cascade will handle friends, notifications, etc.)
		await db.delete(users).where(eq(users.id, _id));

		// remove token
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
