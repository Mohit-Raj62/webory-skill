import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import Course from "@/models/Course";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET - Fetch specific assignment
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; assignmentId: string }> },
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

    // Verify ownership or shared access
    const course = await Course.findOne({
      _id: id,
      $or: [{ instructor: decoded.userId }, { coInstructors: decoded.userId }],
    });
    if (!course) {
      return NextResponse.json(
        { error: "Course not found or you do not have permission to view it" },
        { status: 404 },
      );
    }

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      courseId: id,
    });
    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ assignment });
  } catch (error) {
    console.error("Fetch assignment error:", error);
    return NextResponse.json(
      { error: "Failed to fetch assignment" },
      { status: 500 },
    );
  }
}

// PUT - Update specific assignment
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; assignmentId: string }> },
) {
  try {
    await dbConnect();
    const { id, assignmentId } = await params;
    const data = await req.json();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Verify ownership or shared access
    const course = await Course.findOne({
      _id: id,
      $or: [{ instructor: decoded.userId }, { coInstructors: decoded.userId }],
    });
    if (!course) {
      return NextResponse.json(
        { error: "Course not found or you do not have permission to edit it" },
        { status: 404 },
      );
    }

    const assignment = await Assignment.findOneAndUpdate(
      { _id: assignmentId, courseId: id },
      data,
      { new: true },
    );

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ assignment });
  } catch (error) {
    console.error("Update assignment error:", error);
    return NextResponse.json(
      { error: "Failed to update assignment" },
      { status: 500 },
    );
  }
}

// DELETE - Delete specific assignment
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; assignmentId: string }> },
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

    // Verify ownership or shared access
    const course = await Course.findOne({
      _id: id,
      $or: [{ instructor: decoded.userId }, { coInstructors: decoded.userId }],
    });
    if (!course) {
      return NextResponse.json(
        { error: "Course not found or you do not have permission to edit it" },
        { status: 404 },
      );
    }

    const assignment = await Assignment.findOneAndDelete({
      _id: assignmentId,
      courseId: id,
    });

    if (!assignment) {
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 },
      );
    }

    // Also delete all submissions for this assignment
    await AssignmentSubmission.deleteMany({ assignmentId });

    return NextResponse.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Delete assignment error:", error);
    return NextResponse.json(
      { error: "Failed to delete assignment" },
      { status: 500 },
    );
  }
}
