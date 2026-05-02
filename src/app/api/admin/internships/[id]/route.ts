import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Internship from "@/models/Internship";
import Application from "@/models/Application";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { revalidateTag, revalidatePath } from "next/cache";

// GET single internship
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const internship = await Internship.findById(id);

    if (!internship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    return NextResponse.json({ internship });
  } catch (error) {
    console.error("Get internship error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE internship
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const updateData = await req.json();

    // Remove internal fields if present
    delete updateData._id;
    delete updateData.__v;

    const internship = await Internship.findByIdAndUpdate(
      id,
      updateData, // Update everything sent
      { new: true, runValidators: true }
    );

    revalidateTag('internships');
    revalidatePath('/internships');
    revalidatePath('/');

    if (!internship) {
      return NextResponse.json({ error: "Internship not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Internship updated successfully",
      internship 
    });
  } catch (error) {
    console.error("Update internship error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE internship
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Delete applications for this internship
    await Application.deleteMany({ internship: id });

    // Delete internship
    await Internship.findByIdAndDelete(id);

    return NextResponse.json({ message: "Internship deleted successfully" });
  } catch (error) {
    console.error("Delete internship error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
