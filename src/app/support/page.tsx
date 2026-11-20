"use client";

import { useState } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import Link from "next/link";
import { 
    HelpCircle, 
    CreditCard, 
    GraduationCap, 
    Video, 
    Briefcase, 
    CheckCircle2, 
    Clock, 
    Mail, 
    Phone, 
    MessageSquare, 
    Send, 
    Copy, 
    Check, 
    Search, 
    ChevronDown, 
    ExternalLink, 
    ShieldCheck, 
    AlertCircle, 
    ArrowRight,
    Loader2,
    Ticket
} from "lucide-react";
import { toast } from "sonner";


interface CategoryIssue {
    question: string;
    answer: string;
    actionLabel?: string;
    actionLink?: string;
}

const CATEGORIES = [
    {
        id: "certificate",
        title: "Certificates & Credentials",
        subtitle: "Verification, downloads & name corrections",
        icon: GraduationCap,
        color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        ringColor: "hover:border-blue-500/40",
        issues: [
            {
                question: "How do I download my Course / Internship Certificate?",
                answer: "Ensure all course modules, assignments, and quizzes have a 100% completion status. Then visit your Student Dashboard > Certificates tab to generate and download your high-resolution verified PDF.",
                actionLabel: "Go to Dashboard",
                actionLink: "/dashboard"
            },
            {
                question: "My name or completion date is printed incorrectly.",
                answer: "Certificate metadata is drawn from your registered profile details. If your legal name requires a correction on a verified credential, raise a ticket below with your government ID name and certificate ID.",
                actionLabel: "Verify Certificate",
                actionLink: "/verify-certificate"
            },
            {
                question: "How does the QR verification portal authenticate my certificate?",
                answer: "Every official Webory Skills certificate carries a cryptographic 16-character alphanumeric key and scan-to-verify QR code registered under our MSME credential repository.",
                actionLabel: "Open QR Portal",
                actionLink: "/verify-certificate"
            }
        ]
    },
    {
        id: "payment",
        title: "Payments, Invoices & Refunds",
        subtitle: "Transaction issues, receipt downloads & refunds",
        icon: CreditCard,
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        ringColor: "hover:border-emerald-500/40",
        issues: [
            {
                question: "My account was debited via UPI/Card, but my course is still locked.",
                answer: "Bank gateways sometimes take 10-15 minutes for webhook settlement. If you paid via UPI QR, go to 'Submit Payment Proof' in your dashboard and paste your 12-digit UTR/Transaction ID for instant matching.",
                actionLabel: "Submit Payment Proof",
                actionLink: "/dashboard"
            },
            {
                question: "Where can I download my official GST/Tax Invoice?",
                answer: "Invoices are automatically emailed to your registered email upon successful enrollment. You can also view and re-download verified invoices from your Course details page.",
                actionLabel: "View Courses",
                actionLink: "/courses"
            },
            {
                question: "How do I submit a refund request?",
                answer: "Refund requests are processed according to our official Refund Policy. Requests must be submitted within 7 days of purchase. Support evaluates requests within 2 business days.",
                actionLabel: "Read Refund Policy",
                actionLink: "/refund-policy"
            }
        ]
    },
    {
        id: "lms",
        title: "LMS, Videos & Course Access",
        subtitle: "Video playback, quiz locks & resource files",
        icon: Video,
        color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        ringColor: "hover:border-purple-500/40",
        issues: [
            {
                question: "Video playback is buffering or showing a black screen.",
                answer: "Webory Skills streams adaptive HLS video. If playback freezes, try clearing your browser cache, disabling aggressive ad-blockers, or switching video quality to 720p from the player controls.",
            },
            {
                question: "The next chapter or quiz module appears locked.",
                answer: "To ensure academic mastery, chapters unlock sequentially. Please make sure the previous video is marked 100% watched and any mandatory quiz is attempted.",
            },
            {
                question: "Where do I download code repositories and starter files?",
                answer: "Each technical lecture includes an 'Attachments & Code' tab below the video player where GitHub repository links and downloadable zip notes are located.",
            }
        ]
    },
    {
        id: "internship",
        title: "Internships, Tasks & Offers",
        subtitle: "Offer letters, weekly tasks & mentor evaluations",
        icon: Briefcase,
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        ringColor: "hover:border-amber-500/40",
        issues: [
            {
                question: "How do I view and print my official Internship Offer Letter?",
                answer: "Once your application status moves to 'Accepted', your official offer letter with MSME registration UDYAM-BR-26-0208472 is available on your internship tracking page.",
                actionLabel: "View Internships",
                actionLink: "/internships"
            },
            {
                question: "How do I submit weekly GitHub tasks for review?",
                answer: "Navigate to your Internship Workspace > Tasks section. Push your code to your public GitHub repository and paste the commit/PR link for mentor review.",
            },
            {
                question: "How long does mentor task evaluation take?",
                answer: "Our industry mentors review pull requests within 48 to 72 business hours, providing line-by-line constructive architectural feedback.",
            }
        ]
    },
    {
        id: "other",
        title: "Other Issues & Queries",
        subtitle: "Account, campus, hackathons & general doubt",
        icon: HelpCircle,
        color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
        ringColor: "hover:border-rose-500/40",
        issues: [
            {
                question: "My issue does not match the 4 categories above.",
                answer: "You can select 'Other Query / Technical Doubt' in the ticket form below. Fill in your details and describe your issue, and our support team will resolve it within 4-6 business hours.",
                actionLabel: "Raise a Ticket",
                actionLink: "#ticket-form"
            },
            {
                question: "Can I directly email the support desk?",
                answer: "Yes, you can write directly to our helpdesk at support@weboryskills.in with your registered email, mobile number, and screenshots of your issue.",
                actionLabel: "Email Support Desk",
                actionLink: "mailto:support@weboryskills.in"
            },
            {
                question: "Need help with College Partnerships or Hackathons?",
                answer: "For institutional MoUs, training batches, or hackathons, please write to our academic team at info@weboryskills.in or drop an inquiry on our Contact Us page.",
                actionLabel: "Contact Desk",
                actionLink: "/contact"
            }
        ]
    }
];

export default function SupportPage() {
    const [selectedCategory, setSelectedCategory] = useState("certificate");
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [ticketSearchId, setTicketSearchId] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchedTicket, setSearchedTicket] = useState<any>(null);

    // Ticket Form States
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        category: "certificate",
        subject: "",
        message: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [generatedTicketId, setGeneratedTicketId] = useState<string | null>(null);
    const [copiedTicket, setCopiedTicket] = useState(false);

    const activeCategory = CATEGORIES.find(c => c.id === selectedCategory) || CATEGORIES[0];

    const handleTicketSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/support/ticket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit support ticket.");
            }

            setGeneratedTicketId(data.ticketId);
            toast.success("Support Ticket Raised Successfully!");
            setFormData({
                name: "",
                email: "",
                phone: "",
                category: selectedCategory,
                subject: "",
                message: ""
            });
        } catch (err: any) {
            toast.error(err.message || "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSearchTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticketSearchId.trim()) return;

        setSearchLoading(true);
        setSearchedTicket(null);
        try {
            const res = await fetch(`/api/support/ticket?ticketId=${encodeURIComponent(ticketSearchId.trim())}`);
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "No ticket found with this ID.");
                return;
            }

            setSearchedTicket(data.ticket);
        } catch (err) {
            toast.error("Failed to fetch ticket status.");
        } finally {
            setSearchLoading(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedTicket(true);
        toast.success("Ticket ID copied to clipboard!");
        setTimeout(() => setCopiedTicket(false), 2000);
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
            <Navbar />

            {/* Subtle Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
            </div>

            <div className="relative z-10 pt-24 sm:pt-32 pb-14 sm:pb-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mb-3 sm:mb-4 shadow-sm">
                        <ShieldCheck size={14} className="text-blue-400 shrink-0" />
                        <span>Official Student Help & Support Center</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3 sm:mb-4 px-1">
                        How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">help you</span> today?
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto px-2">
                        Fast resolutions for enrolled learners. Find instant answers, track support tickets, or connect directly with our technical resolution desk.
                    </p>

                    {/* Quick Ticket Tracker Bar */}
                    <form onSubmit={handleSearchTicket} className="mt-6 sm:mt-8 max-w-xl mx-auto relative flex items-center px-1">
                        <div className="relative w-full">
                            <Ticket size={16} className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Enter Ticket ID (e.g. WS-TICK-849201)"
                                value={ticketSearchId}
                                onChange={(e) => setTicketSearchId(e.target.value)}
                                className="w-full bg-[#0d131f] border border-slate-800 rounded-xl sm:rounded-2xl pl-9 sm:pl-11 pr-24 sm:pr-28 py-2.5 sm:py-3.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 font-mono transition-all shadow-inner"
                            />
                            <button
                                type="submit"
                                disabled={searchLoading || !ticketSearchId.trim()}
                                className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-60 shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
                            >
                                {searchLoading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                                <span className="hidden xs:inline">Track Status</span>
                                <span className="xs:hidden">Track</span>
                            </button>
                        </div>
                    </form>

                    {/* Live Support Chat Page Callout Banner */}
                    <div className="mt-4 sm:mt-5 max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1627] to-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-xl shadow-black/40">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0 p-2 shadow-inner">
                                <img
                                    src="/webory-logo.png"
                                    alt="Webory Skills Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    <span>Support & Help Desk</span>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Live Helpdesk
                                    </span>
                                </h4>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Connect with <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 font-bold">Webory Skills</span> technical resolution desk for instant answers & priority ticketing.
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/support/chat"
                            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shrink-0 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-95 cursor-pointer text-center"
                        >
                            <MessageSquare size={14} />
                            <span>Open Support Chat</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Detailed Visual Live Ticket Tracker Result Card */}
                    {searchedTicket && (
                        <div className="mt-5 sm:mt-6 max-w-2xl mx-auto p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border border-slate-800/90 bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#070b13] text-left animate-in fade-in zoom-in-95 duration-300 shadow-2xl relative overflow-hidden">
                            {/* Ambient Top Glow */}
                            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                                searchedTicket.status === 'resolved' 
                                    ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500' 
                                    : searchedTicket.status === 'in_progress'
                                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500'
                                    : 'bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-500'
                            }`}></div>

                            {/* Ticket Header & Status */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-4 sm:pb-5 border-b border-slate-800">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                                        Ticket Reference ID
                                    </span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <h3 className="font-mono font-extrabold text-blue-400 text-base sm:text-xl tracking-tight">
                                            {searchedTicket.ticketId}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(searchedTicket.ticketId)}
                                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors active:scale-95"
                                            title="Copy Ticket ID"
                                        >
                                            <Copy size={12} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-start sm:self-auto">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wide border shadow-sm ${
                                        searchedTicket.status === 'resolved'
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                            : searchedTicket.status === 'in_progress'
                                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                    }`}>
                                        <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-current"></span>
                                        <span>
                                            {searchedTicket.status === 'resolved' 
                                                ? 'Resolved & Closed' 
                                                : searchedTicket.status === 'in_progress' 
                                                ? 'Under Investigation' 
                                                : 'In Support Queue'}
                                        </span>
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setSearchedTicket(null)}
                                        className="text-xs text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
                                        title="Close"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* 3-Stage Visual Progress Timeline */}
                            <div className="py-4 sm:py-6 border-b border-slate-800/80">
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-3 sm:mb-4">
                                    Live Resolution Timeline
                                </span>
                                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 relative">
                                    {/* Line connecting stages */}
                                    <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-800 z-0 hidden sm:block"></div>

                                    {/* Stage 1: Received */}
                                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left relative z-10 space-y-1">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500 text-black font-bold flex items-center justify-center text-[11px] sm:text-xs shadow-md shadow-emerald-500/20">
                                            ✓
                                        </div>
                                        <div>
                                            <p className="text-[11px] sm:text-xs font-bold text-white">Ticket Logged</p>
                                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                                                {new Date(searchedTicket.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stage 2: In Review */}
                                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left relative z-10 space-y-1">
                                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold flex items-center justify-center text-[11px] sm:text-xs shadow-md ${
                                            searchedTicket.status === 'in_progress' || searchedTicket.status === 'resolved'
                                                ? 'bg-blue-500 text-white shadow-blue-500/20'
                                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}>
                                            {searchedTicket.status === 'in_progress' || searchedTicket.status === 'resolved' ? '✓' : '2'}
                                        </div>
                                        <div>
                                            <p className={`text-[11px] sm:text-xs font-bold ${searchedTicket.status !== 'open' ? 'text-white' : 'text-slate-400'}`}>
                                                Under Review
                                            </p>
                                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                                                {searchedTicket.status === 'open' ? 'In Queue' : 'Assigned Desk'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stage 3: Resolved */}
                                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left relative z-10 space-y-1">
                                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold flex items-center justify-center text-[11px] sm:text-xs shadow-md ${
                                            searchedTicket.status === 'resolved'
                                                ? 'bg-emerald-500 text-black shadow-emerald-500/20'
                                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}>
                                            {searchedTicket.status === 'resolved' ? '✓' : '3'}
                                        </div>
                                        <div>
                                            <p className={`text-[11px] sm:text-xs font-bold ${searchedTicket.status === 'resolved' ? 'text-emerald-400' : 'text-slate-400'}`}>
                                                {searchedTicket.status === 'resolved' ? 'Resolved' : 'Resolution'}
                                            </p>
                                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                                                {searchedTicket.resolvedAt 
                                                    ? new Date(searchedTicket.resolvedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
                                                    : 'SLA: 4-6 Hours'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Details & Resolution Note */}
                            <div className="pt-4 sm:pt-5 space-y-2.5 sm:space-y-3 text-xs">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-slate-300">
                                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">Student Name</span>
                                        <p className="font-semibold text-white mt-0.5 text-xs sm:text-sm">{searchedTicket.name}</p>
                                    </div>
                                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/70 border border-slate-800">
                                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">Department Category</span>
                                        <p className="font-semibold text-blue-400 uppercase tracking-wide mt-0.5 text-xs sm:text-sm">{searchedTicket.category}</p>
                                    </div>
                                </div>

                                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-500 block">Subject</span>
                                    <p className="font-semibold text-white text-xs sm:text-sm">{searchedTicket.subject}</p>
                                    {searchedTicket.message && (
                                        <p className="text-slate-400 text-[11px] sm:text-xs pt-1 leading-relaxed border-t border-slate-800/60 mt-1">
                                            {searchedTicket.message}
                                        </p>
                                    )}
                                </div>

                                {/* Official Admin Resolution Note (If resolved) */}
                                {searchedTicket.adminNotes && (
                                    <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
                                        <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                                            <CheckCircle2 size={14} className="shrink-0" />
                                            <span>Official Resolution Note from Support Team:</span>
                                        </div>
                                        <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed pl-5">
                                            {searchedTicket.adminNotes}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Direct Follow-up Actions */}
                            <div className="pt-4 sm:pt-5 mt-3 sm:mt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                                <span className="text-[10px] sm:text-[11px] text-slate-400">
                                    Need urgent assistance regarding this ticket?
                                </span>
                                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                                    <a
                                        href={`https://wa.me/919473471153?text=Hi%20Webory%20Support,%20I%20am%20following%20up%20on%20my%20Ticket%20ID%20${encodeURIComponent(searchedTicket.ticketId)}.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-95"
                                    >
                                        <MessageSquare size={13} />
                                        <span>WhatsApp</span>
                                    </a>
                                    <a
                                        href={`mailto:support@weboryskills.in?subject=Follow-up%20on%20Ticket%20${encodeURIComponent(searchedTicket.ticketId)}`}
                                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-700 active:scale-95"
                                    >
                                        <Mail size={13} />
                                        <span>Email Desk</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 1: Problem Categories Selector */}
                <div className="mb-10 sm:mb-14">
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                            Select Your Problem Category
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1 px-2">
                            Choose the topic related to your issue to view instant fixes or open a priority ticket.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                        {CATEGORIES.map((cat) => {
                            const IconComponent = cat.icon;
                            const isSelected = selectedCategory === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedCategory(cat.id);
                                        setFormData(prev => ({ ...prev, category: cat.id }));
                                        setOpenFaqIndex(0);
                                    }}
                                    className={`p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border text-left transition-all duration-300 relative overflow-hidden group flex flex-col justify-between active:scale-[0.99] cursor-pointer ${
                                        isSelected 
                                            ? 'bg-slate-900 border-blue-500/50 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/30' 
                                            : 'bg-[#0b101b] border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                                    }`}
                                >
                                    <div className="space-y-3 sm:space-y-4">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center shrink-0 ${cat.color}`}>
                                            <IconComponent size={20} className="sm:w-5 sm:h-5" />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold text-sm sm:text-base transition-colors ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                                                {cat.title}
                                            </h3>
                                            <p className="text-slate-400 text-[11px] sm:text-xs mt-1 leading-snug">
                                                {cat.subtitle}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] sm:text-xs font-semibold">
                                        <span className={isSelected ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}>
                                            {isSelected ? 'Selected Category' : 'Browse Solutions'}
                                        </span>
                                        <ArrowRight size={13} className={`transition-transform ${isSelected ? 'translate-x-1 text-blue-400' : 'text-slate-500 group-hover:translate-x-1'}`} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Section 2: Instant Self-Help Solutions + Support Ticket Form Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
                    {/* Left Column: Instant Self-Help Accordion */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 bg-[#0b101b] shadow-xl">
                            <div className="flex items-center gap-3 pb-4 sm:pb-6 border-b border-slate-800">
                                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 ${activeCategory.color}`}>
                                    <activeCategory.icon size={18} className="sm:w-5 sm:h-5" />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Instant Self-Help</span>
                                    <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                                        {activeCategory.title} Solutions
                                    </h3>
                                </div>
                            </div>

                            <p className="text-slate-400 text-xs sm:text-sm mt-3 sm:mt-4 mb-4 sm:mb-6 leading-relaxed">
                                Most student queries can be resolved instantly without waiting for a reply. Check the verified solutions below:
                            </p>

                            <div className="space-y-2.5 sm:space-y-3">
                                {activeCategory.issues.map((issue, idx) => {
                                    const isOpen = openFaqIndex === idx;

                                    return (
                                        <div 
                                            key={idx}
                                            className="rounded-xl border border-slate-800/90 bg-[#070b13] overflow-hidden transition-colors"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                                className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left gap-2.5 sm:gap-3 focus:outline-none cursor-pointer"
                                            >
                                                <span className={`text-xs sm:text-sm font-semibold transition-colors ${isOpen ? 'text-blue-400' : 'text-slate-300'}`}>
                                                    {issue.question}
                                                </span>
                                                <ChevronDown size={14} className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
                                            </button>

                                            {isOpen && (
                                                <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 pt-1 text-[11px] sm:text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 space-y-2.5 sm:space-y-3">
                                                    <p>{issue.answer}</p>
                                                    {issue.actionLabel && issue.actionLink && (
                                                        <Link
                                                            href={issue.actionLink}
                                                            className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold text-xs pt-1 transition-colors"
                                                        >
                                                            <span>{issue.actionLabel}</span>
                                                            <ExternalLink size={12} />
                                                        </Link>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Self-Help Notice */}
                            <div className="mt-6 sm:mt-8 p-3.5 sm:p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-2.5 sm:gap-3 text-xs text-slate-400">
                                <HelpCircle size={15} className="text-blue-400 shrink-0 mt-0.5" />
                                <span className="text-[11px] sm:text-xs leading-relaxed">Did not find your answer? Fill in the Priority Support Ticket form on the right and our engineering helpdesk will take it up immediately.</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Raise a Priority Support Ticket */}
                    <div id="ticket-form" className="lg:col-span-6">
                        <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 bg-[#0b101b] shadow-xl relative overflow-hidden">
                            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 pb-4 sm:pb-6 border-b border-slate-800">
                                <div>
                                    <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Fast Resolution</span>
                                    <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                                        Raise a Priority Support Ticket
                                    </h3>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit">
                                    <Clock size={12} />
                                    <span>SLA: 4-6 Hours</span>
                                </div>
                            </div>

                            {generatedTicketId ? (
                                <div className="py-6 sm:py-8 text-center space-y-4 sm:space-y-5 animate-in fade-in duration-300">
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                                        <CheckCircle2 size={28} className="sm:w-8 sm:h-8" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg sm:text-xl font-bold text-white">Ticket Created Successfully!</h4>
                                        <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto px-2">
                                            A confirmation email with instructions has been dispatched to your email address.
                                        </p>
                                    </div>

                                    {/* Ticket Box */}
                                    <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-800 max-w-xs mx-auto flex items-center justify-between">
                                        <div className="text-left">
                                            <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold block">Your Reference ID:</span>
                                            <span className="text-sm sm:text-base font-mono font-bold text-blue-400">{generatedTicketId}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(generatedTicketId)}
                                            className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors active:scale-95"
                                            title="Copy Ticket ID"
                                        >
                                            {copiedTicket ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                        </button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTicketSearchId(generatedTicketId);
                                                window.scrollTo({ top: 150, behavior: 'smooth' });
                                                fetch(`/api/support/ticket?ticketId=${encodeURIComponent(generatedTicketId)}`)
                                                    .then(r => r.json())
                                                    .then(d => { if (d.ticket) setSearchedTicket(d.ticket); });
                                            }}
                                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer"
                                        >
                                            <Search size={13} />
                                            <span>Track This Ticket Live</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setGeneratedTicketId(null)}
                                            className="text-xs text-slate-400 hover:text-white underline font-medium py-1"
                                        >
                                            Raise another ticket
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleTicketSubmit} className="space-y-3.5 sm:space-y-4 pt-4 sm:pt-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="space-y-1 sm:space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Rahul Sharma"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-[#070b13] border border-slate-800 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                                            />
                                        </div>
                                        <div className="space-y-1 sm:space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">Registered Email *</label>
                                            <input
                                                type="email"
                                                required
                                                placeholder="student@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-[#070b13] border border-slate-800 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="space-y-1 sm:space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">WhatsApp / Phone Number</label>
                                            <input
                                                type="tel"
                                                placeholder="10-digit mobile number"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-[#070b13] border border-slate-800 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 font-mono"
                                            />
                                        </div>
                                        <div className="space-y-1 sm:space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-300">Category *</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, category: e.target.value });
                                                    setSelectedCategory(e.target.value);
                                                }}
                                                className="w-full bg-[#070b13] border border-slate-800 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/50"
                                            >
                                                <option value="certificate">Certificates & Credentials</option>
                                                <option value="payment">Payments, Invoices & Refunds</option>
                                                <option value="lms">LMS, Videos & Course Access</option>
                                                <option value="internship">Internships, Tasks & Offers</option>
                                                <option value="other">Other Query / Technical Doubt</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1 sm:space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300">Subject *</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Payment deducted but Full Stack course still locked"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full bg-[#070b13] border border-slate-800 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50"
                                        />
                                    </div>

                                    <div className="space-y-1 sm:space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-300">Detailed Problem Description *</label>
                                        <textarea
                                            rows={4}
                                            required
                                            placeholder="Please describe the issue in detail, including Course Name, Transaction ID or Error message..."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full bg-[#070b13] border border-slate-800 rounded-xl px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 resize-none leading-relaxed"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full py-3 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin" />
                                                <span>Registering Support Ticket...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={14} />
                                                <span>Submit Support Ticket</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section 3: Direct Official Channels Bar */}
                <div className="mt-10 sm:mt-16 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 bg-gradient-to-r from-[#0b101b] via-[#0f172a] to-[#0b101b] shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 md:gap-6 text-center md:text-left">
                        {/* Channel 1: WhatsApp Support */}
                        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3.5 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                <MessageSquare size={20} className="sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                                <h4 className="text-white text-xs sm:text-sm font-bold">WhatsApp Helpdesk</h4>
                                <p className="text-slate-400 text-[11px] sm:text-xs mt-0.5">Instant chat for quick doubts</p>
                                <a
                                    href="https://wa.me/919473471153?text=Hi%20Webory%20Skills%20Support,%20I%20need%20help%20with%20my%20course/account."
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-400 hover:text-emerald-300 text-[11px] sm:text-xs font-semibold inline-flex items-center gap-1 mt-1"
                                >
                                    <span>Chat on WhatsApp</span>
                                    <ArrowRight size={12} />
                                </a>
                            </div>
                        </div>

                        {/* Channel 2: Official Support Email */}
                        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3.5 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                                <Mail size={20} className="sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                                <h4 className="text-white text-xs sm:text-sm font-bold">Dedicated Email Desk</h4>
                                <p className="text-slate-400 text-[11px] sm:text-xs mt-0.5">SLA: 4 to 6 business hours</p>
                                <a
                                    href="mailto:support@weboryskills.in"
                                    className="text-blue-400 hover:text-blue-300 text-[11px] sm:text-xs font-mono font-semibold block truncate mt-1"
                                >
                                    support@weboryskills.in
                                </a>
                            </div>
                        </div>

                        {/* Channel 3: Helpline Call */}
                        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3.5 sm:gap-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                                <Phone size={20} className="sm:w-5 sm:h-5" />
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                                <h4 className="text-white text-xs sm:text-sm font-bold">Helpline Hours</h4>
                                <p className="text-slate-400 text-[11px] sm:text-xs mt-0.5">Mon - Sat, 10 AM - 6 PM IST</p>
                                <p className="text-white text-xs font-semibold mt-1">
                                    +91 94734 71153
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
