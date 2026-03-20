import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Simulator from "@/models/Simulator";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        
        const params = await context.params;
        const simulator = await Simulator.findById(params.id);
        
        if (!simulator) {
            return NextResponse.json({ error: "Simulator not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: simulator });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
