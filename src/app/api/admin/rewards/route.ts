import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import RewardRequest from "@/models/RewardRequest";
import User from "@/models/User";
import Ambassador from "@/models/Ambassador";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const requests = await RewardRequest.find({})
      .populate(
        "ambassadorId",
        "userId college referralCode points totalSignups",
      )
      .sort({ createdAt: -1 });

    // Populate user details manually since Ambassador references User
    const enrichedRequests = await Promise.all(
      requests.map(async (req) => {
        const ambassador = req.ambassadorId;
        if (ambassador) {
          const ambassadorUser = await User.findById(ambassador.userId).select(
            "firstName lastName email",
          );
          return {
            ...req.toObject(),
            ambassadorName: ambassadorUser
              ? `${ambassadorUser.firstName} ${ambassadorUser.lastName}`
              : "Unknown",
            ambassadorEmail: ambassadorUser ? ambassadorUser.email : "Unknown",
            referralCode: ambassador.referralCode,
          };
        }
        return req;
      }),
    );

    return NextResponse.json({
      success: true,
      data: enrichedRequests,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);
    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { requestId, status } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: "Request ID and Status are required" },
        { status: 400 },
      );
    }

    const updatedRequest = await RewardRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true },
    );

    if (!updatedRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // specific status handling (e.g. if rejected, refund points)
    if (status === "rejected") {
      const ambassador = await Ambassador.findById(updatedRequest.ambassadorId);
      if (ambassador) {
        ambassador.points += updatedRequest.pointsSpent;
        await ambassador.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: `Request marked as ${status}`,
      data: updatedRequest,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
