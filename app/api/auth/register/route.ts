import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
	try {
		const { name, email, password } = await request.json();

		// check if user already exists
		const [existingUser] = await db
			.select()
			.from(users)
			.where(eq(users.email, email));

		// check if user is verified
		if (existingUser && existingUser.isVerified) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 400 },
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		// user exists but not verified, update password and resend email
		if (existingUser) {
			await db
				.update(users)
				.set({ password: hashedPassword })
				.where(eq(users.id, existingUser.id));

			// send verification email
			await sendEmail(email, "VERIFY", existingUser.id);

			return NextResponse.json({
				message: "User updated successfully",
				success: true,
				savedUser: existingUser,
			});
		}

		// otherwise create new user
		const [savedUser] = await db
			.insert(users)
			.values({
				name,
				email,
				password: hashedPassword,
			})
			.returning();

		// send verification email
		await sendEmail(email, "VERIFY", savedUser.id);

		return NextResponse.json({
			message: "User created successfully",
			success: true,
			savedUser,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
