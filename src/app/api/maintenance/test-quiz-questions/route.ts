import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Quiz from "@/models/Quiz";
import Course from "@/models/Course";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Find a course
    const course = await Course.findOne({});
    if (!course) return NextResponse.json({ error: "No course found" });

    // Create a test quiz with questions
    const quiz = await Quiz.create({
      title: "Test Quiz With Questions",
      courseId: course._id,
      duration: 10,
      passingScore: 100,
      totalMarks: 5,
      questions: [
        {
          questionText: "Q1",
          questionType: "mcq",
          options: ["A", "B"],
          correctAnswer: 0,
          marks: 1,
        },
        {
          questionText: "Q2",
          questionType: "true-false",
          correctAnswer: 0, // True
          marks: 1,
        },
        {
          questionText: "Q3",
          questionType: "mcq",
          options: ["X", "Y"],
          correctAnswer: 1,
          marks: 1,
        },
        {
          questionText: "Q4",
          questionType: "mcq",
          options: ["X", "Y"],
          correctAnswer: 1,
          marks: 1,
        },
        {
          questionText: "Q5",
          questionType: "mcq",
          options: ["X", "Y"],
          correctAnswer: 1,
          marks: 1,
        },
      ],
    });

    // Read it back
    const savedQuiz = await Quiz.findById(quiz._id);

    return NextResponse.json({
      requestedProps: { passingScore: 100 },
      savedProps: {
        passingScore: savedQuiz.passingScore,
        totalMarks: savedQuiz.totalMarks,
      },
      isMatch: savedQuiz.passingScore === 100,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
