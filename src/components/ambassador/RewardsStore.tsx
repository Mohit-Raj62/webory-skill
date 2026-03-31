"use client";

import { useState } from "react";
import { Gift, Lock, Unlock, Loader2, ShoppingBag, Truck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import dynamic from "next/dynamic";

const CertificateModal = dynamic(() => import("@/components/ambassador/certificate-modal").then(mod => mod.CertificateModal), {
  ssr: false,
});

interface RewardItem {
  id: string;
  name: string;
  cost: number;
  image: string;
  type: "merch" | "virtual";
  gradient: string;
  color: string;
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

export function RewardsStore({ stats, rewardsHistory, onRedeemSuccess, user }: any) {
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [showAddressModal, setShowAddressModal] = useState<string | null>(null);
  const [showRewardModal, setShowRewardModal] = useState<any>(null);

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
            setShowAddressModal(null);
            setAddress("");
            onRedeemSuccess(data.remainingPoints);
        } else {
            toast.error(data.error || "Redemption failed");
        }
    } catch (error) {
        toast.error("Something went wrong");
    } finally {
        setRedeeming(null);
    }
  };

  return (
    <>
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
                const borderColor = isLocked ? 'border-white/5' : `border-emerald-500/30`; // Simplified for now

                return (
                    <div key={reward.id} className={`bg-[#0A0A0A] border ${borderColor} rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group relative`}>
                        <div className={`absolute inset-0 bg-gradient-to-br ${reward.gradient} pointer-events-none ${isLocked ? 'opacity-10' : 'opacity-20'}`}></div>

                        <div className={`h-48 flex items-center justify-center text-7xl relative z-10 ${isLocked ? 'opacity-50' : ''}`}>
                            {reward.image}
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
                            {reward.type === "virtual" && rewardsHistory.some((r: any) => r.item === reward.name) ? (
                                <Button 
                                    className="w-full h-12 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
                                    onClick={() => {
                                        const historyItem = rewardsHistory.find((r: any) => r.item === reward.name);
                                        setShowRewardModal({ ...reward, redeemedAt: historyItem?.createdAt, historyId: historyItem?._id });
                                    }}
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
                            
                            {isLocked && !(reward.type === "virtual" && rewardsHistory.some((r: any) => r.item === reward.name)) && (
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

      {showAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
              <div className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl relative">
                  <div className="absolute top-4 right-4 text-gray-500 hover:text-white cursor-pointer" onClick={() => { setShowAddressModal(null); setAddress(""); }}>
                      <AlertCircle size={24} className="rotate-45" />
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

      {showRewardModal && (
        <CertificateModal 
          isOpen={!!showRewardModal} 
          onClose={() => setShowRewardModal(null)} 
          reward={showRewardModal} 
          stats={stats} 
          user={user} 
        />
      )}
    </>
  );
}
