import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Simulator from "@/models/Simulator";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        
        const { searchParams } = new URL(request.url);
        const difficulty = searchParams.get("difficulty");
        
        let query = {};
        if (difficulty) {
            query = { difficulty };
        }

        const simulators = await Simulator.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: simulators });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
