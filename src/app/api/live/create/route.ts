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

    const roomId = `room_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

    // Close any previous active sessions for this context to prevent students from joining old ghost sessions
    const query: any = { status: "active" };
    if (data.applicationId) query.applicationId = data.applicationId;
    else if (data.applicationIds && data.applicationIds.length > 0) query.applicationIds = { $in: data.applicationIds };
    else if (data.internshipId) query.internshipId = data.internshipId;
    else if (data.courseId) query.courseId = data.courseId;
    
    if (Object.keys(query).length > 1) {
       await LiveSession.updateMany(query, { $set: { status: "ended", endedAt: new Date() } });
    }

    const liveSession = await LiveSession.create({
      title: data.title,
      description: data.description,
      instructor: decoded.userId, // use real instructor ID from token
      roomId,
      sessionType: data.sessionType || "general",
      courseId: data.courseId || undefined,
      internshipId: data.internshipId || undefined,
      applicationId: data.applicationId || undefined,
      applicationIds: data.applicationIds || undefined,
      moduleId: data.moduleId || undefined,
      inviteCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      status: "active",
      scheduledAt: new Date(),
      startedAt: new Date(),
    });

    return NextResponse.json({ success: true, roomId: liveSession.roomId, inviteCode: liveSession.inviteCode, session: liveSession }, { status: 201 });
  } catch (error: any) {
    console.error("Create live session error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create live session" },
      { status: 500 }
    );
  }
}
