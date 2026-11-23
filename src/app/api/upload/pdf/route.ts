import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

async function saveToGridFS(file: File, buffer: Buffer, req: Request) {
  await dbConnect();
  const db = mongoose.connection.db;
  if (!db) throw new Error("Database connection not ready");
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "coursePdfs" });

  const uploadStream = bucket.openUploadStream(file.name, {
    contentType: "application/pdf",
    metadata: {
      originalName: file.name,
      size: file.size,
      uploadedAt: new Date(),
    },
  });

  await new Promise((resolve, reject) => {
    uploadStream.on("finish", resolve);
    uploadStream.on("error", reject);
    uploadStream.end(buffer);
  });

  const fileId = uploadStream.id.toString();

  let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl || !baseUrl.startsWith("http")) {
    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    baseUrl = `${protocol}://${host}`;
  }

  const proxyUrl = `${baseUrl}/api/view-pdf?gridfsId=${fileId}&filename=${encodeURIComponent(file.name)}`;

  return {
    url: proxyUrl,
    publicId: `gridfs-${fileId}`,
    fileName: file.name,
    fileSize: file.size,
    cloudinaryId: `gridfs-${fileId}`,
  };
}

export async function POST(req: Request) {
  try {
    const formData: any = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("Uploading PDF:", file.name, "Size:", file.size, "bytes");

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If file is > 10MB (Cloudinary Free limit is 10485760 bytes), store in MongoDB GridFS!
    if (file.size > 10 * 1024 * 1024) {
      console.log("File size exceeds Cloudinary 10MB limit. Using MongoDB GridFS storage...");
      const gridfsResult = await saveToGridFS(file, buffer, req);
      return NextResponse.json(gridfsResult);
    }

    // Check if Cloudinary is configured
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.warn("Cloudinary credentials missing. Falling back to MongoDB GridFS...");
      const gridfsResult = await saveToGridFS(file, buffer, req);
      return NextResponse.json(gridfsResult);
    }

    // Try uploading to Cloudinary
    try {
      const result: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            type: "authenticated",
            folder: "course-pdfs",
            public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_")}.txt`,
            use_filename: true,
            unique_filename: false,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
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

      let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
      if (!baseUrl || !baseUrl.startsWith("http")) {
        const host = req.headers.get("host");
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        baseUrl = `${protocol}://${host}`;
      }

      const proxyUrl = `${baseUrl}/api/view-pdf?url=${encodeURIComponent(signedUrl)}&filename=${encodeURIComponent(file.name)}`;

      return NextResponse.json({
        url: proxyUrl,
        publicId: result.public_id,
        fileName: file.name,
        fileSize: file.size,
        cloudinaryId: result.public_id,
      });
    } catch (cloudinaryErr: any) {
      console.warn("Cloudinary upload failed (limit hit). Falling back to MongoDB GridFS:", cloudinaryErr.message);
      const gridfsResult = await saveToGridFS(file, buffer, req);
      return NextResponse.json(gridfsResult);
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    console.error("Error details:", error.message);
    return NextResponse.json(
      { error: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}
