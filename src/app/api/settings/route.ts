import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";

export const dynamic = "force-dynamic";

// GET - Fetch public settings
export async function GET() {
  try {
    await dbConnect();

    // Fetch all needed public settings in a single query
    const settingsList = await Settings.find({
      key: {
        $in: [
          "careerApplicationsEnabled",
          "mentorshipEnabled",
          "announcementBar",
        ],
      },
    }).lean();

    // Convert array to a lookup object
    const settingsMap = settingsList.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    const careerApplicationsEnabled =
      settingsMap.careerApplicationsEnabled ?? true;
    const mentorshipEnabled = settingsMap.mentorshipEnabled ?? true;
    const announcementBar = settingsMap.announcementBar ?? {
      enabled: true,
      text: "Waitlist for January 2026 is full. February batch closing soon!",
    };

    return NextResponse.json(
      { careerApplicationsEnabled, mentorshipEnabled, announcementBar },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=150",
        },
      },
    );
  } catch (error) {
    console.error("Fetch settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

// POST - Update settings (Admin only)
export async function POST(req: Request) {
  try {
    await dbConnect();
    console.log("🛠️ Starting Settings POST update...");
    
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.warn("⚠️ No token found in cookies.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (jwtError) {
        console.error("❌ JWT Verification failed:", jwtError);
        return NextResponse.json({ error: "Session expired. Please login again.", details: "JWT_VERIFY_FAIL" }, { status: 401 });
    }
    
    const userId = decoded.userId || decoded.id;
    if (!userId) {
        console.warn("⚠️ No user identification found in token.");
        return NextResponse.json({ error: "Invalid token payload", details: "NO_USER_ID" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
        console.warn(`⚠️ User not found for ID: ${userId}`);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "admin") {
      console.warn(`🔒 Forbidden: User ${user.firstName} (Role: ${user.role}) attempted admin action.`);
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    console.log(`✅ Updating setting: ${key} to ${JSON.stringify(value)}`);

    const setting = await Settings.findOneAndUpdate(
      { key },
      { value, updatedAt: new Date() },
      { upsert: true, new: true },
    );

    return NextResponse.json({
      message: "Setting updated successfully",
      setting,
    });
  } catch (error) {
    console.error("❌ Critical Update setting error:", error);
    return NextResponse.json(
      { 
        error: "Failed to update setting", 
        details: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 },
    );
  }
}
