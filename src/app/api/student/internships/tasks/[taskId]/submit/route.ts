import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import InternshipTask from "@/models/InternshipTask";
import Application from "@/models/Application";
import InternshipSubmission from "@/models/InternshipSubmission";
import Activity from "@/models/Activity";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// POST - Submit work for a task
export async function POST(
  req: Request,
  props: { params: Promise<{ taskId: string }> },
) {
  try {
    await dbConnect();
    const params = await props.params;
    const { taskId } = params;
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
        { status: 403 },
      );
    }

    // Check if already submitted
    let submission = await InternshipSubmission.findOne({
      task: taskId,
      student: userId,
    });

    let xpEarned = 0;

    if (submission) {
      // Update existing submission
      submission.submissionUrl = submissionUrl;
      submission.comments = comments;
      submission.submittedAt = new Date();
      submission.status = "pending";
    } else {
      // Create new submission
      submission = new InternshipSubmission({
        task: taskId,
        student: userId,
        submissionUrl,
        comments,
      });
    }

    // Award XP if not already awarded
    if (!submission.xpAwarded) {
      xpEarned = 50;
      await User.findByIdAndUpdate(userId, { $inc: { xp: xpEarned } });

      // Log Activity
      await Activity.create({
        student: userId,
        type: "internship_task_submitted",
        category: "internship",
        relatedId: task.internship,
        metadata: {
          internshipName: task.title,
        },
        date: new Date(),
      });

      submission.xpAwarded = true;
    }

    await submission.save();

    return NextResponse.json({ submission, xpEarned }, { status: 201 });
  } catch (error) {
    console.error("Submit internship task error:", error);
    return NextResponse.json(
      { error: "Failed to submit task" },
      { status: 500 },
    );
  }
}
