import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import LiveSession from "@/models/LiveSession";
import mongoose from "mongoose";
import Internship from "@/models/Internship";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const internshipId = searchParams.get("internshipId");

    if (!internshipId) {
      return NextResponse.json({ error: "Missing internshipId" }, { status: 400 });
    }

    await dbConnect();

    let actualId = internshipId;
    if (!mongoose.isValidObjectId(internshipId)) {
      const internship = await Internship.findOne({ slug: internshipId }).select("_id");
      if (internship) {
        actualId = internship._id.toString();
      }
    }

    // Find any active live session for this internship
    const activeSession = await LiveSession.findOne({
      internshipId: actualId,
      status: "active"
    }).lean();

    return NextResponse.json({
      success: true,
      session: activeSession
    });
  } catch (error) {
    console.error("Error fetching active live session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch active live session" },
      { status: 500 }
    );
  }
}
