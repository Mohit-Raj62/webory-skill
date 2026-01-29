import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Lead from "@/models/Lead";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }

    await connectToDB();

    const leads = await Lead.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
