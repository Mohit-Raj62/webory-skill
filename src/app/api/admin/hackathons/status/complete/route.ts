import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hackathon from "@/models/Hackathon";
import HackathonSubmission from "@/models/HackathonSubmission";
import CustomCertificate from "@/models/CustomCertificate";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Admin Auth Check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { hackathonId, winners } = await req.json(); // winners: [{ userId, rank, points }]

    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return NextResponse.json({ error: "Hackathon not found" }, { status: 404 });
    }

    // 1. Mark Hackathon as Completed
    hackathon.status = "completed";
    await hackathon.save();

    // Process Winners and Participants
    const submissions = await HackathonSubmission.find({ hackathonId }).populate("userId");
    
    // Side-effect import to ensure model is registered
    require("@/models/User");
    const User = (await import("@/models/User")).default;

    const certificateResults = [];

    for (const sub of submissions) {
      const isWinner = winners?.some((w: any) => w.userId === sub.userId._id.toString());
      const winnerData = winners?.find((w: any) => w.userId === sub.userId._id.toString());
      
      const certId = "WEBORY-" + crypto.randomBytes(4).toString("hex").toUpperCase();
      const certKey = crypto.randomBytes(16).toString("hex");

      const title = isWinner 
        ? `Hackathon Champion - ${winnerData.rank}${winnerData.rank === 1 ? 'st' : winnerData.rank === 2 ? 'nd' : 'rd'} Place`
        : "Hackathon Participant";
      
      const description = `Awarded for ${isWinner ? 'Outstanding performance' : 'Active participation'} in the ${hackathon.title}. Project: ${sub.projectName}`;

      // Award XP
      const xpAmount = isWinner ? (winnerData.rank === 1 ? 500 : winnerData.rank === 2 ? 300 : 100) : 50;
      await User.findByIdAndUpdate(sub.userId._id, { $inc: { xp: xpAmount } });

      // Create Certificate Record
      const certificate = await CustomCertificate.create({
        studentName: `${(sub.userId as any).firstName} ${(sub.userId as any).lastName}`,
        title,
        description,
        certificateId: certId,
        certificateKey: certKey,
        issuedAt: new Date(),
      });

      // Link certificate to submission
      sub.status = isWinner ? "winner" : "participated";
      if (isWinner) sub.rank = winnerData.rank;
      sub.certificateId = certificate._id;
      await sub.save();

      certificateResults.push({ userId: sub.userId._id, title, certId, xpAwarded: xpAmount });
    }

    return NextResponse.json({
      success: true,
      message: `Hackathon finalized. ${certificateResults.length} certificates generated and XP awarded.`,
      data: certificateResults,
    });
  } catch (error: any) {
    console.error("HACKATHON_FINALIZE_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
