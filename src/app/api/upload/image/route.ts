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
        { status: 500 }
      );
    }

    const formData: any = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "course-thumbnails";
    const noCrop = formData.get("noCrop") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log(`Uploading image to ${folder}:`, file.name, "Size:", file.size, "bytes");

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dynamic transformation based on noCrop
    const transformation = noCrop 
      ? [
          { width: 2000, height: 2000, crop: "limit" }, // Preserve original ratio, just resize if massive
          { quality: "auto" },
          { fetch_format: "auto" },
        ]
      : [
          { width: 1200, height: 630, crop: "fill" }, // Default course thumbnail crop
          { quality: "auto" },
          { fetch_format: "auto" },
        ];

    // Upload using upload_stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: folder,
          transformation: transformation,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    console.log("Upload successful:", (result as any).secure_url);

    return NextResponse.json({
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    console.error("Error details:", error.message);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 }
    );
  }
}
