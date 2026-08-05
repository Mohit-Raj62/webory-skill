import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import User from "@/models/User";
import Internship from "@/models/Internship";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

export const dynamic = "force-dynamic";

// SVG for the "APPROVED" top stamp
const approvedStampSvg = `
<svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="180" height="80" fill="rgba(255, 255, 255, 0.7)" stroke="green" stroke-width="5" rx="10" />
  <text x="100" y="55" font-family="Arial" font-size="28" font-weight="bold" fill="green" text-anchor="middle">APPROVED</text>
  <text x="100" y="75" font-family="Arial" font-size="12" fill="green" text-anchor="middle">Webory Skills</text>
</svg>
`;

// SVG for the Signature/Mohar bottom stamp
const signatureStampSvg = `
<svg width="250" height="150" xmlns="http://www.w3.org/2000/svg">
  <circle cx="125" cy="65" r="55" fill="rgba(255, 255, 255, 0.7)" stroke="blue" stroke-width="3" />
  <text x="125" y="60" font-family="Arial" font-size="16" font-weight="bold" fill="blue" text-anchor="middle">WEBORY</text>
  <text x="125" y="80" font-family="Arial" font-size="12" fill="blue" text-anchor="middle">OFFICIAL SEAL</text>
  <line x1="50" y1="130" x2="200" y2="130" stroke="black" stroke-width="2" />
  <text x="125" y="125" font-family="Times New Roman, serif" font-size="24" font-style="italic" fill="#000" text-anchor="middle">Webory Admin</text>
  <text x="125" y="145" font-family="Arial" font-size="10" fill="#333" text-anchor="middle">Authorized Signatory</text>
</svg>
`;

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id: internshipSlugOrId } = params;

    await dbConnect();

    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
      userId = decoded.userId;
    } catch (err) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (!mongoose.models.User) mongoose.model("User", User.schema);
    if (!mongoose.models.Internship) mongoose.model("Internship", Internship.schema);
    if (!mongoose.models.Application) mongoose.model("Application", Application.schema);

    // Resolve internship ID
    let actualInternshipId = internshipSlugOrId;
    if (!mongoose.isValidObjectId(internshipSlugOrId)) {
        const intDoc = await Internship.findOne({ slug: internshipSlugOrId }).select("_id");
        if (!intDoc) {
             return NextResponse.json({ error: "Internship not found" }, { status: 404 });
        }
        actualInternshipId = intDoc._id.toString();
    }

    const application = await Application.findOne({ student: userId, internship: actualInternshipId });

    if (!application) {
      return NextResponse.json(
        { error: "Application record not found for this internship" },
        { status: 404 }
      );
    }

    if (!application.collegeApprovalLetter) {
        return NextResponse.json({ error: "No college approval letter uploaded" }, { status: 404 });
    }

    if (application.status !== "accepted") {
        return NextResponse.json({ error: "Application is not accepted yet" }, { status: 403 });
    }

    // Fetch the actual file
    const fileResponse = await fetch(application.collegeApprovalLetter);
    if (!fileResponse.ok) {
        return NextResponse.json({ error: "Failed to download original document" }, { status: 500 });
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = fileResponse.headers.get("content-type") || "";

    // Generate PNG buffers for stamps
    const topStampPng = await sharp(Buffer.from(approvedStampSvg)).png().toBuffer();
    const bottomStampPng = await sharp(Buffer.from(signatureStampSvg)).png().toBuffer();

    let finalFileBuffer: Buffer;
    let finalContentType = contentType;
    let extension = "pdf";

    // Detect if it's a PDF or Image
    if (contentType.includes("pdf") || application.collegeApprovalLetter.toLowerCase().endsWith(".pdf")) {
        // PDF Processing
        const pdfDoc = await PDFDocument.load(buffer);
        
        // Embed the PNG stamps
        const topStampImage = await pdfDoc.embedPng(topStampPng);
        const bottomStampImage = await pdfDoc.embedPng(bottomStampPng);

        // Add to first page
        const pages = pdfDoc.getPages();
        if (pages.length > 0) {
            const firstPage = pages[0];
            const { width, height } = firstPage.getSize();
            
            // Draw top stamp (top right)
            firstPage.drawImage(topStampImage, {
                x: width - 210,
                y: height - 110,
                width: 200,
                height: 100,
            });

            // Draw bottom stamp (bottom right)
            firstPage.drawImage(bottomStampImage, {
                x: width - 260,
                y: 50,
                width: 250,
                height: 150,
            });
        }

        const pdfBytes = await pdfDoc.save();
        finalFileBuffer = Buffer.from(pdfBytes);
        finalContentType = "application/pdf";
        extension = "pdf";

    } else {
        // Image Processing
        finalContentType = "image/png";
        extension = "png";

        // Get original dimensions to calculate positions
        // Composite stamps
        finalFileBuffer = await sharp(buffer)
            .composite([
                {
                    input: topStampPng,
                    gravity: "northeast", // Top right
                },
                {
                    input: bottomStampPng,
                    gravity: "southeast", // Bottom right
                }
            ])
            .png()
            .toBuffer();
    }

    // Return the modified file as an attachment
    const headers = new Headers();
    headers.set("Content-Type", finalContentType);
    headers.set("Content-Disposition", \`attachment; filename="Approved_NOC_\${application.student.toString()}.\${extension}"\`);

    return new NextResponse(finalFileBuffer, {
        status: 200,
        headers,
    });

  } catch (error: any) {
    console.error("=== APPROVED LETTER API Error ===", error);
    return NextResponse.json(
      {
        error: \`Server error: \${error.message}\`
      },
      { status: 500 }
    );
  }
}
