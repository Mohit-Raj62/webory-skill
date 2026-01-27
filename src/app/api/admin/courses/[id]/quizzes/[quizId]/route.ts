import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quiz from "@/models/Quiz";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET - Fetch quiz details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; quizId: string }> },
) {
  try {
    await dbConnect();
    const { quizId } = await params;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Fetch quiz error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 },
    );
  }
}

// PUT - Update quiz
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; quizId: string }> },
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { quizId } = await params;
    const data = await req.json();

    const quiz = await Quiz.findByIdAndUpdate(quizId, data, { new: true });

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Update quiz error:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 },
    );
  }
}

// DELETE - Delete quiz
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; quizId: string }> },
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { quizId } = await params;

    await Quiz.findByIdAndDelete(quizId);

    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Delete quiz error:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 },
    );
  }
}
