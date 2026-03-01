import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import EmployeeVerification from "@/models/EmployeeVerification";

// GET - Get single employee verification
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const verification = await EmployeeVerification.findById(id).lean();
    if (!verification) {
      return NextResponse.json(
        { error: "Verification not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: verification });
  } catch (error: any) {
    console.error("Get verification error:", error);
    return NextResponse.json(
      { error: "Failed to get verification", details: error.message },
      { status: 500 },
    );
  }
}

// PATCH - Admin: Update verification step/status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const { currentStep, status } = body;

    const updateData: any = {};
    if (currentStep) updateData.currentStep = currentStep;
    if (status) updateData.status = status;

    const verification = await EmployeeVerification.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    if (!verification) {
      return NextResponse.json(
        { error: "Verification not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: verification,
      message: "Verification updated successfully",
    });
  } catch (error: any) {
    console.error("Update verification error:", error);
    return NextResponse.json(
      { error: "Failed to update verification", details: error.message },
      { status: 500 },
    );
  }
}
