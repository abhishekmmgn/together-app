import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type Params = {
	params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, props: Params) {
	const params = await props.params;
	try {
		const id = params.id;
		console.log(id);

		const [user] = await db
			.select({
				id: users.id,
				name: users.name,
				profilePhoto: users.profilePhoto,
			})
			.from(users)
			.where(eq(users.id, id));

		console.log(user);

		return NextResponse.json({
			message: "User found",
			data: user
				? { _id: user.id, name: user.name, profilePhoto: user.profilePhoto }
				: null,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
