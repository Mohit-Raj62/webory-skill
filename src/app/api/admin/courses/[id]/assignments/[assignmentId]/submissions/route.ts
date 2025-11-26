import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AssignmentSubmission from '@/models/AssignmentSubmission';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// GET - Fetch all submissions for an assignment
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

    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { assignmentId } = await params;

    const submissions = await AssignmentSubmission.find({ assignmentId })
      .populate('userId', 'name email')
      .sort({ submittedAt: -1 });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
