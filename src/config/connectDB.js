import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit if DB connection fails
  }
};