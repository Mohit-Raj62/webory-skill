import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import cloudinary from "@/lib/cloudinary";
import { extractPublicId } from "@/lib/cloudinary-utils";

export const maxDuration = 300; // 5 minutes (Vercel limit)

export async function POST(req: Request) {
  try {
    await dbConnect();

    // 1. Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // 2. Fetch all used URLs from Database (Courses & Users)
    const usedUrls = new Set<string>();

    // Courses
    const courses = await Course.find({})
      .select("thumbnail certificateImage videos modules pdfResources")
      .lean();
    courses.forEach((course: any) => {
      if (course.thumbnail) usedUrls.add(course.thumbnail);
      if (course.certificateImage) usedUrls.add(course.certificateImage);

      // Videos
      if (course.videos)
        course.videos.forEach((v: any) => v.url && usedUrls.add(v.url));

      // Modules
      if (course.modules) {
        course.modules.forEach((mod: any) => {
          if (mod.videos)
            mod.videos.forEach((v: any) => v.url && usedUrls.add(v.url));
        });
      }

      // PDF Resources
      if (course.pdfResources) {
        course.pdfResources.forEach(
          (pdf: any) => pdf.fileUrl && usedUrls.add(pdf.fileUrl)
        );
      }
    });

    // Users (Avatars)
    const users = await User.find({}).select("avatar").lean();
    users.forEach((user: any) => {
      if (user.avatar) usedUrls.add(user.avatar);
    });

    // 3. Convert Used URLs to Public IDs
    const usedPublicIds = new Set<string>();
    usedUrls.forEach((url) => {
      const pid = extractPublicId(url);
      if (pid) usedPublicIds.add(pid);
    });

    console.log(`Found ${usedPublicIds.size} used assets in database.`);

    // 4. Scan Cloudinary Folders
    // Use a comprehensive set of folders
    const foldersToScan = [
      "", // Root folder
      "course-videos",
      "course-thumbnails",
      "course-pdfs",
      "assignment-files",
      "resumes",
      "My Brand",
    ];

    // Scan logic
    const orphansByType: { [key: string]: string[] } = {
      image: [],
      video: [],
      raw: [],
    };
    let scannedCount = 0;

    for (const folder of foldersToScan) {
      let nextCursor = null;
      // Search for all resource types in each folder
      const types = ["image", "video", "raw"];

      for (const type of types) {
        do {
          try {
            const result: any = await cloudinary.api.resources({
              type: "upload",
              prefix: folder,
              resource_type: type,
              max_results: 500,
              next_cursor: nextCursor,
            });

            if (result.resources) {
              result.resources.forEach((res: any) => {
                // Check if exact public_id matches
                scannedCount++;
                if (!usedPublicIds.has(res.public_id)) {
                  orphansByType[type].push(res.public_id);
                }
              });
            }
            nextCursor = result.next_cursor;
          } catch (e) {
            // Ignore errors (e.g., folder not found for specific type)
            nextCursor = null;
          }
        } while (nextCursor);
      }
    }

    // Execute Deletion
    let totalDeleted = 0;
    for (const type of ["image", "video", "raw"]) {
      const ids = orphansByType[type];

      // Remove duplicates
      const uniqueIds = Array.from(new Set(ids));

      if (uniqueIds.length > 0) {
        console.log(`Deleting ${uniqueIds.length} orphaned ${type}s...`);

        // Chunk into 100s
        for (let i = 0; i < uniqueIds.length; i += 100) {
          const chunk = uniqueIds.slice(i, i + 100);
          try {
            await cloudinary.api.delete_resources(chunk, {
              resource_type: type,
            });
            totalDeleted += chunk.length;
          } catch (err) {
            console.error(`Failed to delete chunk of ${type}s:`, err);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleanup complete. Scanned ${scannedCount} assets. Deleted ${totalDeleted} orphans.`,
      details: {
        scanned: scannedCount,
        deleted: totalDeleted,
        types: {
          images: orphansByType["image"].length,
          videos: orphansByType["video"].length,
          raw: orphansByType["raw"].length,
        },
      },
    });
  } catch (error: any) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: error.message || "Cleanup failed" },
      { status: 500 }
    );
  }
}
