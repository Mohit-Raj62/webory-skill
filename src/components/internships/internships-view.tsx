"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, IndianRupee, CheckCircle2, X, Search, Filter, Zap, Sparkles, GraduationCap, Globe, ArrowUpRight, ShieldCheck, Calendar, Briefcase } from "lucide-react";
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
    userApplications: { internshipId: string; status: string }[];
}

export function InternshipsView({ internships, user, userApplications }: InternshipsViewProps) {
    const [selectedInternship, setSelectedInternship] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("All");

    const [resumeType, setResumeType] = useState<'file' | 'link'>('file');
    const [file, setFile] = useState<File | null>(null);
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

        setSubmitting(true);
        let resumeUrl = formData.resume;

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
                    currentYear: formData.currentYear,
                    startDate: formData.startDate,
                    preferredDuration: formData.preferredDuration,
                    referralCode: formData.referralCode,
                    transactionId: "PENDING_PAYU",
                    amountPaid: internshipDetails?.price || 0
                }),
            });

            const data = await res.json();
            
            if (res.ok || data.error === "Already applied to this internship") {
                if (internshipDetails?.isFree) {
                    toast.success("Application submitted successfully!");
                    setSelectedInternship(null);
                    router.push("/profile?tab=internships");
                } else {
                    setShowPayment(true);
                }
                setFile(null);
            } else {
                toast.error(data.error || "Failed to submit application");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
            setUploading(false);
        }
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
                         <div className="flex flex-wrap justify-center gap-3 mb-6">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-[9px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Hiring Now
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-5 tracking-tighter text-white leading-tight">
                            Launch Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Career</span> <span className="text-slate-500 mx-2 font-light">|</span> <span className="text-slate-200 opacity-90">Earn While You Learn</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                            Gain <span className="text-white font-medium italic underline decoration-emerald-500/50">real-world experience</span> by working with 
                            growing startups and established tech companies.
                        </p>
                    </motion.div>
                </div>

                {/* Search & Filter Bar */}
                <div className="max-w-4xl mx-auto mb-8 md:mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-emerald-400 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by role or company..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all backdrop-blur-md"
                        />
                    </div>

                    <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md overflow-x-auto max-w-full">
                        {["All", "Full Time", "Part Time", "Remote", "Hybrid"].map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                    selectedType === type 
                                    ? "bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
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
                            filteredInternships.map((job, index) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ 
                                        duration: 0.8, 
                                        ease: [0.16, 1, 0.3, 1] 
                                    }}
                                    key={job._id || index} 
                                    className="group relative bg-[#0a0b10] border border-white/[0.03] rounded-[2rem] p-8 md:p-14 mb-16 transition-all duration-700 hover:shadow-[0_0_120px_-30px_rgba(16,185,129,0.1)]"
                                >
                                    {/* Ambient Gradients from Mockup */}
                                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-purple-500/[0.03] via-transparent to-emerald-500/[0.03] pointer-events-none" />
                                    
                                    <div className="relative z-10">
                                        {/* Top Header Section - More compact on mobile */}
                                        <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/[0.05]">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-emerald-400 to-blue-600 flex items-center justify-center p-1.5 md:p-2 shadow-lg">
                                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                </div>
                                                <span className="text-lg md:text-2xl font-black text-white tracking-tighter uppercase">Webory</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 md:gap-2.5 px-3 py-1.5 md:px-4 md:py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#10b981] shadow-[0_0_12px_#10b981] animate-pulse" />
                                                <span className="text-[8px] md:text-[10px] font-black text-[#10b981] uppercase tracking-[0.15em] md:tracking-[0.2em]">Active</span>
                                            </div>
                                        </div>

                                        {/* Main Content Grid */}
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                                            {/* Left: Info (8 cols) */}
                                            <div className="lg:col-span-8 space-y-8 md:space-y-10 text-left">
                                                <div>
                                                    <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-[1.2] md:leading-[1.1]">
                                                        {job.title}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 rounded-xl">
                                                            <Globe size={16} className="text-blue-400" />
                                                            <span className="text-[11px] md:text-xs font-bold text-slate-300">{job.type} ({job.location})</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 rounded-xl">
                                                            <Clock size={16} className="text-slate-400" />
                                                            <span className="text-[11px] md:text-xs font-bold text-slate-300">{job.duration || "3-6 Months"}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 rounded-xl">
                                                            <Briefcase size={16} className="text-emerald-500" />
                                                            <span className="text-[11px] md:text-xs font-bold text-slate-300">{job.perks && job.perks.length > 0 ? job.perks[0] : "Performance Bonus"}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Tech Stack Section */}
                                                <div className="bg-white/[0.02] border border-white/[0.05] p-5 md:p-8 rounded-[2rem] space-y-6">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{job.tagline || "Industry Standard"}</p>
                                                            <p className="text-sm md:text-base font-bold text-slate-300">Master production-ready technologies</p>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 md:justify-end">
                                                            {job.tags && job.tags.map((tag: string, i: number) => (
                                                                <div key={i} className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2 group/tag hover:border-emerald-500/30 transition-colors">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover/tag:bg-emerald-500 transition-colors" />
                                                                    <span className="text-[11px] md:text-xs font-bold text-slate-300">{tag}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dynamic Description Section */}
                                                <div className="space-y-6">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                                            About the Internship
                                                        </h4>
                                                        <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl">
                                                            {job.description}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        {job.requirements && job.requirements.length > 0 && (
                                                            <div>
                                                                <h4 className="text-sm font-black text-white/50 uppercase tracking-widest mb-4">Core Requirements</h4>
                                                                <ul className="space-y-3">
                                                                    {job.requirements.map((req: string, i: number) => (
                                                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                                                                            <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                                                            {req}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {job.responsibilities && job.responsibilities.length > 0 && (
                                                            <div>
                                                                <h4 className="text-sm font-black text-white/50 uppercase tracking-widest mb-4">Key Responsibilities</h4>
                                                                <ul className="space-y-3">
                                                                    {job.responsibilities.map((res: string, i: number) => (
                                                                        <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                                                                            <div className="w-1 h-1 rounded-full bg-blue-500 mt-2 shrink-0" />
                                                                            {res}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: CTA (4 cols) */}
                                            <div className="lg:col-span-4">
                                                <div className="lg:sticky lg:top-10 flex flex-col gap-6">
                                                    <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.1] rounded-[2.5rem] p-8 md:p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group/cta">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px] rounded-full" />
                                                        
                                                        <div className="mb-8 text-center lg:text-left relative z-10">
                                                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Onboarding Fee</p>
                                                            <div className="flex items-baseline justify-center lg:justify-start gap-3">
                                                                <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">₹{job.price || 999}</span>
                                                                <span className="text-sm text-slate-500 line-through">₹2,999</span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-400 mt-4 leading-relaxed font-medium">
                                                                Includes lifetime certification, premium resources, and direct mentorship.
                                                            </p>
                                                        </div>
                                                        
                                                        <Button
                                                            onClick={() => (job.totalSeats - job.filledSeats > 0) && handleApplyClick(job._id)}
                                                            disabled={job.totalSeats - job.filledSeats <= 0}
                                                            className={`w-full h-16 md:h-20 rounded-2xl font-black text-sm md:text-base tracking-widest uppercase relative overflow-hidden group/btn shadow-[0_20px_50px_-15px_rgba(16,185,129,0.4)] transition-transform ${job.totalSeats - job.filledSeats > 0 ? 'hover:scale-[1.02] active:scale-[0.98]' : 'opacity-50 grayscale cursor-not-allowed'}`}
                                                            style={{
                                                                background: job.totalSeats - job.filledSeats > 0 
                                                                    ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' 
                                                                    : '#334155',
                                                                color: 'white'
                                                            }}
                                                        >
                                                            {job.totalSeats - job.filledSeats > 0 ? (
                                                                <>
                                                                    APPLY NOW <ArrowUpRight size={22} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                                </>
                                                            ) : (
                                                                "BATCH FULL"
                                                            )}
                                                        </Button>

                                                        <div className="mt-8 flex flex-col gap-4">
                                                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider">
                                                                <span className="text-slate-500">Deadline</span>
                                                                <span className="text-white">{job.deadline || "Soon"}</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                                <div className={`h-full ${job.totalSeats - job.filledSeats > 0 ? 'bg-emerald-500' : 'bg-red-500'} transition-all`} style={{ width: `${Math.min(100, (job.filledSeats / job.totalSeats) * 100)}%` }} />
                                                            </div>
                                                            <div className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl border ${
                                                                job.totalSeats - job.filledSeats > 0 
                                                                    ? 'bg-emerald-500/10 border-emerald-500/20' 
                                                                    : 'bg-red-500/10 border-red-500/20'
                                                            }`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${job.totalSeats - job.filledSeats > 0 ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`} />
                                                                <span className={`text-[11px] font-black uppercase tracking-widest ${
                                                                    job.totalSeats - job.filledSeats > 0 ? 'text-emerald-400' : 'text-red-400'
                                                                }`}>
                                                                    {job.totalSeats - job.filledSeats > 0 
                                                                        ? `Only ${job.totalSeats - job.filledSeats} seats left!` 
                                                                        : "Registration Closed - Batch Full"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Perks Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/[0.05]">
                                            {(job.benefits && job.benefits.length > 0 ? job.benefits : [
                                                { title: "Certified Experience", description: "Get a verified internship completion certificate and letter of recommendation from Webory.", icon: "ShieldCheck" },
                                                { title: "Direct Mentorship", description: "Work directly with industry experts who will guide you through complex real-world production cycles.", icon: "Sparkles" },
                                                { title: "Career Growth", description: "Top performers will receive Pre-Placement Offers (PPOs) and exclusive networking opportunities.", icon: "Briefcase" }
                                            ]).map((benefit: any, i: number) => {
                                                const IconComponent = benefit.icon === "ShieldCheck" ? ShieldCheck : 
                                                                    benefit.icon === "Sparkles" ? Sparkles : 
                                                                    benefit.icon === "Briefcase" ? Briefcase : Globe;
                                                return (
                                                    <div key={i} className={`bg-[#0c0d12] border border-white/[0.03] rounded-3xl p-8 hover:bg-[#0e0f16] transition-all group/benefit ${i === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover/benefit:scale-110 transition-transform ${
                                                            benefit.icon === "ShieldCheck" ? "bg-emerald-500/10" : 
                                                            benefit.icon === "Sparkles" ? "bg-blue-500/10" : "bg-purple-500/10"
                                                        }`}>
                                                            <IconComponent className={
                                                                benefit.icon === "ShieldCheck" ? "text-emerald-400" : 
                                                                benefit.icon === "Sparkles" ? "text-blue-400" : "text-purple-400"
                                                            } size={24} />
                                                        </div>
                                                        <h4 className="text-lg font-black text-white mb-4">{benefit.title}</h4>
                                                        <p className="text-sm text-slate-500 leading-relaxed">{benefit.description}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
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

            <AnimatePresence>
                {selectedInternship && (
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
                            className="bg-[#0f1014] w-full max-w-4xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row h-[92vh] md:h-[90vh]"
                        >
                            {/* LEFT SIDE: Internship Details / Perks (Hidden on Mobile) */}
                            <div className="hidden md:flex w-2/5 bg-gradient-to-br from-emerald-950/30 to-black p-8 relative flex-col justify-between border-r border-white/5">
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
                                <div className="flex-1 overflow-y-auto p-6 min-h-0 custom-scrollbar scroller">
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
                                        {uploading ? "Uploading File..." : submitting ? "Processing Application..." : (internships.find(i => i._id === selectedInternship)?.isFree ? "Submit Free Application" : `Proceed to Payment (₹${internships.find(i => i._id === selectedInternship)?.price})`)}
                                    </Button>
                                    <p className="text-[10px] text-center text-gray-500 mt-3 mb-2 md:mb-0">
                                        Secure Payment via Razorpay/PhonePe • 100% Secure
                                    </p>
                                </div>
                            </div>
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
                    onClose={() => setShowPayment(false)}
                    courseTitle={`Internship: ${internships.find(i => i._id === selectedInternship)?.title}`}
                    price={internships.find(i => i._id === selectedInternship)?.price || 0}
                    gstPercentage={internships.find(i => i._id === selectedInternship)?.gstPercentage || 0}
                    internshipId={selectedInternship}
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
