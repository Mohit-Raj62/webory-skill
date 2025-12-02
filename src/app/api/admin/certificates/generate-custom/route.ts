import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CustomCertificate from "@/models/CustomCertificate";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { studentName, title, description } = await req.json();

    if (!studentName || !title) {
      return NextResponse.json(
        { error: "Student name and title are required" },
        { status: 400 }
      );
    }

    // Generate Certificate ID
    const titleSlug = title
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 4);

    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const certificateId = `CUSTOM-${titleSlug}-${randomId}-${Date.now()
      .toString()
      .substring(8)}`;

    // Generate Security Key
    const certificateKey =
      Math.random().toString(36).substring(2, 10).toUpperCase() +
      Math.random().toString(36).substring(2, 10).toUpperCase();

    // Save to database
    const customCert = await CustomCertificate.create({
      studentName,
      title,
      description: description || "",
      certificateId,
      certificateKey,
      issuedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      certificateId: customCert.certificateId,
      certificateKey: customCert.certificateKey,
    });
  } catch (error) {
    console.error("Generate custom certificate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
