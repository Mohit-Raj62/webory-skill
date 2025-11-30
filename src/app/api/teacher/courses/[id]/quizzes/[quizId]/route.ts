import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quiz from "@/models/Quiz";
import Course from "@/models/Course";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET - Fetch specific quiz
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; quizId: string }> }
) {
  try {
    await dbConnect();
    const { id, quizId } = await params;

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

    const quiz = await Quiz.findOne({ _id: quizId, courseId: id });
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Fetch quiz error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

// PUT - Update specific quiz
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; quizId: string }> }
) {
  try {
    await dbConnect();
    const { id, quizId } = await params;
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

    const quiz = await Quiz.findOneAndUpdate(
      { _id: quizId, courseId: id },
      data,
      { new: true }
    );

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Update quiz error:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific quiz
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; quizId: string }> }
) {
  try {
    await dbConnect();
    const { id, quizId } = await params;

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

    const quiz = await Quiz.findOneAndDelete({ _id: quizId, courseId: id });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Delete quiz error:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}
