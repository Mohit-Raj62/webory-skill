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

    const [formData, setFormData] = useState({
        resume: "",
        coverLetter: "",
        portfolio: "",
        linkedin: "",
        phone: user?.phone || "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [transactionData, setTransactionData] = useState<any>(null);
    const router = useRouter();

    const filteredInternships = useMemo(() => {
        return internships.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 job.company.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = selectedType === "All" || job.type === selectedType;
            return matchesSearch && matchesType;
        });
    }, [internships, searchQuery, selectedType]);

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
        
        setSubmitting(true);
        try {
            const internshipDetails = internships.find(i => i._id === selectedInternship);
            
            const res = await fetch("/api/internships/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    internshipId: selectedInternship,
                    resume: formData.resume,
                    coverLetter: formData.coverLetter,
                    portfolio: formData.portfolio,
                    linkedin: formData.linkedin,
                    transactionId: "PENDING_PAYU",
                    amountPaid: internshipDetails?.price || 0
                }),
            });

            const data = await res.json();
            
            if (res.ok || data.error === "Already applied to this internship") {
                setShowPayment(true);
            } else {
                toast.error(data.error || "Failed to submit application");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("An error occurred");
        } finally {
            setSubmitting(false);
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

                                        <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-emerald-300 transition-colors duration-500">{job.title}</h3>
                                        <div className="text-base text-slate-300 font-bold mb-4 flex items-center gap-2 opacity-90">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            {job.company}
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
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="glass-card w-full max-w-lg p-8 rounded-2xl relative border-purple-500/30"
                        >
                            <button
                                onClick={() => setSelectedInternship(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">Submit Application</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-300 block mb-2">Resume Link (Google Drive/Dropbox)</label>
                                    <input
                                        type="url"
                                        required
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500/50 outline-none"
                                        placeholder="https://..."
                                        value={formData.resume}
                                        onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-300 block mb-2">Cover Letter</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500/50 outline-none resize-none"
                                        placeholder="Why should we hire you?"
                                        value={formData.coverLetter}
                                        onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-300 block mb-2">Portfolio Link</label>
                                        <input
                                            type="url"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500/50 outline-none"
                                            placeholder="https://..."
                                            value={formData.portfolio}
                                            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-300 block mb-2">LinkedIn Profile</label>
                                        <input
                                            type="url"
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500/50 outline-none"
                                            placeholder="https://linkedin.com/in/..."
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 py-6 text-lg font-bold mt-4"
                                >
                                    {submitting ? "Processing..." : `Pay ₹${Math.round((internships.find(i => i._id === selectedInternship)?.price || 0) * (1 + (internships.find(i => i._id === selectedInternship)?.gstPercentage || 0) / 100))} & Submit`}
                                </Button>
                            </form>
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
