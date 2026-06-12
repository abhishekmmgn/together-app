import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
	try {
		const curUserId = await getDataFromToken(request);
		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				profilePhoto: users.profilePhoto,
				bio: users.bio,
			})
			.from(users)
			.where(eq(users.id, curUserId));

		const data = {
			_id: user.id,
			name: user.name,
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
		const { profilePhoto, bio } = await request.json();

		const [user] = await db.select().from(users).where(eq(users.id, userId));

		if (!user) {
			return NextResponse.json(
				{ error: "User doesn't exist." },
				{ status: 400 },
			);
		}

		const result = await db
			.update(users)
			.set({ profilePhoto, bio })
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
