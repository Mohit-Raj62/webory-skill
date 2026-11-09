import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User, { IUser } from "@/models/User";
import { NextResponse } from "next/server";

export interface AuthResult {
  user: any;
  error?: string;
  status?: number;
}

export async function getAuthenticatedUser(): Promise<AuthResult> {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return { user: null, error: "Authentication required", status: 401 };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      sessionId?: string;
    };

    const user = await User.findById(decoded.userId).select("-password").lean();
    if (!user) {
      return { user: null, error: "User not found", status: 404 };
    }

    return { user: JSON.parse(JSON.stringify(user)) };
  } catch (err) {
    return { user: null, error: "Invalid or expired session", status: 401 };
  }
}

export async function requireAdmin(): Promise<AuthResult> {
  const auth = await getAuthenticatedUser();
  if (auth.error || !auth.user) {
    return auth;
  }

  const role = auth.user.role;
  if (role !== "admin" && role !== "superadmin") {
    return { user: null, error: "Forbidden: Admin access required", status: 403 };
  }

  return auth;
}

