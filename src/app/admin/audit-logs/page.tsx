"use client";

import { useState, useEffect } from "react";
import { History, Search, RefreshCw, Shield, Crown, Calendar, Filter, ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [actionFilter, setActionFilter] = useState("ALL");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchLogs = async (targetPage = page) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/maintenance/logs?page=${targetPage}&limit=20&_t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
                if (data.pagination) {
                    setTotalPages(data.pagination.totalPages || 1);
                    setTotalCount(data.pagination.totalCount || 0);
                    setPage(data.pagination.currentPage || 1);
                }
            }
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs(1);
    }, []);

    const filteredLogs = logs.filter((log) => {
        const matchesAction = actionFilter === "ALL" || log.action === actionFilter;
        const matchesSearch =
            !searchTerm ||
            log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            `${log.user?.firstName} ${log.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesAction && matchesSearch;
    });

    const getActionBadgeColor = (action: string) => {
        if (action.includes("DELETE")) return "bg-red-500/20 text-red-300 border-red-500/40";
        if (action.includes("CREATE")) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
        if (action.includes("UPDATE") || action.includes("VERIFY")) return "bg-blue-500/20 text-blue-300 border-blue-500/40";
        if (action.includes("LOGIN") || action.includes("LOGOUT")) return "bg-purple-500/20 text-purple-300 border-purple-500/40";
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    };

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto min-h-screen text-slate-100 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                            <History size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                                    Audit Logs (Admin Activity)
                                </h1>
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    <Crown size={11} /> Founder Exclusive
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                                Real-time audit trail of all actions performed by Admins and Teachers across the platform
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={() => fetchLogs(page)}
                    variant="outline"
                    className="h-10 px-4 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl flex items-center gap-2 text-xs font-semibold cursor-pointer"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Refresh Logs</span>
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                            <Activity size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Total Recorded Actions</p>
                            <p className="text-2xl font-black text-white">{totalCount}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Audit Window</p>
                            <p className="text-2xl font-black text-white">30 Days</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                            <Crown size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Security Status</p>
                            <p className="text-2xl font-black text-emerald-400">Active & Monitored</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by admin name, email, or details..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 outline-none focus:border-blue-500/50"
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <Filter size={14} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-400 shrink-0">Filter Action:</span>
                    <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="h-10 px-3 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none cursor-pointer"
                    >
                        <option value="ALL">All Actions</option>
                        <option value="CREATE_COURSE">Create Course</option>
                        <option value="UPDATE_COURSE">Update Course</option>
                        <option value="DELETE_COURSE">Delete Course</option>
                        <option value="VERIFY_USER">Verify / Change Role</option>
                        <option value="DELETE_USER">Delete User</option>
                        <option value="LOGIN">Admin Login</option>
                        <option value="LOGOUT">Admin Logout</option>
                        <option value="CLEANUP_ASSETS">Cleanup Assets</option>
                        <option value="OPTIMIZE_DB">Optimize DB</option>
                    </select>
                </div>
            </div>

            {/* Log Table */}
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto max-h-[600px]">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-white/5 border-b border-white/10 text-gray-400 font-bold sticky top-0 backdrop-blur-md z-10">
                            <tr>
                                <th className="px-5 py-3.5">Admin / User</th>
                                <th className="px-5 py-3.5">Action</th>
                                <th className="px-5 py-3.5">Details (What Changed)</th>
                                <th className="px-5 py-3.5">Date & Time</th>
                                <th className="px-5 py-3.5">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                                            <span>Loading audit trail...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-gray-400">
                                        <div className="space-y-1">
                                            <p className="text-white font-semibold">No activity logs found</p>
                                            <p className="text-xs text-gray-500">Actions taken by Admins and Teachers will automatically appear here.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log: any) => (
                                    <tr key={log._id} className="hover:bg-white/[0.03] transition-colors">
                                        {/* User Column */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
                                                    log.user?.role === "superadmin" 
                                                        ? "bg-gradient-to-br from-amber-500 to-orange-600 shadow-sm shadow-amber-500/20" 
                                                        : log.user?.role === "admin" 
                                                        ? "bg-gradient-to-br from-blue-600 to-indigo-600" 
                                                        : "bg-gradient-to-br from-purple-600 to-pink-600"
                                                }`}>
                                                    {log.user?.firstName ? log.user.firstName[0].toUpperCase() : "U"}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-semibold text-white">
                                                            {log.user ? `${log.user.firstName} ${log.user.lastName}` : "System / Deleted User"}
                                                        </span>
                                                        {log.user?.role && (
                                                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider border ${
                                                                log.user.role === "superadmin" 
                                                                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40" 
                                                                    : log.user.role === "admin" 
                                                                    ? "bg-blue-500/20 text-blue-300 border-blue-500/40" 
                                                                    : "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                                            }`}>
                                                                {log.user.role}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-gray-500">{log.user?.email || "Unknown"}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Action Badge */}
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${getActionBadgeColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>

                                        {/* Details */}
                                        <td className="px-5 py-3.5 text-gray-200 font-medium max-w-md">
                                            <p className="truncate" title={log.details}>
                                                {log.details || "—"}
                                            </p>
                                        </td>

                                        {/* Date */}
                                        <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={13} className="text-gray-500" />
                                                <span>{new Date(log.createdAt).toLocaleString("en-IN", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}</span>
                                            </div>
                                        </td>

                                        {/* IP */}
                                        <td className="px-5 py-3.5 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                                            {log.ip || "unknown"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                        <div>
                            Page <span className="font-bold text-white">{page}</span> of {totalPages} ({totalCount} total events)
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchLogs(Math.max(1, page - 1))}
                                disabled={page === 1}
                                className="h-8 bg-black/20 border-white/10 text-white"
                            >
                                <ChevronLeft size={14} /> Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchLogs(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                className="h-8 bg-black/20 border-white/10 text-white"
                            >
                                Next <ChevronRight size={14} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

