import { RoomServiceClient } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Temporary in-memory store for blocked users (For production, move to MongoDB)
if (!(global as any).blockedParticipants) {
  (global as any).blockedParticipants = new Map<string, Set<string>>(); // roomId -> Set<identities>
}

const getUserFromToken = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload; 
  } catch (error) {
    return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    // Only teachers or admins can moderate
    if (!user || (user.role !== "teacher" && user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { action, room, identity } = await req.json();

    if (!room || !identity || !action) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const svc = new RoomServiceClient(wsUrl, apiKey, apiSecret);

    if (action === "remove" || action === "block") {
      // Remove participant from the active room
      await svc.removeParticipant(room, identity);

      if (action === "block") {
        // Add to blocklist
        const blockedMap = (global as any).blockedParticipants as Map<string, Set<string>>;
        if (!blockedMap.has(room)) {
          blockedMap.set(room, new Set());
        }
        blockedMap.get(room)!.add(identity);
      }
      
      return NextResponse.json({ success: true, message: `Participant ${action}ed` });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Moderation error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
