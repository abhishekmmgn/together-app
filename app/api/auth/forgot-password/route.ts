import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		const [user] = await db.select().from(users).where(eq(users.email, email));

		if (!user) {
			return NextResponse.json(
				{ error: "User doesn't exist." },
				{ status: 400 },
			);
		}

		const hashedToken = await bcryptjs.hash(user.id.toString(), 10);
		await db
			.update(users)
			.set({
				forgotPasswordToken: hashedToken,
				forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
			})
			.where(eq(users.id, user.id));

		const domain = process.env.NEXT_PUBLIC_DOMAIN || "localhost:3000";
		const protocol = domain.startsWith("localhost") ? "http" : "https";
		const resetLink = `${protocol}://${domain}/auth/reset-password?token=${hashedToken}`;
		console.log(`[Forgot Password] Reset link for ${email}: ${resetLink}`);

		return NextResponse.json({
			message: "Password reset link generated successfully.",
			success: true,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
