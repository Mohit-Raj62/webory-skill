import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

// Configure max duration for Vercel (5 minutes)
export const maxDuration = 300;

// Maximum file size: 500MB
const MAX_FILE_SIZE = 500 * 1024 * 1024;

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

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size is ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB`,
        },
        { status: 400 }
      );
    }

    console.log(
      "Uploading video:",
      file.name,
      "Size:",
      (file.size / (1024 * 1024)).toFixed(2),
      "MB"
    );

    console.log(
      "Uploading video:",
      file.name,
      "Size:",
      (file.size / (1024 * 1024)).toFixed(2),
      "MB"
    );

    // Convert file to stream
    const fileStream = file.stream();

    // Upload using upload_stream with optimized settings
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "course-videos",
          timeout: 600000, // 10 minutes timeout for large files
          chunk_size: 6000000, // 6MB chunks for better performance
          eager: [
            {
              quality: "auto",
              format: "mp4",
            },
          ],
          eager_async: true, // Process transformations in background
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Convert Web Stream to Node Stream and pipe to Cloudinary
      // @ts-ignore - Readable.fromWeb is available in Node 18+
      const nodeStream = Readable.fromWeb(fileStream);
      nodeStream.pipe(uploadStream);
    });

    console.log("Upload successful:", (result as any).secure_url);

    return NextResponse.json({
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
      duration: (result as any).duration,
      format: (result as any).format,
      bytes: (result as any).bytes,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    console.error("Error details:", error.message);

    // Provide more specific error messages
    let errorMessage = "Upload failed. Please try again.";

    if (error.message?.includes("timeout")) {
      errorMessage =
        "Upload timed out. Please try a smaller file or check your internet connection.";
    } else if (error.message?.includes("Invalid")) {
      errorMessage =
        "Invalid video file. Please ensure the file is a valid video format.";
    } else if (error.http_code === 420) {
      errorMessage = "Upload limit reached. Please try again later.";
    }

    return NextResponse.json(
      { error: error.message || errorMessage },
      { status: 500 }
    );
  }
}
