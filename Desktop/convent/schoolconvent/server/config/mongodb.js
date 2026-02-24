// config/mongodb.js
import mongoose from "mongoose";
import { config } from "./config.js";

// Set up connection event handlers
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Connection function
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB");
      return;
    }

    console.log("Connecting to MongoDB...");
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      family: 4,
    };

    await mongoose.connect(config.mongoUri, options);
    console.log("MongoDB connection established");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Create a default export object
const mongodb = {
  connect: connectDB,
  connection: mongoose.connection,
  mongoose,
};

export default mongodb;
