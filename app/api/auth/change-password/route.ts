import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function PUT(request: NextRequest) {
	try {
		const { password, _id } = await request.json();

		let user;

		// check if user already exists
		if (_id) {
			const [found] = await db.select().from(users).where(eq(users.id, _id));
			user = found;
		}

		if (!user) {
			return NextResponse.json(
				{ error: "User doesn't exists" },
				{ status: 400 },
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		await db
			.update(users)
			.set({ password: hashedPassword })
			.where(eq(users.id, user.id));

		return NextResponse.json({
			message: "Password updated successfully",
			success: true,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
