import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hackathon from "@/models/Hackathon";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const hackathon = await Hackathon.findById(id).lean();
    if (!hackathon || (hackathon.isHidden && !hackathon.isArchived)) {
      // Note: We might allow archived but hidden is usually for drafts/removed events
      return NextResponse.json({ error: "Hackathon not found or is currently hidden." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: hackathon,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
