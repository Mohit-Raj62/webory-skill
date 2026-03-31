import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { getUser } from "@/lib/get-user";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Ambassador from "@/models/Ambassador";
import RewardRequest from "@/models/RewardRequest";
import { AmbassadorRegistration } from "@/components/ambassador/AmbassadorRegistration";
import { AmbassadorDashboardClient } from "@/components/ambassador/AmbassadorDashboardClient";

export default async function AmbassadorDashboard() {
  const user = await getUser();

  if (!user) {
    redirect("/login?redirect=/ambassador/dashboard");
  }

  await dbConnect();

  // Fetch Ambassador Profile
  const ambassador = await Ambassador.findOne({ userId: user._id }).lean();

  if (!ambassador) {
    // Show Registration View
    return (
      <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
        <Navbar />
        <div className="pt-24 pb-20 container mx-auto px-4 md:px-8">
            <AmbassadorRegistration onSuccess={() => redirect("/ambassador/dashboard")} />
        </div>
        <Footer />
      </main>
    );
  }

  // Handle Pending View
  if (ambassador.status === "pending") {
    return (
      <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center container mx-auto px-4">
            <div className="text-center max-w-lg bg-[#0A0A0A] border border-white/10 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>
                <AlertCircle size={48} className="text-yellow-400 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">Application Pending</h1>
                <p className="text-gray-400 mb-8 leading-relaxed">
                    Hold tight! Our team is reviewing your profile showing your leadership potential. 
                    You'll receive an email once approved.
                </p>
                <Link href="/">
                    <Button variant="outline" className="w-full text-white border-white/10 hover:bg-white/5 h-12 rounded-xl">Back to Home</Button>
                </Link>
            </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Handle Rejected View
  if (ambassador.status === "rejected") {
    return (
      <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center container mx-auto px-4">
            <div className="text-center max-w-lg bg-[#0A0A0A] border border-red-500/20 p-10 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -z-10"></div>
                <AlertCircle size={48} className="text-red-400 mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4 text-red-400">Application Status</h1>
                <p className="text-gray-400 mb-8">
                    We appreciate your interest, but we are unable to accept your application at this time.
                </p>
                <Link href="/">
                    <Button variant="outline" className="w-full text-white border-white/10 hover:bg-white/5 h-12 rounded-xl">Return Home</Button>
                </Link>
            </div>
        </div>
        <Footer />
      </main>
    );
  }

  // ACTIVE DASHBOARD LOGIC (moved to server)
  
  // Calculate total spent points for current ambassador (non-rejected rewards)
  const spentResult = await RewardRequest.aggregate([
    { $match: { ambassadorId: ambassador._id, status: { $ne: "rejected" } } },
    { $group: { _id: null, totalSpent: { $sum: "$pointsSpent" } } },
  ]);
  const myTotalSpent = spentResult.length > 0 ? spentResult[0].totalSpent : 0;
  const myTotalEarned = (ambassador.points || 0) + myTotalSpent;

  // Calculate rank
  const higherRankedCount = await Ambassador.aggregate([
      {
          $lookup: {
              from: "rewardrequests",
              let: { ambId: "$_id" },
              pipeline: [
                  { $match: { $expr: { $and: [{ $eq: ["$ambassadorId", "$$ambId"] }, { $ne: ["$status", "rejected"] }] } } },
                  { $group: { _id: null, totalSpent: { $sum: "$pointsSpent" } } }
              ],
              as: "rewards"
          }
      },
      {
          $addFields: {
              totalEarned: { $add: [{ $ifNull: ["$points", 0] }, { $ifNull: [{ $arrayElemAt: ["$rewards.totalSpent", 0] }, 0] }] }
          }
      },
      {
          $match: {
              _id: { $ne: ambassador._id },
              $or: [
                  { totalEarned: { $gt: myTotalEarned } },
                  { totalEarned: myTotalEarned, createdAt: { $lt: ambassador.createdAt } }
              ]
          }
      },
      { $count: "count" }
  ]);
  
  const rank = (higherRankedCount.length > 0 ? higherRankedCount[0].count : 0) + 1;

  // Fetch Rewards History
  const history = await RewardRequest.find({ ambassadorId: ambassador._id }).sort({ createdAt: -1 }).lean();

  const serializedStats = JSON.parse(JSON.stringify({ 
    ...ambassador, 
    rank, 
    totalEarned: myTotalEarned 
  }));
  const serializedHistory = JSON.parse(JSON.stringify(history));

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 print:bg-white print:min-h-0 relative">
      <div className="print:hidden"><Navbar /></div>

      <div className="pt-24 pb-20 container mx-auto px-4 md:px-8 print:hidden">
        <AmbassadorDashboardClient 
          initialStats={serializedStats} 
          initialHistory={serializedHistory} 
          user={JSON.parse(JSON.stringify(user))} 
        />
      </div>

      <div className="print:hidden"><Footer /></div>
    </main>
  );
}
