import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import Course from "@/models/Course";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// PUT - Grade a submission
export async function PUT(
  req: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; assignmentId: string; submissionId: string }>;
  }
) {
  try {
    await dbConnect();
    const { id, assignmentId, submissionId } = await params;
    const { marksObtained, feedback } = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify ownership
    const course = await Course.findOne({
      _id: id,
      instructor: decoded.userId,
    });
    if (!course) {
      return NextResponse.json(
        { error: "Course not found or you do not have permission to edit it" },
        { status: 404 }
      );
    }

    const submission = await AssignmentSubmission.findByIdAndUpdate(
      submissionId,
      {
        marksObtained,
        feedback,
        status: "graded",
        gradedAt: new Date(),
      },
      { new: true }
    );

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Grade submission error:", error);
    return NextResponse.json(
      { error: "Failed to grade submission" },
      { status: 500 }
    );
  }
}
