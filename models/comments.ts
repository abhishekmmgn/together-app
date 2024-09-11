import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
		},
		creator: {
			type: String,
			required: true,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "posts",
			required: true,
		},
	},
	{ timestamps: true },
);

const Comments =
	mongoose.models.comments || mongoose.model("comments", commentSchema);

export default Comments;
