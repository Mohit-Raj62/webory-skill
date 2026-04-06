import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import User from "@/models/User";
import Internship from "@/models/Internship";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id: applicationId } = params;
    
    console.log(`[Certificate API] Fetching application: ${applicationId}`);

    await dbConnect();

    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.warn("[Certificate API] No token found");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      userId = decoded.userId;
    } catch (err) {
      console.error("[Certificate API] Token verification failed");
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // Fetch Application with explicit data for Certificate
    // Note: Implicitly registers User and Internship models via imports
    const application = await Application.findById(applicationId)
      .populate("internship", "title company location stipend type")
      .populate("student", "firstName lastName email")
      .lean();

    if (!application) {
      console.warn(`[Certificate API] Application not found: ${applicationId}`);
      return NextResponse.json(
        { error: "Application record not found in database" },
        { status: 404 }
      );
    }

    // Safety check for student existence
    if (!application.student) {
      console.error("[Certificate API] Student data missing in application object");
      return NextResponse.json({ error: "Associated student data not found" }, { status: 404 });
    }

    // Verify ownership: studentId vs userId
    const studentId = application.student._id ? application.student._id.toString() : application.student.toString();

    if (studentId !== userId) {
      console.warn(`[Certificate API] Unauthorized access attempt by user ${userId} for application ${applicationId}`);
      return NextResponse.json({ error: "Unauthorized: You do not own this application" }, { status: 403 });
    }

    // Status Check (Optional but helpful for debugging)
    console.log(`[Certificate API] Application status: ${application.status}`);

    return NextResponse.json(application);
  } catch (error: any) {
    console.error("=== Certificate API Critical Error ===");
    console.error(error);
    return NextResponse.json(
      { 
        error: "Server-side error while fetching certificate", 
        details: error.message,
        path: "/api/internships/applications/[id]/certificate"
      },
      { status: 500 }
    );
  }
}
