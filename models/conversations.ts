import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: [],
    },
    messages: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Conversations =
  mongoose.models.conversations || mongoose.model("conversations", conversationSchema);

export default Conversations;

/*

room1: {
  members: [curUser, otherUser],
  messages: [{message: "Hello world!", createdAt: Date.now(), createdBy: curUser}, {message: "World says hello!", createdAt: Date.now(), createdBy: otherUser}]
  createdAt: Date.now()
}
*/
