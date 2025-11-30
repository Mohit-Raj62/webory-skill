import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import Course from "@/models/Course";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET - Fetch all submissions for an assignment
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; assignmentId: string }> }
) {
  try {
    await dbConnect();
    const { id, assignmentId } = await params;

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
        { error: "Course not found or you do not have permission to view it" },
        { status: 404 }
      );
    }

    const submissions = await AssignmentSubmission.find({ assignmentId })
      .populate("userId", "name email")
      .sort({ submittedAt: -1 });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Fetch submissions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}
