import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CustomCertificate from "@/models/CustomCertificate";
import HackathonSubmission from "@/models/HackathonSubmission";
import "@/models/Hackathon";
import "@/models/User";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    // Search by the custom certificateId (e.g., WEBORY-XXXX)
    const certificate = await CustomCertificate.findOne({ certificateId: id }).lean();

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    // Find the linked submission to get project data
    const submission = await HackathonSubmission.findOne({ certificateId: certificate._id })
      .populate("hackathonId", "title collaborations signatures")
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        ...certificate,
        hackathonTitle: (submission?.hackathonId as any)?.title || "Webory Hackathon",
        projectName: submission?.projectName || "Innovative Project",
        type: certificate.title.includes("Champion") ? "winner" : "participant",
        rank: submission?.rank || 0,
        collaborations: certificate.collaborations?.length ? certificate.collaborations : (submission?.hackathonId as any)?.collaborations,
        signatures: certificate.signatures || (submission?.hackathonId as any)?.signatures
      },
    });
  } catch (error: any) {
    console.error("CERTIFICATE_FETCH_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
