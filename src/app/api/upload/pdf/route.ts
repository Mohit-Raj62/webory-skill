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

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Uploading PDF:", file.name, "Size:", file.size, "bytes");

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload using upload_stream
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          type: "upload",
          folder: "course-pdfs",
          use_filename: true,
          unique_filename: true,
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
      fileName: file.name,
      fileSize: file.size,
      cloudinaryId: (result as any).public_id,
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
