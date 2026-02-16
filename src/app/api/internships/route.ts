import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Internship from "@/models/Internship";

export async function GET() {
  try {
    await dbConnect();
    const internships = await Internship.find({})
      .select(
        "title company location type stipend tags price description color icon requirements responsibilities",
      )
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ internships }, { status: 200 });
  } catch (error) {
    console.error("Fetch internships error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const internship = await Internship.create(data);
    return NextResponse.json({ internship }, { status: 201 });
  } catch (error) {
    console.error("Create internship error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
