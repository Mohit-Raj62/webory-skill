import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import QuizAttempt from '@/models/QuizAttempt';
import AssignmentSubmission from '@/models/AssignmentSubmission';

export async function GET() {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    // Fetch quiz attempts
    const quizAttempts = await QuizAttempt.find({ userId })
      .populate('quizId', 'title type totalMarks')
      .populate('courseId', 'title')
      .sort({ submittedAt: -1 })
      .limit(10);

    // Fetch assignment submissions
    const assignmentSubmissions = await AssignmentSubmission.find({ userId })
      .populate('assignmentId', 'title totalMarks')
      .populate('courseId', 'title')
      .sort({ submittedAt: -1 })
      .limit(10);

    // Calculate stats
    const totalQuizzes = quizAttempts.length;
    const passedQuizzes = quizAttempts.filter((a: any) => a.passed).length;
    const totalAssignments = assignmentSubmissions.length;
    const gradedAssignments = assignmentSubmissions.filter((s: any) => s.status === 'graded').length;

    const avgQuizScore = quizAttempts.length > 0
      ? quizAttempts.reduce((sum: number, a: any) => sum + a.percentage, 0) / quizAttempts.length
      : 0;

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
    console.error('Fetch grades error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grades' },
      { status: 500 }
    );
  }
}
