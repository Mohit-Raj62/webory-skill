import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import SimulatorSession from "@/models/SimulatorSession";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { scenarioId, taskId, timeTakenSeconds, passed, playback, finalCode, taskStatus } = body;

        if (taskId) {
            // Import model using side-effect to ensure registration
            require("@/models/InternshipSubmission");
            require("@/models/InternshipTask");
            const InternshipSubmission = (await import("@/models/InternshipSubmission")).default;

            // This is an Internship Task Submission from WeboryOS
            const submission = await InternshipSubmission.findOneAndUpdate(
                { student: userId, task: taskId },
                {
                    student: userId,
                    task: taskId,
                    finalCode,
                    playback,
                    status: passed ? "approved" : "pending",
                    submittedAt: new Date()
                },
                { upsert: true, new: true }
            );

            return NextResponse.json({ success: true, submissionId: submission._id, message: "Internship task progress saved." });
        } else {
            // Generic Simulator Scenario
            const session = await SimulatorSession.create({
                userId,
                scenarioId,
                timeTakenSeconds,
                passed,
                playback,
                finalCode,
                taskStatus: taskStatus || (passed ? "DONE" : "IN_PROGRESS")
            });
            return NextResponse.json({ success: true, sessionId: session._id, message: "Session recorded for recruiter replay." });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
