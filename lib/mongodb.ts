import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "";
  try {
    await mongoose.connect(uri);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      console.log(
        `MongoDB connection error. Please make sure MongoDB is running: ${err}`
      );
      process.exit();
    });
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
};
