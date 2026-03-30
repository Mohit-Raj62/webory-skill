import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hackathon from "@/models/Hackathon";
import HackathonSubmission from "@/models/HackathonSubmission";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Get all non-archived hackathons
    const hackathons = await Hackathon.find({ isArchived: false })
      .sort({ startDate: -1 })
      .lean();

    // Enhancing the data: Get participant counts for each
    const enhancedHackathons = await Promise.all(
      hackathons.map(async (h: any) => {
        const submissionCount = await HackathonSubmission.countDocuments({
          hackathonId: h._id,
        });
        
        return {
          ...h,
          totalParticipants: h.registeredUsers?.length || 0,
          totalSubmissions: submissionCount,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enhancedHackathons,
    });
  } catch (error: any) {
    console.error("HACKATHON_FETCH_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
