import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string; videoIndex: string }> }
) {
  try {
    const params = await props.params;
    const courseId = params.id;
    const videoIndex = parseInt(params.videoIndex);

    await dbConnect();

    // Get user from token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Find enrollment
    const enrollment = await Enrollment.findOne({
      student: decoded.userId,
      course: courseId,
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Get notes for this video
    const videoNotes =
      enrollment.notes?.filter((note: any) => note.videoIndex === videoIndex) ||
      [];

    return NextResponse.json({ notes: videoNotes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string; videoIndex: string }> }
) {
  try {
    const params = await props.params;
    const courseId = params.id;
    const videoIndex = parseInt(params.videoIndex);
    const { content, timestamp } = await req.json();

    await dbConnect();

    // Get user from token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Get course to get video title
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const video = course.videos[videoIndex];
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Find enrollment
    const enrollment = await Enrollment.findOne({
      student: decoded.userId,
      course: courseId,
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Add new note
    const newNote = {
      videoIndex,
      videoTitle: video.title,
      content,
      timestamp: timestamp || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!enrollment.notes) {
      enrollment.notes = [];
    }

    enrollment.notes.push(newNote);
    await enrollment.save();

    return NextResponse.json({
      success: true,
      note: newNote,
      message: "Note saved successfully",
    });
  } catch (error) {
    console.error("Error saving note:", error);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ id: string; videoIndex: string }> }
) {
  try {
    const params = await props.params;
    const courseId = params.id;
    const videoIndex = parseInt(params.videoIndex);
    const { noteId } = await req.json();

    await dbConnect();

    // Get user from token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Find enrollment and remove note
    const enrollment = await Enrollment.findOne({
      student: decoded.userId,
      course: courseId,
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 }
      );
    }

    // Remove note by index (noteId is the index in the array)
    if (enrollment.notes && enrollment.notes[noteId]) {
      enrollment.notes.splice(noteId, 1);
      await enrollment.save();
    }

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
