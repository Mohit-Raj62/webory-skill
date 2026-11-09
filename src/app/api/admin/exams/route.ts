import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Examination from "@/models/Examination";
import ExaminationAttempt from "@/models/ExaminationAttempt";
import "@/models/User";
import "@/models/Course";
import { requireAdmin } from "@/lib/exam-auth";

export async function GET(req: Request) {
  try {
    const auth = await requireAdmin();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const subject = searchParams.get("subject") || "";

    const query: any = {};
    if (status && status !== "all") {
      query.status = status;
    }
    if (subject && subject !== "all") {
      query.subject = { $regex: new RegExp(subject, "i") };
    }
    if (search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { subject: { $regex: search.trim(), $options: "i" } },
        { topic: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const exams = await Examination.find(query)
      .populate("createdBy", "firstName lastName email")
      .populate("courseId", "title slug")
      .sort({ createdAt: -1 })
      .lean();

    // Attach submission counts & active attempt counts
    const examIds = exams.map((e) => e._id);
    const attempts = await ExaminationAttempt.aggregate([
      { $match: { examId: { $in: examIds } } },
      {
        $group: {
          _id: { examId: "$examId", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    const statsMap: Record<string, { totalSubmissions: number; activeAttempting: number }> = {};
    attempts.forEach((item) => {
      const eId = item._id.examId.toString();
      if (!statsMap[eId]) {
        statsMap[eId] = { totalSubmissions: 0, activeAttempting: 0 };
      }
      if (item._id.status === "submitted" || item._id.status === "evaluated") {
        statsMap[eId].totalSubmissions += item.count;
      } else if (item._id.status === "in-progress") {
        statsMap[eId].activeAttempting += item.count;
      }
    });

    const enrichedExams = exams.map((exam) => ({
      ...exam,
      submissionsCount: statsMap[exam._id.toString()]?.totalSubmissions || 0,
      activeAttemptingCount: statsMap[exam._id.toString()]?.activeAttempting || 0,
    }));

    return NextResponse.json({
      success: true,
      exams: enrichedExams,
    });
  } catch (error: any) {
    console.error("Admin Exams GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch examinations" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdmin();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();
    const body = await req.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: "Examination title is required" },
        { status: 400 }
      );
    }

    // Default status MUST be hidden or draft unless admin explicitly sets otherwise
    const allowedStatuses = ["draft", "hidden", "scheduled", "live", "completed", "archived"];
    const status = allowedStatuses.includes(body.status) ? body.status : "hidden";

    const questions = Array.isArray(body.questions) ? body.questions : [];
    const totalQuestions = questions.length;
    const totalMarks = questions.reduce(
      (sum: number, q: any) => sum + (Number(q.marks) || 1),
      0
    );

    const exam = await Examination.create({
      ...body,
      status,
      questions,
      totalQuestions,
      totalMarks: body.totalMarks || totalMarks,
      passingMarks: body.passingMarks || Math.round((totalMarks * (body.passingPercentage || 40)) / 100),
      createdBy: auth.user._id,
      isPublished: status === "live",
      resultsPublished: body.resultsPublished || false,
      answerKeyPublished: body.answerKeyPublished || false,
    });

    return NextResponse.json(
      {
        success: true,
        exam,
        message: `Examination created successfully in ${status.toUpperCase()} mode`,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin Exam POST error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create examination" },
      { status: 500 }
    );
  }
}

