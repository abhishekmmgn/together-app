import { db } from "./lib/db";
import { sql } from "drizzle-orm";

async function main() {
	try {
		await db.execute(sql`ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");`);
		console.log("Applied unique constraint");
		process.exit(0);
	} catch (e) {
		console.error(e);
		process.exit(1);
	}
}
main();
