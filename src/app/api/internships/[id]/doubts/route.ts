import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import dbConnect from '@/lib/db';
import Doubt from '@/models/Doubt';
import Internship from '@/models/Internship';

// Get all doubts for a internship (student's own doubts)
export async function GET(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const params = await props.params;
        
        let actualInternshipId = params.id;
        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            const internship = await Internship.findOne({ slug: params.id }).select('_id');
            if (!internship) return NextResponse.json({ error: "Internship not found" }, { status: 404 });
            actualInternshipId = internship._id.toString();
        }
        const internshipId = actualInternshipId;

        // Get user from token
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        // Get doubts for this student and internship
        const doubts = await Doubt.find({
            student: decoded.userId,
            internship: internshipId
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
        await dbConnect();
        const params = await props.params;
        
        let actualInternshipId = params.id;
        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            const internship = await Internship.findOne({ slug: params.id }).select('_id');
            if (!internship) return NextResponse.json({ error: "Internship not found" }, { status: 404 });
            actualInternshipId = internship._id.toString();
        }
        const internshipId = actualInternshipId;

        const { question, videoIndex, videoTitle } = await req.json();

        if (!question || !question.trim()) {
            return NextResponse.json({ error: 'Question is required' }, { status: 400 });
        }

        // Get user from token
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        // Verify internship exists
        const internship = await Internship.findById(internshipId);
        if (!internship) {
            return NextResponse.json({ error: 'Internship not found' }, { status: 404 });
        }

        // Create new doubt
        const doubt = await Doubt.create({
            student: decoded.userId,
            internship: internshipId,
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
