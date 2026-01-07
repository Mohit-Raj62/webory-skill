import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ActivityLog from "@/models/ActivityLog";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Fetch Logs (Newest first, limit 50)
    const logs = await ActivityLog.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
