import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { initSocket } from "./sockets/socket";
import liveRoutes from "./routes/live.routes";
import videoRoutes from "./routes/video.routes";
import dbConnect from "../../src/lib/db";

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") }); // Load from Next.js root

const app = express();
const server = http.createServer(app);

// Initialize WebSockets
initSocket(server);

app.use(cors());
app.use(express.json());

// Connect to MongoDB using the shared Next.js connection instance
dbConnect()
  .then(() => console.log("Connected to MongoDB from Express using shared dbConnect"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// Routes
app.use("/api/live", liveRoutes);
app.use("/api/video", videoRoutes);

const PORT = process.env.EXPRESS_PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
