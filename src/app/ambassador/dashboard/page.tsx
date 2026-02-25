"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/session-provider";
import { Copy, Loader2, Trophy, Users, ShoppingBag, Gift, AlertCircle, CheckCircle2, Share2, TrendingUp, Lock, Unlock } from "lucide-react";
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
    if (!address.trim()) {
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
                shippingAddress: address
            })
        });

        const data = await res.json();
        
        if (res.ok) {
            toast.success("Reward redeemed! We'll ship it soon. 🎁");
            setStats(prev => prev ? ({ ...prev, points: data.remainingPoints }) : null);
            setShowAddressModal(null);
            setAddress("");
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
    <main className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      <div className="pt-24 pb-20 container mx-auto px-4 md:px-8">
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
                    <h2 className="text-gray-400 text-sm font-medium mb-1">Total Points</h2>
                    <span className="text-5xl font-black text-white">{stats?.points}</span>
                    <div className="mt-4 flex items-center gap-2 text-sm text-yellow-400/80">
                        <TrendingUp size={16} /> Top 5% of Ambassadors
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
                                    
                                    {/* Locked Message */}
                                    {isLocked && (
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
            
            {/* Address Modal (Redesign) */}
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
                                onClick={() => handleRedeem(showAddressModal, REWARDS.find(r => r.id === showAddressModal)?.cost || 0)}
                            >
                                Confirm Order
                            </Button>
                        </div>
                    </div>
                </div>
            )}

          </div>
        )}
      </div>

      <Footer />
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
