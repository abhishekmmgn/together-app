import { type NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
	try {
		const { name, email, password } = await request.json();

		const [existingUser] = await db
			.select()
			.from(users)
			.where(eq(users.email, email));

		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 400 },
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, "");
		let uniqueUsername = baseUsername;
		let isUnique = false;
		while (!isUnique) {
			const [existing] = await db
				.select()
				.from(users)
				.where(eq(users.username, uniqueUsername));
			if (!existing) {
				isUnique = true;
			} else {
				uniqueUsername = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
			}
		}

		const [savedUser] = await db
			.insert(users)
			.values({
				name,
				username: uniqueUsername,
				email,
				password: hashedPassword,
				isVerified: true,
			})
			.returning();

		return NextResponse.json({
			message: "Account created successfully.",
			success: true,
		});
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Internal server error";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
