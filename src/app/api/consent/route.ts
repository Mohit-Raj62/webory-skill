import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import ConsentLog from "@/models/ConsentLog";
import PolicyVersion from "@/models/PolicyVersion";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const consentLogs = await ConsentLog.find({ userId: user._id }).sort({ timestamp: -1 });

    return NextResponse.json({ consentLogs });
  } catch (error) {
    console.error("Error fetching consent logs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { consentType, action } = await req.json();

    if (!["granted", "withdrawn"].includes(action) || consentType !== "marketing") {
      return NextResponse.json({ error: "Invalid consent parameters" }, { status: 400 });
    }

    const marketingPolicy = await PolicyVersion.findOne({ documentType: "marketing", isActive: true }) || { version: "v1.0.0" };

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await ConsentLog.create({
      userId: user._id,
      action,
      consentType,
      policyVersion: marketingPolicy.version,
      ipAddress,
      userAgent,
      source: "profile-settings"
    });

    user.marketingPreferences = action === "granted";
    user.lastConsentUpdate = new Date();
    await user.save();

    return NextResponse.json({ message: "Consent updated successfully", marketingPreferences: user.marketingPreferences });
  } catch (error) {
    console.error("Error updating consent:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
