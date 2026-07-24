import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Internship from "@/models/Internship";
import Enrollment from "@/models/Enrollment";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// DELETE internship
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Verify ownership
    const internship = await Internship.findOne({
      _id: id,
      $or: [{ instructor: decoded.userId }, { coInstructors: decoded.userId }],
    });
    if (!internship) {
      return NextResponse.json(
        {
          error: "Internship not found or you do not have permission to delete it",
        },
        { status: 404 },
      );
    }

    // Delete enrollments for this internship
    await Enrollment.deleteMany({ internship: id });

    // Delete internship
    await Internship.findByIdAndDelete(id);

    const { logActivity } = await import("@/lib/logger");
    await logActivity(
      decoded.userId || decoded.id,
      "DELETE_COURSE",
      `Deleted internship: ${internship.title} (${id})`,
      req.headers.get("x-forwarded-for") || "unknown",
    );

    return NextResponse.json({ message: "Internship deleted successfully" });
  } catch (error) {
    console.error("Delete internship error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Update internship
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const data = await req.json();

    // Verify ownership
    const existingInternship = await Internship.findOne({
      _id: id,
      $or: [{ instructor: decoded.userId }, { coInstructors: decoded.userId }],
    });
    if (!existingInternship) {
      return NextResponse.json(
        { error: "Internship not found or you do not have permission to edit it" },
        { status: 404 },
      );
    }

    // Handle module-based updates
    if (data.modules && data.modules.length > 0) {
      // Flatten modules to videos array for backward compatibility
      const flattenedVideos = data.modules
        .sort((a: any, b: any) => a.order - b.order)
        .flatMap((module: any) => module.videos || []);
      data.videos = flattenedVideos;
    }

    const internship = await Internship.findByIdAndUpdate(id, data, { new: true });

    const { logActivity } = await import("@/lib/logger");
    await logActivity(
      decoded.userId || decoded.id,
      "UPDATE_COURSE",
      `Updated internship: ${data.title || internship?.title || id}`,
      req.headers.get("x-forwarded-for") || "unknown",
    );

    return NextResponse.json({ internship });
  } catch (error) {
    console.error("Update internship error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
