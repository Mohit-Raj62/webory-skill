import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Ambassador from "@/models/Ambassador";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/User";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const adminUserId = await getDataFromToken(request);
    const admin = await User.findById(adminUserId);

    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { showTestimonial } = await request.json();

    const ambassador = await Ambassador.findByIdAndUpdate(
      id,
      { showTestimonial },
      { new: true },
    );

    if (!ambassador) {
      return NextResponse.json(
        { error: "Ambassador not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Testimonial is now ${showTestimonial ? "Visible" : "Hidden"}`,
      data: ambassador,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await params;

    const adminUserId = await getDataFromToken(request);
    const admin = await User.findById(adminUserId);

    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // "Deleting" a testimonial means clearing the field and hiding it
    const ambassador = await Ambassador.findByIdAndUpdate(
      id,
      {
        testimonial: "",
        showTestimonial: false,
      },
      { new: true },
    );

    if (!ambassador) {
      return NextResponse.json(
        { error: "Ambassador not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Testimonial cleared successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
