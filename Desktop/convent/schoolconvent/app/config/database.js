import * as mongoose from "mongoose";
import "react-native-get-random-values";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/schoolconvent";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing database connection");
    return;
  }

  try {
    // Connect to MongoDB
    const db = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log(`MongoDB Connected: ${db.connection.host}`);

    // Set up connection event handlers
    db.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    db.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      isConnected = false;
    });

    db.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      isConnected = false;
    });

    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    isConnected = false;
    throw error;
  }
};

export default connectDB;
