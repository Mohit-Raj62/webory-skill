import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Examination from "@/models/Examination";
import ExaminationAttempt from "@/models/ExaminationAttempt";
import Application from "@/models/Application";
import { getAuthenticatedUser } from "@/lib/exam-auth";

export async function GET() {
  try {
    const auth = await getAuthenticatedUser();
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    await dbConnect();

    // Students only ever see "live" or "scheduled" exams. Hidden and draft are NEVER visible!
    const exams = await Examination.find({
      status: { $in: ["live", "scheduled", "completed"] },
    })
      .select(
        "title description subject topic duration totalQuestions totalMarks passingPercentage status startDate endDate maxAttempts resultVisibility answerKeyVisibility isPublished resultsPublished studentEligibility"
      )
      .sort({ createdAt: -1 })
      .lean();

    const isAdmin = auth.user.role === "admin" || auth.user.role === "superadmin";

    // Fetch user's internship applications to determine eligibility for restricted exams
    const studentApplications = await Application.find({
      student: auth.user._id,
      status: { $ne: "rejected" },
    })
      .select("internship assignedExam status")
      .lean();

    const appliedInternshipIds = new Set(
      studentApplications.map((a) => a.internship?.toString()).filter(Boolean)
    );
    const assignedExamIds = new Set(
      studentApplications.map((a) => a.assignedExam?.toString()).filter(Boolean)
    );

    // Filter exams based on target audience
    const eligibleExams = exams.filter((exam) => {
      if (isAdmin) return true;

      const eligibility = exam.studentEligibility;
      // Default or "all" -> Open for all students
      if (!eligibility || !eligibility.type || eligibility.type === "all") {
        return true;
      }

      // If "internship" -> Check if student applied to the internship or was assigned this exam
      if (eligibility.type === "internship") {
        const examIdStr = exam._id.toString();
        // 1. Directly assigned in an application
        if (assignedExamIds.has(examIdStr)) return true;

        // 2. Applied for one of the target internships (and has an active application)
        const targetInternships = eligibility.internshipIds || [];
        if (targetInternships.length === 0) {
          return studentApplications.some((a) => a.status === "exam_pending");
        }
        return targetInternships.some((iId: any) => appliedInternshipIds.has(iId.toString()));
      }

      return false;
    });

    // Check user's attempt status for each exam
    const examIds = eligibleExams.map((e) => e._id);
    const myAttempts = await ExaminationAttempt.find({
      examId: { $in: examIds },
      studentId: auth.user._id,
    })
      .select("examId status startTime submittedAt evaluation.obtainedMarks evaluation.percentage evaluation.passed")
      .lean();

    const attemptMap = new Map<string, any>();
    myAttempts.forEach((att) => {
      attemptMap.set(att.examId.toString(), att);
    });

    const studentExams = eligibleExams.map((exam) => {
      const myAttempt = attemptMap.get(exam._id.toString());
      return {
        ...exam,
        myAttempt: myAttempt
          ? {
              status: myAttempt.status,
              submittedAt: myAttempt.submittedAt,
              score: exam.resultsPublished || exam.resultVisibility === "immediate"
                ? myAttempt.evaluation?.obtainedMarks
                : null,
              percentage: exam.resultsPublished || exam.resultVisibility === "immediate"
                ? myAttempt.evaluation?.percentage
                : null,
              passed: exam.resultsPublished || exam.resultVisibility === "immediate"
                ? myAttempt.evaluation?.passed
                : null,
            }
          : null,
      };
    });

    return NextResponse.json({
      success: true,
      exams: studentExams,
    });
  } catch (error: any) {
    console.error("Student Exams GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch examinations" },
      { status: 500 }
    );
  }
}

