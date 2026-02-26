"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/session-provider";
import { Copy, Loader2, Trophy, Users, ShoppingBag, Gift, AlertCircle, CheckCircle2, Share2, TrendingUp, Lock, Unlock, Award } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AmbassadorStats {
  referralCode: string;
  points: number;
  totalSignups: number;
  rank: number;
  college: string;
  firstName?: string;
  lastName?: string;
  status: "active" | "suspended" | "pending" | "rejected";
}

interface RewardItem {
  id: string;
  name: string;
  cost: number;
  image: string;
  type: "merch" | "virtual";
  gradient: string; // Dynamic Gradient
  color: string; // Text Color
}

const REWARDS: RewardItem[] = [
  { id: "cert", name: "Ambassador Certificate", cost: 50, image: "📜", type: "virtual", gradient: "from-yellow-500/20 to-orange-500/5", color: "text-yellow-400" },
  { id: "stickers", name: "Webory Sticker Pack", cost: 100, image: "✨", type: "merch", gradient: "from-pink-500/20 to-purple-500/5", color: "text-pink-400" },
  { id: "notebook", name: "Webory Notebook", cost: 200, image: "📔", type: "merch", gradient: "from-blue-500/20 to-cyan-500/5", color: "text-blue-400" },
  { id: "mug", name: "Webory Coffee Mug", cost: 300, image: "☕", type: "merch", gradient: "from-amber-700/20 to-orange-900/5", color: "text-amber-500" },
  { id: "tshirt", name: "Official T-Shirt", cost: 500, image: "👕", type: "merch", gradient: "from-indigo-600/20 to-blue-500/5", color: "text-indigo-400" },
  { id: "voucher100", name: "Amazon Voucher ₹100", cost: 700, image: "🎁", type: "virtual", gradient: "from-orange-500/20 to-yellow-500/5", color: "text-orange-400" },
  { id: "hoodie", name: "Premium Hoodie", cost: 1000, image: "🧥", type: "merch", gradient: "from-purple-600/20 to-pink-500/5", color: "text-purple-400" },
  { id: "backpack", name: "Tech Backpack", cost: 2500, image: "🎒", type: "merch", gradient: "from-emerald-600/20 to-teal-500/5", color: "text-emerald-400" },
];

export default function AmbassadorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dataLoading, setDataLoading] = useState(true);
  const [stats, setStats] = useState<AmbassadorStats | null>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [certScale, setCertScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      
      // Calculate space needed for modal padding and fixed banners
      const paddingX = window.innerWidth < 768 ? 32 : 64; 
      const paddingY = 180; // Space for the top close button and bottom Print banner
      
      const availableWidth = window.innerWidth - paddingX;
      const availableHeight = window.innerHeight - paddingY;
      
      const scaleX = availableWidth / 1122;
      const scaleY = availableHeight / 794;
      
      // Scale down to fit the smallest dimension, but cap at 1 to prevent enlarging past native size
      setCertScale(Math.min(scaleX, scaleY, 1));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Registration State
  const [isRegistered, setIsRegistered] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<"none" | "pending" | "active" | "rejected" | "suspended">("none");
  
  const [formData, setFormData] = useState({
    college: "",
    linkedin: "",
    reason: ""
  });
  const [registering, setRegistering] = useState(false);

  // Rewards State
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [showAddressModal, setShowAddressModal] = useState<string | null>(null);
  const [rewardsHistory, setRewardsHistory] = useState<any[]>([]);
  const [showRewardModal, setShowRewardModal] = useState<any>(null); // For showing specific virtual rewards

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login?redirect=/ambassador/dashboard");
      return;
    }

    fetchStats();
  }, [user, authLoading, router]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/ambassador/stats");
      const data = await res.json();

      if (res.ok) {
        setStats(data.data);
        setIsRegistered(true);
        setApplicationStatus(data.data.status);
        
        // Fetch history if registered and active
        if (data.data.status === "active") {
          const resRewards = await fetch("/api/ambassador/rewards");
          const dataRewards = await resRewards.json();
          if (resRewards.ok) {
            setRewardsHistory(dataRewards.data || []);
          }
        }
      } else if (data.notRegistered) {
        setIsRegistered(false);
        setApplicationStatus("none");
      }
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    try {
      const res = await fetch("/api/ambassador/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Application submitted! 🚀");
      setIsRegistered(true);
      setApplicationStatus("pending");
      fetchStats();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setRegistering(false);
    }
  };

  const copyCode = () => {
    if (stats?.referralCode) {
      navigator.clipboard.writeText(stats.referralCode);
      toast.success("Referral code copied!");
    }
  };

  const handleRedeem = async (itemId: string, cost: number) => {
    const isVirtual = REWARDS.find(r => r.id === itemId)?.type === "virtual";

    if (!isVirtual && !address.trim()) {
        setShowAddressModal(itemId);
        return;
    }

    setRedeeming(itemId);
    try {
        const res = await fetch("/api/ambassador/rewards", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                item: REWARDS.find(r => r.id === itemId)?.name,
                cost,
                shippingAddress: isVirtual ? "Virtual Delivery" : address
            })
        });

        const data = await res.json();
        
        if (res.ok) {
            toast.success(isVirtual ? "Reward claimed successfully! 🎉" : "Reward redeemed! We'll ship it soon. 🎁");
            setStats(prev => prev ? ({ ...prev, points: data.remainingPoints }) : null);
            setShowAddressModal(null);
            setAddress("");
            fetchStats(); // Refresh history
        } else {
            toast.error(data.error || "Redemption failed");
        }
    } catch (error) {
        toast.error("Something went wrong");
    } finally {
        setRedeeming(null);
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  // Pending View
  if (applicationStatus === "pending") {
    return (
        <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
            <Navbar />
            <div className="min-h-screen flex items-center justify-center container mx-auto px-4">
                <div className="text-center max-w-lg bg-[#0A0A0A] border border-white/10 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>
                    <Clock size={48} className="text-yellow-400 mx-auto mb-6" />
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

  // Rejected View
  if (applicationStatus === "rejected") {
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

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 print:bg-white print:min-h-0 relative">
      <div className="print:hidden"><Navbar /></div>

      <div className="pt-24 pb-20 container mx-auto px-4 md:px-8 print:hidden">
        {!isRegistered ? (
          // Registration Form
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto mt-10"
          >
            <div className="bg-[#0A0A0A] border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-blue-500/20">
                    <Trophy size={32} />
                  </div>
                  <h1 className="text-3xl font-bold mb-3">Join the Leaders</h1>
                  <p className="text-gray-400">Apply now to represent Webory at your campus.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">College / University</label>
                    <input
                      type="text"
                      required
                      value={formData.college}
                      onChange={(e) => setFormData({...formData, college: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white active:bg-black focus:bg-black focus:border-blue-500 transition-all outline-none placeholder:text-gray-600"
                      placeholder="e.g. IIT Bombay"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">LinkedIn Profile</label>
                    <input
                      type="url"
                      required
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white active:bg-black focus:bg-black focus:border-blue-500 transition-all outline-none placeholder:text-gray-600"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                   <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Motivational Statement</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white active:bg-black focus:bg-black focus:border-blue-500 transition-all outline-none placeholder:text-gray-600 resize-none"
                      placeholder="Why do you want to join? What makes you a good leader?"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={registering}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-6 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
                  >
                    {registering ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Submitting...</span> : "Submit Application"}
                  </Button>
                </form>
            </div>
          </motion.div>
        ) : (
          // Dashboard (Only shown if ACTIVE)
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
                        <CheckCircle2 size={16} /> Status: {applicationStatus.toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
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
                        <TrendingUp size={16} /> Total Earned: {(stats?.points || 0) + rewardsHistory.filter((r: any) => r.status !== 'rejected').reduce((acc: any, curr: any) => acc + curr.pointsSpent, 0)} pts
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

            {/* Rewards Section */}
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                         <ShoppingBag size={24} /> 
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Rewards Store</h2>
                        <p className="text-sm text-gray-400">Redeem your hard-earned points for exclusive swag.</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {REWARDS.map((reward) => {
                        const isLocked = !stats || stats.points < reward.cost;
                        
                        // Dynamic Border Color based on reward theme (using text color as proxy or a map)
                        const borderColor = isLocked ? 'border-white/5' : `border-${reward.color.split('-')[1]}-500/30`;

                        return (
                            <div key={reward.id} className={`bg-[#0A0A0A] border ${borderColor} rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group relative`}>
                                {/* Background Gradient for Color - Increased Opacity */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${reward.gradient} pointer-events-none ${isLocked ? 'opacity-10' : 'opacity-20'}`}></div>

                                {/* Icon - Removed Grayscale, added Glow */}
                                <div className={`h-48 flex items-center justify-center text-7xl relative z-10 ${isLocked ? 'opacity-50' : ''}`}>
                                    {reward.image}
                                    {/* Icon Glow */}
                                    <div className={`absolute z-[-1] w-32 h-32 rounded-full blur-[50px] opacity-20 bg-white/20 group-hover:opacity-40 transition-opacity`}></div>
                                </div>
                                
                                <div className="p-6 relative z-10 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`font-bold text-lg leading-tight ${isLocked ? 'text-gray-400' : 'text-white'}`}>{reward.name}</h3>
                                        {isLocked ? <Lock size={16} className="text-gray-500 mt-1" /> : <Unlock size={16} className="text-green-400 mt-1" />}
                                    </div>
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className={`text-xl font-bold ${isLocked ? 'text-gray-500' : reward.color}`}>{reward.cost}</span>
                                        <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Points</span>
                                    </div>
                                    {reward.type === "virtual" && rewardsHistory.some(r => r.item === reward.name) ? (
                                        <Button 
                                            className="w-full h-12 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                                            onClick={() => setShowRewardModal(reward)}
                                        >
                                            Show Reward
                                        </Button>
                                    ) : (
                                        <Button 
                                            className={`w-full h-12 rounded-xl font-bold shadow-lg transition-all ${
                                                isLocked 
                                                ? 'bg-white/5 text-gray-500 hover:bg-white/10 cursor-not-allowed' 
                                                : `bg-gradient-to-r ${reward.gradient.replace('/20', '').replace('/5', '')} text-white shadow-lg transform hover:-translate-y-1`
                                            }`}
                                            disabled={isLocked || redeeming === reward.id}
                                            onClick={() => handleRedeem(reward.id, reward.cost)}
                                        >
                                            {redeeming === reward.id ? <Loader2 className="animate-spin" /> : isLocked ? "Locked" : "Redeem Reward"}
                                        </Button>
                                    )}
                                    
                                    {/* Locked Message */}
                                    {isLocked && !(reward.type === "virtual" && rewardsHistory.some(r => r.item === reward.name)) && (
                                        <div className="mt-3 text-center">
                                            <span className="text-xs text-gray-500 font-medium bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                                Need {reward.cost - (stats?.points || 0)} more pts
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* History Section */}
            {rewardsHistory.length > 0 && (
                <div className="mt-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                             <TrendingUp size={24} /> 
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Points & Rewards History</h2>
                            <p className="text-sm text-gray-400">Track your earnings and redeemed items.</p>
                        </div>
                    </div>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10 text-sm font-bold text-gray-400 uppercase">
                                        <th className="p-4 px-6 min-w-[200px]">Item</th>
                                        <th className="p-4 px-6">Points Spent</th>
                                        <th className="p-4 px-6">Date</th>
                                        <th className="p-4 px-6">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rewardsHistory.map((historyItem: any, i) => (
                                        <tr key={historyItem._id || i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4 px-6 font-medium text-white">{historyItem.item}</td>
                                            <td className="p-4 px-6 text-yellow-400 font-bold">-{historyItem.pointsSpent} pts</td>
                                            <td className="p-4 px-6 text-gray-400">{new Date(historyItem.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4 px-6">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                                                    historyItem.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                    historyItem.status === 'shipped' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    historyItem.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    'bg-green-500/10 text-green-500 border-green-500/20'
                                                }`}>
                                                    {historyItem.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

          </div>
        )}
      </div>

      {/* Address Modal (Redesign) */}
      <div className="print:hidden">
        {showAddressModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
                <div className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl relative">
                    <div className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer" onClick={() => { setShowAddressModal(null); setAddress(""); }}>
                        <AlertCircle size={24} className="rotate-45" /> {/* Close icon lookalike */}
                    </div>
                    <div className="mb-6">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 mb-4">
                            <Truck size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Shipping Details</h3>
                        <p className="text-gray-400 text-sm">Where should we send your reward?</p>
                    </div>
                    
                    <textarea
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white mb-6 focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder:text-gray-600"
                        rows={4}
                        placeholder="Full Name&#10;Street Address&#10;City, State, Zip Code&#10;Phone Number"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    
                    <div className="flex gap-3">
                        <Button variant="ghost" className="flex-1 h-12 rounded-xl hover:bg-white/5" onClick={() => { setShowAddressModal(null); setAddress(""); }}>Cancel</Button>
                        <Button 
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-12 rounded-xl font-bold"
                            disabled={!address}
                            onClick={() => handleRedeem(showAddressModal as string, REWARDS.find(r => r.id === showAddressModal)?.cost || 0)}
                        >
                            Confirm Order
                        </Button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Virtual Reward / Certificate Modal */}
      {showRewardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 print:absolute print:inset-auto print:p-0 print:bg-transparent print:backdrop-blur-none">
              <div className="bg-[#111] border border-white/10 p-2 text-center rounded-3xl max-w-6xl w-full shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:p-0">
                  <div className="absolute top-4 right-4 z-20 text-gray-500 hover:text-white cursor-pointer bg-black/50 p-2 rounded-full print:hidden" onClick={() => setShowRewardModal(null)}>
                      <AlertCircle size={24} className="rotate-45" />
                  </div>
                  
                  {showRewardModal.id === "cert" ? (
                      <div className="relative w-full overflow-hidden bg-[#111] p-0 md:p-8 flex justify-center pb-24 print:pb-0 print:p-0 print:bg-white print:overflow-visible my-12 md:my-0 print:m-0">
                          {/* Flexible Scaling Container */}
                          <div 
                              className="relative mx-auto overflow-hidden shadow-2xl print:shadow-none print:overflow-visible"
                              style={{
                                  width: `${1122 * certScale}px`,
                                  height: `${794 * certScale}px`,
                                  maxWidth: '100%',
                              }}
                          >
                              <div 
                                  id="certificate-container"
                                  style={{
                                      width: '1122px', 
                                      height: '794px', 
                                      transform: `scale(${certScale})`,
                                      transformOrigin: 'top left',
                                  }}
                                  className="bg-white text-black absolute top-0 left-0 print:!scale-100 print:relative print:transform-none"
                              >
                              {/* Outer Border */}
                              <div className="absolute inset-0 p-[12px]">
                                  <div className="w-full h-full border-[12px] border-double border-[#1a237e] relative">
                                      {/* Inner Ornamental Border */}
                                      <div className="absolute inset-1 border border-[#c5a059]"></div>
                                      <div className="absolute inset-3 border-2 border-[#1a237e]"></div>

                                      {/* Corner Ornaments */}
                                      <div className="absolute top-0 left-0 w-24 h-24 border-t-[12px] border-l-[12px] border-[#c5a059] rounded-tl-sm"></div>
                                      <div className="absolute top-0 right-0 w-24 h-24 border-t-[12px] border-r-[12px] border-[#c5a059] rounded-tr-sm"></div>
                                      <div className="absolute bottom-0 left-0 w-24 h-24 border-b-[12px] border-l-[12px] border-[#c5a059] rounded-bl-sm"></div>
                                      <div className="absolute bottom-0 right-0 w-24 h-24 border-b-[12px] border-r-[12px] border-[#c5a059] rounded-br-sm"></div>
                                  </div>
                              </div>

                              {/* Background Watermark and Texture */}
                              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                                  {/* Fine Grid Pattern overlay for official document feel */}
                                  <div className="absolute inset-0 bg-[#fdfaf5] opacity-90 blur-[1px]"></div>
                                  
                                  {/* Large seal watermark */}
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
                                      <Award size={650} className="text-[#1a237e]" strokeWidth={0.5} />
                                  </div>
                              </div>

                              {/* Content */}
                              <div className="relative z-10 h-full flex flex-col items-center justify-between pt-14 pb-8 px-24 border-[1px] border-transparent">
                                  {/* Header */}
                                  <div className="text-center w-full">
                                      <div className="flex items-start justify-center gap-4 mb-2">
                                          <Award className="text-[#c5a059] mt-1" size={40} />
                                          <div className="text-left">
                                              <h2 className="text-3xl font-bold text-[#1a237e] tracking-wide uppercase font-serif">
                                                  WEBORY <span className="relative inline-block ml-2">
                                                      <span className="absolute -top-1.5 left-[30%] -translate-x-1/2 flex gap-1">
                                                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"></span>
                                                          <span className="w-1.5 h-1.5 rounded-full bg-white border border-gray-200"></span>
                                                          <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"></span>
                                                      </span>
                                                      SKILLS
                                                  </span>
                                              </h2>
                                              <p className="text-sm text-[#c5a059] tracking-[0.2em] uppercase">Excellence in Education</p>
                                              <div className="flex gap-4 mt-1">
                                                  <div className="flex flex-col items-start border-l-2 border-[#c5a059] pl-2">
                                                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Govt. of India Recognized</p>
                                                      <p className="text-[9px] text-[#c5a056] font-bold font-mono tracking-wider">MSME Reg: UDYAM-BR-26-0208472</p>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>

                                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#1a237e] to-transparent mb-6 opacity-30 mt-3"></div>

                                      <h1 className="text-[2.8rem] leading-none font-serif font-extrabold text-[#1a237e] mb-2 tracking-tight certificate-title drop-shadow-sm">
                                          Certificate of Excellence
                                      </h1>
                                      <p className="text-xl text-gray-500 italic font-serif mt-2 mb-2">This proudly certifies that</p>
                                  </div>

                                  {/* Recipient */}
                                  <div className="text-center w-full my-0 py-0 relative z-10">
                                      <h2 className="text-6xl font-serif font-bold text-[#1a237e] px-12 pb-2 pt-2 inline-block border-b-2 border-[#c5a059] min-w-[500px] capitalize tracking-wide shadow-black/5 drop-shadow-sm">
                                          {`${stats?.firstName || user?.firstName || ''} ${stats?.lastName || user?.lastName || ''}`.trim() || "Campus Ambassador"}
                                      </h2>
                                  </div>

                                  {/* Certificate Details */}
                                  <div className="text-center w-full mt-2 relative z-10 px-8">
                                      <p className="text-[1.3rem] text-gray-700 font-serif max-w-4xl mx-auto leading-[1.8] tracking-wide">
                                          is a recognized <span className="font-extrabold text-[#1a237e]">Campus Ambassador</span> for Webory Skills from <br/>
                                          <span className="font-bold text-[#1a237e] text-3xl block mt-2 mb-2 tracking-wider uppercase">{stats?.college || "their institution"}</span> 
                                          demonstrating exceptional leadership, dedication, and community participation.
                                      </p>
                                  </div>

                                  {/* Footer / Signatures */}
                                  <div className="w-full flex justify-between items-end px-16 mt-4">
                                      {/* Date */}
                                      <div className="text-center w-64">
                                          <div className="border-b border-gray-400 w-full mb-1 pb-3 text-2xl font-bold text-[#1a237e] font-sans">
                                              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                          </div>
                                          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Date of Issue</p>
                                      </div>

                                      {/* Official Seal */}
                                      <div className="w-64 flex justify-center pb-2">
                                          <div className="relative w-32 h-32 flex items-center justify-center">
                                              <div className="absolute inset-0 border-4 border-[#c5a059] border-dashed rounded-full animate-[spin_10s_linear_infinite] opacity-30"></div>
                                              <div className="w-28 h-28 rounded-full border-4 border-[#c5a059] flex items-center justify-center bg-yellow-50/90 shadow-inner">
                                                  <div className="text-center">
                                                      <Trophy className="mx-auto text-[#c5a059] mb-1" size={28} />
                                                      <span className="text-xs font-bold uppercase text-[#c5a059] tracking-wider block leading-tight">Official<br/>Ambassador</span>
                                                  </div>
                                              </div>
                                          </div>
                                      </div>

                                      {/* Signature */}
                                      <div className="text-center w-64">
                                          <div className="h-16 flex items-end justify-center mb-1 pb-2">
                                              <span className="font-signature text-5xl text-[#1a237e] whitespace-nowrap px-2">
                                                  Vijay Kumar
                                              </span>
                                          </div>
                                          <div className="border-t border-gray-400 w-full pt-2">
                                              <p className="text-sm text-gray-600 font-bold uppercase tracking-widest mt-2">Director of Education</p>
                                              <p className="text-xs text-[#1a237e] font-bold">Webory Skills</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          </div>
                      </div>
                  ) : (
                      <div className="p-10 text-center text-white print:hidden">
                          <span className="text-6xl block mb-6">{showRewardModal.image}</span>
                          <h3 className="text-2xl font-bold mb-4">Your {showRewardModal.name}</h3>
                          <p className="text-gray-400 mb-8">This digital reward is currently active on your account.</p>
                          <Button onClick={() => setShowRewardModal(null)} variant="outline" className="border-white/10 hover:bg-white/5">Close</Button>
                      </div>
                  )}
                  
                  {showRewardModal.id === "cert" && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-md p-4 flex justify-center gap-4 border-t border-white/10 z-30 print:hidden">
                          <Button 
                              className="bg-white text-black hover:bg-gray-200"
                              onClick={() => window.print()}
                          >
                              Print / Save as PDF
                          </Button>
                          <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white" onClick={() => setShowRewardModal(null)}>Close</Button>
                      </div>
                  )}
              </div>
          </div>
      )}

      <div className="print:hidden"><Footer /></div>
      
      <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Mr+De+Haviland&display=swap');

          .font-serif {
              font-family: 'Playfair Display', serif;
          }
          .font-signature {
              font-family: 'Mr De Haviland', cursive;
          }

          @media print {
              @page {
                  size: A4 landscape;
                  margin: 0;
              }
              html, body {
                  width: 100%;
                  height: 100%;
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow: hidden !important;
                  background-color: white !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
              }
              #certificate-container {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 1122px !important;
                  height: 794px !important;
                  background-color: white !important;
              }
          }
      `}</style>
    </main>
  );
}

// Helper icon
function Clock({ size, className }: { size: number, className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}

// Helper icon
function Truck({ size, className }: { size: number, className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v7a2 2 0 0 1 2 2 2 2 0 0 1 2-2 2 2 0 0 1 2 2v.5a2.5 2.5 0 0 1-5 0v-.5"/><path d="M15 6h-5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V8a2 2 0 0 1 2-2h1"/><rect x="1" y="6" width="4" height="12"/></svg>
}
