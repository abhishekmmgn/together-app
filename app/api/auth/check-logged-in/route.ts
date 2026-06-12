import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getDataFromToken } from "@/lib/getDataFromToken";

export async function GET(request: NextRequest) {
	try {
		const _id = await getDataFromToken(request);
		
		if (!_id) {
			return NextResponse.json({ error: "User not logged in." }, { status: 401 });
		}

		const [user] = await db.select().from(users).where(eq(users.id, _id));

		if (!user) {
			return NextResponse.json({ error: "User not found." }, { status: 404 });
		}

		return NextResponse.json({
			message: "User found",
			data: user,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 501 });
	}
}
