import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hackathon from "@/models/Hackathon";
import HackathonSubmission from "@/models/HackathonSubmission";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Auth Check
    const userId = await getDataFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
    }

    const data = await req.json();
    const { hackathonId, projectName, projectDescription, githubUrl, demoUrl, techStack } = data;

    if (!hackathonId || !projectName || !projectDescription || !githubUrl) {
      return NextResponse.json({ error: "Missing required project fields" }, { status: 400 });
    }

    // Verify registration - Most robust check using Mongoose direct query
    console.log("DEBUG_SUBMISSION:", { hackathonId, userId });
    const hackathonDoc = await Hackathon.findById(hackathonId);
    console.log("DEBUG_HACKATHON_DATA:", { 
        found: !!hackathonDoc, 
        regCount: hackathonDoc?.registeredUsers?.length,
        actualUsers: hackathonDoc?.registeredUsers,
        isIncluded: hackathonDoc?.registeredUsers?.some((id: any) => id && id.toString() === userId)
    });

    const isRegistered = await Hackathon.findOne({
      _id: hackathonId,
      registeredUsers: userId
    });

    if (!isRegistered) {
      return NextResponse.json({ error: "You must be registered to submit a project." }, { status: 403 });
    }

    // Check if already submitted
    const existingSubmission = await HackathonSubmission.findOne({ hackathonId, userId });
    if (existingSubmission) {
      return NextResponse.json({ error: "You have already submitted a project for this event." }, { status: 400 });
    }

    // Create Submission
    const submission = await HackathonSubmission.create({
      hackathonId,
      userId,
      projectName,
      projectDescription,
      githubUrl,
      demoUrl,
      techStack,
      status: "submitted",
    });

    return NextResponse.json({
      success: true,
      message: "Project submitted successfully!",
      data: submission,
    });
  } catch (error: any) {
    console.error("HACKATHON_SUBMIT_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
