import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail"; // Corrected import path
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/lib/db";

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

    // Get Admin Email
    const adminUser = await User.findById(decoded.userId); // Token uses 'userId'

    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Send Test Email
    const htmlContent = `
        <div style="font-family: sans-serif; padding: 20px; text-align: center;">
            <h1>System Check Passed! ✅</h1>
            <p>Your email system is configured correctly.</p>
            <p>Time: ${new Date().toLocaleString()}</p>
        </div>
    `;

    const result = await sendEmail(
      adminUser.email,
      "Webory Skills - System Test Email",
      htmlContent
    );

    // Note: sendEmail utility needs to return something or throw error.
    // Assuming it throws on failure.

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${adminUser.email}`,
    });
  } catch (error: any) {
    console.error("Test email failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
