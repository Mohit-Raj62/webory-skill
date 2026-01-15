import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function getUser() {
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
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return null;
    }

    // Check if session is valid
    if (decoded.sessionId && user.currentSessionId !== decoded.sessionId) {
      return null;
    }

    // Return plain object to avoid serialization issues with Client Components if passed directly
    // though usually Mongoose docs need .lean() or JSON.stringify/parse for passing to client
    // We'll rely on the caller to handle serialization if needed, or return a plain object here.
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Auth check error:", error);
    return null;
  }
}
