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
      
      // Calculate new XP
      const newXp = isWinner ? (winnerData.rank === 1 ? 500 : winnerData.rank === 2 ? 300 : 100) : 50;
      
      // Get previously awarded XP (stored on submission)
      const previousXp = (sub as any).xpAwarded || 0;
      
      // Calculate XP difference (could be positive or negative)
      const xpDiff = newXp - previousXp;

      // Only update user XP if there's a difference
      if (xpDiff !== 0) {
        await User.findByIdAndUpdate(sub.userId._id, { $inc: { xp: xpDiff } });
      }

      // Check if certificate already exists for this submission
      let certificate;
      const title = isWinner 
        ? `Hackathon Champion - ${winnerData.rank}${winnerData.rank === 1 ? 'st' : winnerData.rank === 2 ? 'nd' : 'rd'} Place`
        : "Hackathon Participant";
      
      const description = `Awarded for ${isWinner ? 'Outstanding performance' : 'Active participation'} in the ${hackathon.title}. Project: ${sub.projectName}`;

      if (!sub.certificateId) {
        // First time — create new certificate
        const certId = "WEBORY-" + crypto.randomBytes(4).toString("hex").toUpperCase();
        const certKey = crypto.randomBytes(16).toString("hex");

        certificate = await CustomCertificate.create({
          studentName: `${(sub.userId as any).firstName} ${(sub.userId as any).lastName}`,
          title,
          description,
          certificateId: certId,
          certificateKey: certKey,
          issuedAt: hackathon.endDate, // Fixed to the event end date, rather than the moment admin clicks 'Finalize'
        });
        sub.certificateId = certificate._id;
      } else {
        // Already has certificate — update title/description if rank changed
        await CustomCertificate.findByIdAndUpdate(sub.certificateId, { title, description });
      }

      // Update submission with new status, rank, and XP tracking
      sub.status = isWinner ? "winner" : "participated";
      if (isWinner) sub.rank = winnerData.rank;
      else sub.rank = 0;
      (sub as any).xpAwarded = newXp; // Track how much XP was given
      await sub.save();

      certificateResults.push({ 
        userId: sub.userId._id, 
        title, 
        xpAwarded: newXp, 
        xpDiff, 
        previousXp,
        action: previousXp === 0 ? 'NEW' : xpDiff === 0 ? 'UNCHANGED' : xpDiff > 0 ? 'UPGRADED' : 'DOWNGRADED'
      });
    }

    // Update total XP distributed on the hackathon
    const totalXp = certificateResults.reduce((sum, r) => sum + r.xpAwarded, 0);
    hackathon.totalXpDistributed = totalXp;
    await hackathon.save();

    return NextResponse.json({
      success: true,
      message: `Hackathon finalized. ${certificateResults.length} certificates generated and ${totalXp} XP distributed.`,
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
