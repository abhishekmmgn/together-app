import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function PUT(request: NextRequest) {
	try {
		const { password, _id } = await request.json();

		let userId = _id;
		if (!userId) userId = getDataFromToken(request);

		let user;

		// check if user already exists
		if (userId) {
			const [found] = await db.select().from(users).where(eq(users.id, userId));
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
