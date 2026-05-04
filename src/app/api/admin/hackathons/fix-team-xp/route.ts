import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import HackathonSubmission from "@/models/HackathonSubmission";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Admin Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const submissions = await HackathonSubmission.find({ 
      participationType: "team",
      xpAwarded: { $gte: 50 } 
    }).populate("userId");

    const results = [];

    for (const sub of submissions) {
      if (!sub.teamMemberDetails || sub.teamMemberDetails.length === 0) continue;

      const leadEmail = (sub.userId as any).email.toLowerCase();

      for (const member of sub.teamMemberDetails) {
        if (member.email.toLowerCase() === leadEmail) continue;

        const memberUser = await User.findOne({ email: member.email.toLowerCase() });
        if (memberUser) {
          // Check if we should award 50 XP
          // For safety, we can check if they have a certificate or if the hackathon is completed
          // But the user specifically asked to add the "cut" 50 points.
          
          await User.findByIdAndUpdate(memberUser._id, { $inc: { xp: 50 } });
          results.push({
            user: member.email,
            submission: sub._id,
            projectName: sub.projectName,
            status: "XP_ADDED"
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully added 50 XP to ${results.length} team members.`,
      details: results
    });

  } catch (error: any) {
    console.error("FIX_XP_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
