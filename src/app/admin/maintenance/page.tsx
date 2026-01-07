"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Database, Trash2, RefreshCw, CheckCircle, AlertTriangle, Download, Zap, Mail } from "lucide-react";
import { toast } from "sonner";

export default function MaintenancePage() {
    const [exportLoading, setExportLoading] = useState(false);
    const [cacheLoading, setCacheLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);

    // Old handlers restored
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [optimizeResult, setOptimizeResult] = useState<any>(null);

    const handleCleanup = async () => {
        if (!confirm("Are you sure? This will delete orphaned files from Cloudinary permanently.")) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch("/api/admin/maintenance/cleanup", { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                setResult(data);
                toast.success(data.message);
            } else {
                toast.error(data.error || "Cleanup failed");
            }
        } catch (error) {
            console.error("Cleanup error:", error);
            toast.error("Cleanup failed");
        } finally {
            setLoading(false);
        }
    };

    const handleOptimize = async () => {
        setLoading(true);
        setOptimizeResult(null);

        try {
            const res = await fetch("/api/admin/maintenance/optimize", { method: "POST" });
            const data = await res.json();
            if (res.ok) {
                setOptimizeResult(data);
                toast.success(data.message);
            } else {
                toast.error(data.error || "Optimization failed");
            }
        } catch (error) {
            console.error("Optimization error:", error);
            toast.error("Optimization failed");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type: string) => {
        setExportLoading(true);
        try {
            const res = await fetch("/api/admin/maintenance/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                toast.success(`${type} exported successfully!`);
            } else {
                toast.error("Export failed");
            }
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Export failed");
        } finally {
            setExportLoading(false);
        }
    };

    const handleClearCache = async () => {
        setCacheLoading(true);
        try {
            const res = await fetch("/api/admin/maintenance/revalidate", { method: "POST" });
            const data = await res.json();
            if (res.ok) toast.success(data.message);
            else toast.error(data.error);
        } catch (error) {
            toast.error("Failed to clear cache");
        } finally {
            setCacheLoading(false);
        }
    };

    const handleTestEmail = async () => {
        setEmailLoading(true);
        try {
            const res = await fetch("/api/admin/maintenance/test-email", { method: "POST" });
            const data = await res.json();
            if (res.ok) toast.success(data.message);
            else toast.error(data.error);
        } catch (error) {
            toast.error("Failed to send test email");
        } finally {
            setEmailLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">System Maintenance</h1>
                <p className="text-gray-400">Manage system health, storage, and backups</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Cloudinary Cleanup */}
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Database size={100} className="text-blue-500" />
                    </div>
                    <div className="relative z-10">
                         <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                            <Database size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Storage Cleanup</h3>
                         <p className="text-gray-400 mb-6 text-sm">
                            Scan Cloudinary storage to remove unused assets and free up space.
                        </p>
                        <Button onClick={handleCleanup} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                           {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                           {loading ? "Scanning..." : "Start Cleanup"}
                        </Button>
                        {result && (
                            <div className="mt-4 p-4 bg-white/5 rounded-lg text-sm">
                                <p className="text-green-400 mb-1">Success!</p>
                                <p className="text-gray-300">Scanned: {result.details?.scanned} | Deleted: {result.details?.deleted}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Database Optimization */}
                 <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <RefreshCw size={100} className="text-green-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4 text-green-400">
                            <RefreshCw size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Database Optimization</h3>
                         <p className="text-gray-400 mb-6 text-sm">
                            Sync indexes and check connection health.
                        </p>
                        <Button onClick={handleOptimize} disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                           {loading && !result && !optimizeResult ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                           Run Optimization
                        </Button>
                        {optimizeResult && (
                             <div className="mt-4 p-4 bg-white/5 rounded-lg text-sm">
                                <p className="text-green-400 mb-1">Optimized!</p>
                                <p className="text-gray-300">Latency: {optimizeResult.details?.latency}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Export Data */}
                <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Download size={100} className="text-purple-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                            <Download size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Backup Data</h3>
                        <p className="text-gray-400 mb-6 text-sm">Download your data as CSV files.</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                             <Button onClick={() => handleExport('users')} disabled={exportLoading} variant="outline" className="border-white/10 hover:bg-white/5">
                                Users
                            </Button>
                            <Button onClick={() => handleExport('courses')} disabled={exportLoading} variant="outline" className="border-white/10 hover:bg-white/5">
                                Courses
                            </Button>
                            <Button onClick={() => handleExport('enrollments')} disabled={exportLoading} variant="outline" className="border-white/10 hover:bg-white/5 col-span-2">
                                Enrollments / Payments
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 4. System Tools */}
                 <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={100} className="text-yellow-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mb-4 text-yellow-400">
                            <Zap size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">System Tools</h3>
                        <p className="text-gray-400 mb-6 text-sm">Quick fixes and health checks.</p>
                        
                        <div className="space-y-3">
                             <Button onClick={handleClearCache} disabled={cacheLoading} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                                {cacheLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                                Clear Cache (Update Site)
                            </Button>
                             <Button onClick={handleTestEmail} disabled={emailLoading} variant="outline" className="w-full border-white/10 hover:bg-white/5">
                                {emailLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                                Test Email System
                            </Button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Activity Logs Section */}
            <div className="mt-8 glass-card p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Admin Activity Logs</h3>
                        <p className="text-gray-400 text-sm">Recent actions performed by admins.</p>
                    </div>
                    <Button onClick={() => window.location.reload()} variant="outline" className="border-white/10 hover:bg-white/5">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Logs
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">User</th>
                                <th className="px-4 py-3">Action</th>
                                <th className="px-4 py-3">Details</th>
                                <th className="px-4 py-3">Time</th>
                                <th className="px-4 py-3 rounded-r-lg">IP</th>
                            </tr>
                        </thead>
                       <ActivityLogsTable />
                    </table>
                </div>
            </div>
        </div>
    );
}

function ActivityLogsTable() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/maintenance/logs')
            .then(res => res.json())
            .then(data => {
                if(data.logs) setLogs(data.logs);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <tbody><tr><td colSpan={5} className="text-center py-8">Loading logs...</td></tr></tbody>;
    if (logs.length === 0) return <tbody><tr><td colSpan={5} className="text-center py-8">No activity logs found.</td></tr></tbody>;

    return (
        <tbody className="divide-y divide-white/5">
            {logs.map((log: any) => (
                <tr key={log._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">
                        {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Unknown User'}
                        <div className="text-xs text-gray-500">{log.user?.email}</div>
                    </td>
                    <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                            log.action.includes('DELETE') ? 'bg-red-500/20 text-red-400' :
                            log.action.includes('UPDATE') ? 'bg-blue-500/20 text-blue-400' :
                            log.action.includes('CREATE') ? 'bg-green-500/20 text-green-400' :
                            'bg-gray-500/20 text-gray-400'
                        }`}>
                            {log.action}
                        </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 max-w-xs truncate" title={log.details}>
                        {log.details || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                        {log.ip}
                    </td>
                </tr>
            ))}
        </tbody>
    );
}
