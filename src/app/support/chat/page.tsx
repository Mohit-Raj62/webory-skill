"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { 
    ArrowLeft, 
    Send, 
    CheckCircle2, 
    Copy, 
    Check, 
    Ticket, 
    Mail, 
    Phone, 
    Search, 
    ShieldCheck, 
    RefreshCw, 
    ChevronRight,
    HelpCircle,
    User,
    Loader2,
    GraduationCap,
    CreditCard,
    Video,
    Briefcase,
    Paperclip,
    FileText,
    Image as ImageIcon,
    X,
    ExternalLink,
    Download
} from "lucide-react";
import { useAuth } from "@/components/auth/session-provider";
import { toast } from "sonner";

export interface AttachmentItem {
    url: string;
    name: string;
    size: number;
    type: string;
    isImage?: boolean;
}

interface Message {
    id: string;
    role: "user" | "support";
    text: string;
    timestamp: Date;
    attachments?: AttachmentItem[];
    ticketOffer?: {
        category: string;
        subject: string;
        message: string;
    };
    createdTicket?: {
        ticketId: string;
        category: string;
        status: string;
    };
    isTicketLookup?: boolean;
    ticketDetails?: any;
}

const QUICK_TOPICS = [
    {
        title: "Certificate Download & Corrections",
        category: "certificate",
        icon: GraduationCap,
        prompt: "I am having an issue downloading my verified certificate, or my legal name requires a correction."
    },
    {
        title: "Payment Debited, Course Locked",
        category: "payment",
        icon: CreditCard,
        prompt: "My UPI / card payment was debited, but my course is still locked in my dashboard."
    },
    {
        title: "LMS Video Buffering / Lesson Locked",
        category: "lms",
        icon: Video,
        prompt: "The video lecture is buffering or the next chapter is showing locked."
    },
    {
        title: "Internship Offer Letter & Tasks",
        category: "internship",
        icon: Briefcase,
        prompt: "How do I access my verified internship offer letter and submit weekly mentor tasks?"
    },
    {
        title: "Raise Official Support Ticket",
        category: "other",
        icon: Ticket,
        prompt: "I would like to raise an official support ticket for the engineering support team."
    }
];

export default function SupportChatPage() {
    const { user } = useAuth();
    const [isMounted, setIsMounted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome-1",
            role: "support",
            text: "Hello and welcome to the official **Webory Skills** Technical Support & Resolution Desk.\n\nI am here to assist you with instant solutions regarding certificate downloads, payment settlements, course access, and internship workflows. If any issue requires manual review, I can also directly lodge an official support ticket for our engineering and operations team.\n\nHow may our desk help you today?",
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // Attachments state
    const [pendingAttachments, setPendingAttachments] = useState<AttachmentItem[]>([]);
    const [uploadingAttachment, setUploadingAttachment] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sidebar ticket lookup state
    const [sidebarTicketId, setSidebarTicketId] = useState("");
    const [sidebarLookupLoading, setSidebarLookupLoading] = useState(false);
    const [lookedUpTicket, setLookedUpTicket] = useState<any>(null);

    // Ticket form modal / inline state
    const [ticketFormData, setTicketFormData] = useState({
        name: "",
        email: "",
        phone: "",
        category: "other",
        subject: "",
        message: ""
    });
    const [submittingTicket, setSubmittingTicket] = useState(false);
    const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // File Upload Handler
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingAttachment(true);
        const uploadedList: AttachmentItem[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // 10MB limit
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`"${file.name}" exceeds the 10MB limit.`);
                continue;
            }

            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await fetch("/api/upload/support", {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(data.error || `Failed to upload ${file.name}`);
                }

                uploadedList.push({
                    url: data.url,
                    name: data.name || file.name,
                    size: data.size || file.size,
                    type: data.type || file.type,
                    isImage: data.isImage ?? file.type.startsWith("image/")
                });
                toast.success(`Attached: ${file.name}`);
            } catch (err: any) {
                console.error("Upload error:", err);
                toast.error(err.message || `Failed to upload ${file.name}`);
            }
        }

        if (uploadedList.length > 0) {
            setPendingAttachments(prev => [...prev, ...uploadedList]);
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setUploadingAttachment(false);
    };

    const handleRemovePendingAttachment = (indexToRemove: number) => {
        setPendingAttachments(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    // Pre-fill user data when session loads
    useEffect(() => {
        if (user) {
            const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
            setTicketFormData(prev => ({
                ...prev,
                name: prev.name || fullName,
                email: prev.email || user.email || "",
                phone: prev.phone || user.phone || ""
            }));
        }
    }, [user]);

    // Auto scroll only the inner chat container (never the page window)
    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Focus input on load and mark mounted without jumping page
    useEffect(() => {
        setIsMounted(true);
        inputRef.current?.focus({ preventScroll: true });
    }, []);

    const formatTimestamp = (date: Date) => {
        if (!isMounted) return null;
        try {
            const d = new Date(date);
            return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch {
            return null;
        }
    };

    // Copy Ticket ID
    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedTicketId(id);
        toast.success("Ticket ID copied to clipboard!");
        setTimeout(() => setCopiedTicketId(null), 2500);
    };

    // Send a message
    const handleSendMessage = async (customText?: string) => {
        const textToSend = (customText || input).trim();
        const attachmentsToSend = [...pendingAttachments];

        if ((!textToSend && attachmentsToSend.length === 0) || loading || uploadingAttachment) return;

        const userMsg: Message = {
            id: `usr-${Date.now()}`,
            role: "user",
            text: textToSend || (attachmentsToSend.length > 0 ? "Shared attachment(s):" : ""),
            attachments: attachmentsToSend.length > 0 ? attachmentsToSend : undefined,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        if (!customText) setInput("");
        setPendingAttachments([]);
        setLoading(true);

        try {
            // Build recent history for context
            const history = messages.slice(-6).map(m => ({
                role: m.role === "support" ? "assistant" : "user",
                content: m.text
            }));

            const res = await fetch("/api/support/ai-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "chat",
                    message: textToSend,
                    history,
                    userContext: {
                        name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
                        email: user?.email || ""
                    }
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to reach resolution desk");
            }

            const supportMsg: Message = {
                id: `sup-${Date.now()}`,
                role: "support",
                text: data.reply || "Thank you for reaching out. Please let us know if you need any additional help.",
                timestamp: new Date(),
                ticketOffer: data.ticketOffer || undefined,
                isTicketLookup: data.isTicketLookup || false,
                ticketDetails: data.ticketDetails || undefined
            };

            setMessages(prev => [...prev, supportMsg]);

            if (data.ticketOffer) {
                setTicketFormData(prev => ({
                    ...prev,
                    category: data.ticketOffer.category || prev.category,
                    subject: data.ticketOffer.subject || prev.subject,
                    message: data.ticketOffer.message || prev.message
                }));
            }
        } catch (err: any) {
            console.error("Chat error:", err);
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    role: "support",
                    text: "Aapke inquiry ko process karne me ek pal ka network delay hua hai. Kripya apna message dobara send karein, ya aap direct support desk ko **support@weboryskills.in** par likh sakte hain.",
                    timestamp: new Date()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Sidebar Ticket Lookup
    const handleSidebarLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        const cleanId = sidebarTicketId.trim();
        if (!cleanId) return;

        setSidebarLookupLoading(true);
        setLookedUpTicket(null);
        try {
            const res = await fetch("/api/support/ai-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "track_ticket",
                    ticketId: cleanId
                })
            });

            const data = await res.json();
            if (!res.ok || !data.found) {
                toast.error(data.message || "No ticket found with this ID.");
                return;
            }

            const ticket = data.ticket;
            setLookedUpTicket(ticket);

            const lookupMessage: Message = {
                id: `lookup-${Date.now()}`,
                role: "support",
                text: `Official Ticket Status for **${ticket.ticketId}**:\n\n` +
                      `• **Category:** ${ticket.category}\n` +
                      `• **Subject:** ${ticket.subject}\n` +
                      `• **Status:** \`${ticket.status}\`\n` +
                      `• **Priority:** ${ticket.priority}\n` +
                      `• **Created At:** ${new Date(ticket.createdAt).toLocaleString("en-IN")}\n` +
                      `• **Resolution Note:** ${ticket.adminNotes}`,
                timestamp: new Date(),
                isTicketLookup: true,
                ticketDetails: ticket
            };

            setMessages(prev => [...prev, lookupMessage]);
            setSidebarTicketId("");
            toast.success(`Ticket ${ticket.ticketId} loaded in chat.`);
        } catch (_error) {
            toast.error("Failed to lookup ticket status.");
        } finally {
            setSidebarLookupLoading(false);
        }
    };

    // Submit Official Ticket from Chat
    const handleCreateTicket = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!ticketFormData.name.trim() || !ticketFormData.email.trim()) {
            toast.error("Please provide your name and email.");
            return;
        }

        if (!ticketFormData.subject.trim() || !ticketFormData.message.trim()) {
            toast.error("Please provide a subject and message.");
            return;
        }

        // Collect all attachments from messages + pending
        const allChatAttachments: AttachmentItem[] = [];
        messages.forEach(m => {
            if (m.attachments && m.attachments.length > 0) {
                allChatAttachments.push(...m.attachments);
            }
        });
        if (pendingAttachments.length > 0) {
            allChatAttachments.push(...pendingAttachments);
        }

        setSubmittingTicket(true);
        try {
            const res = await fetch("/api/support/ai-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "create_ticket",
                    name: ticketFormData.name.trim(),
                    email: ticketFormData.email.trim().toLowerCase(),
                    phone: ticketFormData.phone.trim(),
                    category: ticketFormData.category,
                    subject: ticketFormData.subject.trim(),
                    message: ticketFormData.message.trim(),
                    attachments: allChatAttachments
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to create support ticket");
            }

            // Append confirmation to chat
            const confirmationMsg: Message = {
                id: `ticket-confirm-${Date.now()}`,
                role: "support",
                text: `✅ **Official Support Ticket Created Successfully!**\n\n` +
                      `• **Ticket ID:** \`${data.ticketId}\`\n` +
                      `• **Category:** ${data.category.toUpperCase()}\n` +
                      `• **Status:** In Resolution Queue (SLA: 4-6 business hours)\n\n` +
                      `A confirmation receipt has been emailed to **${ticketFormData.email}** from **support@weboryskills.in**. Our technical operations team has been notified and will address your request on priority.`,
                timestamp: new Date(),
                createdTicket: {
                    ticketId: data.ticketId,
                    category: data.category,
                    status: data.status
                }
            };

            setMessages(prev => [...prev, confirmationMsg]);
            toast.success(`Support ticket ${data.ticketId} lodged!`);

            // Clear form
            setTicketFormData({
                name: user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "",
                email: user?.email || "",
                phone: user?.phone || "",
                category: "other",
                subject: "",
                message: ""
            });
        } catch (err: any) {
            toast.error(err.message || "Failed to submit ticket.");
        } finally {
            setSubmittingTicket(false);
        }
    };

    // Restart conversation
    const handleRestartSession = () => {
        setMessages([
            {
                id: "welcome-restart",
                role: "support",
                text: "Session refreshed. Welcome to the **Webory Skills** Technical Support & Resolution Desk. How can our team assist you?",
                timestamp: new Date()
            }
        ]);
        toast.info("Support session reset.");
    };

    // Helper to render brand name with careers green gradient
    const renderBrandName = (text: string) => {
        if (!text.toLowerCase().includes("webory skills") && !text.toLowerCase().includes("weboryskills")) {
            return text;
        }
        const subparts = text.split(/(Webory Skills|webory skills|Weboryskills)/gi);
        return subparts.map((sp, spi) => {
            if (sp.toLowerCase() === "webory skills" || sp.toLowerCase() === "weboryskills") {
                return (
                    <span key={spi} className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 font-bold">
                        Webory Skills
                    </span>
                );
            }
            return sp;
        });
    };

    // Helper to render rich styled lines (bold, italic, code, links) without ugly raw asterisks
    const renderFormattedLine = (line: string) => {
        const parts = line.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*[^*\s][^*]*\*|`.*?`|https?:\/\/[^\s]+)/g);
        return parts.map((part, i) => {
            if (!part) return null;

            // ***bold italic***
            if (part.startsWith("***") && part.endsWith("***")) {
                const inner = part.slice(3, -3);
                return (
                    <strong key={i} className="font-bold text-white italic">
                        {renderBrandName(inner)}
                    </strong>
                );
            }

            // **bold**
            if (part.startsWith("**") && part.endsWith("**")) {
                const inner = part.slice(2, -2);
                return (
                    <strong key={i} className="font-semibold text-white">
                        {renderBrandName(inner)}
                    </strong>
                );
            }

            // *italic or highlight*
            if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
                const inner = part.slice(1, -1);
                return (
                    <span key={i} className="text-emerald-300 font-medium">
                        {renderBrandName(inner)}
                    </span>
                );
            }

            // `code`
            if (part.startsWith("`") && part.endsWith("`")) {
                const inner = part.slice(1, -1);
                return (
                    <code key={i} className="font-mono bg-slate-900/90 text-emerald-400 border border-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                        {inner}
                    </code>
                );
            }

            // URLs
            if (part.startsWith("http://") || part.startsWith("https://")) {
                return (
                    <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">
                        {part}
                    </a>
                );
            }

            return renderBrandName(part);
        });
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans overflow-x-hidden flex flex-col">
            <Navbar />

            {/* Subtle Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>
            </div>

            <div className="relative z-10 pt-24 sm:pt-32 pb-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1 flex flex-col">
                {/* Top Bar: Left aligned Back to Home link, Right aligned Desk Status */}
                <div className="flex items-center justify-between w-full mb-6 sm:mb-8">
                    <Link 
                        href="/"
                        className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-emerald-950/30 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 transition-all text-xs sm:text-sm font-medium"
                    >
                        <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>

                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-xs font-medium tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        <span>Helpdesk Online</span>
                    </div>
                </div>

                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Webory Skills</span> Helpdesk
                    </h1>
                    
                    <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
                        Instant resolutions for enrolled learners and interns. Ask any inquiry, track existing tickets, or escalate directly to our engineering support queue.
                    </p>
                </div>

                {/* 2-Column Desktop Grid / Stacked Mobile Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
                    
                    {/* Left Column: Quick Directory, Live Tracker & Verified SLA Card */}
                    <aside className="lg:col-span-4 xl:col-span-4 space-y-4">
                        {/* Back to Support Shortcut in Sidebar */}
                        <Link
                            href="/support"
                            className="group flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 hover:bg-emerald-950/30 border border-slate-800/80 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 transition-all text-xs font-semibold shadow-lg"
                        >
                            <div className="flex items-center gap-2">
                                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform text-slate-400 group-hover:text-emerald-400" />
                                <span>Back to Support</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">Overview</span>
                        </Link>
                        {/* Desk Identity Card */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
                            <div className="flex items-center gap-3.5 pb-3.5 border-b border-slate-800">
                                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0 p-2 shadow-inner">
                                    <Image
                                        src="/webory-logo.png"
                                        alt="Webory Skills Logo"
                                        width={36}
                                        height={36}
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <span>Resolution Center</span>
                                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                            Online
                                        </span>
                                    </h3>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        MSME Registered Credential Desk
                                    </p>
                                </div>
                            </div>

                            <div className="pt-3 grid grid-cols-2 gap-2 text-center text-xs">
                                <div className="p-2 rounded-xl bg-black/40 border border-slate-800/60">
                                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Response SLA</span>
                                    <span className="text-emerald-400 font-bold text-xs">Instant / 4-6 hrs</span>
                                </div>
                                <div className="p-2 rounded-xl bg-black/40 border border-slate-800/60">
                                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Helpline</span>
                                    <span className="text-white font-bold text-xs">Mon - Sat</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Ticket Tracker Card */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
                            <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-2">
                                <Ticket size={16} className="text-emerald-400" />
                                <span>Track Your Ticket</span>
                            </div>
                            <p className="text-slate-400 text-xs mb-3">
                                Enter your 10-character Ticket ID (e.g. <span className="font-mono text-slate-300">WS-TICK-849201</span>):
                            </p>
                            <form onSubmit={handleSidebarLookup} className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Enter Ticket ID..."
                                    value={sidebarTicketId}
                                    onChange={(e) => setSidebarTicketId(e.target.value)}
                                    className="w-full bg-black/50 border border-slate-800 rounded-xl pl-3 pr-20 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 font-mono transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={sidebarLookupLoading || !sidebarTicketId.trim()}
                                    className="absolute right-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {sidebarLookupLoading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />}
                                    <span>Track</span>
                                </button>
                            </form>

                            {/* Looked Up Ticket Mini Result */}
                            {lookedUpTicket && (
                                <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30 text-xs space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono font-bold text-emerald-400">{lookedUpTicket.ticketId}</span>
                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold uppercase">
                                            {lookedUpTicket.status}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 text-[11px] truncate font-medium">{lookedUpTicket.subject}</p>
                                    <p className="text-slate-400 text-[10px]">{lookedUpTicket.adminNotes}</p>
                                </div>
                            )}
                        </div>

                        {/* Quick Common Inquiries */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-2">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-white font-bold text-xs sm:text-sm uppercase tracking-wider">
                                    <HelpCircle size={15} className="text-emerald-400" />
                                    <span>Common Queries</span>
                                </div>
                                <span className="text-[10px] text-slate-500">1-click answers</span>
                            </div>

                            {QUICK_TOPICS.map((topic, idx) => {
                                const IconComp = topic.icon;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleSendMessage(topic.prompt)}
                                        disabled={loading}
                                        className="w-full text-left p-2.5 rounded-xl bg-black/30 hover:bg-emerald-950/30 border border-slate-800/80 hover:border-emerald-500/40 transition-all flex items-center justify-between group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                            <IconComp size={14} className="text-slate-400 group-hover:text-emerald-400 shrink-0" />
                                            <span className="text-xs text-slate-300 group-hover:text-white font-medium truncate">
                                                {topic.title}
                                            </span>
                                        </div>
                                        <ChevronRight size={13} className="text-slate-600 group-hover:text-emerald-400 shrink-0 transition-transform group-hover:translate-x-0.5" />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Direct Contacts Card */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-2.5 text-xs">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                <ShieldCheck size={14} className="text-emerald-400" />
                                <span>Official Direct Desks</span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800/60 flex items-center justify-between">
                                <div className="min-w-0">
                                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Priority Helpdesk</div>
                                    <a href="mailto:support@weboryskills.in" className="text-emerald-400 hover:underline font-mono text-xs truncate block font-medium">
                                        support@weboryskills.in
                                    </a>
                                </div>
                                <Mail size={15} className="text-slate-500 shrink-0" />
                            </div>

                            <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800/60 flex items-center justify-between">
                                <div className="min-w-0">
                                    <div className="text-[10px] text-slate-500 uppercase font-semibold">General & Partnerships</div>
                                    <a href="mailto:info@weboryskills.in" className="text-slate-300 hover:underline font-mono text-xs truncate block font-medium">
                                        info@weboryskills.in
                                    </a>
                                </div>
                                <Mail size={15} className="text-slate-500 shrink-0" />
                            </div>

                            <div className="p-2.5 rounded-xl bg-black/40 border border-slate-800/60 flex items-center justify-between">
                                <div className="min-w-0">
                                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Official Helpline</div>
                                    <span className="text-white font-mono text-xs block font-medium">
                                        +91 94734 71153
                                    </span>
                                </div>
                                <Phone size={15} className="text-slate-500 shrink-0" />
                            </div>

                            <p className="text-[10px] text-slate-500 leading-normal pt-1">
                                Security note: Official transactional OTPs and credentials are sent exclusively from <span className="text-slate-300 font-mono">no-reply@weboryskills.in</span>.
                            </p>
                        </div>
                    </aside>

                    {/* Right Column: Full-featured Live Support Console */}
                    <div className="lg:col-span-8 xl:col-span-8 flex flex-col rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0c121e] via-[#090e17] to-[#060a10] shadow-2xl overflow-hidden">
                        
                        {/* Console Header Bar */}
                        <div className="px-5 py-4 border-b border-slate-800/80 bg-[#0a0f19]/90 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 p-1.5 flex items-center justify-center shadow-inner">
                                        <Image
                                            src="/webory-logo.png"
                                            alt="Webory Avatar"
                                            width={28}
                                            height={28}
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#090e17] rounded-full" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                        <span>Technical Resolution Specialist</span>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                            Verified
                                        </span>
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Empowered with full <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 font-semibold">Webory Skills</span> system knowledge
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleRestartSession}
                                    title="Restart Conversation"
                                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                                >
                                    <RefreshCw size={13} />
                                    <span className="hidden sm:inline">Clear Chat</span>
                                </button>
                            </div>
                        </div>

                        {/* Messages Conversation Stream (Container Scroller) */}
                        <div 
                            ref={chatContainerRef}
                            className="h-[520px] sm:h-[580px] p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm scroll-smooth"
                        >
                            {messages.map((msg) => {
                                const isUser = msg.role === "user";
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                                    >
                                        {/* Avatar */}
                                        {!isUser ? (
                                            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700/80 p-1 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                                                <Image
                                                    src="/webory-logo.png"
                                                    alt="Webory Avatar"
                                                    width={22}
                                                    height={22}
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                                                <User size={15} />
                                            </div>
                                        )}

                                        {/* Message Bubble */}
                                        <div className={`max-w-[85%] sm:max-w-[80%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                                            <div
                                                className={`rounded-2xl px-4 py-3 leading-relaxed ${
                                                    isUser
                                                        ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-tr-none shadow-lg shadow-emerald-950/50"
                                                        : "bg-[#111927] border border-slate-800 text-slate-200 rounded-tl-none shadow-md"
                                                }`}
                                            >
                                                {/* Formatted Text Content */}
                                                <div className="font-sans text-xs sm:text-sm space-y-2 leading-relaxed">
                                                    {msg.text.split("\n\n").map((paragraph, pIdx) => {
                                                        const rawLines = paragraph.split("\n");
                                                        return (
                                                            <div key={pIdx} className="space-y-1">
                                                                {rawLines.map((rawLine, lIdx) => {
                                                                    const trimmed = rawLine.trim();
                                                                    if (!trimmed) return null;

                                                                    // 1. Check for bullet list item: starts with • or * or - or +
                                                                    const bulletMatch = trimmed.match(/^[\*•\-+]\s+(.*)$/);
                                                                    if (bulletMatch) {
                                                                        return (
                                                                            <div key={lIdx} className="flex items-start gap-2.5 pl-1.5 py-0.5 text-slate-200">
                                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                                                                <span className="flex-1 leading-relaxed">
                                                                                    {renderFormattedLine(bulletMatch[1])}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    }

                                                                    // 2. Check for numbered list item: e.g. "1. ", "2. "
                                                                    const numberedMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)$/);
                                                                    if (numberedMatch) {
                                                                        return (
                                                                            <div key={lIdx} className="flex items-start gap-2.5 pl-1 py-0.5 text-slate-200">
                                                                                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold mt-0.5 shrink-0 border border-emerald-500/30">
                                                                                    {numberedMatch[1]}
                                                                                </span>
                                                                                <span className="flex-1 leading-relaxed">
                                                                                    {renderFormattedLine(numberedMatch[2])}
                                                                                </span>
                                                                            </div>
                                                                        );
                                                                    }

                                                                    // 3. Regular Line
                                                                    return (
                                                                        <p key={lIdx} className="leading-relaxed">
                                                                            {renderFormattedLine(rawLine)}
                                                                        </p>
                                                                    );
                                                                })}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Attached Images & Documents */}
                                                {msg.attachments && msg.attachments.length > 0 && (
                                                    <div className="mt-2.5 pt-2 border-t border-white/10 space-y-2">
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {msg.attachments.map((att, attIdx) => {
                                                                if (att.isImage) {
                                                                    return (
                                                                        <a
                                                                            key={attIdx}
                                                                            href={att.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="group block relative rounded-xl overflow-hidden border border-white/15 bg-black/40 hover:border-emerald-400 transition-all shadow-md"
                                                                        >
                                                                            <img
                                                                                src={att.url}
                                                                                alt={att.name || "Attachment"}
                                                                                className="w-full max-h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                                            />
                                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 justify-between">
                                                                                <span className="text-[10px] text-white truncate max-w-[80%] font-medium">
                                                                                    {att.name}
                                                                                </span>
                                                                                <ExternalLink size={12} className="text-emerald-400 shrink-0" />
                                                                            </div>
                                                                        </a>
                                                                    );
                                                                }
                                                                return (
                                                                    <a
                                                                        key={attIdx}
                                                                        href={att.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex items-center gap-2.5 p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/15 hover:border-emerald-400 text-left transition-all group"
                                                                    >
                                                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                                                            <FileText size={16} />
                                                                        </div>
                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="text-xs font-semibold text-white truncate group-hover:text-emerald-300 transition-colors">
                                                                                {att.name}
                                                                            </p>
                                                                            <p className="text-[10px] text-slate-300">
                                                                                {att.size ? `${(att.size / 1024).toFixed(0)} KB • ` : ""}Document
                                                                            </p>
                                                                        </div>
                                                                        <Download size={13} className="text-slate-400 group-hover:text-emerald-400 shrink-0" />
                                                                    </a>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Interactive Ticket Offer Card */}
                                                {msg.ticketOffer && (
                                                    <div className="mt-4 pt-3.5 border-t border-slate-700/70">
                                                        <div className="p-4 rounded-2xl bg-[#090e17] border border-emerald-500/30 space-y-3 text-left shadow-lg">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                                                                    <Ticket size={15} />
                                                                    <span>Escalate to Engineering Support Ticket?</span>
                                                                </div>
                                                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 uppercase font-semibold">
                                                                    {msg.ticketOffer.category}
                                                                </span>
                                                            </div>

                                                            <div className="text-xs text-slate-300">
                                                                <p className="font-semibold text-white">{msg.ticketOffer.subject}</p>
                                                                <p className="text-slate-400 mt-1">{msg.ticketOffer.message}</p>
                                                            </div>

                                                            {/* Quick Confirmation Form */}
                                                            <form onSubmit={handleCreateTicket} className="space-y-2.5 pt-1">
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Your Full Name *"
                                                                        value={ticketFormData.name}
                                                                        onChange={(e) => setTicketFormData(prev => ({ ...prev, name: e.target.value }))}
                                                                        required
                                                                        className="w-full bg-[#05080e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
                                                                    />
                                                                    <input
                                                                        type="email"
                                                                        placeholder="Registered Email *"
                                                                        value={ticketFormData.email}
                                                                        onChange={(e) => setTicketFormData(prev => ({ ...prev, email: e.target.value }))}
                                                                        required
                                                                        className="w-full bg-[#05080e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
                                                                    />
                                                                </div>

                                                                {/* Attachments Indicator in Ticket Form */}
                                                                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                                                                    <span className="flex items-center gap-1.5 text-emerald-400">
                                                                        <Paperclip size={12} />
                                                                        <span>
                                                                            {messages.reduce((acc, m) => acc + (m.attachments?.length || 0), 0) + pendingAttachments.length > 0
                                                                                ? `${messages.reduce((acc, m) => acc + (m.attachments?.length || 0), 0) + pendingAttachments.length} file(s) attached`
                                                                                : "No files attached"}
                                                                        </span>
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => fileInputRef.current?.click()}
                                                                        className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                                                                    >
                                                                        <ImageIcon size={12} />
                                                                        <span>+ Attach screenshot/doc</span>
                                                                    </button>
                                                                </div>

                                                                <button
                                                                    type="submit"
                                                                    disabled={submittingTicket}
                                                                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 disabled:opacity-50 cursor-pointer active:scale-95"
                                                                >
                                                                    {submittingTicket ? (
                                                                        <>
                                                                            <Loader2 size={13} className="animate-spin" />
                                                                            <span>Submitting Support Ticket...</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <CheckCircle2 size={13} />
                                                                            <span>Confirm & Lodge Support Ticket</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Created Ticket Confirmation Card */}
                                                {msg.createdTicket && (
                                                    <div className="mt-3.5 pt-3 border-t border-slate-700/60">
                                                        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-3 text-left">
                                                            <div>
                                                                <span className="text-[10px] text-emerald-400 font-semibold uppercase block">
                                                                    Registered Ticket Reference
                                                                </span>
                                                                <span className="text-base font-mono font-extrabold text-white tracking-wide">
                                                                    {msg.createdTicket.ticketId}
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopy(msg.createdTicket!.ticketId)}
                                                                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-95"
                                                            >
                                                                {copiedTicketId === msg.createdTicket.ticketId ? (
                                                                    <>
                                                                        <Check size={13} />
                                                                        <span>Copied</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Copy size={13} />
                                                                        <span>Copy ID</span>
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Timestamp */}
                                            <span suppressHydrationWarning className="text-[10px] text-slate-500 mt-1.5 px-1 font-mono min-h-[14px]">
                                                {formatTimestamp(msg.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Thinking / Reviewing Indicator */}
                            {loading && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 p-1 flex items-center justify-center shrink-0">
                                        <Image
                                            src="/webory-logo.png"
                                            alt="Webory Avatar"
                                            width={20}
                                            height={20}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="rounded-2xl rounded-tl-none px-4 py-3 bg-[#111927] border border-slate-800 text-slate-300 flex items-center gap-2.5 text-xs">
                                        <Loader2 size={15} className="animate-spin text-emerald-400" />
                                        <span>Resolution specialist is reviewing your inquiry...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Console Input Bar */}
                        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-[#0a0f19] shrink-0">
                            {/* Hidden File Input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileUpload}
                                multiple
                                accept="image/*,.pdf,.doc,.docx,.txt"
                                className="hidden"
                            />

                            {/* Pending Attachments Preview Chips */}
                            {(pendingAttachments.length > 0 || uploadingAttachment) && (
                                <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-2.5 scrollbar-none">
                                    {pendingAttachments.map((att, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 bg-slate-900 border border-emerald-500/40 rounded-xl px-2.5 py-1.5 text-xs text-white shrink-0 shadow-sm"
                                        >
                                            {att.isImage ? (
                                                <img src={att.url} alt={att.name} className="w-5 h-5 rounded object-cover" />
                                            ) : (
                                                <FileText size={14} className="text-emerald-400" />
                                            )}
                                            <span className="max-w-[130px] truncate text-[11px] text-slate-200">{att.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePendingAttachment(idx)}
                                                className="p-0.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    {uploadingAttachment && (
                                        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-emerald-400 shrink-0">
                                            <Loader2 size={13} className="animate-spin" />
                                            <span className="text-[11px]">Uploading file...</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Quick Suggestion Chips */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-2.5 scrollbar-none text-[11px]">
                                <button
                                    type="button"
                                    onClick={() => handleSendMessage("I want to raise an official support ticket.")}
                                    className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-colors shrink-0 whitespace-nowrap cursor-pointer"
                                >
                                    ⚡ Raise Official Ticket
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSendMessage("How do I correct my legal name on my verified certificate?")}
                                    className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-colors shrink-0 whitespace-nowrap cursor-pointer"
                                >
                                    🎓 Name Correction
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSendMessage("Where can I download my course GST invoice?")}
                                    className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-colors shrink-0 whitespace-nowrap cursor-pointer"
                                >
                                    💳 GST Invoice
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSendMessage("When will my weekly internship tasks be evaluated by mentors?")}
                                    className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-colors shrink-0 whitespace-nowrap cursor-pointer"
                                >
                                    💼 Mentor SLA
                                </button>
                            </div>

                            {/* Message Input Form */}
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="relative flex items-center gap-2"
                            >
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading || uploadingAttachment}
                                    className="p-3 rounded-2xl bg-white/5 hover:bg-emerald-950/40 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 transition-all shrink-0 flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-40"
                                    title="Attach screenshot or document (Payment screenshot, ID, error, PDF)"
                                >
                                    {uploadingAttachment ? (
                                        <Loader2 size={18} className="animate-spin text-emerald-400" />
                                    ) : (
                                        <Paperclip size={18} />
                                    )}
                                </button>

                                <div className="relative flex-1 flex items-center">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder={
                                            pendingAttachments.length > 0 
                                                ? "Add a note or press enter to send attachment(s)..." 
                                                : "Type your question or issue in detail..."
                                        }
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        disabled={loading}
                                        className="w-full bg-[#05080e] border border-slate-800 rounded-2xl pl-4 pr-14 py-3.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all shadow-inner"
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading || uploadingAttachment || (!input.trim() && pendingAttachments.length === 0)}
                                        className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white transition-all disabled:opacity-40 shadow-lg shadow-emerald-950 cursor-pointer active:scale-95"
                                        title="Send Message"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </form>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 px-1">
                                <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px]">Enter</kbd> to send</span>
                                <span>Powered by <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 font-semibold">Webory Skills</span> Technical Helpdesk</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
