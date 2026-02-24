import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import mongodb from "./config/mongodb.js";
import healthRoutes from "./routes/health.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // In production, replace with your actual domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongodb.connect();

    // Start the server
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to School Convent API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: config.nodeEnv === "development" ? err.message : undefined,
  });
});

// Start the server
startServer();
