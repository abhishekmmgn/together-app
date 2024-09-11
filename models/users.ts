import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			maxlength: 20,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		profilePhoto: {
			type: String,
			default: "",
		},
		bio: {
			type: String,
			default: "",
		},
		friends: {
			type: Array,
			default: [],
		},
		posts: {
			type: Array,
			default: [],
		},
		notifications: {
			type: Array,
			default: [],
		},
		conversations: {
			type: Array,
			default: [],
		},
		forgotPasswordToken: String,
		forgotPasswordTokenExpiry: Date,
		verifyToken: String,
		verifyTokenExpiry: Date,
	},
	{ timestamps: true },
);

const Users = mongoose.models.users || mongoose.model("users", userSchema);

export default Users;
