import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Doubt from "@/models/Doubt";
import User from "@/models/User";
import Course from "@/models/Course";

// Answer a doubt (teacher only)
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const doubtId = params.id;
    const { answer } = await req.json();

    if (!answer || !answer.trim()) {
      return NextResponse.json(
        { error: "Answer is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get user from token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Check if user is teacher
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get the doubt to verify it belongs to teacher's course
    const doubt = await Doubt.findById(doubtId).populate("course");
    if (!doubt) {
      return NextResponse.json({ error: "Doubt not found" }, { status: 404 });
    }

    // Verify the course belongs to this teacher
    const course = await Course.findById(doubt.course);
    if (!course || course.instructor.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: "Forbidden - Not your course" },
        { status: 403 }
      );
    }

    // Update doubt with answer
    const updatedDoubt = await Doubt.findByIdAndUpdate(
      doubtId,
      {
        answer: answer.trim(),
        answeredBy: decoded.userId,
        status: "answered",
        answeredAt: new Date(),
      },
      { new: true }
    )
      .populate("student", "name email")
      .populate("course", "title")
      .populate("answeredBy", "name email");

    return NextResponse.json({
      success: true,
      doubt: updatedDoubt,
      message: "Doubt answered successfully",
    });
  } catch (error) {
    console.error("Error answering doubt:", error);
    return NextResponse.json(
      { error: "Failed to answer doubt" },
      { status: 500 }
    );
  }
}

// Delete a doubt (teacher only)
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const doubtId = params.id;

    await dbConnect();

    // Get user from token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Check if user is teacher
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get the doubt to verify it belongs to teacher's course
    const doubt = await Doubt.findById(doubtId).populate("course");
    if (!doubt) {
      return NextResponse.json({ error: "Doubt not found" }, { status: 404 });
    }

    // Verify the course belongs to this teacher
    const course = await Course.findById(doubt.course);
    if (!course || course.instructor.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: "Forbidden - Not your course" },
        { status: 403 }
      );
    }

    // Delete doubt
    await Doubt.findByIdAndDelete(doubtId);

    return NextResponse.json({
      success: true,
      message: "Doubt deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting doubt:", error);
    return NextResponse.json(
      { error: "Failed to delete doubt" },
      { status: 500 }
    );
  }
}
