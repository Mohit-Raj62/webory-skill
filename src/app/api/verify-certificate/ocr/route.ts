import { NextResponse } from "next/server";
import {
  extractCertificateData,
  validateExtractedData,
} from "@/lib/ocr-service";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import CustomCertificate from "@/models/CustomCertificate";
import { detectPhotoManipulation } from "@/lib/image-comparison";

export async function POST(req: Request) {
  try {
    console.log("[OCR API] Starting certificate verification...");

    const formData: any = await req.formData();
    const file = formData.get("certificate") as File;

    if (!file) {
      console.log("[OCR API] No file uploaded");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("[OCR API] File received:", file.name, file.type, file.size);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("[OCR API] Buffer created, size:", buffer.length);

    // Extract data using OCR
    console.log("[OCR API] Starting OCR extraction...");
    const extractedData = await extractCertificateData(buffer);
    console.log("[OCR API] OCR extraction complete:", extractedData);

    // Check for photo manipulation
    let manipulationCheck = {
      isManipulated: false,
      confidence: 0,
      issues: [] as string[],
    };
    try {
      console.log("[OCR API] Checking for manipulation...");
      manipulationCheck = await detectPhotoManipulation(buffer);
      console.log("[OCR API] Manipulation check result:", manipulationCheck);
    } catch (error) {
      console.error("[OCR API] Manipulation check failed:", error);
      // Don't fail the whole request if manipulation check fails
    }

    if (extractedData.confidence < 30) {
      console.log("[OCR API] Low confidence:", extractedData.confidence);
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not extract certificate data. Image quality may be too low.",
          extractedData,
        },
        { status: 400 }
      );
    }

    // If certificate ID was extracted, try to verify
    if (extractedData.certificateId) {
      console.log(
        "[OCR API] Certificate ID found:",
        extractedData.certificateId
      );
      await dbConnect();

      // Search in all certificate sources
      let dbCertificate: any = null;
      let certificateType: "course" | "internship" | "custom" | null = null;

      // Check enrollments
      console.log("[OCR API] Checking enrollments...");
      const enrollment = await Enrollment.findOne({
        certificateId: extractedData.certificateId,
      })
        .populate("student", "firstName lastName")
        .populate("course", "title");

      if (enrollment) {
        console.log("[OCR API] Found in enrollments");
        dbCertificate = {
          studentName: `${enrollment.student.firstName} ${enrollment.student.lastName}`,
          certificateId: enrollment.certificateId,
          courseName: enrollment.course.title,
          issueDate: enrollment.updatedAt.toISOString(),
          certificateKey: enrollment.certificateKey,
        };
        certificateType = "course";
      }

      // Check applications
      if (!dbCertificate) {
        console.log("[OCR API] Checking applications...");
        const application = await Application.findOne({
          certificateId: extractedData.certificateId,
        })
          .populate("student", "firstName lastName")
          .populate("internship", "title");

        if (application) {
          console.log("[OCR API] Found in applications");
          dbCertificate = {
            studentName: `${application.student.firstName} ${application.student.lastName}`,
            certificateId: application.certificateId,
            courseName: application.internship.title,
            issueDate: application.completedAt.toISOString(),
            certificateKey: application.certificateKey,
          };
          certificateType = "internship";
        }
      }

      // Check custom certificates
      if (!dbCertificate) {
        console.log("[OCR API] Checking custom certificates...");
        const customCert = await CustomCertificate.findOne({
          certificateId: extractedData.certificateId,
        });

        if (customCert) {
          console.log("[OCR API] Found in custom certificates");
          dbCertificate = {
            studentName: customCert.studentName,
            certificateId: customCert.certificateId,
            courseName: customCert.title,
            issueDate: customCert.issuedAt.toISOString(),
            certificateKey: customCert.certificateKey,
          };
          certificateType = "custom";
        }
      }

      if (dbCertificate) {
        // Validate extracted data against database
        console.log("[OCR API] Validating extracted data...");
        const validation = validateExtractedData(extractedData, dbCertificate);
        console.log("[OCR API] Validation result:", validation);

        const isAuthentic =
          validation.isValid && !manipulationCheck.isManipulated;
        let message = validation.isValid
          ? "Certificate is authentic and matches database records"
          : "Certificate data does not match database.";

        if (manipulationCheck.isManipulated) {
          message += " Warning: Potential photo manipulation detected.";
        }

        return NextResponse.json({
          success: true,
          extractedData,
          databaseData: dbCertificate,
          validation,
          manipulationCheck,
          certificateType,
          verdict: isAuthentic ? "AUTHENTIC" : "SUSPICIOUS",
          message,
        });
      } else {
        console.log("[OCR API] Certificate not found in database");
        return NextResponse.json(
          {
            success: false,
            extractedData,
            verdict: "INVALID",
            message:
              "Certificate ID not found in database. This certificate may be fake.",
          },
          { status: 404 }
        );
      }
    } else {
      // No certificate ID found, return extracted data only
      console.log("[OCR API] No certificate ID extracted");
      console.log("[OCR API] Raw text length:", extractedData.rawText.length);
      console.log(
        "[OCR API] Raw text preview:",
        extractedData.rawText.substring(0, 500)
      );

      return NextResponse.json({
        success: true,
        extractedData,
        verdict: "UNKNOWN",
        message:
          "Certificate ID could not be extracted from the image. However, other data was found. You can verify manually using the extracted information below, or try using QR code verification instead.",
      });
    }
  } catch (error) {
    console.error("OCR verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process certificate",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 200 }
    );
  }
}
