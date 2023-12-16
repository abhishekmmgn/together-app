import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    createdBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
      default: "",
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    destination: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Notifications =
  mongoose.models.notifications || mongoose.model("notifications", userSchema);

export default Notifications;
