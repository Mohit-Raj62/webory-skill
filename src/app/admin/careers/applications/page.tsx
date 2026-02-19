"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, FileText, CheckCircle, XCircle, Clock, Search, ExternalLink, Edit2, Save, X, Calendar, Award, Mail, ChevronLeft, ChevronRight, Briefcase, DollarSign, Globe, Linkedin } from "lucide-react";
import { uploadPDFToCloudinary } from "@/lib/upload-utils";
import { Skeleton } from "@/components/ui/skeleton";
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
    linkedin?: string;
    portfolio?: string;
    currentSalary?: string;
    expectedSalary?: string;
    noticePeriod?: string;
    whyHireYou?: string;
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
        limit: 5,
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
    const [offerFile, setOfferFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // View Details Modal
    const [viewApp, setViewApp] = useState<JobApplication | null>(null);

    // Initial load and Debounce search
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            fetchApplications(1);
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            fetchApplications(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, filter]);

    const fetchApplications = async (page = pagination.page) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: pagination.limit.toString(),
                search: searchTerm,
                filter: filter
            });
            
            console.log("Fetching applications with params:", params.toString());
            const res = await fetch(`/api/admin/applications?${params}`, {
                cache: "no-store",
                headers: {
                    "Cache-Control": "no-cache"
                }
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`API Error: ${res.status} ${errorText}`);
            }

            const data = await res.json();
            
            if(data.success) {
                 setApplications(data.data);
                 setPagination(prev => ({
                     ...prev,
                     page: data.pagination.currentPage,
                     totalPages: data.pagination.totalPages,
                     totalCount: data.pagination.totalCount
                 }));
            } else {
                console.error("API returned success: false", data);
                if (data.error) toast.error(data.error);
            }
        } catch (error) {
            console.error("Failed to fetch applications", error);
            toast.error("Failed to load applications. Please refresh.");
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
        
        // Validation: Need either a link or a file
        if (!offerLink && !offerFile) {
            toast.error("Please provide an offer letter link or upload a file");
            return;
        }

        try {
            let finalOfferLink = offerLink;

            // Handle File Upload if present
            if (offerFile) {
                setIsUploading(true);
                try {
                    const uploadResult = await uploadPDFToCloudinary(offerFile);
                    finalOfferLink = uploadResult.url;
                    toast.success("Offer letter uploaded successfully!");
                } catch (error) {
                    console.error("File upload failed:", error);
                    toast.error("Failed to upload offer letter. Please try again.");
                    setIsUploading(false);
                    return; // Stop execution on upload failure
                }
            }

            const res = await fetch("/api/admin/applications", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: offerApp._id,
                    status: "selected",
                    offerLink: finalOfferLink
                })
            });
            
             const data = await res.json();
            if(data.success) {
                toast.success("Offer sent successfully!");
                setOfferApp(null);
                setOfferLink("");
                setOfferFile(null);
                setIsUploading(false);
                fetchApplications();
            } else {
                 toast.error(data.error || "Failed to send offer");
                 setIsUploading(false);
            }
        } catch (error) {
            console.error("Offer error:", error);
            toast.error("Failed to send offer");
            setIsUploading(false);
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

    const filteredApplications = applications;

    const ApplicationSkeleton = () => (
        <div className="glass-card p-6 rounded-2xl border border-white/5 animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-7 w-48" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-5 w-56" />
                    <Skeleton className="h-4 w-40" />
                    <div className="flex gap-4 mt-3">
                        <Skeleton className="h-10 w-40 rounded-lg" />
                    </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[200px]">
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );

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

             <div className="space-y-4">
                {loading ? (
                    Array(5).fill(0).map((_, i) => <ApplicationSkeleton key={i} />)
                ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-12 glass-card rounded-2xl border border-white/5">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-4">
                            <Search className="text-gray-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No applications found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    filteredApplications.map((app) => (
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
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                         <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                                         {app.currentSalary && <span className="flex items-center gap-1"><DollarSign size={12}/> Cur. {app.currentSalary}</span>}
                                         {app.expectedSalary && <span className="flex items-center gap-1"><DollarSign size={12}/> Exp. {app.expectedSalary}</span>}
                                         {app.noticePeriod && <span className="flex items-center gap-1"><Clock size={12}/> {app.noticePeriod}</span>}
                                    </div>

                                    
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        {/* Resume Link */}
                                        <div className="max-w-xs">
                                            <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm flex items-center hover:underline bg-white/5 px-4 py-2 rounded-lg inline-flex max-w-full truncate border border-white/5 hover:bg-white/10">
                                                <ExternalLink size={14} className="mr-2 flex-shrink-0"/> 
                                                <span className="truncate">Resume</span>
                                            </a>
                                        </div>

                                        {/* LinkedIn */}
                                        {app.linkedin && (
                                            <a href={app.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm flex items-center hover:underline bg-blue-500/10 px-4 py-2 rounded-lg inline-flex max-w-full truncate border border-blue-500/20 hover:bg-blue-500/20">
                                                <Linkedin size={14} className="mr-2 flex-shrink-0"/> 
                                                <span className="truncate">LinkedIn</span>
                                            </a>
                                        )}

                                        {/* Portfolio */}
                                        {app.portfolio && (
                                            <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="text-purple-400 text-sm flex items-center hover:underline bg-purple-500/10 px-4 py-2 rounded-lg inline-flex max-w-full truncate border border-purple-500/20 hover:bg-purple-500/20">
                                                <Globe size={14} className="mr-2 flex-shrink-0"/> 
                                                <span className="truncate">Portfolio</span>
                                            </a>
                                        )}

                                        {/* View Details Button */}
                                         <button 
                                            onClick={() => setViewApp(app)}
                                            className="text-gray-300 text-sm flex items-center hover:text-white bg-white/5 px-4 py-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors"
                                        >
                                            <Search size={14} className="mr-2"/> View Full Details
                                         </button>
                                    </div>
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
                                        <Button onClick={() => { setOfferApp(app); setOfferLink(""); setOfferFile(null); }} className="bg-green-600 hover:bg-green-700">
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
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 py-8">
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1 || loading}
                        className="bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                    </Button>
                    <span className="text-sm text-gray-400">
                        Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages || loading}
                        className="bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    >
                        Next <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            )}

            {/* View Details Modal */}
            {viewApp && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                     <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                             <div>
                                <h2 className="text-xl font-bold text-white mb-1">Application Details</h2>
                                <p className="text-sm text-gray-400">{viewApp.name} - {viewApp.jobId?.title || viewApp.position}</p>
                            </div>
                            <button onClick={() => setViewApp(null)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Contact Info */}
                            <div className="space-y-4">
                                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-wider">Candidate Info</h3>
                                <div className="space-y-3">
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Email</p>
                                        <p className="text-white font-medium">{viewApp.email}</p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                                        <p className="text-white font-medium">{viewApp.phone}</p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Applied At</p>
                                        <p className="text-white font-medium">{new Date(viewApp.appliedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Job Info */}
                            <div className="space-y-4">
                                <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider">Professional Info</h3>
                                <div className="space-y-3">
                                     <div className="flex gap-2">
                                        <div className="flex-1 bg-black/20 p-3 rounded-lg border border-white/5">
                                            <p className="text-xs text-gray-500 mb-1">Current CTC</p>
                                            <p className="text-white font-medium">{viewApp.currentSalary || "N/A"}</p>
                                        </div>
                                        <div className="flex-1 bg-black/20 p-3 rounded-lg border border-white/5">
                                            <p className="text-xs text-gray-500 mb-1">Expected CTC</p>
                                            <p className="text-white font-medium">{viewApp.expectedSalary || "N/A"}</p>
                                        </div>
                                     </div>
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Notice Period</p>
                                        <p className="text-white font-medium">{viewApp.noticePeriod || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Links & Documents</h3>
                                <div className="flex flex-wrap gap-4">
                                    {viewApp.linkedin && (
                                        <a href={viewApp.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-500/10 px-4 py-3 rounded-xl border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors">
                                           <Linkedin size={18} /> LinkedIn Profile
                                        </a>
                                    )}
                                     {viewApp.portfolio && (
                                        <a href={viewApp.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-purple-500/10 px-4 py-3 rounded-xl border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors">
                                           <Globe size={18} /> Portfolio
                                        </a>
                                    )}
                                    <a href={viewApp.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/5 px-4 py-3 rounded-xl border border-white/10 text-white hover:bg-white/10 transition-colors">
                                       <ExternalLink size={18} /> View Resume
                                    </a>
                                </div>
                            </div>
                            
                            {/* Why Hire You / Content */}
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-orange-400 text-xs font-bold uppercase tracking-wider">Why Should We Hire You?</h3>
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {viewApp.whyHireYou || viewApp.coverLetter || "No details provided."}
                                    </p>
                                </div>
                            </div>

                        </div>
                        
                        <div className="mt-8 flex justify-end">
                            <Button onClick={() => setViewApp(null)} className="bg-white hover:bg-gray-200 text-black">
                                Close Details
                            </Button>
                        </div>
                     </div>
                </div>
            )}

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
                             
                             {/* File Upload Option */}
                            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                <label className="block text-sm text-gray-400 mb-2">Upload Offer Letter (PDF)</label>
                                <div className="flex items-center gap-3">
                                    <label className="cursor-pointer flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                                        <Upload size={16} />
                                        <span>{offerFile ? "Change File" : "Select File"}</span>
                                        <input 
                                            type="file" 
                                            accept=".pdf" 
                                            className="hidden" 
                                            onChange={(e) => {
                                                if(e.target.files?.[0]) {
                                                    setOfferFile(e.target.files[0]);
                                                    setOfferLink(""); // Clear link if file is selected to avoid confusion, though logic prioritizes file
                                                }
                                            }}
                                        />
                                    </label>
                                    {offerFile && (
                                        <span className="text-sm text-white flex items-center gap-1">
                                            <FileText size={14} className="text-blue-400"/>
                                            {offerFile.name}
                                            <button onClick={() => setOfferFile(null)} className="ml-2 text-gray-400 hover:text-red-400">
                                                <X size={14}/>
                                            </button>
                                        </span>
                                    )}
                                </div>
                            </div>

                             <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-slate-900 px-2 text-gray-400">Or paste link</span>
                                </div>
                            </div>

                             <div>
                                <label className="block text-sm text-gray-400 mb-1">Offer Letter Link (PDF/Doc)</label>
                                <input 
                                    type="url" 
                                    value={offerLink} 
                                    onChange={(e) => {
                                        setOfferLink(e.target.value);
                                        setOfferFile(null); // Clear file if link is being typed
                                    }}
                                    disabled={!!offerFile}
                                    placeholder="https://..." 
                                    className={`w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 outline-none ${offerFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                                />
                            </div>
                            <Button 
                                onClick={handleSendOffer} 
                                disabled={isUploading || (!offerLink && !offerFile)}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUploading ? (
                                    <>
                                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                                        Uploading & Sending...
                                    </>
                                ) : (
                                    "Approve & Send Email"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
