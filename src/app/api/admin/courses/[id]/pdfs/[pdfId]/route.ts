import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Helper for auth
async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    await dbConnect();
    return await User.findById(decoded.userId);
  } catch (error) {
    return null;
  }
}

// PUT - Update PDF metadata
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; pdfId: string }> }
) {
  try {
    const { id, pdfId } = await params;
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, afterModule, order } = body;

    await dbConnect();
    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const pdfIndex = course.pdfResources.findIndex(
      (pdf: any) => pdf._id.toString() === pdfId
    );

    if (pdfIndex === -1) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // Update PDF metadata
    if (title !== undefined) course.pdfResources[pdfIndex].title = title;
    if (description !== undefined)
      course.pdfResources[pdfIndex].description = description;
    if (afterModule !== undefined)
      course.pdfResources[pdfIndex].afterModule = afterModule;
    if (order !== undefined) course.pdfResources[pdfIndex].order = order;

    await course.save();

    return NextResponse.json({
      message: "PDF updated successfully",
      pdf: course.pdfResources[pdfIndex],
    });
  } catch (error) {
    console.error("Error updating PDF:", error);
    return NextResponse.json(
      { error: "Failed to update PDF" },
      { status: 500 }
    );
  }
}

// DELETE - Delete PDF
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; pdfId: string }> }
) {
  try {
    const { id, pdfId } = await params;
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const pdfIndex = course.pdfResources.findIndex(
      (pdf: any) => pdf._id.toString() === pdfId
    );

    if (pdfIndex === -1) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    const cloudinaryId = course.pdfResources[pdfIndex].cloudinaryId;

    // Delete from Cloudinary
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/destroy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            public_id: cloudinaryId,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          }),
        }
      );

      if (!response.ok) {
        console.error("Failed to delete from Cloudinary");
      }
    } catch (error) {
      console.error("Cloudinary deletion error:", error);
      // Continue with database deletion even if Cloudinary fails
    }

    // Remove from database
    course.pdfResources.splice(pdfIndex, 1);
    await course.save();

    return NextResponse.json({ message: "PDF deleted successfully" });
  } catch (error) {
    console.error("Error deleting PDF:", error);
    return NextResponse.json(
      { error: "Failed to delete PDF" },
      { status: 500 }
    );
  }
}
