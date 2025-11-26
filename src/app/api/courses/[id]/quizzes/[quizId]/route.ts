import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Quiz from '@/models/Quiz';
import QuizAttempt from '@/models/QuizAttempt';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// GET - Fetch quiz for taking (without correct answers)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; quizId: string }> }
) {
  try {
    await dbConnect();
    const { quizId } = await params;

    const quiz = await Quiz.findById(quizId).select('-questions.correctAnswer -questions.explanation');

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Fetch quiz error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

// POST - Submit quiz attempt
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; quizId: string }> }
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const { id: courseId, quizId } = await params;
    const { answers, timeSpent } = await req.json();

    // Fetch quiz with correct answers
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
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

    const obtainedMarks = gradedAnswers.reduce((sum: number, ans: any) => sum + ans.marksObtained, 0);
    const percentage = (obtainedMarks / quiz.totalMarks) * 100;
    const passed = percentage >= quiz.passingScore;

    // Save attempt
    const attempt = await QuizAttempt.create({
      userId: decoded.userId,
      quizId,
      courseId,
      answers: gradedAnswers,
      totalMarks: quiz.totalMarks,
      obtainedMarks,
      percentage,
      passed,
      timeSpent,
    });

    // Return results with correct answers if showAnswers is true
    const result = {
      attemptId: attempt._id,
      obtainedMarks,
      totalMarks: quiz.totalMarks,
      percentage,
      passed,
      answers: quiz.showAnswers ? gradedAnswers.map((ans: any, index: number) => ({
        ...ans,
        correctAnswer: quiz.questions[index].correctAnswer,
        explanation: quiz.questions[index].explanation,
        questionText: quiz.questions[index].questionText,
        options: quiz.questions[index].options,
      })) : gradedAnswers,
    };

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Submit quiz error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
