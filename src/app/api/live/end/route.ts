import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LiveSession from "@/models/LiveSession";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin" && decoded.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { roomId } = data;
    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
    }

    const liveSession = await LiveSession.findOneAndUpdate(
      { roomId },
      { status: "ended", endedAt: new Date() },
      { new: true }
    );

    if (!liveSession) {
      return NextResponse.json({ error: "Live session not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, session: liveSession });
  } catch (error: any) {
    console.error("End live session error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to end live session" },
      { status: 500 }
    );
  }
}
