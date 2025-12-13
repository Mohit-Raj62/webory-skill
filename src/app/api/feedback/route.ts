import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Feedback from "@/models/Feedback";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { category, rating, comment, targetId } = body;

    if (!category || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Optional: Validate that the user has actually enrolled in the course/internship if applicable
    // For now, we allow open feedback

    const feedback = await Feedback.create({
      user: userId,
      category,
      rating,
      comment,
      targetId: targetId || null,
    });

    return NextResponse.json(
      { message: "Feedback submitted successfully", feedback },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Fetch only public feedback, populated with user details
    // Limit to latest 20 for the home page carousel
    const feedbacks = await Feedback.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("user", "firstName lastName avatar");

    // Filter out feedbacks where the user no longer exists
    const validFeedbacks = feedbacks.filter((f: any) => f.user);

    return NextResponse.json({ feedbacks: validFeedbacks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
