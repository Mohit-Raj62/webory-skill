import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import QuizAttempt from "@/models/QuizAttempt";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET - Fetch all attempts for a specific quiz (Teacher)
export async function GET(
  req: Request,
  props: { params: Promise<{ id: string; quizId: string }> },
) {
  try {
    await dbConnect();
    const params = await props.params;
    const { quizId } = params;

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Allow both teacher and admin to access this
    if (decoded.role !== "teacher" && decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const attempts = await QuizAttempt.find({ quizId })
      .populate("userId", "firstName lastName email avatar")
      .sort({ attemptedAt: -1 });

    return NextResponse.json({ attempts });
  } catch (error) {
    console.error("Fetch quiz attempts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz attempts" },
      { status: 500 },
    );
  }
}
