import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";
import User from "@/models/User";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import Enrollment from "@/models/Enrollment";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const startTime = Date.now();
    await dbConnect();

    // 1. Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // 2. Sync Indexes
    // Ensure all indexes defined in schemas are applied to the database
    // This improves query performance
    const models = [User, Course, Internship, Enrollment];
    const indexResults: any[] = [];

    for (const model of models) {
      try {
        await model.syncIndexes();
        indexResults.push({ model: model.modelName, status: "Synced" });
      } catch (err: any) {
        console.error(`Index sync failed for ${model.modelName}:`, err);
        indexResults.push({
          model: model.modelName,
          status: "Failed",
          error: err.message,
        });
      }
    }

    // 3. Connection Health & Latency
    const adminDb = mongoose.connection.db.admin();
    let pingTime: number | string = -1;
    let serverStatus: any = {};
    let connections = { current: "N/A", available: "N/A" };

    try {
      const pingStart = Date.now();
      await adminDb.ping();
      pingTime = Date.now() - pingStart;
    } catch (e) {
      console.warn("Ping failed (likely permission issue):", e);
      // Fallback: simple query to own collection to check connectivity
      try {
        const start = Date.now();
        await User.findOne().select("_id");
        pingTime = Date.now() - start;
      } catch (inner) {
        console.error("Connectivity check failed:", inner);
        pingTime = "Error (Permissions/Connectivity)";
      }
    }

    // 4. Database Stats (Optional)
    try {
      serverStatus = await adminDb.serverStatus();
      connections = serverStatus.connections || {};
    } catch (e) {
      console.warn(
        "serverStatus failed (permission issue), skipping detailed stats."
      );
      // Continue without stats
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: `Database optimization completed in ${duration}ms`,
      details: {
        latency: typeof pingTime === "number" ? `${pingTime}ms` : pingTime,
        indexes: indexResults,
        connections: {
          current: connections.current || "N/A",
          available: connections.available || "N/A",
        },
        uptime: serverStatus.uptime || "N/A",
      },
    });
  } catch (error: any) {
    console.error("Optimization error:", error);
    return NextResponse.json(
      { error: error.message || "Optimization failed" },
      { status: 500 }
    );
  }
}
