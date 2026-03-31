"use client";

import { Copy, Share2, Gift, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AmbassadorStatsProps {
  stats: {
    referralCode: string;
    points: number;
    totalSignups: number;
    totalEarned?: number;
  };
  rewardsHistory: any[];
}

export function AmbassadorStats({ stats, rewardsHistory }: AmbassadorStatsProps) {
  const copyCode = () => {
    if (stats?.referralCode) {
      navigator.clipboard.writeText(stats.referralCode);
      toast.success("Referral code copied!");
    }
  };

  const totalEarnedPoints = stats.totalEarned || (stats?.points || 0) + rewardsHistory.filter((r: any) => r.status !== 'rejected').reduce((acc: any, curr: any) => acc + curr.pointsSpent, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Referral Code */}
      <div className="bg-gradient-to-br from-blue-900/40 via-[#0A0A0A] to-[#0A0A0A] border border-blue-500/30 p-8 rounded-3xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <Share2 size={120} />
         </div>
         <div className="relative z-10">
            <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Referral Code</h2>
            <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-mono font-black text-white">{stats?.referralCode}</span>
                <button onClick={copyCode} className="p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-400 transition-colors" title="Copy Code">
                    <Copy size={20} />
                </button>
            </div>
            
            <p className="text-sm text-gray-400 mb-4 tracking-wide">
              Share your unique link. Anyone who signs up using this link will automatically use your code.
            </p>
            
            <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs h-10 font-bold" 
                  onClick={() => {
                     const link = `${window.location.origin}/signup?ref=${stats?.referralCode}`;
                     navigator.clipboard.writeText(link);
                     toast.success("Referral link copied to clipboard!");
                  }}
                >
                  Share Link
                </Button>
                <Button size="sm" variant="outline" className="flex-1 border-white/10 hover:bg-white/5 text-xs h-10" onClick={() => {
                     const link = `${window.location.origin}/signup?ref=${stats?.referralCode}`;
                     navigator.clipboard.writeText(`Hi! I'm learning some really valuable skills at Webory. If you're interested in upgrading your skills too, you can sign up using my link: ${link}`);
                     toast.success("Message copied to clipboard!");
                }}>Copy Message</Button>
            </div>
         </div>
      </div>

       {/* Points */}
       <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Gift size={120} />
         </div>
         <div className="relative z-10">
            <div className="w-12 h-12 bg-yellow-400/10 rounded-xl flex items-center justify-center text-yellow-400 mb-4">
                <Gift size={24} />
            </div>
            <h2 className="text-gray-400 text-sm font-medium mb-1">Available Points</h2>
            <span className="text-5xl font-black text-white">{stats?.points}</span>
            <div className="mt-4 flex items-center gap-2 text-sm text-yellow-400/80">
                <TrendingUp size={16} /> Total Earned: {totalEarnedPoints} pts
            </div>
         </div>
      </div>

      {/* Signups */}
      <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={120} />
         </div>
         <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-400/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                <Users size={24} />
            </div>
            <h2 className="text-gray-400 text-sm font-medium mb-1">Total Signups</h2>
            <span className="text-5xl font-black text-white">{stats?.totalSignups}</span>
            <div className="mt-4 text-sm text-gray-500">
                Goal: {(Math.floor((stats?.totalSignups || 0) / 10) + 1) * 10} signups for next badge
            </div>
         </div>
      </div>
    </div>
  );
}
