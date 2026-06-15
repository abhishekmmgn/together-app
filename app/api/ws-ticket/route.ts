import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getUserIdFromCookies } from "@/lib/getDataFromToken";

export async function POST() {
	const userId = await getUserIdFromCookies();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const secret = process.env.TOKEN_SECRET;
	if (!secret) {
		return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
	}

	const token = await new SignJWT({ id: userId, purpose: "ws" })
		.setProtectedHeader({ alg: "HS256" })
		.setExpirationTime("5m")
		.sign(new TextEncoder().encode(secret));

	return NextResponse.json({ token });
}
