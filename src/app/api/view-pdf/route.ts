import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");
    const gridfsId = searchParams.get("gridfsId");
    const filename = searchParams.get("filename") || "document.pdf";
    const isDownload = searchParams.get("download") === "true";
    const safeFilename = filename.replace(/["\r\n]/g, "");
    const disposition = isDownload
      ? `attachment; filename="${safeFilename}"`
      : `inline; filename="${safeFilename}"`;

    // 1. If stored in MongoDB GridFS (for large PDFs > 10MB)
    if (gridfsId) {
      await dbConnect();
      const db = mongoose.connection.db;
      if (!db) {
        return NextResponse.json(
          { error: "Database not connected" },
          { status: 500 }
        );
      }

      const bucket = new mongoose.mongo.GridFSBucket(db, {
        bucketName: "coursePdfs",
      });

      const downloadStream = bucket.openDownloadStream(
        new mongoose.Types.ObjectId(gridfsId)
      );

      const chunks: Buffer[] = [];
      for await (const chunk of downloadStream) {
        chunks.push(chunk);
      }
      const fileBuffer = Buffer.concat(chunks);

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": disposition,
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    if (!fileUrl) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // 2. Fetch the file from Cloudinary (which is .txt but contains PDF data)
    const response = await fetch(fileUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file" },
        { status: response.status }
      );
    }

    const fileBuffer = await response.arrayBuffer();

    // Determine proper content type based on filename extension
    let contentType = "application/pdf";
    const lowerFilename = filename.toLowerCase();
    if (lowerFilename.endsWith(".jpg") || lowerFilename.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } else if (lowerFilename.endsWith(".png")) {
      contentType = "image/png";
    }

    // Return as file with disposition to view or download in browser
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": disposition,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
