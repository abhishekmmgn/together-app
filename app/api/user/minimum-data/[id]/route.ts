import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Users from "@/models/users";

type Params = {
	params: { id: string };
};

export async function GET(request: NextRequest, { params }: Params) {
	try {
		await connectDB();

		const id = params.id;
		console.log(id);

		const user = await Users.findOne({ _id: id }).select("name profilePhoto");
		console.log(user);

		return NextResponse.json({
			message: "User found",
			data: user,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
