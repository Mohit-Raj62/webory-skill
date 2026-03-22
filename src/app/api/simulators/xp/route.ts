import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const userId = await getDataFromToken(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { xp = 50 } = body;

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        user.xp = (user.xp || 0) + xp;
        await user.save();

        return NextResponse.json({ success: true, newXp: user.xp, message: `Awarded ${xp} XP!` });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
