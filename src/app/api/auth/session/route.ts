import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            console.log("Session check failed: No token");
            return NextResponse.json({ valid: false }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, sessionId?: string };
        } catch (e) {
            console.log("Session check failed: Invalid token");
            return NextResponse.json({ valid: false }, { status: 401 });
        }

        if (!decoded.sessionId) {
            console.log("Session check failed: No session ID in token");
            return NextResponse.json({ valid: false }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById(decoded.userId);

        if (!user) {
            console.log("Session check failed: User not found");
            return NextResponse.json({ valid: false }, { status: 401 });
        }

        // Check if session ID matches
        if (user.currentSessionId !== decoded.sessionId) {
            console.log(`Session check failed: Mismatch. DB: ${user.currentSessionId}, Token: ${decoded.sessionId}`);
            return NextResponse.json({ valid: false, reason: "session_mismatch" }, { status: 401 });
        }

        return NextResponse.json({ valid: true }, { status: 200 });
    } catch (error) {
        console.error("Session check error:", error);
        return NextResponse.json({ valid: false }, { status: 500 }); // Changed to 500 to differentiate
    }
}
