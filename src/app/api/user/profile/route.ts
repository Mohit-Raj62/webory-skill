import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      firstName, lastName, bio, socialLinks, 
      education, experience, projects, skills, 
      externalHackathons, phone 
    } = body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName,
          lastName,
          bio,
          socialLinks,
          education,
          experience,
          projects,
          skills,
          externalHackathons,
          phone
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Profile updated successfully",
      user: updatedUser 
    });

  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
