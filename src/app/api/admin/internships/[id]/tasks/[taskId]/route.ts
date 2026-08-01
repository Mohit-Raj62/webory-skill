import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import InternshipTask from "@/models/InternshipTask";
import Internship from "@/models/Internship";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// PUT - Update a specific task
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    await dbConnect();
    const { id, taskId } = await params;
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

    const task = await InternshipTask.findOneAndUpdate(
      { _id: taskId, internship: actualId },
      data,
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ task });
  } catch (error) {
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific task
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    await dbConnect();
    const { id, taskId } = await params;

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

    const task = await InternshipTask.findOneAndDelete({
      _id: taskId,
      internship: actualId,
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Optionally delete task submissions if they exist here

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}
