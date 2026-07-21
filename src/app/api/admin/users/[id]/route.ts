import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// DELETE user
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

    // Delete user's enrollments and applications
    await Enrollment.deleteMany({ student: id });
    await Application.deleteMany({ student: id });

    // Delete user
    await User.findByIdAndDelete(id);

    const { logActivity } = await import("@/lib/logger");
    await logActivity(
      decoded.userId || decoded.id,
      "DELETE_USER",
      `Deleted user: ${id}`,
      req.headers.get("x-forwarded-for") || "unknown"
    );

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH user (update role)
export async function PATCH(
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
    const { role } = await req.json();

    if (!["student", "admin", "teacher"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    const { logActivity } = await import("@/lib/logger");
    await logActivity(
      decoded.userId || decoded.id,
      "VERIFY_USER",
      `Updated role of user ${id} to ${role}`,
      req.headers.get("x-forwarded-for") || "unknown"
    );

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
