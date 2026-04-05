import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hackathon from "@/models/Hackathon";
import HackathonSubmission from "@/models/HackathonSubmission";
import User from "@/models/User";
import Activity from "@/models/Activity";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// GET: Fetch existing submission for the logged-in user
export async function GET(req: Request) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const hackathonId = searchParams.get("hackathonId");

    if (!hackathonId) {
      return NextResponse.json({ error: "hackathonId is required" }, { status: 400 });
    }

    const submission = await HackathonSubmission.findOne({ hackathonId, userId });

    return NextResponse.json({
      success: true,
      data: submission || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

// POST: Create or Update submission
export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Auth Check
    const userId = await getDataFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
    }

    const data = await req.json();
    const { hackathonId, projectName, projectDescription, githubUrl, demoUrl, techStack, participationType, teamName, teamMemberDetails, isDraft } = data;

    if (!hackathonId) {
      return NextResponse.json({ error: "Missing hackathonId" }, { status: 400 });
    }

    if (!isDraft && (!projectName || !projectDescription || !githubUrl)) {
      return NextResponse.json({ error: "Missing required project fields for final submission" }, { status: 400 });
    }

    if (participationType === "team" && (!teamName || !teamMemberDetails || teamMemberDetails.length === 0)) {
      return NextResponse.json({ error: "Team name and at least one team member are required for team participation." }, { status: 400 });
    }

    // Verify registration and get hackathon deadlines
    const hackathon = await Hackathon.findOne({
      _id: hackathonId,
      registeredUsers: userId
    });

    if (!hackathon) {
      return NextResponse.json({ error: "You must be registered to submit a project." }, { status: 403 });
    }

    const now = new Date();
    const regDeadline = hackathon.registrationDeadline ? new Date(hackathon.registrationDeadline) : new Date(hackathon.startDate);
    const endDeadline = new Date(hackathon.endDate);

    // Check if already submitted
    const existingSubmission = await HackathonSubmission.findOne({ hackathonId, userId });
    
    // For new registrations (step 1), check registration deadline
    if (!existingSubmission && now > regDeadline) {
      return NextResponse.json({ error: "Registration phase has ended for this hackathon." }, { status: 403 });
    }

    // For final project submission (step 2), check end deadline
    if (!isDraft && now > endDeadline) {
      return NextResponse.json({ error: "Project submission phase has ended." }, { status: 403 });
    }

    const newStatus = isDraft ? "draft" : "submitted";

    if (existingSubmission) {
      // Prevent updating if already finalized or rated by judges
      if (existingSubmission.status !== "draft" && existingSubmission.status !== "submitted") {
          return NextResponse.json({ error: "Cannot modify a project that is already under review or finalized." }, { status: 403 });
      }

      // Update existing submission
      existingSubmission.participationType = participationType || "individual";
      existingSubmission.teamName = teamName || "";
      existingSubmission.teamMemberDetails = teamMemberDetails || [];
      if (projectName) existingSubmission.projectName = projectName;
      if (projectDescription) existingSubmission.projectDescription = projectDescription;
      if (githubUrl) existingSubmission.githubUrl = githubUrl;
      if (demoUrl) existingSubmission.demoUrl = demoUrl;
      if (techStack) existingSubmission.techStack = techStack;
      
      // Award XP if project is submitted and no XP has been awarded yet
      let xpMessage = "";
      if (newStatus === "submitted" && (existingSubmission.xpAwarded || 0) === 0) {
        // 1. Award +50 XP to the user
        await User.findByIdAndUpdate(userId, { $inc: { xp: 50 } });
        
        // 2. Create Activity Record for dashboard visualization
        await Activity.create({
          student: userId,
          type: "hackathon_submitted",
          category: "hackathon",
          relatedId: hackathonId,
          metadata: {
             internshipName: hackathon.title // Re-using field for display consistency
          }
        });

        existingSubmission.xpAwarded = 50;
        xpMessage = " +50 XP Earned!";
      }

      existingSubmission.status = newStatus;
      await existingSubmission.save();

      return NextResponse.json({
        success: true,
        message: isDraft ? (xpMessage ? "Draft saved!" + xpMessage : "Draft saved successfully!") : ("Submission updated successfully!" + xpMessage),
        data: existingSubmission,
        updated: true,
      });
    }

    // Create new Submission Document
    const submission = await HackathonSubmission.create({
      hackathonId,
      userId,
      participationType: participationType || "individual",
      teamName: teamName || "",
      teamMemberDetails: teamMemberDetails || [],
      projectName: projectName || "",
      projectDescription: projectDescription || "",
      githubUrl: githubUrl || "",
      demoUrl: demoUrl || "",
      techStack: techStack || [],
      status: newStatus,
      xpAwarded: !isDraft ? 50 : 0
    });

    // Award XP if it's an immediate final submission
    if (!isDraft) {
      await User.findByIdAndUpdate(userId, { $inc: { xp: 50 } });
      
      // Create Activity Record
      await Activity.create({
        student: userId,
        type: "hackathon_submitted",
        category: "hackathon",
        relatedId: hackathonId,
        metadata: {
           internshipName: hackathon.title
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: isDraft ? "Team registered successfully!" : "Project submitted successfully! +50 XP Earned!",
      data: submission,
      updated: false,
    });
  } catch (error: any) {
    console.error("HACKATHON_SUBMIT_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
