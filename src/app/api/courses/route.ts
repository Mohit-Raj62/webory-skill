import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

export async function GET() {
  try {
    await dbConnect();
    const courses = await Course.find({});
    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error("Fetch courses error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const course = await Course.create(data);
    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
