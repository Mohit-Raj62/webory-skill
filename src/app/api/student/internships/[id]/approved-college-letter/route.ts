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
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

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

    // Generate PNG buffers for stamps by dynamically reading the JSON files to bypass webpack import cache
    const topStampRaw = fs.readFileSync(path.join(process.cwd(), 'src/lib/top_stamp.json'), 'utf8');
    const bottomStampRaw = fs.readFileSync(path.join(process.cwd(), 'src/lib/bottom_stamp.json'), 'utf8');
    
    // Parse the JSON string to get the base64 string
    const topStampStr = JSON.parse(topStampRaw);
    const bottomStampStr = JSON.parse(bottomStampRaw);

    const topStampPng = Buffer.from(topStampStr, "base64");
    const bottomStampPng = Buffer.from(bottomStampStr, "base64");

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
