import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Activity from "@/models/Activity";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as any;
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category"); // 'course' or 'internship'
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const query: any = { student: decoded.userId };

    if (category) {
      query.category = category;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const activities = await Activity.find(query)
      .select("date type metadata")
      .sort({ date: -1 })
      .lean();

    // Aggregate by date for calendar view
    const dailyStats: { [key: string]: any } = {};

    activities.forEach((activity) => {
      const dateKey = activity.date.toISOString().split("T")[0];

      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = {
          date: dateKey,
          totalActivities: 0,
          videoMinutes: 0,
          questionsAttempted: 0,
          activities: [],
        };
      }

      dailyStats[dateKey].totalActivities += 1;
      dailyStats[dateKey].videoMinutes += activity.metadata?.videoMinutes || 0;
      dailyStats[dateKey].questionsAttempted +=
        activity.metadata?.questionsCount || 0;
      dailyStats[dateKey].activities.push({
        type: activity.type,
        metadata: activity.metadata,
      });
    });

    return NextResponse.json(
      {
        activities,
        dailyStats: Object.values(dailyStats),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get activities error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!) as any;
    const body = await req.json();

    const activity = await Activity.create({
      student: decoded.userId,
      ...body,
    });

    // Award +10 XP to the student
    await User.findByIdAndUpdate(decoded.userId, { $inc: { xp: 10 } });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error("Create activity error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
