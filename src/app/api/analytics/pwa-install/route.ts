import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Settings from "@/models/Settings";

export async function POST(req: Request) {
    try {
        await dbConnect();
        
        // Ensure atomic increment
        const setting = await Settings.findOneAndUpdate(
            { key: "pwa_installs" },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        
        return NextResponse.json({ success: true, count: setting.value });
    } catch (error) {
        console.error("Error tracking PWA install:", error);
        return NextResponse.json({ success: false, error: "Failed to track install" }, { status: 500 });
    }
}
