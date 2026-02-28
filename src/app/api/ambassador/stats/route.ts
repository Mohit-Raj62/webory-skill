import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Ambassador from "@/models/Ambassador";
import RewardRequest from "@/models/RewardRequest";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ambassador = await Ambassador.findOne({ userId }).populate(
      "userId",
      "firstName lastName email avatar",
    );

    if (!ambassador) {
      return NextResponse.json(
        { error: "Ambassador profile not found", notRegistered: true },
        { status: 404 },
      );
    }

    // Calculate total spent points for current ambassador (non-rejected rewards)
    const spentResult = await RewardRequest.aggregate([
      { $match: { ambassadorId: ambassador._id, status: { $ne: "rejected" } } },
      { $group: { _id: null, totalSpent: { $sum: "$pointsSpent" } } },
    ]);
    const myTotalSpent = spentResult.length > 0 ? spentResult[0].totalSpent : 0;
    const myTotalEarned = (ambassador.points || 0) + myTotalSpent;

    // Calculate total earned for ALL ambassadors using aggregation
    const allAmbassadorsTotalEarned = await Ambassador.aggregate([
      // Lookup non-rejected reward requests for each ambassador
      {
        $lookup: {
          from: "rewardrequests",
          let: { ambId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$ambassadorId", "$$ambId"] },
                    { $ne: ["$status", "rejected"] },
                  ],
                },
              },
            },
            { $group: { _id: null, totalSpent: { $sum: "$pointsSpent" } } },
          ],
          as: "rewards",
        },
      },
      // Calculate totalEarned = current points + spent points
      {
        $addFields: {
          totalEarned: {
            $add: [
              { $ifNull: ["$points", 0] },
              { $ifNull: [{ $arrayElemAt: ["$rewards.totalSpent", 0] }, 0] },
            ],
          },
        },
      },
      // Count ambassadors who earned more than current user (or same but registered earlier)
      {
        $match: {
          _id: { $ne: ambassador._id },
          $or: [
            { totalEarned: { $gt: myTotalEarned } },
            {
              totalEarned: myTotalEarned,
              createdAt: { $lt: ambassador.createdAt },
            },
          ],
        },
      },
      { $count: "higherRanked" },
    ]);

    const rank =
      (allAmbassadorsTotalEarned.length > 0
        ? allAmbassadorsTotalEarned[0].higherRanked
        : 0) + 1;

    return NextResponse.json({
      success: true,
      data: {
        ...ambassador.toObject(),
        rank,
        totalEarned: myTotalEarned,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
