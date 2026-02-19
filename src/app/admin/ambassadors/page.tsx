
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Clock, Linkedin, Users, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link"; // Import Link correctly

interface AmbassadorApp {
  _id: string;
  userId: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  college: string;
  linkedin: string;
  reason: string;
  referralCode: string;
  status: "active" | "pending" | "rejected" | "suspended";
  points: number;
  totalSignups: number;
  createdAt: string;
}

export default function AdminAmbassadorsPage() {
  const [ambassadors, setAmbassadors] = useState<AmbassadorApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAmbassadors();
  }, [filter]);

  const fetchAmbassadors = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ambassadors?status=${filter}`);
      const data = await res.json();
      if (res.ok) {
        setAmbassadors(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch ambassadors", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
        const res = await fetch("/api/admin/ambassadors", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ambassadorId: id, status }),
        });
        const data = await res.json();
        if (res.ok) {
            toast.success(`Ambassador ${status} successfully`);
            fetchAmbassadors();
        } else {
            toast.error(data.error);
        }
    } catch (error) {
        toast.error("Failed to update status");
    }
  };


  // Stats Calculation
  const totalAmbassadors = ambassadors.length;
  const pendingCount = ambassadors.filter(a => a.status === 'pending').length;
  const activeCount = ambassadors.filter(a => a.status === 'active').length;
  const rejectedCount = ambassadors.filter(a => a.status === 'rejected').length;

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      <div className="pt-8 pb-20 container mx-auto px-4 max-w-6xl">
        
        {/* Header & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
            <div className="lg:col-span-1">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
                    Ambassadors
                </h1>
                <p className="text-gray-400 mt-2 text-sm">Manage pending applications and track performance.</p>
            </div>
            
            <StatsCard label="Total" value={totalAmbassadors} icon={<Users size={18} />} color="text-blue-400" bg="bg-blue-500/10" border="border-blue-500/20" />
            <StatsCard label="Pending" value={pendingCount} icon={<Clock size={18} />} color="text-yellow-400" bg="bg-yellow-500/10" border="border-yellow-500/20" />
            <StatsCard label="Active" value={activeCount} icon={<CheckCircle size={18} />} color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white/5 p-1.5 rounded-xl w-fit border border-white/10">
            {["all", "pending", "active", "rejected"].map((f) => (
                <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === f ? "bg-white/10 text-white shadow-lg border border-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                >
                    {f}
                </button>
            ))}
        </div>

        {/* Content */}
        {loading ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-500">
                <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
                <p>Loading details...</p>
            </div>
        ) : (
            <div className="grid gap-6">
                {ambassadors.map((app) => (
                    <div key={app._id} className="group relative bg-[#0A0A0A] border border-white/5 hover:border-white/10 p-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5">
                        
                        {/* Grid Layout for Card */}
                        <div className="flex flex-col md:flex-row gap-6">
                            
                            {/* User Info */}
                            <div className="flex gap-5 flex-1">
                                <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center text-xl font-bold border border-white/10 shadow-inner">
                                    {app.userId.avatar ? (
                                        <img src={app.userId.avatar} alt={app.userId.firstName} className="w-full h-full object-cover rounded-2xl" />
                                    ) : (
                                       <span className="text-gray-400">{app.userId.firstName[0]}</span>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{app.userId.firstName} {app.userId.lastName}</h3>
                                        <Badge status={app.status} />
                                    </div>
                                    <p className="text-gray-400 text-sm flex items-center gap-2">
                                        {app.userId.email} 
                                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span> 
                                        {app.userId.phone}
                                    </p>
                                    <p className="text-blue-400_ text-sm font-medium mt-1 text-gray-300 bg-white/5 px-2 py-0.5 rounded inline-block border border-white/5">
                                        🎓 {app.college}
                                    </p>
                                </div>
                            </div>

                            {/* Details & Actions */}
                            <div className="flex flex-col md:items-end gap-4 min-w-[200px]">
                                {app.status === 'pending' ? (
                                    <div className="flex gap-3 w-full md:w-auto">
                                        <Button onClick={() => updateStatus(app._id, "active")} className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-600/20 transition-all flex-1 md:flex-none">
                                            <CheckCircle size={16} className="mr-2" /> Approve
                                        </Button>
                                        <Button onClick={() => updateStatus(app._id, "rejected")} className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-600/20 transition-all flex-1 md:flex-none">
                                            <XCircle size={16} className="mr-2" /> Reject
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex gap-4 text-right">
                                        <div>
                                            <div className="text-2xl font-bold text-white">{app.points}</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Points</div>
                                        </div>
                                        <div className="w-px h-10 bg-white/10"></div>
                                        <div>
                                            <div className="text-2xl font-bold text-white">{app.totalSignups}</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Referrals</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expanded Details */}
                        <div className="mt-6 pt-6 border-t border-white/5 grid md:grid-cols-2 gap-6">
                            <div>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Reason for Joining</span>
                                <p className="text-gray-300 text-sm leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">
                                    "{app.reason}"
                                </p>
                            </div>
                            <div className="flex flex-col justify-between">
                                 <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Social</span>
                                    {app.linkedin ? (
                                        <a href={app.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-400 hover:text-white transition-colors bg-blue-500/10 hover:bg-blue-600 px-3 py-2 rounded-lg border border-blue-500/20">
                                            <Linkedin size={16} /> 
                                            <span className="text-sm font-medium">View LinkedIn Profile</span>
                                            <ExternalLink size={12} className="opacity-50" />
                                        </a>
                                    ) : (
                                        <span className="text-gray-500 text-sm italic">No LinkedIn profile provided</span>
                                    )}
                                 </div>
                                 <div className="text-right mt-4 md:mt-0">
                                     <span className="text-xs text-gray-600">Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                                 </div>
                            </div>
                        </div>

                    </div>
                ))}
                
                {ambassadors.length === 0 && (
                    <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl border-dashed">
                        <Users className="mx-auto text-gray-600 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-gray-300">No Ambassadors Found</h3>
                        <p className="text-gray-500 mt-2">Try changing the filter or wait for new applications.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </main>
  );
}

function StatsCard({ label, value, icon, color, bg, border }: any) {
    return (
        <div className={`p-5 rounded-2xl border ${border} ${bg} flex items-center justify-between`}>
            <div>
                <p className={`text-sm font-medium ${color} mb-1`}>{label}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-black/20`}>
                {icon}
            </div>
        </div>
    )
}

function Badge({ status }: { status: string }) {
    const styles = {
        active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        rejected: "bg-red-500/10 text-red-500 border-red-500/20",
        suspended: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };
    
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${styles[status as keyof typeof styles] || styles.pending}`}>
            {status}
        </span>
    );
}
