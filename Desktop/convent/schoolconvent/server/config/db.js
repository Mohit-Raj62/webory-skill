import mongoose from "mongoose";
import { config } from "./config.js";

// Set strictQuery to false to prepare for Mongoose 7
mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    if (!mongoose.connection.readyState) {
      const conn = await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
