import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, friends } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";
import type { PersonProfileType } from "@/types";

export async function GET(request: NextRequest) {
	try {
		const _id = await getDataFromToken(request);

		// get friend IDs from the friends junction table
		const friendships = await db
			.select({ friendId: friends.friendId })
			.from(friends)
			.where(eq(friends.userId, _id));

		const friendIds = friendships.map((f) => f.friendId);

		if (friendIds.length === 0) {
			return NextResponse.json({
				message: "Friends found",
				data: [],
			});
		}

		// get friend details
		const friendsData: PersonProfileType[] = await Promise.all(
			friendIds.map(async (friendId) => {
				const [friend] = await db
					.select({
						id: users.id,
						name: users.name,
						bio: users.bio,
						profilePhoto: users.profilePhoto,
					})
					.from(users)
					.where(eq(users.id, friendId));
				return {
					_id: friend.id,
					name: friend.name,
					bio: friend.bio || "",
					profilePhoto: friend.profilePhoto || "",
				};
			}),
		);

		return NextResponse.json({
			message: "Friends found",
			data: friendsData,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
