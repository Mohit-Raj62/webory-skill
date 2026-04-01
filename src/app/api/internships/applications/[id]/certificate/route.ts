import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getUser } from "@/lib/get-user";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    await dbConnect();
    const { id: applicationId } = params;

    // Auth Check using utility
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = user._id.toString();

    // Fetch Application
    const application = await Application.findById(applicationId)
      .populate("internship", "title company")
      .populate("student", "firstName lastName")
      .select(
        "student internship status startDate appliedAt duration completedAt certificateId certificateKey offerDate"
      )
      .lean();

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Verify ownership and existence
    if (!application.student) {
      return NextResponse.json({ error: "Student data not found in application" }, { status: 404 });
    }

    const studentId = typeof application.student === 'object' 
      ? (application.student._id || application.student).toString() 
      : application.student.toString();

    if (studentId !== userId) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    return NextResponse.json(application);
  } catch (error: any) {
    console.error("Certificate API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch certificate", details: error.message },
      { status: 500 }
    );
  }
}
