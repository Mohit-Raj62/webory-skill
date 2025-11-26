import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Assignment from '@/models/Assignment';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// GET - Fetch all assignments for a course
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const assignments = await Assignment.find({ courseId: id, isActive: true }).sort({ createdAt: -1 });

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Fetch assignments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}

// POST - Create new assignment
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const data = await req.json();

    const assignment = await Assignment.create({
      ...data,
      courseId: id,
    });

    return NextResponse.json({ assignment });
  } catch (error) {
    console.error('Create assignment error:', error);
    return NextResponse.json(
      { error: 'Failed to create assignment' },
      { status: 500 }
    );
  }
}
