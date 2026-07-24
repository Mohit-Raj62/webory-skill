import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import Internship from "@/models/Internship";
import Activity from "@/models/Activity";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string; videoIndex: string }> },
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

    const { videoIndex } = params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const userId = decoded.userId;

    const { watchedPercentage = 100, duration = 0 } = await req.json();

    // Find application
    const application = await Application.findOne({
      student: userId,
      internship: internshipId,
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    // Get internship to know total videos
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    const videoIdx = parseInt(videoIndex);
    const video = internship.videos[videoIdx];

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    // Check if video already watched
    const existingWatch = application.watchedVideos.find(
      (w: any) => w.videoIndex === videoIdx,
    );

    let previouslyCompleted = false;

    if (existingWatch) {
      if (existingWatch.watchedPercentage >= 90) {
        previouslyCompleted = true;
      }
      // Update watched percentage
      existingWatch.watchedPercentage = Math.max(
        existingWatch.watchedPercentage,
        watchedPercentage,
      );
      existingWatch.watchedAt = new Date();
    } else {
      // Add new watched video
      application.watchedVideos.push({
        videoIndex: videoIdx,
        videoTitle: video.title,
        watchedAt: new Date(),
        watchedPercentage: watchedPercentage,
      });
    }

    // Calculate progress: count videos watched >= 90%
    const watchedCount = application.watchedVideos.filter(
      (w: any) => w.watchedPercentage >= 90,
    ).length;
    const totalVideos = internship.videos.length;
    const newProgress =
      totalVideos > 0 ? Math.round((watchedCount / totalVideos) * 100) : 0;

    // Update progress
    application.progress = newProgress;

    await application.save();

    // Record Activity if watched >= 90%
    if (watchedPercentage >= 90 && !previouslyCompleted) {
      // Check if activity already exists for this video today to avoid duplicates
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingActivity = await Activity.findOne({
        student: userId,
        type: "video_watched",
        "metadata.courseName": internship.title,
        date: { $gte: today },
      });

      // Award +10 XP to the student
      await User.findByIdAndUpdate(userId, { $inc: { xp: 10 } });

      await Activity.create({
        student: userId,
        type: "video_watched",
        category: "internship",
        relatedId: internshipId,
        metadata: {
          videoMinutes: Math.round(duration / 60) || 0, // Convert seconds to minutes
          courseName: internship.title,
        },
        date: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      progress: newProgress,
      watchedVideos: application.watchedVideos.length,
      totalVideos: totalVideos,
    });
  } catch (error: any) {
    console.error("Error marking video as watched:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
