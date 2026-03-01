import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import EmployeeVerification from "@/models/EmployeeVerification";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// POST - Submit new employee verification form
export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      positionApplied,
      dateOfBirth,
      currentAddress,
      documents,
      bankDetails,
      declaration,
    } = body;

    // Validation
    if (
      !fullName ||
      !phone ||
      !email ||
      !positionApplied ||
      !dateOfBirth ||
      !currentAddress
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 },
      );
    }

    if (!declaration) {
      return NextResponse.json(
        { error: "You must accept the declaration." },
        { status: 400 },
      );
    }

    // Bank Details validation
    if (
      !bankDetails ||
      !bankDetails.bankName ||
      !bankDetails.accountNumber ||
      !bankDetails.ifscCode
    ) {
      return NextResponse.json(
        { error: "Complete Bank Details are required." },
        { status: 400 },
      );
    }

    // Check required documents
    const requiredDocs = [
      "resume",
      "aadharFront",
      "aadharBack",
      "panCard",
      "marksheet10th",
      "marksheet12th",
      "degree",
      "passportPhoto",
    ];
    for (const doc of requiredDocs) {
      if (!documents?.[doc]) {
        return NextResponse.json(
          { error: `Document "${doc}" is required.` },
          { status: 400 },
        );
      }
    }

    // Check for duplicate email
    const existing = await EmployeeVerification.findOne({ email });
    if (existing) {
      return NextResponse.json(
        {
          error:
            "A verification form has already been submitted with this email.",
        },
        { status: 409 },
      );
    }

    // Auto-generate employee ID based on Name and Date of Birth
    // Format: WS-[First 4 Name Chars]-[DOB Date part]-[Last 2 Name Chars]-[Optional Counter]
    let baseNameStr = (fullName || "User").replace(/\s+/g, "").toUpperCase();
    let firstPart = baseNameStr.substring(0, 4);
    if (firstPart.length < 4) firstPart = firstPart.padEnd(4, "X");

    let lastPart = baseNameStr.substring(baseNameStr.length - 2);
    if (lastPart.length < 2) lastPart = lastPart.padStart(2, "X");

    let dobStr = "01";
    if (dateOfBirth) {
      const d = new Date(dateOfBirth);
      if (!isNaN(d.getTime())) {
        dobStr = String(d.getDate()).padStart(2, "0");
      }
    }

    let baseEmployeeId = `WS-${firstPart}${dobStr}${lastPart}`;
    let employeeId = baseEmployeeId;

    // Check for uniqueness and append a counter if collision happens
    let isUnique = false;
    let counter = 1;
    while (!isUnique) {
      const existingId = await EmployeeVerification.findOne({ employeeId });
      if (existingId) {
        employeeId = `${baseEmployeeId}-${String(counter).padStart(2, "0")}`;
        counter++;
      } else {
        isUnique = true;
      }
    }

    const verification = new EmployeeVerification({
      userId,
      employeeId,
      fullName,
      phone,
      email,
      positionApplied,
      dateOfBirth: new Date(dateOfBirth),
      currentAddress,
      documents,
      bankDetails,
      declaration,
      currentStep: 2,
      status: "document_verification",
    });

    await verification.save();

    return NextResponse.json({
      success: true,
      data: {
        employeeId: verification.employeeId,
        fullName: verification.fullName,
        status: verification.status,
      },
      message: `Verification submitted! Your Employee ID is ${verification.employeeId}`,
    });
  } catch (error: any) {
    console.error("Employee verification submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit verification", details: error.message },
      { status: 500 },
    );
  }
}

// GET - Admin: List all employee verifications
export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const filter: any = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
      ];
    }

    const verifications = await EmployeeVerification.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: verifications });
  } catch (error: any) {
    console.error("Employee verification list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch verifications", details: error.message },
      { status: 500 },
    );
  }
}
