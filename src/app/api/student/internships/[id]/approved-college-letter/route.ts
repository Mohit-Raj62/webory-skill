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

const approvedStampSvg = `
<svg width="220" height="110" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="distress" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 -1.2" in="noise" result="coloredNoise" />
      <feComposite operator="in" in="SourceGraphic" in2="coloredNoise" result="composite" />
    </filter>
  </defs>
  <g transform="translate(10, 10) rotate(-3)">
    <!-- Box with simulated broken ink (distress) -->
    <rect x="0" y="0" width="200" height="90" fill="none" stroke="#003366" stroke-width="4" rx="4" stroke-dasharray="100 1 50 2 20 1" opacity="0.85" />
    <rect x="4" y="4" width="192" height="82" fill="none" stroke="#003366" stroke-width="1.5" rx="2" stroke-dasharray="40 1 20 1 80 2" opacity="0.8" />
    
    <text x="100" y="22" font-family="'Times New Roman', serif" font-size="12" font-weight="bold" letter-spacing="3" fill="#003366" text-anchor="middle" opacity="0.9">WEBORY SKILLS</text>
    
    <line x1="15" y1="30" x2="185" y2="30" stroke="#003366" stroke-width="1.5" stroke-dasharray="50 1 30 1" opacity="0.8" />
    
    <text x="100" y="58" font-family="'Arial Black', Impact, sans-serif" font-size="28" font-weight="900" letter-spacing="4" fill="#003366" text-anchor="middle" opacity="0.85">APPROVED</text>
    
    <line x1="15" y1="68" x2="185" y2="68" stroke="#003366" stroke-width="1.5" stroke-dasharray="20 1 60 1" opacity="0.8" />
    
    <text x="50" y="82" font-family="Courier, monospace" font-size="10" font-weight="bold" fill="#003366" opacity="0.8">DATE:</text>
    <line x1="85" y1="82" x2="175" y2="82" stroke="#003366" stroke-width="1" stroke-dasharray="2 2" opacity="0.8" />
  </g>
</svg>
`;

const signatureStampSvg = `
<svg width="350" height="150" xmlns="http://www.w3.org/2000/svg">
  <g transform="rotate(-1)">
    <!-- Round Corporate Seal with 'ink-bleed' dashed strokes -->
    <g transform="translate(75, 75)">
      <circle cx="0" cy="0" r="55" fill="none" stroke="#003366" stroke-width="1.5" stroke-dasharray="2 2" opacity="0.8" />
      <circle cx="0" cy="0" r="50" fill="none" stroke="#003366" stroke-width="3" stroke-dasharray="100 1 40 1 80 2" opacity="0.85" />
      <circle cx="0" cy="0" r="32" fill="none" stroke="#003366" stroke-width="1" stroke-dasharray="50 1 20 1" opacity="0.8" />
      
      <!-- Arched text using individual letters for absolute precision in sharp/librsvg -->
      <text x="0" y="-12" font-family="'Times New Roman', serif" font-size="18" font-weight="900" fill="#003366" text-anchor="middle" opacity="0.9">WEBORY</text>
      <text x="0" y="6" font-family="'Arial', sans-serif" font-size="10" letter-spacing="3" fill="#003366" text-anchor="middle" opacity="0.85">SKILLS</text>
      <line x1="-20" y1="14" x2="20" y2="14" stroke="#003366" stroke-width="1" opacity="0.7"/>
      <text x="0" y="24" font-family="'Arial', sans-serif" font-size="6" letter-spacing="1" font-weight="bold" fill="#003366" text-anchor="middle" opacity="0.8">OFFICIAL SEAL</text>
    </g>
    <!-- Signature Block -->
    <g transform="translate(160, 20)">
      <!-- Highly realistic signature with varying thickness and opacity -->
      <path d="M 15,60 C 25,25 30,10 40,55 C 45,75 50,35 60,30 C 65,25 75,55 85,60 C 95,65 100,45 110,50 C 120,55 125,70 135,65 C 145,60 150,45 155,45 C 160,45 160,60 165,55" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" />
      
      <!-- Expressive ink swirl/flourish -->
      <path d="M 5,75 Q 80,95 160,70 C 150,85 120,85 100,80" fill="none" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
      
      <rect x="0" y="5" width="180" height="100" fill="none" stroke="#475569" stroke-width="0.75" stroke-dasharray="3 3" opacity="0.5" />
      
      <text x="90" y="88" font-family="'Helvetica', 'Arial', sans-serif" font-size="11" font-weight="900" letter-spacing="1.5" fill="#1e293b" text-anchor="middle">AUTHORIZED SIGNATORY</text>
      <text x="90" y="100" font-family="'Helvetica', 'Arial', sans-serif" font-size="9" font-style="italic" fill="#475569" text-anchor="middle">Webory Skills Pvt. Ltd.</text>
    </g>
  </g>
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
                x: width - 240,
                y: height - 130,
                width: 220,
                height: 110,
            });

            // Draw bottom stamp (bottom right)
            firstPage.drawImage(bottomStampImage, {
                x: width - 380,
                y: 180,
                width: 350,
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
    headers.set("Content-Disposition", `attachment; filename="Approved_NOC_${application.student.toString()}.${extension}"`);

    return new NextResponse(finalFileBuffer, {
        status: 200,
        headers,
    });

  } catch (error: any) {
    console.error("=== APPROVED LETTER API Error ===", error);
    return NextResponse.json(
      {
        error: `Server error: ${error.message}`
      },
      { status: 500 }
    );
  }
}
