import mongoose from "mongoose";
import logger from "../shared/utils/logger.js";

export const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // wait max 5 seconds
    });
    logger.info(`Connected to ${uri}...`);
  } catch (error) {
    logger.error("MongoDB connection error:");
    logger.error(error);
    process.exit(1);
  }
};