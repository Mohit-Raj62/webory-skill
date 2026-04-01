import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const params = await props.params;

    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;
    const { progress, completed } = await req.json();

    const updateData: any = {};
    if (progress !== undefined) {
      if (progress < 0 || progress > 100) {
        return NextResponse.json(
          { error: "Progress must be between 0 and 100" },
          { status: 400 },
        );
      }
      updateData.progress = progress;
    }
    if (completed !== undefined) updateData.completed = completed;

    const enrollment = await Enrollment.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ enrollment });
  } catch (error: any) {
    console.error("Error updating enrollment:", error);
    if (
      error.message?.includes("jwt") ||
      error.message?.includes("Session expired") ||
      error.message?.includes("Not authenticated")
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const params = await props.params;

    const userId = await getDataFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = params;
    const enrollment = await Enrollment.findByIdAndDelete(id);

    if (!enrollment) {
      return NextResponse.json(
        { error: "Enrollment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Enrollment deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting enrollment:", error);
    if (
      error.message?.includes("jwt") ||
      error.message?.includes("Session expired") ||
      error.message?.includes("Not authenticated")
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
