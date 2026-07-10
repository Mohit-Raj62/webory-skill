"use client";

import { useState, useEffect } from "react";
import { Shield, Download, Search, Filter, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ConsentAdminPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterType, setFilterType] = useState("");
    const [filterAction, setFilterAction] = useState("");

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: page.toString(), limit: "50" });
            if (filterType) params.append("consentType", filterType);
            if (filterAction) params.append("action", filterAction);

            const res = await fetch(`/api/admin/consent?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data.consentLogs);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Failed to fetch consent logs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, filterType, filterAction]);

    const exportToCSV = () => {
        if (logs.length === 0) return;
        
        const headers = ["Date", "User Email", "Name", "Consent Type", "Action", "Policy Version", "Source", "IP Address"];
        const csvRows = [headers.join(",")];
        
        logs.forEach(log => {
            const userEmail = log.userId?.email || "Unknown";
            const userName = `${log.userId?.firstName || ""} ${log.userId?.lastName || ""}`.trim();
            const date = new Date(log.timestamp).toISOString();
            
            csvRows.push([
                date,
                userEmail,
                userName,
                log.consentType,
                log.action,
                log.policyVersion,
                log.source,
                log.ipAddress
            ].join(","));
        });
        
        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", `consent_logs_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="p-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
                        <Shield className="text-blue-500" size={32} />
                        Consent Audit Logs
                    </h1>
                    <p className="text-slate-400 mt-2">Monitor and export user consent records for compliance (GDPR, DPDP).</p>
                </div>
                
                <button 
                    onClick={exportToCSV}
                    className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Download size={16} /> Export to CSV
                </button>
            </div>

            <div className="bg-[#111111] rounded-2xl border border-white/10 overflow-hidden shadow-2xl p-6">
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Filter by Type</label>
                        <select 
                            className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-white text-sm focus:border-blue-500 focus:outline-none"
                            value={filterType}
                            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                        >
                            <option value="" className="bg-[#111111] text-white">All Types</option>
                            <option value="terms" className="bg-[#111111] text-white">Terms & Conditions</option>
                            <option value="privacy" className="bg-[#111111] text-white">Privacy Policy</option>
                            <option value="marketing" className="bg-[#111111] text-white">Marketing</option>
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Filter by Action</label>
                        <select 
                            className="w-full bg-white/5 border border-white/10 rounded-lg h-10 px-3 text-white text-sm focus:border-blue-500 focus:outline-none"
                            value={filterAction}
                            onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
                        >
                            <option value="" className="bg-[#111111] text-white">All Actions</option>
                            <option value="granted" className="bg-[#111111] text-white">Granted</option>
                            <option value="withdrawn" className="bg-[#111111] text-white">Withdrawn</option>
                            <option value="rejected" className="bg-[#111111] text-white">Rejected</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="animate-spin text-blue-500" size={40} />
                    </div>
                ) : logs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
                            <thead className="bg-white/5 text-slate-400 uppercase text-xs font-black tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Timestamp</th>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Consent Type</th>
                                    <th className="px-4 py-3">Action</th>
                                    <th className="px-4 py-3">Version</th>
                                    <th className="px-4 py-3">IP Address</th>
                                    <th className="px-4 py-3 rounded-tr-lg">Source</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-4">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="px-4 py-4">
                                            <div className="font-bold text-white">{log.userId?.firstName} {log.userId?.lastName}</div>
                                            <div className="text-xs text-slate-500">{log.userId?.email}</div>
                                        </td>
                                        <td className="px-4 py-4 capitalize font-medium">{log.consentType}</td>
                                        <td className="px-4 py-4">
                                            <Badge className={`border-none ${
                                                log.action === 'granted' ? 'bg-emerald-500/10 text-emerald-400' : 
                                                log.action === 'withdrawn' ? 'bg-orange-500/10 text-orange-400' :
                                                'bg-red-500/10 text-red-400'
                                            }`}>
                                                {log.action}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-4 font-mono text-xs text-slate-400">{log.policyVersion}</td>
                                        <td className="px-4 py-4 font-mono text-xs">{log.ipAddress}</td>
                                        <td className="px-4 py-4">{log.source}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <Shield className="mx-auto mb-4 opacity-50" size={48} />
                        <p>No consent logs found matching your criteria.</p>
                    </div>
                )}
                
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/5">
                        <button 
                            disabled={page === 1} 
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold disabled:opacity-50 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-slate-400">Page {page} of {totalPages}</span>
                        <button 
                            disabled={page === totalPages} 
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-bold disabled:opacity-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
