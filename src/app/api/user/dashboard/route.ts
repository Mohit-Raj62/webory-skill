import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Enrollment from "@/models/Enrollment";
import Application from "@/models/Application";
import "@/models/Course"; // Ensure Course model is registered for populate
import "@/models/Internship"; // Ensure Internship model is registered for populate
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    console.log("Dashboard - Fetching data for user:", decoded.userId);

    // Use lean() to get plain JavaScript objects instead of Mongoose documents
    // Run queries in parallel for better performance
    const [enrollments, applications] = await Promise.all([
      Enrollment.find({ student: decoded.userId })
        .populate("course")
        .lean()
        .then((res) => {
          console.log("Enrollments found:", res.length);
          return res;
        })
        .catch((err) => {
          console.error("Enrollment query error:", err);
          return [];
        }),

      Application.find({ student: decoded.userId })
        .populate("internship")
        .populate("student")
        .lean()
        .then((res) => {
          console.log("Applications found:", res.length);
          if (res.length > 0) {
            console.log(
              "First application sample:",
              JSON.stringify(res[0], null, 2)
            );
            console.log("Is internship populated?", !!res[0].internship);
          }
          return res;
        })
        .catch((err) => {
          console.error("Application query error:", err);
          return [];
        }),
    ]);

    return NextResponse.json(
      {
        enrollments: enrollments || [],
        applications: applications || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
