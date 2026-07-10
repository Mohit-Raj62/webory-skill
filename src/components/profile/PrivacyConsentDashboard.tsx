"use client";

import { useState, useEffect } from "react";
import { Lock, Shield, Mail, Check, X, Loader2, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PrivacyConsentDashboard({ user }: { user: any }) {
    const [marketingEnabled, setMarketingEnabled] = useState(user.marketingPreferences || false);
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<any[]>([]);
    const [fetchingLogs, setFetchingLogs] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch("/api/consent");
                if (res.ok) {
                    const data = await res.json();
                    setLogs(data.consentLogs);
                }
            } catch (error) {
                console.error("Failed to fetch consent logs", error);
            } finally {
                setFetchingLogs(false);
            }
        };
        fetchLogs();
    }, []);

    const toggleMarketing = async () => {
        setLoading(true);
        try {
            const newStatus = !marketingEnabled;
            const res = await fetch("/api/consent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ consentType: "marketing", action: newStatus ? "granted" : "withdrawn" })
            });

            if (res.ok) {
                setMarketingEnabled(newStatus);
                // Refresh logs
                const logsRes = await fetch("/api/consent");
                if (logsRes.ok) {
                    const data = await logsRes.json();
                    setLogs(data.consentLogs);
                }
            }
        } catch (error) {
            console.error("Failed to update consent", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-xl font-black text-white flex items-center gap-2 mb-2">
                            <Mail className="text-blue-400" size={20} /> Marketing Preferences
                        </h3>
                        <p className="text-sm text-slate-400 max-w-2xl">
                            Control how we communicate with you. We use this to send you personalized offers, career opportunities, and platform updates.
                        </p>
                    </div>
                    <button 
                        onClick={toggleMarketing}
                        disabled={loading}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${marketingEnabled ? 'bg-blue-500' : 'bg-slate-700'}`}
                    >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${marketingEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6">
                <h3 className="text-xl font-black text-white flex items-center gap-2 mb-6">
                    <Shield className="text-purple-400" size={20} /> Consent Audit Trail
                </h3>
                
                {fetchingLogs ? (
                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-slate-500" /></div>
                ) : logs.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="text-xs uppercase bg-white/5 text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg font-black tracking-widest">Date & Time</th>
                                    <th className="px-4 py-3 font-black tracking-widest">Type</th>
                                    <th className="px-4 py-3 font-black tracking-widest">Action</th>
                                    <th className="px-4 py-3 font-black tracking-widest">Source</th>
                                    <th className="px-4 py-3 rounded-tr-lg font-black tracking-widest">IP Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log._id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-300">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="px-4 py-3 capitalize font-bold text-white">{log.consentType}</td>
                                        <td className="px-4 py-3">
                                            <Badge className={`border-none ${log.action === 'granted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {log.action}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">{log.source}</td>
                                        <td className="px-4 py-3 font-mono text-xs">{log.ipAddress}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-slate-500 py-4 text-center">No consent history found.</p>
                )}
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[1.5rem] p-6">
                <h3 className="text-xl font-black text-white flex items-center gap-2 mb-2">
                    <Lock className="text-red-400" size={20} /> Data Rights
                </h3>
                <p className="text-sm text-slate-400 mb-6">
                    Under applicable data protection laws, you have the right to request a copy of your data or request account deletion.
                </p>
                <div className="flex gap-4">
                    <button className="h-10 px-4 flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-black uppercase tracking-widest text-white transition-all border border-white/5">
                        <Download size={14} /> Export My Data
                    </button>
                    <button className="h-10 px-4 flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-xs font-black uppercase tracking-widest text-red-400 transition-all border border-red-500/20">
                        <Trash2 size={14} /> Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}
