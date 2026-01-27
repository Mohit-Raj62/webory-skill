import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quiz from "@/models/Quiz";
import QuizAttempt from "@/models/QuizAttempt";
import Activity from "@/models/Activity";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// GET - Fetch quiz for taking (without correct answers)
export async function GET(
  req: Request,
  props: { params: Promise<{ id: string; quizId: string }> },
) {
  try {
    await dbConnect();
    const params = await props.params;
    const { quizId } = params;

    const quiz = await Quiz.findById(quizId).select(
      "-questions.correctAnswer -questions.explanation",
    );

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

// POST - Submit quiz attempt
export async function POST(
  req: Request,
  props: { params: Promise<{ id: string; quizId: string }> },
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const params = await props.params;
    const { id: courseId, quizId } = params;
    const { answers, timeSpent } = await req.json();

    // Fetch quiz with correct answers
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Calculate score
    const gradedAnswers = answers.map((ans: any, index: number) => {
      const question = quiz.questions[index];
      const isCorrect = ans.answer === question.correctAnswer;

      return {
        questionIndex: index,
        answer: ans.answer,
        isCorrect,
        marksObtained: isCorrect ? question.marks : 0,
      };
    });

    const obtainedMarks = gradedAnswers.reduce(
      (sum: number, ans: any) => sum + ans.marksObtained,
      0,
    );

    // Calculate total possible marks dynamically from questions
    const totalPossibleMarks = quiz.questions.reduce(
      (sum: number, q: any) => sum + (q.marks || 1),
      0,
    );

    const percentage =
      totalPossibleMarks > 0
        ? Math.round((obtainedMarks / totalPossibleMarks) * 100)
        : 0;

    const passed = percentage >= quiz.passingScore;

    // Check if user has previously passed this quiz (BEFORE creating new attempt)
    const alreadyPassed = await QuizAttempt.findOne({
      userId: decoded.userId,
      quizId,
      passed: true,
    });

    // Save attempt
    const attempt = await QuizAttempt.create({
      userId: decoded.userId,
      quizId,
      courseId,
      answers: gradedAnswers,
      totalMarks: totalPossibleMarks,
      obtainedMarks,
      percentage,
      passed,
      timeSpent,
    });

    // Record Activity
    await Activity.create({
      student: decoded.userId,
      type: "quiz_attempted",
      category: "course",
      relatedId: courseId,
      metadata: {
        questionsCount: quiz.questions.length,
        courseName: quiz.title,
      },
      date: new Date(),
    });

    // Award +50 XP ONLY if passed AND didn't pass before
    console.log("=== QUIZ XP CHECK ===");
    console.log("Quiz ID:", quizId);
    console.log("User ID:", decoded.userId);
    console.log("Passed:", passed);
    console.log("Percentage:", percentage);
    console.log("Passing Score Required:", quiz.passingScore);
    console.log("Already Passed Before:", !!alreadyPassed);

    if (passed && !alreadyPassed) {
      console.log("✅ Awarding 50 XP for first-time pass");
      const User = (await import("@/models/User")).default;
      const userBefore = await User.findById(decoded.userId);
      console.log("User XP before:", userBefore?.xp);

      const updated = await User.findByIdAndUpdate(
        decoded.userId,
        { $inc: { xp: 50 } },
        { new: true },
      );
      console.log("User XP after:", updated?.xp);
      console.log("✅ XP successfully awarded!");
    } else {
      console.log(
        "❌ XP NOT awarded - Reason:",
        !passed ? "Quiz not passed" : "User already passed this quiz before",
      );
    }
    console.log("===================");

    // Return results with correct answers if showAnswers is true
    const result = {
      attemptId: attempt._id,
      obtainedMarks,
      totalMarks: quiz.totalMarks,
      percentage,
      passed,
      answers: quiz.showAnswers
        ? gradedAnswers.map((ans: any, index: number) => ({
            ...ans,
            correctAnswer: quiz.questions[index].correctAnswer,
            explanation: quiz.questions[index].explanation,
            questionText: quiz.questions[index].questionText,
            options: quiz.questions[index].options,
          }))
        : gradedAnswers,
    };

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Submit quiz error:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 },
    );
  }
}
