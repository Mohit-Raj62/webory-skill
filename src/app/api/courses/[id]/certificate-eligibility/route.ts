import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";
import Assignment from "@/models/Assignment";
import AssignmentSubmission from "@/models/AssignmentSubmission";
import User from "@/models/User";
import Course from "@/models/Course";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { sendEmail, emailTemplates } from "@/lib/mail";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const params = await props.params;
    const { id: courseId } = params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const userId = decoded.userId;

    // 1. Video Progress
    const enrollment = await Enrollment.findOne({
      student: userId,
      course: courseId,
    });
    const videoProgress = enrollment?.progress || 0;

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // 2. Quizzes
    const quizzes = await Quiz.find({ courseId, isActive: true });
    let totalQuizPercentage = 0;
    let attemptedQuizzes = 0;

    for (const quiz of quizzes) {
      // Find best attempt
      const bestAttempt = await QuizAttempt.findOne({
        userId,
        quizId: quiz._id,
      }).sort({ percentage: -1 });

      if (bestAttempt) {
        totalQuizPercentage += bestAttempt.percentage;
        attemptedQuizzes++;
      }
    }

    // 3. Assignments
    const assignments = await Assignment.find({ courseId, isActive: true });
    let totalAssignmentPercentage = 0;
    let submittedAssignments = 0;

    for (const assignment of assignments) {
      const submission = await AssignmentSubmission.findOne({
        userId,
        assignmentId: assignment._id,
      });
      if (submission && submission.marksObtained != null) {
        const percentage =
          (submission.marksObtained / assignment.totalMarks) * 100;
        totalAssignmentPercentage += percentage;
        submittedAssignments++;
      }
    }

    // Calculate Overall Score
    const totalItems = quizzes.length + assignments.length;
    let overallScore = 0;

    if (totalItems > 0) {
      const totalScoreSum = totalQuizPercentage + totalAssignmentPercentage;
      // We divide by total ITEMS (including unattempted ones which count as 0)
      // This enforces that they must complete everything to get a high score
      overallScore = totalScoreSum / totalItems;
    } else {
      // If no quizzes or assignments exist, we only check video progress
      // Set score to 100 so it doesn't block certificate eligibility
      overallScore = 100;
    }

    // Eligibility Check
    // 1. Video progress must be 100%
    // 2. Overall score >= 90% (or 100 if no assessments)
    const isVideoComplete = videoProgress >= 100;
    const isScoreEligible = overallScore >= 90;
    const isEligible = isVideoComplete && isScoreEligible;

    // Send certificate unlock email if newly eligible
    if (isEligible && enrollment) {
      let needsSave = false;

      // Generate Certificate ID and Key if missing
      if (!enrollment.certificateId) {
        // Generate Certificate ID based on Course Title
        const courseTitleSlug = course.title
          .split(" ")
          .map((word: string) => word[0])
          .join("")
          .toUpperCase()
          .substring(0, 4);

        const certId = `${courseTitleSlug}-${userId
          .substring(0, 6)
          .toUpperCase()}-${Date.now().toString().substring(8)}`;
        // Generate a random 16-character alphanumeric key
        const certKey =
          Math.random().toString(36).substring(2, 10).toUpperCase() +
          Math.random().toString(36).substring(2, 10).toUpperCase();

        enrollment.certificateId = certId;
        enrollment.certificateKey = certKey;
        enrollment.completedAt = new Date(); // Set completion date
        needsSave = true;
      }

      if (!enrollment.certificateEmailSent) {
        try {
          const user = await User.findById(userId);
          // Course is already fetched above

          if (user && course) {
            const certificateLink = `${
              process.env.NEXT_PUBLIC_APP_URL || "https://weboryskills.in"
            }/courses/${courseId}/certificate`;
            await sendEmail(
              user.email,
              `🎓 Certificate Unlocked - ${course.title}`,
              emailTemplates.certificateUnlocked(
                user.firstName,
                course.title,
                certificateLink
              )
            );

            // Mark email as sent
            enrollment.certificateEmailSent = true;
            needsSave = true;

            console.log("✅ Certificate unlock email sent to:", user.email);
          }
        } catch (emailError) {
          console.error("❌ Failed to send certificate email:", emailError);
          // Don't fail the request if email fails
        }
      }

      if (needsSave) {
        await enrollment.save();
      }
    }

    // Debug logging
    console.log("=== CERTIFICATE ELIGIBILITY DEBUG ===");
    console.log("Course ID:", courseId);
    console.log("User ID:", userId);
    console.log("Video Progress:", videoProgress);
    console.log("Overall Score:", overallScore);
    console.log("Is Video Complete:", isVideoComplete);
    console.log("Is Score Eligible:", isScoreEligible);
    console.log("Is Eligible:", isEligible);
    console.log("Quizzes:", quizzes.length);
    console.log("Assignments:", assignments.length);
    console.log("=====================================");

    return NextResponse.json({
      videoProgress,
      overallScore: Math.round(overallScore),
      isEligible,
      certificateKey: enrollment?.certificateKey,
      completedAt: enrollment?.completedAt,
      enrolledAt: enrollment?.enrolledAt || enrollment?.createdAt,
      details: {
        quizzes: {
          total: quizzes.length,
          attempted: attemptedQuizzes,
          average:
            quizzes.length > 0
              ? Math.round(totalQuizPercentage / quizzes.length)
              : 0,
        },
        assignments: {
          total: assignments.length,
          submitted: submittedAssignments,
          average:
            assignments.length > 0
              ? Math.round(totalAssignmentPercentage / assignments.length)
              : 0,
        },
      },
    });
  } catch (error) {
    console.error("Certificate eligibility check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
