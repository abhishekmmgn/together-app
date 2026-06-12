import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
	try {
		const { email } = await request.json();

		// check if user already exists
		const [user] = await db.select().from(users).where(eq(users.email, email));

		console.log(user);

		if (!user) {
			return NextResponse.json(
				{ error: "User doesn't exist." },
				{ status: 400 },
			);
		}

		// send verification email
		await sendEmail(email, "RESET", user.id);

		return NextResponse.json({
			message: "Email send successfully",
			success: true,
			user,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
