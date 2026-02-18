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

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Basic validation
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "text/plain", // Allow txt for PDF workaround
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, JPG, PNG allowed." },
        { status: 400 },
      );
    }

    console.log(
      "Uploading resume:",
      file.name,
      "Size:",
      file.size,
      "Type:",
      file.type,
    );

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Workaround: Rename to .txt, upload as raw authenticated, serve via proxy
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "resumes",
          type: "authenticated",
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
    // Use environment variable for base URL if available, else relative path might work if client is on same domain?
    // But email links need absolute URL.
    // We can infer base URL from request headers if needed, but for now we assume client handles relative or we construct absolute.
    // Determine base URL dynamically from request to support both localhost and production
    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const baseUrl = `${protocol}://${host}`;

    // Include filename in proxy URL for better download experience
    const proxyUrl = `${baseUrl}/api/view-pdf?url=${encodeURIComponent(signedUrl)}&filename=${encodeURIComponent(file.name)}`;

    return NextResponse.json({
      url: proxyUrl,
      publicId: result.public_id,
      success: true,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error.message },
      { status: 500 },
    );
  }
}
