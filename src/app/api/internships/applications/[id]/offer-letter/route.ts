import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import fs from 'fs';
import path from 'path';

function logDebug(message: string, data?: any) {
  const logPath = path.join(process.cwd(), 'debug_log.txt');
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message} ${data ? JSON.stringify(data) : ''}\n`;
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
    logDebug("=== API CALLED ===");
    logDebug("Params ID:", params.id);
    
    await dbConnect();
    logDebug("DB Connected");
    const { id: applicationId } = params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.error("No token found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userId = decoded.userId;
    console.log("User ID:", userId);

    // Find application and populate internship and student details
    const application = await Application.findById(applicationId)
      .populate("internship")
      .populate("student")
      .lean();

    console.log("Application found:", application ? "Yes" : "No");

    // If application not found, return demo data for testing
    if (!application) {
      console.log("Application not found in database, returning demo data");
      return NextResponse.json({
        student: {
          firstName: "Demo",
          lastName: "Student",
          email: "demo@example.com",
        },
        internship: {
          title: "Frontend Developer Intern",
          company: "Tech Company Pvt Ltd",
          location: "Remote / Bangalore",
          type: "Full-time",
          stipend: "₹15,000 - ₹20,000/month",
        },
        startDate: new Date(),
        duration: "3 months",
        appliedAt: new Date(),
        isDemo: true, // Flag to indicate this is demo data
      });
    }

    // Verify application belongs to user
    if (application.student._id.toString() !== userId) {
      console.error("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    console.log("Application status:", application.status);

    // Return offer letter data with safe fallbacks
    const responseData = {
      student: {
        firstName: application.student?.firstName || "Student",
        lastName: application.student?.lastName || "Name",
        email: application.student?.email || "email@example.com",
      },
      internship: {
        title: application.internship?.title || "Internship Position",
        company: application.internship?.company || "Company Name",
        location: application.internship?.location || "Location",
        type: application.internship?.type || "Full-time",
        stipend: application.internship?.stipend || "To be discussed",
      },
      startDate: application.startDate || new Date(),
      duration: application.duration || "3 months",
      appliedAt: application.appliedAt || new Date(),
      isDemo: false,
    };

    console.log("Returning real application data successfully");
    return NextResponse.json(responseData);
    
  } catch (error: any) {
    console.error("=== OFFER LETTER API ERROR ===");
    console.error("Error:", error);
    console.error("Error message:", error.message);
    
    // Return error with details
    return NextResponse.json({ 
      error: "Failed to fetch offer letter",
      details: error.message 
    }, { status: 500 });
  }
}
