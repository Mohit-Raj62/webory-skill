import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Job from "@/models/Job";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    // Public API: fetch all active jobs
    // Admin might want to see all jobs (active or inactive).
    // For now, let's return all for admin (if we can detect) or just active for public.
    // Or simple query param? ?all=true

    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all");

    let query = {};
    if (!showAll) {
      query = { isActive: true };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: jobs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const reqBody = await request.json();
    const job = await Job.create(reqBody);

    return NextResponse.json({
      message: "Job created successfully",
      success: true,
      data: job,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
