import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// DELETE course
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Verify ownership
    const course = await Course.findOne({
      _id: id,
      instructor: decoded.userId,
    });
    if (!course) {
      return NextResponse.json(
        {
          error: "Course not found or you do not have permission to delete it",
        },
        { status: 404 }
      );
    }

    // Delete enrollments for this course
    await Enrollment.deleteMany({ course: id });

    // Delete course
    await Course.findByIdAndDelete(id);

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update course
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const data = await req.json();

    // Verify ownership
    const existingCourse = await Course.findOne({
      _id: id,
      instructor: decoded.userId,
    });
    if (!existingCourse) {
      return NextResponse.json(
        { error: "Course not found or you do not have permission to edit it" },
        { status: 404 }
      );
    }

    const course = await Course.findByIdAndUpdate(id, data, { new: true });

    return NextResponse.json({ course });
  } catch (error) {
    console.error("Update course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
