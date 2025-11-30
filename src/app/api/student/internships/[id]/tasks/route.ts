import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import InternshipTask from "@/models/InternshipTask";
import Application from "@/models/Application";
import InternshipSubmission from "@/models/InternshipSubmission";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET - Fetch tasks for an internship (Student)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    // Check if student is accepted in the internship
    const application = await Application.findOne({
      internship: id,
      student: userId,
      status: { $in: ["accepted", "completed"] },
    });

    if (!application) {
      return NextResponse.json(
        { error: "You are not enrolled in this internship" },
        { status: 403 }
      );
    }

    // Fetch tasks
    const tasks = await InternshipTask.find({ internship: id }).sort({
      createdAt: -1,
    });

    // Fetch student's submissions for these tasks to show status
    const submissions = await InternshipSubmission.find({
      task: { $in: tasks.map((t) => t._id) },
      student: userId,
    });

    // Map submissions to tasks
    const tasksWithStatus = tasks.map((task) => {
      const submission = submissions.find(
        (s) => s.task.toString() === task._id.toString()
      );
      return {
        ...task.toObject(),
        submission: submission || null,
      };
    });

    return NextResponse.json({ tasks: tasksWithStatus });
  } catch (error) {
    console.error("Fetch student internship tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
