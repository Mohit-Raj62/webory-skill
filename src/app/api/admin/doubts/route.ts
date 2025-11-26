import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import Doubt from '@/models/Doubt';
import User from '@/models/User';

// Get all doubts (admin only)
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Get user from token
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        // Check if user is admin
        const user = await User.findById(decoded.userId);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get query parameters for filtering
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const courseId = searchParams.get('courseId');

        // Build query
        const query: any = {};
        if (status) query.status = status;
        if (courseId) query.course = courseId;

        // Get all doubts with populated fields
        const doubts = await Doubt.find(query)
            .sort({ createdAt: -1 })
            .populate('student', 'name email')
            .populate('course', 'title')
            .populate('answeredBy', 'name email');

        return NextResponse.json({ doubts });
    } catch (error) {
        console.error('Error fetching doubts:', error);
        return NextResponse.json({ error: 'Failed to fetch doubts' }, { status: 500 });
    }
}
