import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Activity from "@/models/Activity";
import Lead from "@/models/Lead";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    const category = req.nextUrl.searchParams.get("category");

    await connectToDB();

    // 1. Fetch Guest Leads from 'Lead' collection
    let guestLeads: any[] = [];
    if (!category || category === "internship") {
      const leads = await Lead.find({ internshipId: { $ne: null } })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();
      guestLeads = leads.map((l: any) => ({
        type: "guest_lead",
        student: {
          firstName: l.name,
          lastName: "(Guest)",
          phone: l.phone,
        },
        name: "Requested Information",
        count: 1,
        lastViewed: l.createdAt,
      }));
    }

    // 2. Fetch Logged-in Activity
    const matchStage: any = {
      type: category ? `${category}_viewed` : { $in: ["course_viewed", "internship_viewed"] }
    };

    const activities = await Activity.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            student: "$student",
            relatedId: "$relatedId",
            name: { $ifNull: ["$metadata.courseName", "$metadata.internshipName"] },
          },
          count: { $sum: 1 },
          lastViewed: { $max: "$date" },
        },
      },
      { $sort: { lastViewed: -1 } },
      { $limit: 40 },
      {
        $lookup: {
          from: "users",
          localField: "_id.student",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      {
        $unwind: {
          path: "$studentInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          student: {
            firstName: "$studentInfo.firstName",
            lastName: "$studentInfo.lastName",
            email: "$studentInfo.email",
            phone: "$studentInfo.phone",
            avatar: "$studentInfo.avatar",
          },
          name: "$_id.name",
          relatedId: "$_id.relatedId",
          type: { $literal: "logged_activity" },
          count: "$count",
          lastViewed: "$lastViewed",
        },
      },
    ]);

    // 3. Combine and Sort
    const combined = [...guestLeads, ...activities].sort((a, b) => 
      new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime()
    );

    return NextResponse.json({ success: true, activities: combined });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
