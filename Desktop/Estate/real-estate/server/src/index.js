import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://localhost:5003",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error details:", {
    message: err.message,
    stack: err.stack,
    code: err.code,
  });
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

// Handle 404 errors
app.use((req, res) => {
  console.log("404 Not Found:", req.method, req.url);
  res.status(404).json({ message: `Route ${req.url} not found` });
});

// MongoDB Connection with retry logic
const connectDB = async (retries = 5) => {
  try {
    const mongoURL =
      process.env.MONGODB_URL || "mongodb://localhost:27017/real-estate";
    console.log("Attempting to connect to MongoDB at:", mongoURL);

    await mongoose.connect(mongoURL);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts remaining)`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
      return connectDB(retries - 1);
    }
    process.exit(1);
  }
};

// Start server only after DB connection
const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5003;

  const server = app.listen(PORT, (err) => {
    if (err) {
      console.error("Error starting server:", err);
      process.exit(1);
    } else {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Frontend can connect to http://localhost:${PORT}`);
    }
  });

  server.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
