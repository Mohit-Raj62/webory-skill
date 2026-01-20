import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Helper to check if requester is admin
async function isAdmin(req: Request) {
  try {
    const userId = await getDataFromToken(req);
    if (!userId) return false;
    const user = await User.findById(userId);
    return user && user.role === "admin";
  } catch (e) {
    return false;
  }
}

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    await dbConnect();
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(params.id).select(
      "firstName lastName email bio skills socialLinks projects education experience",
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const params = await props.params;
    await dbConnect();
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bio, skills, socialLinks, projects, education, experience } = body;

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      {
        $set: {
          bio,
          skills,
          socialLinks,
          projects,
          education,
          experience,
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Portfolio updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
