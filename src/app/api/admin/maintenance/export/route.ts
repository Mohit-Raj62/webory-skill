import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment"; // For payments/enrollments
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { type } = await req.json(); // 'users', 'courses', 'enrollments'

    let data: any[] = [];
    let fields: string[] = [];

    if (type === "users") {
      data = await User.find({}).lean();
      fields = ["_id", "firstName", "lastName", "email", "role", "createdAt"];
    } else if (type === "courses") {
      data = await Course.find({}).lean();
      fields = [
        "_id",
        "title",
        "price",
        "instructor",
        "category",
        "studentCount",
        "isPopular",
        "createdAt",
      ];
    } else if (type === "enrollments") {
      data = await Enrollment.find({})
        .populate("student", "email firstName lastName") // Field is 'student' in model
        .populate("course", "title price")
        .lean();
      // Flatten for CSV
      data = data.map((e: any) => ({
        _id: e._id,
        user_email: e.student?.email || "N/A",
        user_name: e.student
          ? `${e.student.firstName} ${e.student.lastName}`
          : "N/A",
        course_title: e.course?.title || "Deleted Course",
        amount: e.amount || e.course?.price || 0,
        status: e.completed ? "completed" : "active", // Logic update: use 'completed' bool
        createdAt: e.createdAt,
      }));
      fields = [
        "_id",
        "user_email",
        "user_name",
        "course_title",
        "amount",
        "status",
        "createdAt",
      ];
    } else {
      return NextResponse.json(
        { error: "Invalid export type" },
        { status: 400 }
      );
    }

    // Convert to CSV
    const header = fields.join(",");
    const rows = data.map((row) => {
      return fields
        .map((field) => {
          let val = row[field];
          if (val instanceof Date) val = val.toISOString();
          // Escape quotes and commas
          if (typeof val === "string") {
            val = `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        })
        .join(",");
    });

    const csvString = [header, ...rows].join("\n");

    return new NextResponse(csvString, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}_export_${
          new Date().toISOString().split("T")[0]
        }.csv"`,
      },
    });
  } catch (error: any) {
    console.error("Export error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
