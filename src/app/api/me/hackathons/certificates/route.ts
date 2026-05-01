import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import HackathonSubmission from "@/models/HackathonSubmission";
import User from "@/models/User";
import "@/models/CustomCertificate";
import "@/models/Hackathon";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Auth Check
    const userId = await getDataFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
    }

    // 1. Get user email for lookup in team certificates
    const user = await User.findById(userId);
    const userEmail = user?.email;

    // 2. Fetch submissions where user is owner OR a team member with a certificate
    const submissions = await HackathonSubmission.find({ 
      $and: [
        {
          $or: [
            { userId },
            { teamMembers: userId },
            { "certificates.email": userEmail }
          ]
        },
        {
          $or: [
            { certificateId: { $exists: true, $ne: null } },
            { "certificates.certificateId": { $exists: true, $ne: null } }
          ]
        }
      ]
    })
    .populate("hackathonId", "title theme bannerImage startDate status collaborations signatures")
    .populate("certificateId")
    .populate("certificates.certificateId")
    .sort({ createdAt: -1 })
    .lean();

    // 3. Format to ensure the 'certificateId' field points to the specific certificate for THIS user
    const data = submissions.map(sub => {
      let personalCert = null;
      
      // Check if user is in team certificates
      if (sub.certificates && sub.certificates.length > 0) {
        personalCert = sub.certificates.find((c: any) => c.email === userEmail)?.certificateId;
      }
      
      // Fallback to primary certificate if not found in list and user is the owner
      if (!personalCert && sub.userId.toString() === userId.toString()) {
        personalCert = sub.certificateId;
      }

      return {
        ...sub,
        certificateId: personalCert
      };
    }).filter(s => s.certificateId); // Only return if they actually have a certificate assigned to them

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("ME_CERTIFICATES_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
