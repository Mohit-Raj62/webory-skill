import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import InternshipTask from "@/models/InternshipTask";
import Application from "@/models/Application";
import InternshipSubmission from "@/models/InternshipSubmission";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// POST - Submit work for a task
export async function POST(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    await dbConnect();
    const { taskId } = await params;
    const { submissionUrl, comments } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    // Get task to find internship ID
    const task = await InternshipTask.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check if student is accepted in the internship
    const application = await Application.findOne({
      internship: task.internship,
      student: userId,
      status: { $in: ["accepted", "completed"] },
    });

    if (!application) {
      return NextResponse.json(
        { error: "You are not enrolled in this internship" },
        { status: 403 }
      );
    }

    // Check if already submitted
    const existingSubmission = await InternshipSubmission.findOne({
      task: taskId,
      student: userId,
    });

    if (existingSubmission) {
      // Update existing submission
      existingSubmission.submissionUrl = submissionUrl;
      existingSubmission.comments = comments;
      existingSubmission.submittedAt = new Date();
      existingSubmission.status = "pending"; // Reset status on resubmission
      await existingSubmission.save();
      return NextResponse.json({ submission: existingSubmission });
    }

    // Create new submission
    const submission = await InternshipSubmission.create({
      task: taskId,
      student: userId,
      submissionUrl,
      comments,
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error("Submit internship task error:", error);
    return NextResponse.json(
      { error: "Failed to submit task" },
      { status: 500 }
    );
  }
}
