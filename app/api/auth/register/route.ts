import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mailer";

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const { name, email, password } = await request.json();

		//check if user already exists
		const user = await User.findOne({ email });

		// check if user is verified
		if (user && user.isVerified) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 400 },
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		// user exists, change the password and send email
		if (user) {
			user.password = hashedPassword;
			await user.save();

			// send verification email
			await sendEmail(email, "VERIFY", user._id);

			return NextResponse.json({
				message: "User updated successfully",
				success: true,
				savedUser: user,
			});
		}

		// otherwise create new user
		const newUser = new User({
			name,
			email,
			password: hashedPassword,
		});

		const savedUser = await newUser.save();

		// send verification email
		await sendEmail(email, "VERIFY", savedUser._id);

		return NextResponse.json({
			message: "User created successfully",
			success: true,
			savedUser,
		});
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
