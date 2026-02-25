import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import QuizAttempt from "@/models/QuizAttempt";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import "@/models/Quiz";
import "@/models/Course";
import "@/models/Assignment";

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    const [
      quizAttempts,
      assignmentSubmissions,
      totalQuizzes,
      passedQuizzes,
      totalAssignments,
      gradedAssignments,
      avgScoreResult,
    ] = await Promise.all([
      // 1. Recent Quiz Attempts
      QuizAttempt.find({ userId })
        .populate("quizId", "title type totalMarks")
        .populate("courseId", "title")
        .sort({ submittedAt: -1 })
        .limit(10)
        .lean(),

      // 2. Recent Assignment Submissions
      AssignmentSubmission.find({ userId })
        .populate("assignmentId", "title totalMarks")
        .populate("courseId", "title")
        .sort({ submittedAt: -1 })
        .limit(10)
        .lean(),

      // 3. Stats Counts
      QuizAttempt.countDocuments({ userId }),
      QuizAttempt.countDocuments({ userId, passed: true }),
      AssignmentSubmission.countDocuments({ userId }),
      AssignmentSubmission.countDocuments({ userId, status: "graded" }),

      // 4. Average Score Aggregation
      QuizAttempt.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, avg: { $avg: "$percentage" } } },
      ]),
    ]);

    // Note: If aggregate fails to match, result is empty array
    const avgQuizScore = avgScoreResult.length > 0 ? avgScoreResult[0].avg : 0;

    return NextResponse.json({
      quizAttempts,
      assignmentSubmissions,
      stats: {
        totalQuizzes,
        passedQuizzes,
        totalAssignments,
        gradedAssignments,
        avgQuizScore: Math.round(avgQuizScore),
      },
    });
  } catch (error) {
    console.error("Fetch grades error:", error);
    return NextResponse.json(
      { error: "Failed to fetch grades" },
      { status: 500 },
    );
  }
}
