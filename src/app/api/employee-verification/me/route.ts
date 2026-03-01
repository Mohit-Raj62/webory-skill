import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import EmployeeVerification from "@/models/EmployeeVerification";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const verification = await EmployeeVerification.findOne({
      $or: [
        { userId: user._id },
        { email: { $regex: new RegExp(`^${user.email}$`, "i") } },
      ],
    });

    if (!verification) {
      return NextResponse.json({
        success: true,
        data: null,
        userDefaults: {
          fullName: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          phone: user.phone || "",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        employeeId: verification.employeeId,
        fullName: verification.fullName,
        email: verification.email,
        phone: verification.phone,
        positionApplied: verification.positionApplied,
        dateOfBirth: verification.dateOfBirth,
        currentAddress: verification.currentAddress,
        currentStep: verification.currentStep,
        status: verification.status,
        joiningDate: verification.joiningDate || null, // If they added a joining date
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
