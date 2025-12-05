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

// GET - List all PDFs for a course
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const course = await Course.findById(id).select("pdfResources instructor");

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if teacher owns this course
    if (course.instructor?.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Not authorized for this course" },
        { status: 403 }
      );
    }

    // Sort PDFs by afterModule and order
    const sortedPDFs = course.pdfResources.sort((a: any, b: any) => {
      if (a.afterModule !== b.afterModule) {
        return a.afterModule - b.afterModule;
      }
      return a.order - b.order;
    });

    return NextResponse.json({ pdfs: sortedPDFs });
  } catch (error) {
    console.error("Error fetching PDFs:", error);
    return NextResponse.json(
      { error: "Failed to fetch PDFs" },
      { status: 500 }
    );
  }
}

// POST - Upload new PDF
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      fileUrl,
      fileName,
      fileSize,
      afterModule,
      order,
      cloudinaryId,
    } = body;

    if (!title || !fileUrl || !fileName || !cloudinaryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await dbConnect();
    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if teacher owns this course
    if (course.instructor?.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: "Not authorized for this course" },
        { status: 403 }
      );
    }

    // Add PDF to course
    course.pdfResources.push({
      title,
      description: description || "",
      fileUrl,
      fileName,
      fileSize,
      afterModule: afterModule || 0,
      order: order || 0,
      uploadedBy: user._id,
      cloudinaryId,
    });

    await course.save();

    return NextResponse.json({
      message: "PDF uploaded successfully",
      pdf: course.pdfResources[course.pdfResources.length - 1],
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return NextResponse.json(
      { error: "Failed to upload PDF" },
      { status: 500 }
    );
  }
}
