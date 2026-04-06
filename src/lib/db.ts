import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Check moved inside dbConnect to prevent build-time/import-time errors

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
    );
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering to prevent 10s hangs; fail fast or wait for explicit dbConnect
      maxPoolSize: 20,
      autoIndex: true,
      serverSelectionTimeoutMS: 10000, // 10s timeout to find server
      connectTimeoutMS: 10000, // 10s timeout for initial connection
      socketTimeoutMS: 45000, // 45s for long-running queries
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("MongoDB Connected Successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error("MongoDB Connection Error:", e);
    cached.promise = null; // Reset promise so we can retry on next call
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
