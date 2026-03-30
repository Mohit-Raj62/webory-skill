import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Simulator from "@/models/Simulator";
import SimulatorSession from "@/models/SimulatorSession";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        
        const { searchParams } = new URL(request.url);
        const difficulty = searchParams.get("difficulty");
        const taskId = searchParams.get("taskId");
        const studentId = searchParams.get("studentId");
        
        // Import User model for role checking
        require("@/models/User");
        const User = (await import("@/models/User")).default;

        let userId = null;
        let isAdmin = false;
        try {
            const rawId = await getDataFromToken(request as any);
            const authUser = await User.findById(rawId);
            if (authUser) {
                userId = rawId;
                isAdmin = authUser.role === "admin";
            }
        } catch (e) {}

        // Admin override: lookup session for student instead of self
        if (isAdmin && studentId) {
            userId = studentId;
        }

        if (taskId) {
            // Fetch Internship Task as Simulator Scenario
            require("@/models/InternshipTask");
            require("@/models/InternshipSubmission");
            const InternshipTask = (await import("@/models/InternshipTask")).default;
            const InternshipSubmission = (await import("@/models/InternshipSubmission")).default;

            const task = await InternshipTask.findById(taskId).lean() as any;
            if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

            let lastSession = null;
            if (userId) {
                const submission = await InternshipSubmission.findOne({ task: taskId, student: userId }).lean() as any;
                if (submission) {
                    lastSession = {
                        code: submission.finalCode,
                        status: submission.status === "approved" ? "DONE" : "IN_PROGRESS"
                    };
                }
            }

            // Map InternshipTask to SimulatorData format
            const data = {
                _id: task._id,
                role: task.title,
                company: "Internship Project",
                emails: task.emails || [],
                tasks: [{ id: "TASK-1", title: task.title, desc: task.description, priority: "High" }],
                initialCode: task.initialCode || "",
                expectedRegex: task.expectedRegex || "",
                hints: task.hints || [],
                lastSession
            };

            return NextResponse.json({ success: true, data: [data] });
        }

        const simulators = await Simulator.find(difficulty ? { difficulty } : {}).sort({ createdAt: -1 }).lean() as any[];
        
        const dataWithProgress = await Promise.all(simulators.map(async (sim) => {
            const id = sim._id.toString();
            let lastSession = null;
            let completed = false;

            if (userId) {
                const session = await SimulatorSession.findOne({ userId, scenarioId: id }).sort({ createdAt: -1 }).lean() as any;
                if (session) {
                    lastSession = {
                        code: session.finalCode,
                        status: session.taskStatus
                    };
                    completed = session.passed;
                }
            }

            return {
                ...sim,
                completed,
                lastSession
            };
        }));

        return NextResponse.json({ success: true, data: dataWithProgress });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
