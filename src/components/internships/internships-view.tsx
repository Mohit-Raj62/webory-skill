"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, IndianRupee, CheckCircle2, X, Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PaymentModal } from "@/components/courses/payment-modal";
import { Invoice } from "@/components/courses/invoice";
import { toast } from "sonner";

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
        if (!user) {
            router.push("/login");
            return;
        }
        if (id.length < 24) {
            alert("This is a demo internship. Please wait for real internships to be loaded or contact admin.");
            return;
        }
        setSelectedInternship(id);
    };

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
                setShowPayment(true);
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
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4 }}
                                    key={job._id || index} 
                                    className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-500/50 transition-all duration-700 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.2)] hover:-translate-y-1"
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                        <div className="absolute inset-[-2px] bg-gradient-to-tr from-emerald-500/50 via-cyan-500/20 to-blue-500/50 rounded-[2.1rem] blur-sm -z-10" />
                                    </div>

                                    <div className="flex-1 relative z-30">
                                        <div className="mb-4 flex items-center gap-3">
                                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
                                             <span className="text-[9px] font-black text-emerald-400/90 uppercase tracking-[0.2em] leading-none">
                                                Active Enrollment
                                             </span>
                                        </div>

                                        <h3 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all duration-500">{job.title}</h3>
                                        <div className="text-lg text-slate-400 font-semibold mb-6 flex items-center gap-2.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                                            <span className="group-hover:text-emerald-300 transition-colors duration-500">{job.company}</span>
                                        </div>

                                         <div className="flex flex-wrap gap-3 mb-6">
                                            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-lg">
                                                <MapPin size={13} className="text-blue-400" />
                                                <span className="text-[11px] font-bold text-slate-400">{job.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-lg">
                                                <Clock size={13} className="text-orange-400" />
                                                <span className="text-[11px] font-bold text-slate-400">{job.type}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-lg">
                                                <IndianRupee size={13} className="text-green-400" />
                                                <span className="text-[11px] font-black text-white">{job.stipend}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {job.tags && job.tags.map((tag: string, i: number) => (
                                                <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-950/20 text-emerald-400/80 text-[9px] font-black uppercase tracking-wider border border-emerald-500/10 transition-all">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 relative z-30 flex flex-col items-end gap-5 w-full md:w-auto">
                                        <div className="w-full md:w-auto p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-end group-hover:bg-white/[0.04] transition-colors">
                                             <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1.5">Registration Fee</span>
                                             <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-black text-white tracking-tighter">
                                                    ₹{job.price || 0}
                                                </span>
                                                {job.gstPercentage > 0 && <span className="text-[10px] text-gray-400 font-bold">+ GST</span>}
                                                <span className="text-[9px] text-emerald-500/80 font-black uppercase tracking-widest">Industry Standard</span>
                                             </div>
                                        </div>

                                        {(() => {
                                            const app = userApplications.find(a => a.internshipId === job._id);
                                            const isPaidJob = (job.price || 0) > 0;
                                            
                                            if (app) {
                                                if (app.status === 'accepted' || app.status === 'completed' || app.status === 'interview_scheduled') {
                                                    return (
                                                        <Button disabled className="w-full bg-slate-800/50 text-slate-500 border border-slate-700/50 h-11 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-inner">
                                                            <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Applied Successfully
                                                        </Button>
                                                    );
                                                } else if (app.status === 'pending') {
                                                    if (isPaidJob) {
                                                        return (
                                                            <Button
                                                                onClick={() => handleApplyClick(job._id)}
                                                                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black border-0 px-8 h-11 rounded-xl font-black uppercase tracking-wider text-[10px] shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group/btn"
                                                            >
                                                                <span className="relative z-20">Complete Payment</span>
                                                            </Button>
                                                        );
                                                    } else {
                                                         return (
                                                            <Button disabled className="w-full bg-slate-800/50 text-amber-500 border border-amber-500/20 h-11 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-inner">
                                                                <Clock className="mr-2 h-3.5 w-3.5" /> Application Pending
                                                            </Button>
                                                        );
                                                    }
                                                }
                                            }

                                            return (
                                                <Button
                                                    onClick={() => handleApplyClick(job._id)}
                                                    className="w-full bg-white hover:bg-emerald-500 text-black hover:text-white border-0 px-8 h-11 rounded-xl font-black uppercase tracking-wider text-[10px] shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group/btn"
                                                >
                                                    <span className="relative z-20">Apply Now</span>
                                                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:left-[100%] transition-all duration-1000" />
                                                </Button>
                                            );
                                        })()}
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
                            className="bg-[#0f1014] w-full max-w-4xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row h-[90vh]"
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
                                                ₹{internships.find(i => i._id === selectedInternship)?.price}
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

                                <div className="p-6 border-t border-white/10 bg-[#0f1014] z-20 shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                                     <Button
                                        onClick={handleSubmit}
                                        disabled={submitting || (uploading && resumeType === 'file')}
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-black border-0 py-6 text-sm font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                                    >
                                        {uploading ? "Uploading File..." : submitting ? "Processing Application..." : `Proceed to Payment (₹${internships.find(i => i._id === selectedInternship)?.price})`}
                                    </Button>
                                    <p className="text-[10px] text-center text-gray-500 mt-3">
                                        Secure Payment via Razorpay/PhonePe • 100% Secure
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
