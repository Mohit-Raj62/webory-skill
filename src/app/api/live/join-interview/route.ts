import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LiveSession from "@/models/LiveSession";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get("applicationId");

    if (!applicationId) {
      return NextResponse.redirect(new URL("/profile?error=MissingApplicationId", req.url));
    }

    await dbConnect();

    const activeSession = await LiveSession.findOne({
      applicationId: applicationId,
      status: "active"
    }).sort({ createdAt: -1 }).lean();

    if (activeSession) {
      return NextResponse.redirect(new URL(`/live/${activeSession.roomId}`, req.url));
    }

    return NextResponse.redirect(new URL("/profile?error=NoActiveInterviewFound", req.url));
  } catch (error) {
    console.error("Error joining live interview:", error);
    return NextResponse.redirect(new URL("/profile?error=ServerError", req.url));
  }
}
