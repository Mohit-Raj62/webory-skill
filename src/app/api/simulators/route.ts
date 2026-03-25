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
        
        let query = {};
        if (difficulty) {
            query = { difficulty };
        }

        const simulators = await Simulator.find(query).sort({ createdAt: -1 }).lean() as any[];
        
        let userId = null;
        try {
            userId = await getDataFromToken(request as any);
        } catch (e) {
            // Ignore token errors, userId remains null
        }

        let completedScenarioIds = new Set();
        if (userId) {
            const sessions = await SimulatorSession.find({ userId, passed: true }, { scenarioId: 1, createdAt: 1 }).lean() as any[];
            
            const latestCompletions = new Map<string, Date>();
            sessions.forEach(s => {
                const id = s.scenarioId.toString();
                if (!latestCompletions.has(id) || new Date(s.createdAt) > latestCompletions.get(id)!) {
                    latestCompletions.set(id, new Date(s.createdAt));
                }
            });

            simulators.forEach(sim => {
                const id = sim._id.toString();
                if (latestCompletions.has(id)) {
                    const completionDate = latestCompletions.get(id)!;
                    // Provide a 1-minute buffer in case of simultaneous updates
                    const lastUpdated = new Date(sim.updatedAt || sim.createdAt || 0);
                    lastUpdated.setSeconds(lastUpdated.getSeconds() - 60);
                    
                    if (completionDate >= lastUpdated) {
                        completedScenarioIds.add(id);
                    }
                }
            });
        }

        const data = simulators.map(sim => ({
            ...sim,
            completed: completedScenarioIds.has(sim._id.toString())
        }));

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
