import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { logActivity } from "@/lib/logger";

// GET - Fetch all courses (for dropdowns/lists)
export async function GET(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin" && decoded.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const courses = await Course.find().select("title _id");

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Fetch courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Create new course
export async function POST(req: Request) {
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

    const data = await req.json();
    const {
      title,
      description,
      level,
      color,
      icon,
      price,
      outcome,
      whoIsThisFor,
      projects,
      careerOutcomes,
    } = data;

    const course = (await Course.create({
      ...data,
      outcome: outcome || "",
      whoIsThisFor: whoIsThisFor || [],
      projects: projects || [],
      careerOutcomes: careerOutcomes || [],
    })) as any;

    // Filter sensitive or too large data for logging
    const { _id, title: savedTitle } = course;
    await logActivity(
      decoded.userId || decoded.id,
      "CREATE_COURSE",
      `Created course: ${savedTitle} (${_id})`,
      req.headers.get("x-forwarded-for") || "unknown",
    );

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
