import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, eq, gt } from "drizzle-orm";

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const { token } = reqBody;

		console.log(token);

		const [user] = await db
			.select()
			.from(users)
			.where(
				and(
					eq(users.forgotPasswordToken, token),
					gt(users.forgotPasswordTokenExpiry, new Date()),
				),
			);

		console.log("User:", user);

		if (!user) {
			return NextResponse.json({ error: "Invalid token" }, { status: 400 });
		}

		await db
			.update(users)
			.set({
				forgotPasswordToken: null,
				forgotPasswordTokenExpiry: null,
			})
			.where(eq(users.id, user.id));

		return NextResponse.json({
			message: "Verification successful",
			success: true,
			userId: user.id,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
