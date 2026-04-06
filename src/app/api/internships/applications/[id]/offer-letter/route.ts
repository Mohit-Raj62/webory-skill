import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import User from "@/models/User";
import Internship from "@/models/Internship";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

function logDebug(message: string, data?: any) {
  const logPath = path.join(process.cwd(), "debug_log.txt");
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message} ${
    data ? JSON.stringify(data) : ""
  }\n`;
  try {
    fs.appendFileSync(logPath, logMessage);
  } catch (e) {
    console.error("Failed to write log", e);
  }
}

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id: applicationId } = params;
    
    console.log(`[Offer Letter API] Fetching application: ${applicationId}`);

    await dbConnect();

    // ID Check
    if (!applicationId || applicationId === "undefined") {
        return NextResponse.json({ error: "Invalid Application ID" }, { status: 400 });
    }

    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.warn("[Offer Letter API] No token found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      userId = decoded.userId;
    } catch (err) {
      console.error("[Offer Letter API] Token verification failed");
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Explicitly ensure models are registered to prevent population failures 
    // especially during Next.js cold starts
    if (!mongoose.models.User) mongoose.model("User", User.schema);
    if (!mongoose.models.Internship) mongoose.model("Internship", Internship.schema);
    if (!mongoose.models.Application) mongoose.model("Application", Application.schema);

    // Find application and populate internship and student details with explicit models
    const application = await Application.findById(applicationId)
      .populate({ path: "internship", model: Internship })
      .populate({ path: "student", model: User })
      .lean();

    if (!application) {
      console.warn(`[Offer Letter API] Application NOT found in DB: ${applicationId}`);
      return NextResponse.json(
        { error: "Application record not found" },
        { status: 404 }
      );
    }

    // Safety check for student and internship existence
    if (!application.student) {
      console.error("[Offer Letter API] Student data missing in application");
      return NextResponse.json({ error: "Student data not found in application record" }, { status: 404 });
    }

    // Verify application belongs to user
    const studentId = application.student._id ? application.student._id.toString() : application.student.toString();
    
    if (studentId !== userId) {
      console.warn(`[Offer Letter API] Unauthorized access by ${userId} for app ${applicationId}`);
      return NextResponse.json({ error: "Unauthorized access to this offer letter" }, { status: 403 });
    }

    // Return offer letter data with safe fallbacks
    const responseData = {
      student: {
        firstName: application.student?.firstName || "Student",
        lastName: application.student?.lastName || "Name",
        email: application.student?.email || "email@example.com",
      },
      internship: {
        title: application.internship?.title || "Internship Position",
        company: application.internship?.company || "Webory Skills",
        location: application.internship?.location || "Remote",
        type: application.internship?.type || "Full-time",
        stipend: application.internship?.stipend || "To be discussed",
      },
      startDate:
        application.startDate ||
        application.offerDate ||
        application.appliedAt ||
        new Date(),
      offerDate: application.offerDate || application.appliedAt || new Date(),
      duration: application.duration || "3 months",
      appliedAt: application.appliedAt || new Date(),
      status: application.status,
      isDemo: false,
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("=== OFFER LETTER API Critical Error ===");
    console.error(error);
    return NextResponse.json(
      {
        error: `Server error: ${error.message}`,
        details: error.stack,
      },
      { status: 500 }
    );
  }
}
