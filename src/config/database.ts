import dotenv from "dotenv";
import mongoose from "mongoose";
import { AppError } from "../utils/error.handler";
import logger from "../utils/logger";

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new AppError("MongoDB URI not provided:", 500);
    }
    const conn = await mongoose.connect(uri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
