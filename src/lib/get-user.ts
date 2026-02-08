import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { cache } from "react";

export const getUser = cache(async () => {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      sessionId?: string;
    };
    const user = await User.findById(decoded.userId).select("-password").lean();

    if (!user) {
      return null;
    }

    // Check if session is valid
    if (decoded.sessionId && user.currentSessionId !== decoded.sessionId) {
      return null;
    }

    // Return plain object (lean already does this mostly, but ensure serialization)
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Auth check error:", error);
    return null;
  }
});
