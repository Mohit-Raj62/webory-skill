import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import VideoFeedback from "@/models/VideoFeedback";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/User";
import Course from "@/models/Course"; // Ensure Course is registered

export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(req);
    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const feedbacks = await VideoFeedback.find({})
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email")
      .populate("courseId", "title videos");

    // Transform data to include video title directly
    const formattedFeedbacks = feedbacks.map((f: any) => {
      const videoTitle =
        f.courseId?.videos?.[f.videoIndex]?.title ||
        `Video ${f.videoIndex + 1}`;
      return {
        _id: f._id,
        user: f.user,
        courseTitle: f.courseId?.title || "Unknown Course",
        videoTitle: videoTitle,
        videoIndex: f.videoIndex,
        isLiked: f.isLiked,
        feedback: f.feedback,
        createdAt: f.createdAt,
      };
    });

    return NextResponse.json({ feedbacks: formattedFeedbacks });
  } catch (error: any) {
    console.error("Admin Video Feedback Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
