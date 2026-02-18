import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    // Check if Cloudinary is configured
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Cloudinary credentials missing");
      return NextResponse.json(
        {
          error:
            "Cloudinary not configured. Please add credentials to .env.local",
        },
        { status: 500 },
      );
    }

    const formData: any = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Uploading PDF:", file.name, "Size:", file.size, "bytes");

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Workaround: Rename to .txt, upload as raw authenticated, serve via proxy
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          type: "authenticated",
          folder: "course-pdfs",
          public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_")}.txt`, // Force .txt extension
          use_filename: true,
          unique_filename: false,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Upload successful:", result);
            resolve(result);
          }
        },
      );
      uploadStream.end(buffer);
    });

    // Generate Signed URL for the .txt file
    const signedUrl = cloudinary.url(result.public_id, {
      resource_type: "raw",
      type: "authenticated",
      sign_url: true,
      version: result.version,
    });

    // Return Proxy URL
    // Determine base URL dynamically from request to support both localhost and production
    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    // Include filename in proxy URL
    const proxyUrl = `${baseUrl}/api/view-pdf?url=${encodeURIComponent(signedUrl)}&filename=${encodeURIComponent(file.name)}`;

    return NextResponse.json({
      url: proxyUrl, // Return proxy URL as the file URL
      publicId: result.public_id,
      fileName: file.name,
      fileSize: file.size,
      cloudinaryId: result.public_id,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    console.error("Error details:", error.message);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}
