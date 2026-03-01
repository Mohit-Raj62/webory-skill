import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData: any = await req.formData();
    const file = formData.get("file") as File;
    const empId = formData.get("empId") as string;
    const empName = formData.get("empName") as string;
    const documentType = formData.get("documentType") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!documentType) {
      return NextResponse.json(
        { error: "Document type is required" },
        { status: 400 },
      );
    }

    // Validate file type - PDF/JPG only
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only PDF and JPG/PNG files are allowed." },
        { status: 400 },
      );
    }

    // Validate file size - max 5MB
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be under 5MB." },
        { status: 400 },
      );
    }

    // Build auto-renamed filename: EmpID_Name_Document
    const sanitizedName = (empName || "Unknown")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_");
    const sanitizedDocType = documentType
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_");
    const ext = file.type === "application/pdf" ? "pdf" : "jpg";
    const autoFileName = `${empId || "TEMP"}_${sanitizedName}_${sanitizedDocType}.${ext}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary as authenticated (no public link)
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "kyc-documents",
          type: "authenticated",
          public_id: `${Date.now()}-${autoFileName.replace(/\.[^/.]+$/, "")}.txt`,
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary KYC upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        },
      );
      uploadStream.end(buffer);
    });

    // Generate signed URL
    const signedUrl = cloudinary.url(result.public_id, {
      resource_type: "raw",
      type: "authenticated",
      sign_url: true,
      version: result.version,
    });

    // Return proxy URL for privacy
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl || !baseUrl.startsWith("http")) {
      const host = req.headers.get("host");
      const protocol = req.headers.get("x-forwarded-proto") || "http";
      baseUrl = `${protocol}://${host}`;
    }

    const proxyUrl = `${baseUrl}/api/view-pdf?url=${encodeURIComponent(signedUrl)}&filename=${encodeURIComponent(autoFileName)}`;

    return NextResponse.json({
      url: proxyUrl,
      publicId: result.public_id,
      fileName: autoFileName,
      success: true,
    });
  } catch (error: any) {
    console.error("KYC document upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 },
    );
  }
}
