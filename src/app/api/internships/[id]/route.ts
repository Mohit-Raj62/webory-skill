import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Internship from "@/models/Internship";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// PUT - Update internship
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const data = await req.json();

    const internship = await Internship.findByIdAndUpdate(id, data, { new: true });

    return NextResponse.json({ internship });
  } catch (error) {
    console.error("Update internship error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    await dbConnect();
    const url = new URL(req.url);
    const includeUnavailable =
      url.searchParams.get("includeUnavailable") === "true";

    const internshipId = params.id;

    // Non-blocking increment of views, then lean fetch
    let internship;
    if (mongoose.isValidObjectId(internshipId)) {
      internship = await Internship.findByIdAndUpdate(
        internshipId,
        { $inc: { views: 1 } },
        { new: true },
      ).lean();
    } else {
      internship = await Internship.findOneAndUpdate(
        { slug: internshipId },
        { $inc: { views: 1 } },
        { new: true },
      ).lean();
    }

    if (!internship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    if (!internship.isAvailable && !includeUnavailable) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    // Migration logic
    if (
      internship.videos &&
      internship.videos.length > 0 &&
      (!internship.modules || internship.modules.length === 0)
    ) {
      internship.modules = [
        {
          title: "Internship Content",
          description: "All internship videos",
          order: 0,
          videos: internship.videos,
        },
      ];
      Internship.findByIdAndUpdate(internshipId, { modules: internship.modules })
        .exec()
        .catch((e) => console.error(e));
    } else if (internship.modules && internship.modules.length > 0) {
      const flattenedVideos = internship.modules
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .flatMap((module: any) => module.videos || []);

      if (JSON.stringify(internship.videos) !== JSON.stringify(flattenedVideos)) {
        internship.videos = flattenedVideos;
        Internship.findByIdAndUpdate(internshipId, { videos: flattenedVideos })
          .exec()
          .catch((e) => console.error(e));
      }
    }

    return NextResponse.json({ internship }, { status: 200 });
  } catch (error) {
    console.error("Fetch internship error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
