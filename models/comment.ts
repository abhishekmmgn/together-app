import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'posts',
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.models.comments || mongoose.model("comments", commentSchema);

export default Comment;