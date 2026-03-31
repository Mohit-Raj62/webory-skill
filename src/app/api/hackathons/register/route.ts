import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hackathon from "@/models/Hackathon";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Auth Check
    const userId = await getDataFromToken(req);
    const { hackathonId } = await req.json();

    console.log("DEBUG_REGISTRATION_START:", { userId, hackathonId });

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please login first." }, { status: 401 });
    }

    if (!hackathonId) {
      return NextResponse.json({ error: "Hackathon ID is required" }, { status: 400 });
    }

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon || (hackathon.isHidden && !hackathon.registeredUsers.includes(userId))) {
      return NextResponse.json({ error: "Hackathon not found or is currently hidden." }, { status: 404 });
    }

    // Check if registration is open
    const now = new Date();
    if (now > hackathon.registrationDeadline) {
      return NextResponse.json({ error: "Registration for this event has closed." }, { status: 400 });
    }

    // Check if already registered
    const isRegistered = await Hackathon.findOne({
      _id: hackathonId,
      registeredUsers: userId
    });
    
    if (isRegistered) {
      return NextResponse.json({ error: "You are already registered for this hackathon." }, { status: 400 });
    }

    // TODO: Add Simulator Prerequisite Check here if needed
    // if (hackathon.simulatorPrerequisite) { ... }

    // Register User
    hackathon.registeredUsers.push(userId);
    await hackathon.save();

    return NextResponse.json({
      success: true,
      message: "Successfully registered for " + hackathon.title,
    });
  } catch (error: any) {
    console.error("HACKATHON_REG_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
