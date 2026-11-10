import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Announcement from "@/models/Announcement";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const callerId = decoded.userId || decoded.id;
    let role = decoded.role;

    if (role !== "admin" && role !== "superadmin") {
      const user = await User.findById(callerId).select("role email").lean();
      if (
        user?.role === "admin" ||
        user?.role === "superadmin" ||
        user?.email?.toLowerCase() === "mohitraj7321@gmail.com"
      ) {
        role = user.role || "superadmin";
      }
    }

    if (role !== "admin" && role !== "superadmin") return null;
    return { callerId, role };
  } catch {
    return null;
  }
}

// GET all announcements for Admin/Superadmin
export async function GET() {
  try {
    await dbConnect();
    const auth = await verifyAdminAuth();
    if (!auth) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const announcements = await Announcement.find()
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, announcements });
  } catch (error: any) {
    console.error("Fetch admin announcements error:", error);
    return NextResponse.json(
      { error: "Failed to load announcements" },
      { status: 500 }
    );
  }
}

// POST: Create a new announcement
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const auth = await verifyAdminAuth();
    if (!auth) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, message, type, target, bannerActive, popupActive, link, linkText, expiresAt } = body;

    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 }
      );
    }

    const announcement = await Announcement.create({
      title,
      message,
      type: type || "info",
      target: target || "all",
      bannerActive: bannerActive !== undefined ? bannerActive : true,
      popupActive: popupActive !== undefined ? popupActive : false,
      link: link || "",
      linkText: linkText || "Learn More",
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: auth.callerId,
    });

    return NextResponse.json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error: any) {
    console.error("Create announcement error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create announcement" },
      { status: 500 }
    );
  }
}

