import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CustomCertificate from "@/models/CustomCertificate";
import HackathonSubmission from "@/models/HackathonSubmission";
import Hackathon from "@/models/Hackathon";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
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
      .populate("hackathonId", "title")
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        ...certificate,
        hackathonTitle: (submission?.hackathonId as any)?.title || "Webory Hackathon",
        projectName: submission?.projectName || "Innovative Project",
        type: certificate.title.includes("Champion") ? "winner" : "participant",
        rank: submission?.rank || 0
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
