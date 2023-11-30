import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    thread: {
      type: String,
      required: true,
    },
    creator: {
      type: String,
      required: true,
    },
    image: {
      type: Array,
      default: "",
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "comments",
      default: [],
    },
    tags: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Posts = mongoose.models.posts || mongoose.model("posts", userSchema);

export default Posts;
