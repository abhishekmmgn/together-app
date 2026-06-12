import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json();

		// check if user exists
		const [user] = await db.select().from(users).where(eq(users.email, email));

		if (!user) {
			return NextResponse.json(
				{ error: "Account does not exist" },
				{ status: 404 },
			);
		}

		// check if password is correct
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return NextResponse.json({ error: "Password is wrong" }, { status: 400 });
		}

		// create token data
		const tokenData = {
			id: user.id,
			email: user.email,
		};

		// create token
		const tokenSecret = process.env.TOKEN_SECRET || "";
		const token = jwt.sign(tokenData, tokenSecret, {
			expiresIn: "30d",
		});

		console.log(token);

		(await cookies()).set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 24,
		});

		console.log("Cookies after setting token:", await cookies());

		return NextResponse.json({
			message: "Login successful",
			success: true,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error?.message }, { status: 500 });
	}
}
