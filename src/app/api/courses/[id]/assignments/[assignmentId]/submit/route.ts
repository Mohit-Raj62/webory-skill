import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AssignmentSubmission from '@/models/AssignmentSubmission';
import Assignment from '@/models/Assignment';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// POST - Submit assignment
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; assignmentId: string }> }
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const { id: courseId, assignmentId } = await params;
    const { submissionText, attachments } = await req.json();

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if already submitted
    const existing = await AssignmentSubmission.findOne({
      assignmentId,
      userId: decoded.userId,
    });

    if (existing) {
      return NextResponse.json({ error: 'Already submitted' }, { status: 400 });
    }

    // Check due date
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const status = now > dueDate ? 'late' : 'submitted';

    const submission = await AssignmentSubmission.create({
      assignmentId,
      userId: decoded.userId,
      courseId,
      submissionText,
      attachments: attachments || [],
      status,
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Submit assignment error:', error);
    return NextResponse.json(
      { error: 'Failed to submit assignment' },
      { status: 500 }
    );
  }
}

// GET - Get student's submission
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string; assignmentId: string }> }
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const { assignmentId } = await params;

    const submission = await AssignmentSubmission.findOne({
      assignmentId,
      userId: decoded.userId,
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Fetch submission error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}
