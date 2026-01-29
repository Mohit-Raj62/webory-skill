import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
  try {
    await dbConnect();

    // Verify Auth
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    // Find and update user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.phone = phone;
    await user.save();

    return NextResponse.json(
      { message: "Phone updated successfully", phone: user.phone },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Phone update error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
