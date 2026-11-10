import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Announcement from "@/models/Announcement";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    // Determine viewer role if logged in
    let viewerRole = "student";
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        if (decoded?.role) {
          viewerRole = decoded.role;
        }
      } catch {
        // invalid or expired token, treat as guest/student
      }
    }

    const now = new Date();
    const targetFilter = ["all"];
    if (viewerRole === "student") targetFilter.push("students");
    if (viewerRole === "teacher") targetFilter.push("teachers");
    if (viewerRole === "admin" || viewerRole === "superadmin") {
      targetFilter.push("admins", "teachers", "students");
    }

    const announcements = await Announcement.find({
      bannerActive: true,
      target: { $in: targetFilter },
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gte: now } },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({ success: true, announcements });
  } catch (error: any) {
    console.error("Fetch active announcements error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}

