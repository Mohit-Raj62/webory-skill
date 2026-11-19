"use client";

import { useEffect, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { 
    LifeBuoy, 
    Search, 
    Filter, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Mail, 
    MessageSquare, 
    Phone, 
    Copy, 
    Check, 
    Trash2, 
    ExternalLink, 
    ChevronRight, 
    Loader2, 
    X,
    Send,
    RefreshCw,
    ShieldAlert
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Ticket {
    _id: string;
    ticketId: string;
    name: string;
    email: string;
    phone?: string;
    category: string;
    subject: string;
    message: string;
    priority: string;
    status: "open" | "in_progress" | "resolved" | "closed";
    adminNotes?: string;
    createdAt: string;
    resolvedAt?: string;
}

export default function AdminSupportPage() {
    const searchParams = useSearchParams();
    const queryTicketId = searchParams.get("ticketId");

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, resolved: 0 });
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState(queryTicketId || "");
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    // Edit modal states
    const [editStatus, setEditStatus] = useState<"open" | "in_progress" | "resolved" | "closed">("open");
    const [editNotes, setEditNotes] = useState("");
    const [notifyStudent, setNotifyStudent] = useState(true);
    const [saving, setSaving] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== "all") params.set("status", statusFilter);
            if (categoryFilter !== "all") params.set("category", categoryFilter);
            if (searchQuery.trim()) params.set("search", searchQuery.trim());

            const res = await fetch(`/api/admin/support?${params.toString()}`);
            const data = await res.json();

            if (res.ok) {
                setTickets(data.tickets || []);
                if (data.stats) setStats(data.stats);

                // Auto-open modal if ticketId was in query param
                if (queryTicketId && data.tickets) {
                    const match = data.tickets.find((t: Ticket) => t.ticketId.toLowerCase() === queryTicketId.toLowerCase());
                    if (match) openTicketModal(match);
                }
            } else {
                toast.error(data.error || "Failed to load support tickets.");
            }
        } catch (err) {
            console.error("Fetch support tickets error:", err);
            toast.error("Network error fetching support tickets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [statusFilter, categoryFilter]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchTickets();
    };

    const openTicketModal = (ticket: Ticket) => {
        setSelectedTicket(ticket);
        setEditStatus(ticket.status);
        setEditNotes(ticket.adminNotes || "");
        setNotifyStudent(true);
    };

    const handleCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        toast.success("Ticket ID copied!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSaveTicket = async (statusOverride?: "resolved" | "in_progress" | "open") => {
        if (!selectedTicket) return;
        setSaving(true);
        const finalStatus = statusOverride || editStatus;

        try {
            const res = await fetch("/api/admin/support", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ticketId: selectedTicket.ticketId,
                    status: finalStatus,
                    adminNotes: editNotes.trim(),
                    notifyStudent: finalStatus === "resolved" ? notifyStudent : false
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(`Ticket ${selectedTicket.ticketId} updated to ${finalStatus.toUpperCase()}`);
                // Update local state
                setTickets(prev => prev.map(t => t.ticketId === selectedTicket.ticketId ? {
                    ...t,
                    status: finalStatus,
                    adminNotes: editNotes.trim(),
                    resolvedAt: finalStatus === "resolved" ? new Date().toISOString() : t.resolvedAt
                } : t));

                // Update stats locally
                setStats(prev => {
                    const oldStatus = selectedTicket.status;
                    const next = { ...prev };
                    if (oldStatus !== finalStatus) {
                        if (oldStatus in next) (next as any)[oldStatus] = Math.max(0, (next as any)[oldStatus] - 1);
                        if (finalStatus in next) (next as any)[finalStatus] = ((next as any)[finalStatus] || 0) + 1;
                    }
                    return next;
                });

                setSelectedTicket(null);
            } else {
                toast.error(data.error || "Failed to update ticket.");
            }
        } catch (err) {
            toast.error("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTicket = async (ticketId: string) => {
        if (!confirm(`Are you sure you want to permanently delete ticket ${ticketId}?`)) return;

        try {
            const res = await fetch(`/api/admin/support?ticketId=${encodeURIComponent(ticketId)}`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success(`Ticket ${ticketId} deleted.`);
                setTickets(prev => prev.filter(t => t.ticketId !== ticketId));
                if (selectedTicket?.ticketId === ticketId) setSelectedTicket(null);
            } else {
                toast.error("Failed to delete ticket.");
            }
        } catch (err) {
            toast.error("Failed to delete ticket.");
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                            <LifeBuoy size={20} />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Support & Help Desk Operations
                        </h1>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        Manage student queries, update resolution status, and sync live tracking on <span className="font-mono text-blue-400">/support</span>
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <Button
                        onClick={fetchTickets}
                        variant="outline"
                        className="border-slate-800 hover:bg-slate-900 text-slate-300 text-xs h-9 px-3 gap-1.5"
                    >
                        <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                        <span>Refresh</span>
                    </Button>
                    <a
                        href="/support"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                        <span>Student Tracker</span>
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>

            {/* Metrics Overview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#0b101b] border border-slate-800/80 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Total Tickets</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{stats.total}</div>
                    <span className="text-[10px] text-slate-500 mt-0.5 block">All lifetime logged requests</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#0b101b] border border-amber-500/20 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Open (Pending)</span>
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1">{stats.open}</div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Awaiting admin investigation</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#0b101b] border border-blue-500/20 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block">In Investigation</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-blue-300 mt-1">{stats.in_progress}</div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Currently being resolved</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#0b101b] border border-emerald-500/20 shadow-sm">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">Resolved & Closed</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{stats.resolved}</div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Successfully resolved & closed</span>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#0b101b] border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
                <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search Ticket ID, Student Name, Email, or Subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#060a12] border border-slate-800 rounded-xl pl-10 pr-20 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                    >
                        Search
                    </button>
                </form>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1 bg-[#060a12] p-1 rounded-xl border border-slate-800">
                        {[
                            { id: "all", label: "All" },
                            { id: "open", label: "Open" },
                            { id: "in_progress", label: "In Review" },
                            { id: "resolved", label: "Resolved" }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                    statusFilter === tab.id
                                        ? "bg-blue-600 text-white"
                                        : "text-slate-400 hover:text-white"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-[#060a12] border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                    >
                        <option value="all">All Topics</option>
                        <option value="certificate">Certificates</option>
                        <option value="payment">Payments</option>
                        <option value="lms">LMS / Videos</option>
                        <option value="internship">Internships</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {/* Tickets List */}
            {loading ? (
                <div className="py-20 text-center text-slate-500 space-y-2">
                    <Loader2 size={24} className="animate-spin mx-auto text-blue-400" />
                    <p className="text-xs">Loading support tickets...</p>
                </div>
            ) : tickets.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0b101b] border border-slate-800 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                        <CheckCircle2 size={24} />
                    </div>
                    <h3 className="text-base font-bold text-white">No Tickets Found</h3>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                        There are currently no tickets matching the selected filters.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket._id}
                            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                                ticket.status === 'open' 
                                    ? 'bg-[#0f172a]/60 border-amber-500/30 hover:border-amber-500/50' 
                                    : ticket.status === 'resolved'
                                    ? 'bg-[#0b101b] border-slate-800 hover:border-slate-700'
                                    : 'bg-[#0b101b] border-blue-500/30 hover:border-blue-500/50'
                            } flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm`}
                        >
                            <div className="space-y-2 flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono font-extrabold text-blue-400 text-sm">
                                        {ticket.ticketId}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(ticket.ticketId)}
                                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                                        title="Copy Ticket ID"
                                    >
                                        {copiedId === ticket.ticketId ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                    </button>

                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                        ticket.status === 'resolved'
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                            : ticket.status === 'in_progress'
                                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                    }`}>
                                        {ticket.status === 'resolved' ? 'Resolved ✓' : ticket.status === 'in_progress' ? 'In Review' : 'Open'}
                                    </span>

                                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-medium text-slate-300 uppercase">
                                        {ticket.category}
                                    </span>

                                    <span className="text-[11px] text-slate-500 ml-auto md:ml-0">
                                        {new Date(ticket.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                </div>

                                <div>
                                    <h4 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                                        {ticket.subject}
                                    </h4>
                                    <p className="text-slate-400 text-xs line-clamp-2 mt-0.5 leading-relaxed">
                                        {ticket.message}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                                    <span className="text-slate-200 font-semibold">{ticket.name}</span>
                                    <span>•</span>
                                    <a href={`mailto:${ticket.email}`} className="text-blue-400 hover:underline font-mono text-[11px] truncate">
                                        {ticket.email}
                                    </a>
                                    {ticket.phone && (
                                        <>
                                            <span>•</span>
                                            <a href={`tel:${ticket.phone}`} className="text-slate-300 hover:text-white font-mono text-[11px]">
                                                {ticket.phone}
                                            </a>
                                        </>
                                    )}
                                </div>

                                {ticket.adminNotes && (
                                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 mt-2">
                                        <span className="font-bold text-emerald-400 text-[11px] block">Admin Resolution Note:</span>
                                        <p className="text-[11px] text-slate-200 mt-0.5">{ticket.adminNotes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap md:flex-col items-stretch gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                                <Button
                                    onClick={() => openTicketModal(ticket)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8 px-4 rounded-xl font-semibold shadow-md shadow-blue-600/20"
                                >
                                    Manage / Resolve
                                </Button>

                                <div className="flex items-center gap-1.5">
                                    <a
                                        href={`mailto:${ticket.email}?subject=Re: [${ticket.ticketId}] ${encodeURIComponent(ticket.subject)}`}
                                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition-colors flex items-center justify-center border border-slate-700"
                                        title="Email Student Directly"
                                    >
                                        <Mail size={13} />
                                    </a>
                                    {ticket.phone && (
                                        <a
                                            href={`https://wa.me/${ticket.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(ticket.name)},%20this%20is%20Webory%20Skills%20Support%20regarding%20Ticket%20${encodeURIComponent(ticket.ticketId)}.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs transition-colors flex items-center justify-center"
                                            title="WhatsApp Student"
                                        >
                                            <MessageSquare size={13} />
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteTicket(ticket.ticketId)}
                                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs transition-colors"
                                        title="Delete Ticket"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Manage & Resolve Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                    <div className="bg-[#0b101b] border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-8">
                        <button
                            type="button"
                            onClick={() => setSelectedTicket(null)}
                            className="absolute right-4 top-4 p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-center gap-2 mb-4">
                            <span className="font-mono font-extrabold text-blue-400 text-lg sm:text-xl">
                                {selectedTicket.ticketId}
                            </span>
                            <span className="text-xs text-slate-400 uppercase font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                                {selectedTicket.category}
                            </span>
                        </div>

                        {/* Student Details Card */}
                        <div className="p-3.5 rounded-xl bg-[#060a12] border border-slate-800 space-y-2 mb-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Student Name:</span>
                                    <p className="font-semibold text-white">{selectedTicket.name}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Student Email:</span>
                                    <a href={`mailto:${selectedTicket.email}`} className="text-blue-400 font-mono underline">{selectedTicket.email}</a>
                                </div>
                                {selectedTicket.phone && (
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Phone / WhatsApp:</span>
                                        <p className="font-mono text-slate-200">{selectedTicket.phone}</p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold block">Logged Date:</span>
                                    <p className="text-slate-300">{new Date(selectedTicket.createdAt).toLocaleString("en-GB")}</p>
                                </div>
                            </div>
                        </div>

                        {/* Issue Subject & Message */}
                        <div className="p-3.5 rounded-xl bg-[#060a12] border border-slate-800 space-y-1.5 mb-5 text-xs">
                            <span className="text-[10px] text-slate-500 uppercase font-bold block">Subject:</span>
                            <p className="font-bold text-white text-sm">{selectedTicket.subject}</p>
                            <span className="text-[10px] text-slate-500 uppercase font-bold block pt-2">Full Message:</span>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
                        </div>

                        {/* Direct Contact Buttons */}
                        <div className="flex flex-wrap items-center gap-2 mb-5">
                            <a
                                href={`mailto:${selectedTicket.email}?subject=Re: [${selectedTicket.ticketId}] ${encodeURIComponent(selectedTicket.subject)}`}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                            >
                                <Mail size={13} />
                                <span>Reply to {selectedTicket.name}</span>
                            </a>
                            {selectedTicket.phone && (
                                <a
                                    href={`https://wa.me/${selectedTicket.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(selectedTicket.name)},%20this%20is%20Webory%20Skills%20Support%20regarding%20Ticket%20${encodeURIComponent(selectedTicket.ticketId)}.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                                >
                                    <MessageSquare size={13} />
                                    <span>WhatsApp Student</span>
                                </a>
                            )}
                        </div>

                        {/* Status Update Form */}
                        <div className="space-y-4 pt-4 border-t border-slate-800">
                            <div>
                                <label className="text-xs font-bold text-white block mb-1.5">Update Ticket Status *</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: "open", label: "Open (In Queue)", color: "border-amber-500 text-amber-400" },
                                        { id: "in_progress", label: "In Review", color: "border-blue-500 text-blue-400" },
                                        { id: "resolved", label: "Resolved & Closed", color: "border-emerald-500 text-emerald-400" }
                                    ].map(st => (
                                        <button
                                            key={st.id}
                                            type="button"
                                            onClick={() => setEditStatus(st.id as any)}
                                            className={`p-2 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                                                editStatus === st.id
                                                    ? `${st.color} bg-white/5 ring-1`
                                                    : "border-slate-800 text-slate-400 hover:bg-slate-900"
                                            }`}
                                        >
                                            {st.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-white block mb-1">
                                    Official Resolution Note (Shown to Student on Live Tracker)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="e.g. We have verified your transaction UTR and unlocked your Full Stack Web Development course. Please refresh your dashboard!"
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    className="w-full bg-[#060a12] border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 leading-relaxed resize-none"
                                />
                                <span className="text-[10px] text-slate-500 block mt-1">
                                    💡 When the student searches their Ticket ID on <span className="font-mono text-blue-400">/support</span>, this note will be visible to them.
                                </span>
                            </div>

                            {editStatus === "resolved" && (
                                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                                    <input
                                        type="checkbox"
                                        checked={notifyStudent}
                                        onChange={(e) => setNotifyStudent(e.target.checked)}
                                        className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span>Send official resolution confirmation email to student ({selectedTicket.email})</span>
                                </label>
                            )}

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3">
                                <Button
                                    type="button"
                                    onClick={() => setSelectedTicket(null)}
                                    variant="outline"
                                    className="border-slate-800 hover:bg-slate-900 text-slate-400 text-xs h-10 rounded-xl"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => handleSaveTicket("resolved")}
                                    disabled={saving}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-10 px-5 rounded-xl font-bold shadow-md shadow-emerald-600/20"
                                >
                                    {saving ? <Loader2 size={13} className="animate-spin mr-1.5" /> : <CheckCircle2 size={14} className="mr-1.5" />}
                                    Mark as Resolved & Save
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => handleSaveTicket()}
                                    disabled={saving}
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-10 px-5 rounded-xl font-semibold"
                                >
                                    {saving ? <Loader2 size={13} className="animate-spin mr-1.5" /> : null}
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
