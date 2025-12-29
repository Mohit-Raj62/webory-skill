"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, DollarSign, IndianRupee, CheckCircle2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UPIPaymentModal } from "@/components/courses/upi-payment-modal";
import { Invoice } from "@/components/courses/invoice";

// Fallback data for initial render or error
const fallbackInternships = [
    {
        _id: "1",
        title: "Frontend Developer Intern",
        company: "Webory Tech",
        location: "Remote",
        type: "Full-time",
        stipend: "₹15,000 - ₹30,000 / month",
        tags: ["React", "Tailwind", "TypeScript"],
    },
    {
        _id: "2",
        title: "UI/UX Design Intern",
        company: "Creative Studio",
        location: "Remote",
        type: "Part-time",
        stipend: "₹10,000 - ₹20,000 / month",
        tags: ["Figma", "Prototyping", "User Research"],
    },
];

export default function InternshipsPage() {
    const [internships, setInternships] = useState < any[] > ([]);
    const [user, setUser] = useState(null);
    const [applied, setApplied] = useState < string[] > ([]);
    const [selectedInternship, setSelectedInternship] = useState < string | null > (null);
    const [formData, setFormData] = useState({
        resume: "",
        coverLetter: "",
        portfolio: "",
        linkedin: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showPayment, setShowPayment] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [transactionData, setTransactionData] = useState < any > (null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch internships
                const resInternships = await fetch("/api/internships");
                if (resInternships.ok) {
                    const data = await resInternships.json();
                    if (data.internships && data.internships.length > 0) {
                        setInternships(data.internships);
                    } else {
                        setInternships(fallbackInternships);
                    }
                } else {
                    setInternships(fallbackInternships);
                }

                // Check auth
                const resAuth = await fetch("/api/auth/me");
                if (resAuth.ok) {
                    const data = await resAuth.json();
                    setUser(data.user);

                    // Fetch applied internships
                    const resDash = await fetch("/api/user/dashboard");
                    if (resDash.ok) {
                        const dashData = await resDash.json();
                        setApplied(dashData.applications.map((a: any) => a.internship._id));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
                setInternships(fallbackInternships);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApplyClick = (id: string) => {
        if (!user) {
            router.push("/login");
            return;
        }
        // If using fallback data (string IDs), we can't submit to backend that expects ObjectId
        if (id.length < 24) {
            alert("This is a demo internship. Please wait for real internships to be loaded or contact admin.");
            return;
        }
        setSelectedInternship(id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInternship) return;
        setShowPayment(true);
    };

    const handlePaymentSuccess = async (transactionId: string, promoCode?: string) => {
        setShowPayment(false);
        setSubmitting(true);

        try {
            const internshipDetails = internships.find(i => i._id === selectedInternship);
            
            // Submit payment proof for verification (not direct enrollment)
            const res = await fetch("/api/payments/submit-proof", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    internshipId: selectedInternship,
                    transactionId,
                    amount: internshipDetails?.price || 0,
                    screenshot: "pending", // This will be set by the UPI modal
                    promoCode,
                    type: "internship", // Mark as internship payment
                    // Include application details
                    resume: formData.resume,
                    coverLetter: formData.coverLetter,
                    portfolio: formData.portfolio,
                    linkedin: formData.linkedin,
                }),
            });

            if (res.ok) {
                alert("Application submitted! Your payment will be verified by admin within 1-2 hours.");
                setSelectedInternship(null);
                setFormData({ resume: "", coverLetter: "", portfolio: "", linkedin: "" });
            } else {
                const data = await res.json();
                alert(data.error || "Application failed. Please try again.");
            }
        } catch (error) {
            console.error("Application error", error);
            alert("An error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-background relative">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Find Your Dream <span className="text-purple-400">Internship</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Kickstart your career with real-world experience at top companies.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center text-white">Loading internships...</div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {internships.map((job) => (
                            <div key={job._id} className="glass-card p-6 md:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-purple-500/50 transition-colors">
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">{job.title}</h3>
                                    <p className="text-lg text-gray-300 mb-4">{job.company}</p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                                        <span className="flex items-center"><MapPin size={16} className="mr-1" /> {job.location}</span>
                                        <span className="flex items-center"><Clock size={16} className="mr-1" /> {job.type}</span>
                                        <span className="flex items-center"><IndianRupee size={16} className="mr-1" /> {job.stipend}</span>
                                        <span className="flex items-center text-purple-400 font-semibold"><IndianRupee size={16} className="mr-1" /> Fee: ₹{job.price || 0}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {job.tags.map((tag: string, i: number) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    {applied.includes(job._id) ? (
                                        <Button disabled className="w-full md:w-auto bg-green-500/20 text-green-400 border border-green-500/50 px-8">
                                            <CheckCircle2 className="mr-2 h-4 w-4" /> Applied
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handleApplyClick(job._id)}
                                            className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0 px-8"
                                        >
                                            Apply Now
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Application Modal */}
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
                                    {submitting ? "Processing..." : `Pay ₹${internships.find(i => i._id === selectedInternship)?.price || 0} & Submit Application`}
                                </Button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {selectedInternship && (
                <UPIPaymentModal
                    isOpen={showPayment}
                    onClose={() => setShowPayment(false)}
                    onSuccess={handlePaymentSuccess}
                    courseTitle={`Internship: ${internships.find(i => i._id === selectedInternship)?.title}`}
                    price={internships.find(i => i._id === selectedInternship)?.price || 0}
                    internshipId={selectedInternship}
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
