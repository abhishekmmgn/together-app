import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const { verificationToken } = reqBody;

		const [user] = await db
			.select()
			.from(users)
			.where(
				and(
					eq(users.verifyToken, verificationToken),
					gt(users.verifyTokenExpiry, new Date()),
				),
			);

		if (!user) {
			return NextResponse.json({ error: "Invalid token" }, { status: 400 });
		}

		await db
			.update(users)
			.set({
				isVerified: true,
				verifyToken: null,
				verifyTokenExpiry: null,
			})
			.where(eq(users.id, user.id));

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

		(await cookies()).set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			path: "/",
			maxAge: 60 * 60 * 24,
		});

		return NextResponse.json({
			message: "Email verification successful",
			success: true,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
