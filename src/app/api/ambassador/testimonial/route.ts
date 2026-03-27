import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Ambassador from "@/models/Ambassador";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ambassador = await Ambassador.findOne({ userId }).select("testimonial");

    if (!ambassador) {
      return NextResponse.json(
        { error: "Ambassador profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      testimonial: ambassador.testimonial || "",
    });
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

    const { testimonial } = await request.json();

    if (testimonial === undefined) {
      return NextResponse.json(
        { error: "Testimonial content is required" },
        { status: 400 },
      );
    }

    const ambassador = await Ambassador.findOneAndUpdate(
      { userId },
      { testimonial },
      { new: true },
    );

    if (!ambassador) {
      return NextResponse.json(
        { error: "Ambassador profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Testimonial updated successfully",
      testimonial: ambassador.testimonial,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
