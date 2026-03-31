"use client";

import { useState } from "react";
import { Award, CheckCircle2, Trophy } from "lucide-react";
import { AmbassadorStats } from "./AmbassadorStats";
import { TestimonialEditor } from "./TestimonialEditor";
import { RewardsStore } from "./RewardsStore";
import { RewardsHistory } from "./RewardsHistory";

export function AmbassadorDashboardClient({ 
  initialStats, 
  initialHistory, 
  user 
}: { 
  initialStats: any, 
  initialHistory: any[], 
  user: any 
}) {
  const [stats, setStats] = useState(initialStats);
  const [history, setHistory] = useState(initialHistory);

  const handleRedeemSuccess = async (remainingPoints: number) => {
    // Update local points immediately
    setStats((prev: any) => ({ ...prev, points: remainingPoints }));
    
    // Refresh history
    try {
      const res = await fetch("/api/ambassador/rewards");
      const data = await res.json();
      if (res.ok) {
        setHistory(data.data || []);
      }
    } catch (e) {
      console.error("Failed to refresh history", e);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 uppercase">{user?.firstName || stats?.firstName || "Ambassador"}</span> 👋
              </h1>
              <p className="text-gray-400">Keep crushing your goals and earning rewards!</p>
          </div>
          <div className="flex gap-3">
              <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-medium flex items-center gap-2">
                  <Trophy size={16} /> Rank #{stats?.rank}
              </div>
              <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 size={16} /> Status: {stats.status.toUpperCase()}
              </div>
          </div>
      </div>

      <AmbassadorStats stats={stats} rewardsHistory={history} />
      
      <TestimonialEditor initialTestimonial={stats.testimonial || ""} />
      
      <RewardsStore 
        stats={stats} 
        rewardsHistory={history} 
        onRedeemSuccess={handleRedeemSuccess}
        user={user}
      />
      
      <RewardsHistory history={history} />
    </div>
  );
}
