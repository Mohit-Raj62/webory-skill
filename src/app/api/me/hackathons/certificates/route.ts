import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import HackathonSubmission from "@/models/HackathonSubmission";
import CustomCertificate from "@/models/CustomCertificate";
import Hackathon from "@/models/Hackathon";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Auth Check
    const userId = await getDataFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
    }

    // Fetch submissions that have a certificate
    const submissions = await HackathonSubmission.find({ 
        userId, 
        certificateId: { $exists: true, $ne: null } 
    })
    .populate("hackathonId", "title theme bannerImage startDate status")
    .populate("certificateId")
    .sort({ createdAt: -1 })
    .lean();

    return NextResponse.json({
      success: true,
      data: submissions,
    });
  } catch (error: any) {
    console.error("ME_CERTIFICATES_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
