"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Clock, IndianRupee, CheckCircle2, X, Search, Zap, Sparkles, GraduationCap, Globe, ArrowUpRight, ShieldCheck, Briefcase, Download, Eye, ExternalLink } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentModal } from "@/components/courses/payment-modal";
import { Invoice } from "@/components/courses/invoice";
import { toast } from "sonner";
import { LeadCaptureModal } from "./lead-capture-modal";
import { useEffect } from "react";

interface InternshipsViewProps {
    internships: any[];
    user: any | null;
    userApplications: { 
        internshipId: string; 
        status: string;
        transactionId?: string;
        amountPaid?: number;
        appliedAt?: string;
    }[];
}

export function InternshipsView({ internships, user, userApplications }: InternshipsViewProps) {
    const [selectedInternship, setSelectedInternship] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("All");

    const [resumeType, setResumeType] = useState<'file' | 'link'>('file');
    const [file, setFile] = useState<File | null>(null);
    const [approvalLetterFile, setApprovalLetterFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        resume: "",
        coverLetter: "",
        portfolio: "",
        linkedin: "",
        phone: user?.phone || "",
        college: "",
        currentYear: "",
        startDate: "",
        preferredDuration: "",
        referralCode: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [transactionData, setTransactionData] = useState<any>(null);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [hasTriggeredLeadPopup, setHasTriggeredLeadPopup] = useState(false);
    const [applyStep, setApplyStep] = useState<number>(1);
    const [selectedTier, setSelectedTier] = useState<string>("Basic");
    const [detailJob, setDetailJob] = useState<any | null>(null);
    const router = useRouter();

    // ... (filteredInternships useMemo remains same) ...
     const filteredInternships = useMemo(() => {
        return internships.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 job.company.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === "All" || job.type === selectedType;
            return matchesSearch && matchesType;
        });
    }, [internships, searchQuery, selectedType]);

    // Handle incoming apply param
    useEffect(() => {
        if (!internships.length) return;
        
        const urlParams = new URLSearchParams(window.location.search);
        const applyId = urlParams.get('apply');
        const tierParam = urlParams.get('tier');
        
        if (applyId && internships.find(i => i._id === applyId)) {
            // Small timeout to ensure component is fully mounted
            setTimeout(() => {
                const internship = internships.find(i => i._id === applyId);
                if (internship) {
                    if (!user) {
                        setSelectedInternship(applyId);
                        setIsLeadModalOpen(true);
                    } else if (applyId.length >= 24) { // Not a demo
                        setSelectedInternship(applyId);
                        setApplyStep(1);
                        setSelectedTier(tierParam || "Basic");
                        
                        // Track view
                        fetch(`/api/student/internships/${applyId}/views`, { method: "POST" }).catch(() => {});
                    }
                }
            }, 100);
            
            // Clean up the URL
            const url = new URL(window.location.href);
            url.searchParams.delete('apply');
            url.searchParams.delete('tier');
            window.history.replaceState({}, '', url.pathname + url.search);
        }
    }, [internships, user]);

    // File Handler
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 4 * 1024 * 1024) {
              toast.error("File is too large! Please upload a resume under 4MB.");
              e.target.value = '';
              return;
          }
          setFile(file);
      } else {
          setFile(null);
      }
    };

    const handleApprovalLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.type !== 'application/pdf') {
              toast.error("Please upload a PDF file for the approval letter.");
              e.target.value = '';
              return;
          }
          if (file.size > 500 * 1024) {
              toast.error("File is too large! Please upload a PDF under 500KB.");
              e.target.value = '';
              return;
          }
          setApprovalLetterFile(file);
      } else {
          setApprovalLetterFile(null);
      }
    };

    const handleApplyClick = (id: string) => {
        const internship = internships.find(i => i._id === id);
        if (!user) {
            setSelectedInternship(id); // Set selected so we know WHICH internship they were looking at
            setIsLeadModalOpen(true);
            return;
        }
        if (id.length < 24) {
            alert("This is a demo internship. Please wait for real internships to be loaded or contact admin.");
            return;
        }
        setSelectedInternship(id);
        setApplyStep(1);
        setSelectedTier("Basic");
        
        // Track view activity for logged-in user when they click apply
        trackActivity(id, internship?.title);
    };

    const trackActivity = async (internshipId: string, internshipName: string) => {
        if (!user) return;
        try {
            await fetch("/api/analytics/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    relatedId: internshipId,
                    category: "internship",
                    metadata: { internshipName }
                })
            });
        } catch (e) {
            console.error("Tracking error:", e);
        }
    };

    // Auto-trigger lead popup after 15 seconds for guest users
    useEffect(() => {
        if (!user && !hasTriggeredLeadPopup) {
            const timer = setTimeout(() => {
                if (!isLeadModalOpen) {
                    setIsLeadModalOpen(true);
                    setHasTriggeredLeadPopup(true);
                }
            }, 15000);
            return () => clearTimeout(timer);
        }
    }, [user, hasTriggeredLeadPopup, isLeadModalOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInternship) return;
        
        if (resumeType === 'file' && !file) {
            toast.error("Please upload your resume");
            return;
        }
        if (resumeType === 'link' && !formData.resume) {
            toast.error("Please provide a resume link");
            return;
        }
        
        if (!approvalLetterFile) {
            toast.error("Please upload your college approval letter");
            return;
        }

        setSubmitting(true);
        let resumeUrl = formData.resume;
        let collegeApprovalLetterUrl = "";

        try {
             // Upload File if selected
            if (resumeType === 'file' && file) {
                setUploading(true);
                const uploadData = new FormData();
                uploadData.append("file", file);
                
                const uploadRes = await fetch("/api/upload/resume", {
                    method: "POST",
                    body: uploadData
                });
                
                if (!uploadRes.ok) {
                    if (uploadRes.status === 413) throw new Error("File is too large. Please upload a smaller file under 50MB.");
                    throw new Error("Failed to upload resume. Server returned an error.");
                }
                
                const uploadResult = await uploadRes.json();
         
                if (!uploadResult.success) {
                    throw new Error(uploadResult.error || "Failed to upload resume");
                }
                resumeUrl = uploadResult.url;
                setUploading(false);
            }

            if (approvalLetterFile) {
                setUploading(true);
                const uploadData = new FormData();
                uploadData.append("file", approvalLetterFile);
                
                const uploadRes = await fetch("/api/upload/resume", {
                    method: "POST",
                    body: uploadData
                });
                
                if (!uploadRes.ok) throw new Error("Failed to upload approval letter.");
                const uploadResult = await uploadRes.json();
                if (!uploadResult.success) throw new Error(uploadResult.error || "Failed to upload approval letter");
                collegeApprovalLetterUrl = uploadResult.url;
                setUploading(false);
            }

            const internshipDetails = internships.find(i => i._id === selectedInternship);

            
            const res = await fetch("/api/internships/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    internshipId: selectedInternship,
                    resume: resumeUrl,
                    resumeType,
                    coverLetter: formData.coverLetter,
                    portfolio: formData.portfolio,
                    linkedin: formData.linkedin,
                    college: formData.college,
                    collegeApprovalLetter: collegeApprovalLetterUrl,
                    currentYear: formData.currentYear,
                    startDate: formData.startDate,
                    preferredDuration: formData.preferredDuration,
                    referralCode: formData.referralCode,
                    transactionId: "PENDING_PAYU",
                    selectedTier: internshipDetails?.hasTiers ? selectedTier : "Basic",
                    amountPaid: 0 // Will be updated when payment actually succeeds
                }),
            });

            const data = await res.json();
            
            if (res.ok || data.error === "Already applied to this internship") {
                if (internshipDetails?.isFree) {
                    toast.success("Application submitted successfully!");
                    setSelectedInternship(null);
                    router.push("/profile?tab=internships");
                } else {
                    toast.success("Application saved! Opening payment checkout...");
                    setShowPayment(true);
                }
                setFile(null);
            } else {
                toast.error(data.error || "Failed to submit application");
            }
        } catch (error: any) {
            console.error("Submission error:", error);
            toast.error(error?.message || "An error occurred");
        } finally {
            setUploading(false);
            setSubmitting(false);
        }
    };

    const handleDownloadInvoice = (job: any, app: any) => {
        const amount = app.amountPaid || job.price || 999;
        const originalPrice = job.originalPrice || 2999;
        
        const safeId = app.internshipId || app._id || Date.now().toString();
        const invoiceData = {
            transactionId: app.transactionId || `TXN${safeId.toString().substring(0, 12)}`,
            courseTitle: job.title || "Internship Course",
            amount: amount,
            originalAmount: originalPrice,
            discountAmount: originalPrice - amount,
            gstPercentage: job.gstPercentage || 18, // Default to 18 if not specified
            date: new Date(app.appliedAt || Date.now()).toLocaleDateString(),
            userEmail: user.email,
            userName: `${user.firstName} ${user.lastName}`,
            userPhone: user.phone || '',
        };
        setTransactionData(invoiceData);
        setShowInvoice(true);
    };

    return (
        <main className="min-h-screen bg-background relative overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            
            <Navbar />

            <div className="pt-24 md:pt-32 pb-20 container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 max-w-4xl bg-emerald-500/5 blur-[120px] -z-10 rounded-full" />
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                         <div className="flex flex-wrap justify-center gap-3 mb-4">
                            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                Verified Industrial Cohort 2026
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white leading-tight">
                            Industrial Internships & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Real-World Projects</span>
                        </h1>
                        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal">
                            Gain hands-on production experience, work under IIT Mandi faculty mentorship, and earn verified Letters of Recommendation (LOR) & credentials.
                        </p>
                    </motion.div>
                </div>

                {/* Search & Filter Bar */}
                <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by role, tech stack, or company..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-11 bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-9 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.07] transition-all"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
                        {["All", "Full Time", "Part Time", "Remote", "Hybrid"].map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                                    selectedType === type 
                                    ? "bg-emerald-500 text-slate-950 shadow-sm" 
                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto space-y-6">
                    <AnimatePresence mode="popLayout">
                        {filteredInternships.length > 0 ? (
                            filteredInternships.map((job, index) => {
                                const totalSeats = typeof job.totalSeats === 'number' ? job.totalSeats : 50;
                                const filledSeats = typeof job.filledSeats === 'number' ? job.filledSeats : 0;
                                const remainingSeats = Math.max(0, totalSeats - filledSeats);
                                const isFull = remainingSeats <= 0;
                                const app = userApplications.find(a => a.internshipId === job._id);
                                const hasApplied = !!app;

                                return (
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, y: 25 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-60px" }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ 
                                            duration: 0.45, 
                                            ease: [0.16, 1, 0.3, 1] 
                                        }}
                                        key={job._id || index} 
                                        className="group relative bg-[#0a0b12] hover:bg-[#0c0d16] border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:shadow-[0_12px_50px_-20px_rgba(16,185,129,0.15)] overflow-hidden"
                                    >
                                        {/* Ambient Gradients */}
                                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-purple-500/[0.03] via-transparent to-emerald-500/[0.03] pointer-events-none rounded-2xl" />
                                        
                                        <div className="relative z-10">
                                            {/* Top Header Section */}
                                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-600 flex items-center justify-center p-1.5 shadow-md">
                                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-white uppercase tracking-wider block leading-tight">Webory Cohort 2026</span>
                                                        <span className="text-[10px] text-slate-400 block leading-tight">IIT Mandi Mentored Industrial Fellowship</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.05] border border-white/10 text-slate-300">
                                                        {job.type}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Active</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Main Content Grid: 8 Cols Left + 4 Cols Right */}
                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
                                                {/* Left: Info (8 cols) */}
                                                <div className="lg:col-span-8 space-y-3.5 text-left">
                                                    <div>
                                                        <h3 
                                                            onClick={() => setDetailJob(job)}
                                                            className="text-lg sm:text-xl md:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug tracking-tight cursor-pointer inline-block"
                                                        >
                                                            {job.title}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] px-2.5 py-1 rounded-lg">
                                                                <Globe size={13} className="text-blue-400" />
                                                                <span className="text-xs font-medium text-slate-300">{job.type} ({job.location})</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] px-2.5 py-1 rounded-lg">
                                                                <Clock size={13} className="text-slate-400" />
                                                                <span className="text-xs font-medium text-slate-300">{job.duration || "3-6 Months"}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.08] px-2.5 py-1 rounded-lg">
                                                                <Briefcase size={13} className="text-emerald-500" />
                                                                <span className="text-xs font-medium text-slate-300">{job.perks && job.perks.length > 0 ? job.perks[0] : "Performance Bonus"}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Brief Overview */}
                                                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-normal line-clamp-2">
                                                        {job.tagline || job.description}
                                                    </p>

                                                    {/* Tech Stack Section */}
                                                    <div className="bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl space-y-2">
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                            <div>
                                                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{job.tagline || "Industry Standard"}</p>
                                                                <p className="text-xs font-medium text-slate-300">Production-Ready Tech Stack</p>
                                                            </div>
                                                            <div className="flex flex-wrap gap-1.5 sm:justify-end">
                                                                {job.tags && job.tags.slice(0, 6).map((tag: string, i: number) => (
                                                                    <div key={i} className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.08] flex items-center gap-1.5 hover:border-emerald-500/30 transition-colors">
                                                                        <div className="w-1 h-1 rounded-full bg-emerald-500/60" />
                                                                        <span className="text-[10px] font-medium text-slate-300">{tag}</span>
                                                                    </div>
                                                                ))}
                                                                {job.tags && job.tags.length > 6 && (
                                                                    <span className="text-[10px] text-slate-500 font-medium px-1 self-center">
                                                                        +{job.tags.length - 6} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* View Details Link */}
                                                    <div>
                                                        <button
                                                            onClick={() => setDetailJob(job)}
                                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors group/link cursor-pointer"
                                                        >
                                                            <Eye size={13} className="text-emerald-400 group-hover/link:scale-110 transition-transform" />
                                                            <span>View Complete Internship Details, Requirements & Syllabus</span>
                                                            <ArrowUpRight size={13} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Right: CTA / Pricing Widget (4 cols) */}
                                                <div className="lg:col-span-4 w-full">
                                                    <div className="bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.08] rounded-xl p-4 md:p-5 backdrop-blur-xl shadow-lg relative overflow-hidden group/cta flex flex-col justify-between">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />
                                                        
                                                        <div className="mb-4 text-center lg:text-left relative z-10">
                                                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Training Program Fee</p>
                                                            <div className="flex flex-col items-center lg:items-start gap-1.5 w-full">
                                                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 w-full">
                                                                    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">₹{job.price || 999}</span>
                                                                    {(job.originalPrice || 2999) > (job.price || 999) && (
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="text-xs text-slate-500 line-through shrink-0">₹{job.originalPrice || 2999}</span>
                                                                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap shrink-0">
                                                                                {Math.round((((job.originalPrice || 2999) - (job.price || 999)) / (job.originalPrice || 2999)) * 100)}% OFF
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed font-normal">
                                                                Verified certificate & IIT Mandi mentor LOR included.
                                                            </p>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        {hasApplied ? (
                                                            <div className="flex flex-col gap-2 w-full">
                                                                <div className="w-full py-2 px-3 rounded-lg bg-[#0a0a0b] border border-emerald-500/20 flex items-center gap-2">
                                                                    <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                                                                    <div className="text-left">
                                                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider block">Application Active</span>
                                                                        <p className="text-[9px] text-slate-400">{app.status === 'accepted' ? 'Enrollment Confirmed' : `Status: ${app.status.replace('_', ' ')}`}</p>
                                                                    </div>
                                                                </div>
                                                                <button 
                                                                    onClick={() => handleDownloadInvoice(job, app)}
                                                                    className="w-full h-9 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all border border-white/10"
                                                                >
                                                                    <Download size={13} className="text-emerald-400" />
                                                                    Download Invoice
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                onClick={() => !isFull && handleApplyClick(job._id)}
                                                                disabled={isFull}
                                                                className={`w-full h-11 rounded-lg font-bold text-xs tracking-wider uppercase relative overflow-hidden transition-all duration-300 px-3 ${
                                                                    isFull 
                                                                        ? 'opacity-40 grayscale cursor-not-allowed bg-slate-800' 
                                                                        : 'hover:scale-[1.01] active:scale-[0.99] hover:shadow-[0_8px_25px_-5px_rgba(16,185,129,0.4)] shadow-md'
                                                                }`}
                                                                style={{
                                                                    background: isFull 
                                                                        ? '#1e293b' 
                                                                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                    color: 'white'
                                                                }}
                                                            >
                                                                <div className="relative z-10 flex items-center justify-center gap-2 w-full">
                                                                    {isFull ? (
                                                                        <span className="whitespace-nowrap tracking-wider text-xs">REGISTRATION CLOSED</span>
                                                                    ) : (
                                                                        <>
                                                                            <span className="whitespace-nowrap font-bold">ENROLL NOW</span> 
                                                                            <ArrowUpRight size={15} />
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </Button>
                                                        )}

                                                        {/* Deadline & Seats */}
                                                        <div className="mt-3 flex flex-col gap-1.5">
                                                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                                                                <span className="text-slate-500">Deadline</span>
                                                                <span className="text-white">{job.deadline || "Soon"}</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                                <div className={`h-full ${remainingSeats > 0 ? 'bg-emerald-500' : 'bg-red-500'} transition-all`} style={{ width: `${Math.min(100, (filledSeats / Math.max(1, totalSeats)) * 100)}%` }} />
                                                            </div>
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${
                                                                remainingSeats > 0 ? 'text-emerald-400' : 'text-red-400'
                                                            }`}>
                                                                {remainingSeats > 0 ? `Only ${remainingSeats} seats left!` : "Batch Full"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Features Strip */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3.5 mt-4 border-t border-white/[0.06] text-slate-400 text-[11px]">
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                                                    <span>Verified Certificate & Official LOR</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Sparkles size={14} className="text-blue-400 shrink-0" />
                                                    <span>Direct Mentorship from IIT Mandi Alumni</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Briefcase size={14} className="text-purple-400 shrink-0" />
                                                    <span>Live Production Projects & PPO Access</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-20 text-center"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6 border border-white/10">
                                    <Search size={32} className="text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No internships found</h3>
                                <p className="text-slate-400 max-w-xs mx-auto text-sm">
                                    Try adjusting your search or filter to find available opportunities.
                                </p>
                                <Button 
                                    onClick={() => { setSearchQuery(""); setSelectedType("All"); }}
                                    className="mt-6 bg-white/10 hover:bg-white/20 text-white border-white/10"
                                >
                                    Clear all filters
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            {/* Internship Details Modal */}
            <AnimatePresence>
                {detailJob && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
                        onClick={() => setDetailJob(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.4 }}
                            className="relative w-full max-w-3xl bg-[#0c0d14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col text-left"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-5 md:p-6 border-b border-white/10 flex items-start justify-between gap-4 bg-gradient-to-r from-white/[0.03] to-transparent sticky top-0 z-20 backdrop-blur-lg">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            {detailJob.type}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            {detailJob.location}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                            {detailJob.duration || "3-6 Months"}
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-300 border border-white/10">
                                            IIT Mandi Mentored
                                        </span>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                                        {detailJob.title}
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Industrial Cohort 2026 • Verified Certificate & Letter of Recommendation
                                    </p>
                                </div>
                                <button
                                    onClick={() => setDetailJob(null)}
                                    className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors shrink-0"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Scrollable Content Body */}
                            <div className="p-5 md:p-6 overflow-y-auto space-y-6">
                                {/* About Section */}
                                <div>
                                    <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                                        About the Internship
                                    </h3>
                                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                                        {detailJob.description}
                                    </p>
                                </div>

                                {/* Tech Stack */}
                                {detailJob.tags && detailJob.tags.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            Technologies & Tools Covered
                                        </h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {detailJob.tags.map((tag: string, i: number) => (
                                                <span key={i} className="px-2.5 py-1 rounded-md text-xs font-medium bg-white/[0.04] border border-white/[0.08] text-emerald-300">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Requirements & Responsibilities */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                    {detailJob.requirements && detailJob.requirements.length > 0 && (
                                        <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl">
                                            <h4 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                <CheckCircle2 size={14} className="text-emerald-400" />
                                                Core Requirements
                                            </h4>
                                            <ul className="space-y-2">
                                                {detailJob.requirements.map((req: string, i: number) => (
                                                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                                        <span>{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {detailJob.responsibilities && detailJob.responsibilities.length > 0 && (
                                        <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-xl">
                                            <h4 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                <Sparkles size={14} className="text-blue-400" />
                                                Key Responsibilities
                                            </h4>
                                            <ul className="space-y-2">
                                                {detailJob.responsibilities.map((res: string, i: number) => (
                                                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                                        <span>{res}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Benefits / What you get */}
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                                        Program Benefits
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                            <ShieldCheck size={20} className="text-emerald-400 mb-2" />
                                            <h5 className="text-xs font-bold text-white mb-1">Certified Experience</h5>
                                            <p className="text-[11px] text-slate-400 leading-relaxed">Verified certificate and official LOR from Webory.</p>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                            <Sparkles size={20} className="text-blue-400 mb-2" />
                                            <h5 className="text-xs font-bold text-white mb-1">Direct Mentorship</h5>
                                            <p className="text-[11px] text-slate-400 leading-relaxed">Mentored by experienced engineers & IIT Mandi faculty.</p>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                            <Briefcase size={20} className="text-purple-400 mb-2" />
                                            <h5 className="text-xs font-bold text-white mb-1">Career Growth</h5>
                                            <p className="text-[11px] text-slate-400 leading-relaxed">Top performers get PPOs & recruitment partner referrals.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Sticky Footer */}
                            <div className="p-4 md:p-5 border-t border-white/10 bg-[#090a10] flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-20">
                                <div className="flex items-center gap-2.5">
                                    <span className="text-2xl font-extrabold text-white">₹{detailJob.price || 999}</span>
                                    {(detailJob.originalPrice || 2999) > (detailJob.price || 999) && (
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-xs text-slate-500 line-through">₹{detailJob.originalPrice || 2999}</span>
                                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                                {Math.round((((detailJob.originalPrice || 2999) - (detailJob.price || 999)) / (detailJob.originalPrice || 2999)) * 100)}% OFF
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            const targetSlug = detailJob.slug || detailJob._id;
                                            router.push(`/internships/${targetSlug}`);
                                        }}
                                        className="h-10 px-4 rounded-xl text-xs font-semibold border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center gap-1.5 w-full sm:w-auto justify-center"
                                    >
                                        Open Full Page
                                        <ExternalLink size={13} />
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            const idToApply = detailJob._id;
                                            setDetailJob(null);
                                            handleApplyClick(idToApply);
                                        }}
                                        className="h-10 px-5 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 w-full sm:w-auto flex items-center justify-center gap-1.5 border-none"
                                    >
                                        Enroll Now
                                        <ArrowUpRight size={14} />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedInternship && !showPayment && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className={`bg-[#0f1014] w-full ${applyStep === 1 && (internships.find(i => i._id === selectedInternship)?.hasTiers) ? 'max-w-6xl' : 'max-w-4xl'} rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col h-[92vh] md:h-[90vh] transition-all duration-500`}
                        >
                            {applyStep === 1 && (internships.find(i => i._id === selectedInternship)?.hasTiers) ? (
                                /* STEP 1: TIER SELECTION */
                                <div className="flex-1 overflow-y-auto scroller p-6 md:p-10 bg-[#0c0d12] flex flex-col items-center relative">
                                    <button
                                        onClick={() => setSelectedInternship(null)}
                                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all z-50"
                                    >
                                        <X size={24} />
                                    </button>

                                    <div className="text-center mb-10 mt-8">
                                        <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Choose Your Internship Tier</h2>
                                        <p className="text-gray-400 text-sm max-w-lg mx-auto">Select the level that matches your career goals and receive tailored benefits.</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                                        {(internships.find(i => i._id === selectedInternship)?.tiers || []).map((tier: any, idx: number) => (
                                            <div 
                                                key={idx}
                                                onClick={() => setSelectedTier(tier.name)}
                                                className={`relative p-8 rounded-[32px] border-2 transition-all cursor-pointer group flex flex-col ${
                                                    selectedTier === tier.name 
                                                    ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.1)]' 
                                                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                                }`}
                                            >
                                                {tier.name === "Intermediate" && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-white shadow-lg z-10">Most Popular</div>}
                                                {tier.name === "Advanced" && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full text-white shadow-lg z-10">Best Value</div>}

                                                <div className="flex justify-between items-start mb-8">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedTier === tier.name ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-400'}`}>
                                                        {idx === 0 ? <Zap size={24} /> : idx === 1 ? <Sparkles size={24} /> : <GraduationCap size={24} />}
                                                    </div>
                                                    {selectedTier === tier.name && <div className="bg-emerald-500 rounded-full p-1"><CheckCircle2 className="text-black" size={16} /></div>}
                                                </div>

                                                <h3 className={`text-xl font-black uppercase tracking-tighter mb-2 ${selectedTier === tier.name ? 'text-white' : 'text-gray-400'}`}>{tier.name}</h3>

                                                <div className="mb-8">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-4xl font-black text-white">₹{tier.price}</span>
                                                        <span className="text-sm text-gray-500 line-through">₹{tier.originalPrice}</span>
                                                    </div>
                                                </div>

                                                <div className="space-y-4 mb-10 flex-1">
                                                    <ul className="space-y-3">
                                                        {tier.perks.map((perk: string, pIdx: number) => (
                                                            <li key={pIdx} className="flex items-start gap-3 text-xs text-gray-400">
                                                                <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                                                                <span className="leading-tight">{perk}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <Button className={`w-full text-xs font-black uppercase tracking-widest py-7 rounded-2xl ${selectedTier === tier.name ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-400'}`}>
                                                    {selectedTier === tier.name ? 'Selected' : 'Choose Plan'}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="mt-12 mb-8">
                                        <Button 
                                            onClick={() => setApplyStep(2)}
                                            className="bg-white text-black hover:bg-gray-100 px-20 py-8 text-sm font-black uppercase tracking-widest rounded-[24px]"
                                        >
                                            Next: Fill Application <ArrowUpRight className="ml-2" size={20} />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col md:flex-row h-full overflow-hidden w-full relative">
                                    {internships.find(i => i._id === selectedInternship)?.hasTiers && (
                                        <button 
                                            onClick={() => setApplyStep(1)}
                                            className="absolute top-8 right-20 text-gray-400 hover:text-white flex items-center gap-1 text-[10px] uppercase font-black tracking-widest transition-colors z-30"
                                        >
                                            ← Change Tier
                                        </button>
                                    )}
                            {/* LEFT SIDE: Internship Details / Perks (Hidden on Mobile) */}
                            <div className="hidden md:flex w-2/5 bg-gradient-to-br from-emerald-950/30 to-black p-8 relative flex-col justify-between border-r border-white/5 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                                
                                <div>
                                    <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4">Selected Role</h3>
                                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-100 to-white mb-3 leading-tight">
                                        {internships.find(i => i._id === selectedInternship)?.title}
                                    </h2>
                                    <p className="text-emerald-400/80 font-semibold text-base mb-8 flex items-center gap-2">
                                        <span className="text-gray-500">at</span>
                                        <span>{internships.find(i => i._id === selectedInternship)?.company}</span>
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                                <IndianRupee size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm">Stipend</h4>
                                                <p className="text-gray-400 text-xs">{internships.find(i => i._id === selectedInternship)?.stipend}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm">Certified Experience</h4>
                                                <p className="text-gray-400 text-xs">Get industry recognized certificate & Letter of Recommendation.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Requirements Section */}
                                    {internships.find(i => i._id === selectedInternship)?.requirements?.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-white/10">
                                            <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3">Requirements</h4>
                                            <ul className="space-y-2">
                                                {internships.find(i => i._id === selectedInternship)?.requirements.map((req: string, idx: number) => (
                                                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                                                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                                                        <span>{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Responsibilities Section */}
                                    {internships.find(i => i._id === selectedInternship)?.responsibilities?.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-white/10">
                                            <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">Responsibilities</h4>
                                            <ul className="space-y-2">
                                                {internships.find(i => i._id === selectedInternship)?.responsibilities.map((resp: string, idx: number) => (
                                                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                                                        <CheckCircle2 size={14} className="text-blue-500 mt-0.5 shrink-0" />
                                                        <span>{resp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Registration Fee</p>
                                            <p className="text-3xl font-black text-white">
                                                {internships.find(i => i._id === selectedInternship)?.isFree ? "FREE" : `₹${internships.find(i => i._id === selectedInternship)?.price}`}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                             <p className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                                Refundable on Performance*
                                             </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT SIDE: Form */}
                            <div className="w-full md:w-3/5 bg-[#0f1014] flex flex-col h-full overflow-hidden relative">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0f1014] z-20 shrink-0">
                                    <div className="md:hidden">
                                         <h2 className="text-lg font-bold text-white truncate max-w-[200px]">
                                           {internships.find(i => i._id === selectedInternship)?.title}
                                        </h2>
                                        <p className="text-xs text-gray-400">
                                            ₹{internships.find(i => i._id === selectedInternship)?.price} • {internships.find(i => i._id === selectedInternship)?.stipend}
                                        </p>
                                    </div>
                                    <h2 className="text-xl font-bold text-white hidden md:block">Student Application</h2>
                                    <button
                                        onClick={() => setSelectedInternship(null)}
                                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all shrink-0"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Scrollable Form Body */}
                                <div className="flex-1 overflow-y-auto p-6 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                    <form onSubmit={handleSubmit} className="space-y-6 pb-4">
                                        
                                        {/* Personal & College Info */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                 <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                                                 <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Academic Details</h3>
                                            </div>
                                           
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-400">College / University</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="e.g. IIT Bombay"
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-colors"
                                                        value={formData.college}
                                                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-400">Current Year</label>
                                                    <select
                                                        required
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-colors [&>option]:text-black"
                                                        value={formData.currentYear}
                                                        onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                                                    >
                                                        <option value="">Select Year...</option>
                                                        <option value="1st Year">1st Year</option>
                                                        <option value="2nd Year">2nd Year</option>
                                                        <option value="3rd Year">3rd Year</option>
                                                        <option value="4th Year">4th Year</option>
                                                        <option value="Final Year">Final Year</option>
                                                        <option value="Graduated">Graduated</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-gray-400">College Approval Letter (PDF, max 500KB) <span className="text-red-500">*</span></label>
                                                <input
                                                    type="file"
                                                    accept=".pdf"
                                                    required
                                                    onChange={handleApprovalLetterChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-emerald-500/50 outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20"
                                                />
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-gray-400">When can you start?</label>
                                                <input
                                                    type="date"
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-colors [color-scheme:dark]"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-gray-400">Preferred Duration</label>
                                                 <select
                                                    required
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-colors [&>option]:text-black"
                                                    value={formData.preferredDuration}
                                                    onChange={(e) => setFormData({ ...formData, preferredDuration: e.target.value })}
                                                >
                                                    <option value="">Select Duration...</option>
                                                    <option value="1 Month">1 Month</option>
                                                    <option value="2 Months">2 Months</option>
                                                    <option value="3 Months">3 Months</option>
                                                    <option value="6 Months">6 Months</option>
                                                    <option value="Flexible">Flexible</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Professional Links */}
                                        <div className="space-y-4 pt-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                 <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                                                 <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Experience & Resume</h3>
                                            </div>
                                             
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-400">LinkedIn Profile</label>
                                                    <input
                                                        type="url"
                                                        placeholder="https://linkedin.com/..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-colors"
                                                        value={formData.linkedin}
                                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-medium text-gray-400">Portfolio / GitHub</label>
                                                    <input
                                                        type="url"
                                                        placeholder="https://github.com/..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-colors"
                                                        value={formData.portfolio}
                                                        onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            {/* Resume Toggle */}
                                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                                <div className="flex items-center justify-between mb-4">
                                                    <label className="text-xs font-medium text-gray-300">Resume / CV</label>
                                                    <div className="flex gap-1 bg-black/40 p-1 rounded-lg">
                                                        <button
                                                            type="button"
                                                            onClick={() => setResumeType('file')}
                                                            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${resumeType === 'file' ? 'bg-emerald-500 text-black shadow-sm' : 'text-gray-500 hover:text-white'}`}
                                                        >
                                                            Upload
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setResumeType('link')}
                                                            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${resumeType === 'link' ? 'bg-emerald-500 text-black shadow-sm' : 'text-gray-500 hover:text-white'}`}
                                                        >
                                                            Link
                                                        </button>
                                                    </div>
                                                </div>

                                                {resumeType === 'file' ? (
                                                    <div className="relative group">
                                                        <input
                                                            type="file"
                                                            id="resume-upload"
                                                            accept=".pdf,image/*"
                                                            className="hidden"
                                                            onChange={handleFileChange}
                                                        />
                                                        <label 
                                                            htmlFor="resume-upload" 
                                                            className={`w-full flex flex-col items-center justify-center gap-3 border border-dashed rounded-xl px-4 py-8 cursor-pointer transition-all hover:bg-white/5 ${file ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10'}`}
                                                        >
                                                            {file ? (
                                                                <>
                                                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                                                        <CheckCircle2 size={20} />
                                                                    </div>
                                                                    <p className="text-xs text-emerald-400 font-medium truncate max-w-[200px]">{file.name}</p>
                                                                    <p className="text-[10px] text-gray-500">Click to change</p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/20 transition-all">
                                                                         <Search size={20} /> 
                                                                    </div>
                                                                    <p className="text-xs text-gray-400 font-medium">Click to browse (PDF/Image)</p>
                                                                </>
                                                            )}
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="url"
                                                        placeholder="Paste Google Drive / Dropbox link..."
                                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-colors"
                                                        value={formData.resume}
                                                        onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                 <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                                                 <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest">Why You?</h3>
                                            </div>
                                            <textarea
                                                required
                                                rows={3}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-colors resize-none"
                                                placeholder="Briefly explain why you are a good fit..."
                                                value={formData.coverLetter}
                                                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-gray-400">Referral Code</label>
                                             <input
                                                type="text"
                                                placeholder="Optional"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-colors uppercase tracking-widest"
                                                value={formData.referralCode}
                                                onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
                                            />
                                        </div>
                                        
                                         <div className="h-4"></div> {/* Bottom spacer */}
                                    </form>
                                </div>

                                <div className="p-6 pb-12 md:pb-6 border-t border-white/10 bg-[#0f1014] z-20 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                                     <Button
                                        onClick={handleSubmit}
                                        disabled={submitting || (uploading && resumeType === 'file')}
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black border-0 py-6 text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                                    >
                                        {uploading ? "Uploading File..." : submitting ? "Processing Application..." : (internships.find(i => i._id === selectedInternship)?.isFree ? "Submit Free Application" : `Proceed to Payment (₹${(internships.find(i => i._id === selectedInternship)?.hasTiers) ? (internships.find(i => i._id === selectedInternship)?.tiers?.find((t: any) => t.name === selectedTier)?.price || 0) : (internships.find(i => i._id === selectedInternship)?.price || 0)})`)}
                                    </Button>
                                    <p className="text-[10px] text-center text-gray-500 mt-3 mb-2 md:mb-0">
                                        Secure Payment via Razorpay/PhonePe • 100% Secure
                                    </p>
                                </div>
                            </div>
                        </div>
                        )}
                    </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <LeadCaptureModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
                internshipId={selectedInternship || undefined}
                internshipTitle={internships.find(i => i._id === selectedInternship)?.title}
            />

            {selectedInternship && user && (
                <PaymentModal
                    isOpen={showPayment}
                    onClose={() => {
                        setShowPayment(false);
                        setSelectedInternship(null);
                        toast.info("Application saved! You can complete payment anytime from your Profile.");
                    }}
                    courseTitle={`Internship: ${internships.find(i => i._id === selectedInternship)?.title}`}
                    price={(internships.find(i => i._id === selectedInternship)?.hasTiers) ? (internships.find(i => i._id === selectedInternship)?.tiers?.find((t: any) => t.name === selectedTier)?.price || 0) : (internships.find(i => i._id === selectedInternship)?.price || 0)}
                    originalPrice={(internships.find(i => i._id === selectedInternship)?.hasTiers) ? (internships.find(i => i._id === selectedInternship)?.tiers?.find((t: any) => t.name === selectedTier)?.originalPrice || 0) : (internships.find(i => i._id === selectedInternship)?.originalPrice || 0)}
                    gstPercentage={internships.find(i => i._id === selectedInternship)?.gstPercentage || 0}
                    internshipId={selectedInternship}
                    selectedTier={selectedTier} // Pass this to PaymentModal
                    userId={user._id}
                    userName={user.firstName}
                    userEmail={user.email}
                    mobileNumber={user.phone}
                    resourceType="internship"
                />
            )}

            {showInvoice && transactionData && (
                <Invoice
                    {...transactionData}
                    onClose={() => setShowInvoice(false)}
                />
            )}

            <Footer />
        </main>
    );
}
