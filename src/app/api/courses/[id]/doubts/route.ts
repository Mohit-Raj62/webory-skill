import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import Doubt from '@/models/Doubt';
import Course from '@/models/Course';
import mongoose from 'mongoose';

// Get all doubts for a course (student's own doubts)
export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const courseId = params.id;

        await dbConnect();

        // Get user from token
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        let course;
        if (mongoose.isValidObjectId(courseId)) {
            course = await Course.findById(courseId).select('_id');
        } else {
            course = await Course.findOne({ slug: courseId }).select('_id');
        }

        if (!course) {
            return NextResponse.json({ doubts: [] });
        }

        const resolvedCourseId = course._id;

        // Get doubts for this student and course
        const doubts = await Doubt.find({
            student: decoded.userId,
            course: resolvedCourseId
        })
            .sort({ createdAt: -1 })
            .populate('answeredBy', 'name email');

        return NextResponse.json({ doubts });
    } catch (error) {
        console.error('Error fetching doubts:', error);
        return NextResponse.json({ error: 'Failed to fetch doubts' }, { status: 500 });
    }
}

// Ask a new doubt
export async function POST(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const courseId = params.id;
        const { question, videoIndex, videoTitle } = await req.json();

        if (!question || !question.trim()) {
            return NextResponse.json({ error: 'Question is required' }, { status: 400 });
        }

        await dbConnect();

        // Get user from token
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        // Verify course exists
        let course;
        if (mongoose.isValidObjectId(courseId)) {
            course = await Course.findById(courseId);
        } else {
            course = await Course.findOne({ slug: courseId });
        }

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const resolvedCourseId = course._id;

        // Create new doubt
        const doubt = await Doubt.create({
            student: decoded.userId,
            course: resolvedCourseId,
            question: question.trim(),
            videoIndex: videoIndex !== undefined ? videoIndex : null,
            videoTitle: videoTitle || '',
            status: 'pending',
        });

        return NextResponse.json({
            success: true,
            doubt,
            message: 'Doubt submitted successfully'
        });
    } catch (error) {
        console.error('Error creating doubt:', error);
        return NextResponse.json({ error: 'Failed to submit doubt' }, { status: 500 });
    }
}
