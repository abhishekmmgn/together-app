import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import bcrypt from "bcryptjs";

export async function PUT(request: NextRequest) {
	try {
		await connectDB();

		const { password, _id } = await request.json();

		let user;

		//check if user already exists
		if (_id) {
			user = await User.findOne({ _id });
		}

		if (!user) {
			return NextResponse.json(
				{ error: "User doesn't exists" },
				{ status: 400 },
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		user.password = hashedPassword;
		await user.save();

		return NextResponse.json({
			message: "Password updated successfully",
			success: true,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
