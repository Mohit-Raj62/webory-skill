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
        const { scenarioId, timeTakenSeconds, passed, playback } = body;

        const session = await SimulatorSession.create({
            userId,
            scenarioId,
            timeTakenSeconds,
            passed,
            playback
        });

        return NextResponse.json({ success: true, sessionId: session._id, message: "Session recorded for recruiter replay." });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
