import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import Internship from "@/models/Internship";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string; videoIndex: string }> }
) {
  try {
        await dbConnect();
    
    const params = await props.params;
    let actualInternshipId = params.id;
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        const internship = await Internship.findOne({ slug: params.id }).select('_id');
        if (!internship) return NextResponse.json({ error: "Internship not found" }, { status: 404 });
        actualInternshipId = internship._id.toString();
    }
    const internshipId = actualInternshipId;

    const videoIndex = parseInt(params.videoIndex);

    // Get user from token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Find application
    const application = await Application.findOne({
      student: decoded.userId,
      internship: internshipId,
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Get notes for this video
    const videoNotes =
      application.notes?.filter((note: any) => note.videoIndex === videoIndex) ||
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
        await dbConnect();
    
    const params = await props.params;
    let actualInternshipId = params.id;
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        const internship = await Internship.findOne({ slug: params.id }).select('_id');
        if (!internship) return NextResponse.json({ error: "Internship not found" }, { status: 404 });
        actualInternshipId = internship._id.toString();
    }
    const internshipId = actualInternshipId;

    const videoIndex = parseInt(params.videoIndex);
    const { content, timestamp } = await req.json();

    // Get user from token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Get internship to get video title
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    const video = internship.videos[videoIndex];
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Find application
    const application = await Application.findOne({
      student: decoded.userId,
      internship: internshipId,
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
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

    if (!application.notes) {
      application.notes = [];
    }

    application.notes.push(newNote);
    await application.save();

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
        await dbConnect();
    
    const params = await props.params;
    let actualInternshipId = params.id;
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
        const internship = await Internship.findOne({ slug: params.id }).select('_id');
        if (!internship) return NextResponse.json({ error: "Internship not found" }, { status: 404 });
        actualInternshipId = internship._id.toString();
    }
    const internshipId = actualInternshipId;

    const videoIndex = parseInt(params.videoIndex);
    const { noteId } = await req.json();

    // Get user from token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    // Find application and remove note
    const application = await Application.findOne({
      student: decoded.userId,
      internship: internshipId,
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Remove note by index (noteId is the index in the array)
    if (application.notes && application.notes[noteId]) {
      application.notes.splice(noteId, 1);
      await application.save();
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
