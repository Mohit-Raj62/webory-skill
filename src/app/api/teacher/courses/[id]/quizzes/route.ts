import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quiz from "@/models/Quiz";
import Course from "@/models/Course";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET - Fetch all quizzes for a course
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

    const quizzes = await Quiz.find({ courseId: id }).sort({ createdAt: -1 });

    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error("Fetch quizzes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

// POST - Create new quiz
export async function POST(
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

    const quiz = await Quiz.create({
      ...data,
      courseId: id,
    });

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Create quiz error:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}
