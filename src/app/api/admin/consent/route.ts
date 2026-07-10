import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ConsentLog from "@/models/ConsentLog";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const adminUser = await User.findById(decoded.userId);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const consentType = searchParams.get("consentType");
    const action = searchParams.get("action");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");
    
    const query: any = {};
    if (userId) query.userId = userId;
    if (consentType) query.consentType = consentType;
    if (action) query.action = action;

    const skip = (page - 1) * limit;

    const consentLogs = await ConsentLog.find(query)
      .populate("userId", "firstName lastName email")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ConsentLog.countDocuments(query);

    return NextResponse.json({ 
      consentLogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching admin consent logs:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
