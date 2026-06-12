import { db } from "./lib/db";
import { users } from "./lib/db/schema";
import { isNull, eq } from "drizzle-orm";

async function main() {
	try {
		console.log("Fetching users with no username...");
		const usersWithoutUsername = await db
			.select()
			.from(users)
			.where(isNull(users.username));

		console.log(`Found ${usersWithoutUsername.length} users to update.`);

		for (const user of usersWithoutUsername) {
			const baseUsername = user.name.toLowerCase().replace(/[^a-z0-9]/g, "");
			const randomSuffix = Math.floor(Math.random() * 10000);
			const newUsername = `${baseUsername}${randomSuffix}`;

			await db
				.update(users)
				.set({ username: newUsername })
				.where(eq(users.id, user.id));

			console.log(`Updated user ${user.id} with username ${newUsername}`);
		}

		console.log("Data migration complete.");
		process.exit(0);
	} catch (error) {
		console.error("Migration failed:", error);
		process.exit(1);
	}
}

main();
