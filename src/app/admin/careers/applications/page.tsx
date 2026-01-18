"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Search, ExternalLink, Edit2, Save, X, Calendar, Award, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface JobApplication {
    _id: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    jobId: {
        title: string;
        type: string;
        location: string;
    };
    resume: string;
    coverLetter?: string;
    status: string;
    appliedAt: string;
    interviewDate?: string;
    interviewLink?: string;
}

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
        totalCount: 0
    });

    // Interview Modal
    const [interviewApp, setInterviewApp] = useState<JobApplication | null>(null);
    const [interviewForm, setInterviewForm] = useState({
        date: "",
        time: "",
        link: ""
    });

    // Offer Modal
    const [offerApp, setOfferApp] = useState<JobApplication | null>(null);
    const [offerLink, setOfferLink] = useState("");

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchApplications(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, filter]);

    // Initial load handled by debounce effect
    // useEffect(() => {
    //     fetchApplications();
    // }, []);

    const fetchApplications = async (page = pagination.page) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: pagination.limit.toString(),
                search: searchTerm,
                filter: filter
            });
            
            const res = await fetch(`/api/admin/applications?${params}`);
            const data = await res.json();
            
            if(data.success) {
                 setApplications(data.data);
                 setPagination(prev => ({
                     ...prev,
                     page: data.pagination.currentPage,
                     totalPages: data.pagination.totalPages,
                     totalCount: data.pagination.totalCount
                 }));
            }
        } catch (error) {
            console.error("Failed to fetch applications", error);
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchApplications(newPage);
        }
    };

    const handleScheduleInterview = async () => {
        if (!interviewApp) return;

        try {
            const interviewDateTime = new Date(`${interviewForm.date}T${interviewForm.time}`);
            
            const res = await fetch("/api/admin/applications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: interviewApp._id,
                    status: "interview",
                    interviewDate: interviewDateTime.toISOString(),
                    interviewLink: interviewForm.link
                })
            });

            const data = await res.json();
            if(data.success) {
                toast.success("Interview scheduled and email sent!");
                setInterviewApp(null);
                fetchApplications();
            } else {
                 toast.error(data.error || "Failed to schedule interview");
            }

        } catch (error) {
            console.error("Schedule error:", error);
            toast.error("Failed to schedule interview");
        }
    };

    const handleSendOffer = async () => {
        if (!offerApp) return;

        try {
            const res = await fetch("/api/admin/applications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: offerApp._id,
                    status: "selected",
                    offerLink: offerLink
                })
            });
            
             const data = await res.json();
            if(data.success) {
                toast.success("Offer sent successfully!");
                setOfferApp(null);
                setOfferLink("");
                fetchApplications();
            } else {
                 toast.error(data.error || "Failed to send offer");
            }
        } catch (error) {
            console.error("Offer error:", error);
            toast.error("Failed to send offer");
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        if(!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;

        try {
             const res = await fetch("/api/admin/applications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    status: newStatus
                })
            });
            
            const data = await res.json();
             if(data.success) {
                toast.success(`Application marked as ${newStatus}`);
                fetchApplications();
             } else {
                 toast.error(data.error || "Failed to update status");
             }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error("Failed to update status");
        }
    };

    // Client-side filtering removed in favor of Server-side
    const filteredApplications = applications;

    if (loading) return <div className="p-8 text-white">Loading applications...</div>;

    return (
        <div className="p-8 relative min-h-screen">
             <div className="mb-8">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Job Applications</h1>
                <p className="text-sm md:text-base text-gray-400">Review and manage career applications</p>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 rounded-2xl mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email or job..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500/50 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {["all", "pending", "reviewed", "interview", "selected", "rejected"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg transition-all capitalize whitespace-nowrap ${filter === f
                                    ? f === "all" ? "bg-blue-600 text-white" :
                                        f === "pending" ? "bg-yellow-600 text-white" :
                                            f === "interview" ? "bg-purple-600 text-white" :
                                                f === "selected" ? "bg-green-600 text-white" :
                                                    f === "reviewed" ? "bg-indigo-600 text-white" :
                                                    "bg-red-600 text-white"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                                    }`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* List */}
             <div className="space-y-4">
                {filteredApplications.map((app) => (
                    <div key={app._id} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-white">{app.name}</h3>
                                     <span
                                        className={`px-3 py-1 rounded-full text-xs capitalize ${
                                            app.status === "pending"
                                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                                            : app.status === "interview"
                                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                                : app.status === "selected"
                                                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                                    : app.status === "rejected" 
                                                        ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                                        : "bg-indigo-500/20 text-indigo-300"
                                            }`}
                                    >
                                        {app.status}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-1">{app.email} • {app.phone}</p>
                                <p className="text-white font-medium">Applied for: {app.jobId?.title || app.position}</p>
                                <p className="text-gray-500 text-sm mt-1">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                                
                                <div className="flex flex-wrap gap-4 mt-3">
                                    {/* Image Preview if applicable */}
                                    {app.resume.match(/\.(jpeg|jpg|png|gif|webp)$/i) && (
                                        <div className="mb-2 w-full max-w-[200px] h-32 rounded-lg overflow-hidden border border-white/10 relative group">
                                            <img
                                                src={app.resume} 
                                                alt="Resume Preview" 
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                 <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-white text-xs bg-black/80 px-2 py-1 rounded">View Full</a>
                                            </div>
                                        </div>
                                    )}
                                    <div className="w-full">
                                         <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm flex items-center hover:underline bg-white/5 px-4 py-2 rounded-lg inline-flex max-w-full truncate">
                                            <ExternalLink size={14} className="mr-2 flex-shrink-0"/> 
                                            <span className="truncate">{app.resume.split('/').pop()}</span>
                                        </a>
                                    </div>
                                </div>
                                {app.coverLetter && (
                                    <div className="mt-3 bg-white/5 p-3 rounded-lg text-sm text-gray-300">
                                        <p className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-1">Cover Letter</p>
                                        {app.coverLetter}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 min-w-[200px]">
                                {app.status === "pending" && (
                                     <Button onClick={() => handleStatusChange(app._id, "reviewed")} variant="secondary" className="bg-indigo-900/50 hover:bg-indigo-900 text-indigo-200">
                                        Mark as Reviewed
                                    </Button>
                                )}

                                {(app.status === "pending" || app.status === "reviewed") && (
                                    <Button onClick={() => { setInterviewApp(app); setInterviewForm({...interviewForm, date: "", time: "", link: ""}); }} className="bg-purple-600 hover:bg-purple-700">
                                        <Calendar size={16} className="mr-2" /> Schedule Interview
                                    </Button>
                                )}

                                {(app.status === "interview") && (
                                     <Button onClick={() => { setOfferApp(app); setOfferLink(""); }} className="bg-green-600 hover:bg-green-700">
                                        <CheckCircle size={16} className="mr-2" /> Send Offer
                                    </Button>
                                )}

                                {app.status !== "rejected" && app.status !== "selected" && (
                                    <Button onClick={() => handleStatusChange(app._id, "rejected")} variant="destructive" className="bg-red-900/50 hover:bg-red-900 text-red-200">
                                        <XCircle size={16} className="mr-2" /> Reject
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Interview Modal */}
            {interviewApp && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Schedule Interview</h2>
                            <button onClick={() => setInterviewApp(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                         <div className="space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Date</label>
                                    <input type="date" value={interviewForm.date} onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Time</label>
                                    <input type="time" value={interviewForm.time} onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
                                </div>
                             </div>
                             <div>
                                <label className="block text-sm text-gray-400 mb-1">Meeting Link</label>
                                <input type="text" value={interviewForm.link} onChange={(e) => setInterviewForm({ ...interviewForm, link: e.target.value })} placeholder="Google Meet / Zoom" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none" />
                            </div>
                            <Button onClick={handleScheduleInterview} className="w-full bg-purple-600 hover:bg-purple-700">Send Invite</Button>
                         </div>
                    </div>
                </div>
            )}

            {/* Offer Modal */}
            {offerApp && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Send Offer Letter</h2>
                            <button onClick={() => setOfferApp(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                        </div>
                        <div className="space-y-4">
                            <p className="text-gray-300 text-sm">You are approving <strong>{offerApp.name}</strong> for <strong>{offerApp.jobId?.title}</strong>.</p>
                             <div>
                                <label className="block text-sm text-gray-400 mb-1">Offer Letter Link (PDF/Doc)</label>
                                <input type="url" value={offerLink} onChange={(e) => setOfferLink(e.target.value)} placeholder="https://..." className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 outline-none" />
                            </div>
                            <Button onClick={handleSendOffer} className="w-full bg-green-600 hover:bg-green-700">Approve & Send Email</Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
