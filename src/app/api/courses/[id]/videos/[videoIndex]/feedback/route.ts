import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import VideoFeedback from "@/models/VideoFeedback";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; videoIndex: string }> },
) {
  const params = await props.params;
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, videoIndex } = params;

    const feedback = await VideoFeedback.findOne({
      user: userId,
      courseId: id,
      videoIndex: parseInt(videoIndex),
    });

    return NextResponse.json({
      success: true,
      feedback: feedback || { isLiked: null, feedback: "" },
    });
  } catch (error: any) {
    console.error("Error fetching video feedback:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string; videoIndex: string }> },
) {
  const params = await props.params;
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, videoIndex } = params;
    const reqBody = await request.json();
    const { isLiked, feedback } = reqBody;

    // Create update object dynamically to allow partial updates (e.g. only like, or only feedback)
    // Actually, for this logic, we probably want to send full state or merge.
    // Let's assume frontend sends the desired end state for both fields if possible, or we handle merge.
    // But $set will merge into existing document fields if we provide them.
    // If frontend sends { isLiked: true }, feedback remains if it existed.
    // Wait, reqBody will contain what's sent.

    const updateData: any = {};
    if (isLiked !== undefined) updateData.isLiked = isLiked;
    if (feedback !== undefined) updateData.feedback = feedback;

    const updatedFeedback = await VideoFeedback.findOneAndUpdate(
      {
        user: userId,
        courseId: id,
        videoIndex: parseInt(videoIndex),
      },
      {
        $set: updateData,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({
      success: true,
      message: "Feedback saved",
      data: updatedFeedback,
    });
  } catch (error: any) {
    console.error("Error saving video feedback:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
