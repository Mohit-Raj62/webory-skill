import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        if (decoded.role === "admin" || decoded.role === "teacher") {
          const { logActivity } = await import("@/lib/logger");
          await logActivity(
            decoded.userId || decoded.id,
            "LOGOUT",
            `Logged out`,
            req.headers.get("x-forwarded-for") || "unknown"
          );
        }
      } catch (err) {
        // Token might be expired or invalid, ignore logout logging
      }
    }

    cookieStore.delete("token");
    
    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
