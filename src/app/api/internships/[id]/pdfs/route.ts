import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Internship from "@/models/Internship";
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

// GET - List all PDFs for a internship
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();
    if (!user || (user.role !== "admin" && user.role !== "teacher")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const internship = await Internship.findById(id).select("pdfResources");

    if (!internship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    // Sort PDFs by afterModule and order
    const sortedPDFs = internship.pdfResources.sort((a: any, b: any) => {
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
  console.log("API Route Hit: POST /api/admin/internships/[id]/pdfs");
  try {
    const { id } = await params;
    console.log("Internship ID:", id);

    const user = await getAuthenticatedUser();
    if (!user || (user.role !== "admin" && user.role !== "teacher")) {
      console.log("Auth failed for user:", user?.email);
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
    const internship = await Internship.findById(id);

    if (!internship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    // Add PDF to internship
    internship.pdfResources.push({
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

    await internship.save();

    return NextResponse.json({
      message: "PDF uploaded successfully",
      pdf: internship.pdfResources[internship.pdfResources.length - 1],
    });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    return NextResponse.json(
      { error: "Failed to upload PDF" },
      { status: 500 }
    );
  }
}
