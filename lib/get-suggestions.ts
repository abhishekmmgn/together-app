import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { ne, desc } from "drizzle-orm";
import type { PersonProfileType } from "@/types";

/** People suggestions for explore (shared by the API route and RSC pages). */
export async function getSuggestions(
	curUserId: string | null,
): Promise<PersonProfileType[]> {
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

	return allUsers.map((u) => ({
		_id: u.id,
		name: u.name,
		username: u.username || "",
		profilePhoto: u.profilePhoto || "",
		bio: u.bio || "",
	}));
}
