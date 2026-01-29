import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Lead from "@/models/Lead";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, courseId, pageUrl } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and Phone are required" },
        { status: 400 },
      );
    }

    await connectToDB();

    const newLead = await Lead.create({
      name,
      phone,
      courseId,
      pageUrl,
      ip: req.headers.get("x-forwarded-for") || "unknown",
    });

    return NextResponse.json({ success: true, lead: newLead }, { status: 201 });
  } catch (error) {
    console.error("Error capturing lead:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
