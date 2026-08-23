import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import dbConnect from "@/lib/db";
import LiveSession from "@/models/LiveSession";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";

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

  // Fetch session to check rules and get inviteCode
  let session = null;
  try {
    await dbConnect();
    session = await LiveSession.findOne({ roomId: room }).lean();
  } catch (err) {
    console.error("Error finding live session:", err);
  }

  const inviteCode = req.nextUrl.searchParams.get("inviteCode");
  const isInvited = inviteCode && session?.inviteCode && inviteCode === session.inviteCode;

  // Get user from our custom auth to assign correct identity
  const user = await getUserFromToken(req);

  // Require login to join if not invited
  if (!user && !isInvited) {
    return NextResponse.json({ error: "You must be logged in to join a live session unless you have an invite code." }, { status: 401 });
  }

  const hasFullControl = user && (user.role === "teacher" || user.role === "admin" || isHost);

  if (!session && !hasFullControl) {
    return NextResponse.json({ error: "Live session not found." }, { status: 404 });
  }

  // Authorization Check for Students
  if (!hasFullControl && session && !isInvited) {
    try {
      if (session.sessionType === "course" && session.courseId) {
        const isEnrolled = await Enrollment.exists({
            student: user?.userId,
            course: session.courseId
        });
        if (!isEnrolled) {
            return NextResponse.json({ error: "You are not enrolled in this course." }, { status: 403 });
        }
      } else if (session.sessionType === "internship" && session.internshipId) {
        const isAccepted = await Application.exists({
            student: user?.userId,
            internship: session.internshipId,
            status: "accepted"
        });
        if (!isAccepted) {
            return NextResponse.json({ error: "You do not have access to this internship session." }, { status: 403 });
        }
      } else if (session.sessionType === "interview" && session.applicationId) {
        const isInterviewCandidate = await Application.exists({
            _id: session.applicationId,
            student: user?.userId
        });
        if (!isInterviewCandidate) {
            return NextResponse.json({ error: "This is not your scheduled interview session." }, { status: 403 });
        }
      } else if (session.sessionType === "group-interview" && session.applicationIds && session.applicationIds.length > 0) {
        const isInterviewCandidate = await Application.exists({
            _id: { $in: session.applicationIds },
            student: user?.userId
        });
        if (!isInterviewCandidate) {
            return NextResponse.json({ error: "This is not your scheduled group interview session." }, { status: 403 });
        }
      }
    } catch (err) {
      console.error("Error authorizing live session:", err);
      return NextResponse.json({ error: "Internal server error during authorization." }, { status: 500 });
    }
  }
  
  // Extract a clean name from the user object if possible
  let derivedName = "Student";
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

  return NextResponse.json({ token: await at.toJwt(), inviteCode: session?.inviteCode });
}
