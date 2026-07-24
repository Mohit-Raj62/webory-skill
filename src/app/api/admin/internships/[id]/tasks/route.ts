import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import InternshipTask from "@/models/InternshipTask";
import Internship from "@/models/Internship";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// GET - Fetch all tasks for an internship
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let actualId = id;
    if (!mongoose.isValidObjectId(id)) {
      const internship = await Internship.findOne({ slug: id }).select("_id");
      if (internship) {
        actualId = internship._id.toString();
      } else {
        return NextResponse.json({ error: "Internship not found" }, { status: 404 });
      }
    }

    const tasks = await InternshipTask.find({ internship: actualId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Fetch internship tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST - Create new task
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let actualId = id;
    if (!mongoose.isValidObjectId(id)) {
      const internship = await Internship.findOne({ slug: id }).select("_id");
      if (internship) {
        actualId = internship._id.toString();
      } else {
        return NextResponse.json({ error: "Internship not found" }, { status: 404 });
      }
    }

    const task = await InternshipTask.create({
      internship: actualId,
      ...data,
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Create internship task error:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
