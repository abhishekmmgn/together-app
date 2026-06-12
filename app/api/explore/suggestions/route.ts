import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { ne, desc } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function GET(request: NextRequest) {
	try {
		const curUserId = await getDataFromToken(request);

		const allUsers = await db
			.select({
				id: users.id,
				name: users.name,
				username: users.username,
				profilePhoto: users.profilePhoto,
				bio: users.bio,
			})
			.from(users)
			.where(curUserId ? ne(users.id, curUserId) : undefined)
			.orderBy(desc(users.createdAt))
			.limit(20);

		const updatedUsers = allUsers.map((u) => ({
			_id: u.id,
			name: u.name,
			username: u.username,
			profilePhoto: u.profilePhoto,
			bio: u.bio,
		}));

		return NextResponse.json({
			message: "Users found",
			data: updatedUsers,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 400 });
	}
}
