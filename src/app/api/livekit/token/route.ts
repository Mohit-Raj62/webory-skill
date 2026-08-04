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
  
  // Extract a clean name from the user object if possible
  let derivedName = "Guest Student";
  if (user) {
    if (user.firstName && user.lastName) derivedName = `${user.firstName} ${user.lastName}`;
    else if (user.firstName) derivedName = user.firstName;
    else if (user.name) derivedName = user.name;
    else if (user.email) derivedName = user.email.split('@')[0];
  } else if (username) {
    derivedName = username;
  }
  
  const participantName = derivedName;
  const participantIdentity = user ? user.userId as string : `guest_${Math.random().toString(36).substring(7)}`;

  // Check if user is blocked from this room
  if ((global as any).blockedParticipants) {
    const blockedMap = (global as any).blockedParticipants as Map<string, Set<string>>;
    if (blockedMap.has(room) && blockedMap.get(room)!.has(participantIdentity)) {
      return NextResponse.json({ error: "You are blocked from this room" }, { status: 403 });
    }
  }

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
