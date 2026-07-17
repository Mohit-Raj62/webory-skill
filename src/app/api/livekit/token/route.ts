import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Standard function to parse our custom JWT
const getUserFromToken = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload; // { userId, role, email, etc. }
  } catch (error) {
    return null;
  }
};

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");
  const isHostParam = req.nextUrl.searchParams.get("isHost");
  const isHost = isHostParam === "true";

  if (!room) {
    return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // Get user from our custom auth to assign correct identity
  const user = await getUserFromToken(req);
  
  // If not logged in, they can still join if they provided a username (guest)
  // For production, you might want to block guests, but we allow it for now.
  const participantName = user ? `${user.firstName} ${user.lastName}` : (username || "Guest Student");
  const participantIdentity = user ? user.userId as string : `guest_${Math.random().toString(36).substring(7)}`;

  // Determine permissions based on role
  // Teachers and Admins have full control
  const hasFullControl = user && (user.role === "teacher" || user.role === "admin" || isHost);

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantIdentity,
    name: participantName,
  });

  at.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    // Add admin powers to host
    roomAdmin: hasFullControl ? true : false,
  });

  return NextResponse.json({ token: await at.toJwt() });
}
