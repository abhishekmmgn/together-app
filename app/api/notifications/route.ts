import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, notifications, friends } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function GET(request: NextRequest) {
	try {
		const curUserId = await getDataFromToken(request);

		const [user] = await db.select().from(users).where(eq(users.id, curUserId));

		if (!user) {
			return NextResponse.json({ error: "User not found." }, { status: 404 });
		}

		const userNotifications = await db
			.select()
			.from(notifications)
			.where(eq(notifications.userId, curUserId));

		return NextResponse.json({
			message: "Notifications found",
			data: userNotifications.map((n) => ({
				_id: n.id,
				message: n.message,
				read: n.read,
				destination: n.destination,
				createdBy: n.createdBy,
				createdAt: n.createdAt,
			})),
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 501 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const { message, destination } = await request.json();

		const curUserId = await getDataFromToken(request);
		const [user] = await db.select().from(users).where(eq(users.id, curUserId));

		if (!user) {
			return NextResponse.json({ error: "User not found." }, { status: 404 });
		}

		// get friends from the junction table
		const friendships = await db
			.select({ friendId: friends.friendId })
			.from(friends)
			.where(eq(friends.userId, curUserId));

		// send notifications to all friends
		if (friendships.length > 0) {
			await db.insert(notifications).values(
				friendships.map((f) => ({
					userId: f.friendId,
					createdBy: curUserId,
					message,
					destination,
					read: false,
				})),
			);
		}

		return NextResponse.json({
			message: "Notification sent",
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 501 });
	}
}

export async function PUT(request: NextRequest) {
	try {
		const { allRead } = await request.json();

		const curUserId = await getDataFromToken(request);
		const [user] = await db.select().from(users).where(eq(users.id, curUserId));

		if (!user) {
			return NextResponse.json({ error: "User not found." }, { status: 404 });
		}

		// update notifications
		if (allRead) {
			await db
				.update(notifications)
				.set({ read: true })
				.where(eq(notifications.userId, curUserId));
		}

		return NextResponse.json({
			message: "Updated notifications",
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 501 });
	}
}
