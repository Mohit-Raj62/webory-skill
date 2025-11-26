import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import Doubt from '@/models/Doubt';
import User from '@/models/User';

// Answer a doubt (admin only)
export async function PATCH(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const doubtId = params.id;
        const { answer } = await req.json();

        if (!answer || !answer.trim()) {
            return NextResponse.json({ error: 'Answer is required' }, { status: 400 });
        }

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

        // Update doubt with answer
        const doubt = await Doubt.findByIdAndUpdate(
            doubtId,
            {
                answer: answer.trim(),
                answeredBy: decoded.userId,
                status: 'answered',
                answeredAt: new Date(),
            },
            { new: true }
        )
            .populate('student', 'name email')
            .populate('course', 'title')
            .populate('answeredBy', 'name email');

        if (!doubt) {
            return NextResponse.json({ error: 'Doubt not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            doubt,
            message: 'Doubt answered successfully'
        });
    } catch (error) {
        console.error('Error answering doubt:', error);
        return NextResponse.json({ error: 'Failed to answer doubt' }, { status: 500 });
    }
}

// Delete a doubt (admin only)
export async function DELETE(
    req: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const doubtId = params.id;

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

        // Delete doubt
        const doubt = await Doubt.findByIdAndDelete(doubtId);

        if (!doubt) {
            return NextResponse.json({ error: 'Doubt not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Doubt deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting doubt:', error);
        return NextResponse.json({ error: 'Failed to delete doubt' }, { status: 500 });
    }
}
