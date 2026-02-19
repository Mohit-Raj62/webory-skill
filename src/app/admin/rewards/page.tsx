"use client";

import { useEffect, useState } from "react";
import { Copy, Loader2, Search, CheckCircle, XCircle, Clock, Truck, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RewardRequest {
  _id: string;
  ambassadorId: {
    _id: string;
    college: string;
    referralCode: string;
  };
  ambassadorName: string;
  ambassadorEmail: string;
  item: string;
  pointsSpent: number;
  status: "pending" | "shipped" | "rejected";
  shippingAddress: string;
  createdAt: string;
}

export default function AdminRewardsPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<RewardRequest[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "shipped" | "rejected">("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/rewards");
      const data = await res.json();
      if (res.ok) {
        setRequests(data.data);
      } else {
        toast.error("Failed to fetch requests");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching requests");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, status: "shipped" | "rejected") => {
    setProcessingId(requestId);
    try {
        const res = await fetch("/api/admin/rewards", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId, status })
        });
        const data = await res.json();

        if (res.ok) {
            toast.success(`Request marked as ${status}`);
            setRequests(prev => prev.map(req => 
                req._id === requestId ? { ...req, status } : req
            ));
        } else {
            toast.error(data.error || "Update failed");
        }
    } catch (error) {
        toast.error("Something went wrong");
    } finally {
        setProcessingId(null);
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
        req.ambassadorName.toLowerCase().includes(search.toLowerCase()) ||
        req.item.toLowerCase().includes(search.toLowerCase()) ||
        req.ambassadorId.college.toLowerCase().includes(search.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    return matchesSearch && req.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold">Reward Requests</h1>
                <p className="text-gray-400 mt-1">Manage and fulfill ambassador redemption requests.</p>
            </div>
            <div className="flex gap-2">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-medium">
                    <span className="text-gray-400">Total Requests:</span> <span className="text-white ml-2">{requests.length}</span>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl text-sm font-medium text-yellow-400">
                    <span>Pending:</span> <span className="ml-2">{requests.filter(r => r.status === 'pending').length}</span>
                </div>
            </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by name, item, or college..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-blue-500 focus:outline-none"
                />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {(['all', 'pending', 'shipped', 'rejected'] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                            filter === f 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>
        </div>

        {/* Table */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">Ambassador</th>
                            <th className="p-4 font-semibold">Item & Cost</th>
                            <th className="p-4 font-semibold">Shipping Address</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredRequests.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    No requests found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            filteredRequests.map((req) => (
                                <tr key={req._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border border-white/10">
                                                <AvatarFallback className="bg-blue-900/50 text-blue-200 text-xs">
                                                    {req.ambassadorName.substring(0,2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-white">{req.ambassadorName}</div>
                                                <div className="text-xs text-gray-500">{req.ambassadorId.college}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-white">{req.item}</div>
                                        <div className="text-xs text-yellow-500 font-mono">{req.pointsSpent} pts</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="max-w-xs text-sm text-gray-300 line-clamp-2" title={req.shippingAddress}>
                                            {req.shippingAddress}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge 
                                            variant="outline" 
                                            className={`
                                                ${req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
                                                ${req.status === 'shipped' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                                                ${req.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                                            `}
                                        >
                                            {req.status}
                                        </Badge>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        {req.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => handleStatusUpdate(req._id, "shipped")}
                                                    disabled={!!processingId}
                                                    className="h-8 bg-green-600 hover:bg-green-700 text-white px-3"
                                                >
                                                    {processingId === req._id ? <Loader2 className="animate-spin h-3 w-3" /> : (
                                                        <span className="flex items-center gap-1.5 text-xs"><Truck size={12} /> Ship</span>
                                                    )}
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    variant="outline"
                                                    onClick={() => handleStatusUpdate(req._id, "rejected")}
                                                    disabled={!!processingId}
                                                    className="h-8 border-red-500/30 text-red-400 hover:bg-red-500/10 px-3"
                                                >
                                                     <span className="flex items-center gap-1.5 text-xs"><XCircle size={12} /> Reject</span>
                                                </Button>
                                            </div>
                                        )}
                                        {req.status === 'shipped' && <span className="text-xs text-green-500 flex items-center justify-end gap-1"><CheckCircle size={12} /> Fulfilled</span>}
                                        {req.status === 'rejected' && <span className="text-xs text-red-500 flex items-center justify-end gap-1"><XCircle size={12} /> Rejected</span>}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}
