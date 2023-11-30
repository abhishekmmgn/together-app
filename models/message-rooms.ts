import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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

const MessageRooms =
  mongoose.models.messageRooms || mongoose.model("messageRooms", userSchema);

export default MessageRooms;

/*

room1: {
  members: [curUser, otherUser],
  messages: [{message: "Hello world!", createdAt: Date.now(), createdBy: curUser}, {message: "World says hello!", createdAt: Date.now(), createdBy: otherUser}]
  createdAt: Date.now()
}
*/
