"use client";

import { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Users,
  Eye,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "promotion" | "urgent";
  target: "all" | "students" | "teachers" | "admins";
  bannerActive: boolean;
  link?: string;
  linkText?: string;
  expiresAt?: string;
  createdBy?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  createdAt: string;
}

export default function AnnouncementsAdminPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "warning" | "promotion" | "urgent">("info");
  const [target, setTarget] = useState<"all" | "students" | "teachers" | "admins">("all");
  const [bannerActive, setBannerActive] = useState(true);
  const [link, setLink] = useState("");
  const [linkText, setLinkText] = useState("Learn More");
  const [expiresAt, setExpiresAt] = useState("");

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      if (data.success && data.announcements) {
        setAnnouncements(data.announcements);
      } else {
        toast.error(data.error || "Failed to load announcements");
      }
    } catch {
      toast.error("Network error fetching announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill title and message");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          type,
          target,
          bannerActive,
          link: link.trim() || undefined,
          linkText: linkText.trim() || undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Announcement published successfully!");
        setShowModal(false);
        // Reset form
        setTitle("");
        setMessage("");
        setType("info");
        setTarget("all");
        setLink("");
        setLinkText("Learn More");
        setExpiresAt("");
        fetchAnnouncements();
      } else {
        toast.error(data.error || "Failed to create announcement");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bannerActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          !currentStatus ? "Announcement activated" : "Announcement paused"
        );
        setAnnouncements((prev) =>
          prev.map((a) =>
            a._id === id ? { ...a, bannerActive: !currentStatus } : a
          )
        );
      }
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this announcement?"))
      return;

    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Announcement deleted");
        setAnnouncements((prev) => prev.filter((a) => a._id !== id));
      }
    } catch {
      toast.error("Failed to delete announcement");
    }
  };

  const activeCount = announcements.filter((a) => a.bannerActive).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl">
              <Megaphone className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
                Global Smart Announcements
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Publish live notice banners and alerts across the website for Students, Teachers & Admins
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAnnouncements}
            className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus size={18} />
            New Announcement
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-indigo-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Total Broadcasts
              </p>
              <h3 className="text-3xl font-black text-white mt-1">
                {announcements.length}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Megaphone size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Currently Live on Website
              </p>
              <h3 className="text-3xl font-black text-green-400 mt-1">
                {activeCount}
              </h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
              <Eye size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Target Groups
              </p>
              <h3 className="text-sm font-semibold text-gray-300 mt-2 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs">All Users</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-xs">Students</span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-xs">Teachers</span>
              </h3>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
              <Users size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>All Published Announcements</span>
            <span className="text-xs font-normal text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
              {announcements.length}
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 animate-pulse">
            Loading announcements...
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-16 text-center text-gray-400 space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-500">
              <Megaphone size={30} />
            </div>
            <h3 className="text-lg font-bold text-white">No Announcements Yet</h3>
            <p className="text-sm max-w-md mx-auto text-gray-400">
              Click &quot;New Announcement&quot; above to create a notice banner for students, teachers, or the whole platform.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {announcements.map((ann) => {
              const isUrgent = ann.type === "urgent";
              const isPromo = ann.type === "promotion";
              const isWarn = ann.type === "warning";

              return (
                <div
                  key={ann._id}
                  className="p-5 md:p-6 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Type Badge */}
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isUrgent
                            ? "bg-red-500/20 text-red-300 border-red-500/40"
                            : isPromo
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : isWarn
                            ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        }`}
                      >
                        {ann.type}
                      </span>

                      {/* Target Audience Badge */}
                      <span className="text-[10px] font-semibold text-gray-300 bg-white/10 px-2 py-0.5 rounded-full">
                        Audience: {ann.target.toUpperCase()}
                      </span>

                      {/* Status Badge */}
                      {ann.bannerActive ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <CheckCircle size={10} /> Active on Banner
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                          <XCircle size={10} /> Paused
                        </span>
                      )}

                      {ann.expiresAt && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock size={11} /> Expires:{" "}
                          {new Date(ann.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {ann.title}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {ann.message}
                    </p>

                    {ann.link && (
                      <div className="pt-1">
                        <a
                          href={ann.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2"
                        >
                          <ExternalLink size={12} />
                          {ann.linkText || "Destination URL"} ({ann.link})
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
                    <button
                      onClick={() => handleToggle(ann._id, ann.bannerActive)}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition-colors ${
                        ann.bannerActive
                          ? "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
                      }`}
                    >
                      {ann.bannerActive ? "Pause Banner" : "Go Live"}
                    </button>

                    <button
                      onClick={() => handleDelete(ann._id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                      title="Delete Announcement"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card bg-[#0b0f19] border border-white/10 rounded-3xl p-6 md:p-8 max-w-2xl w-full my-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                  <Megaphone size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Create New Announcement
                  </h3>
                  <p className="text-xs text-gray-400">
                    Broadcast an official notice or promotional banner
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white p-2 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Announcement Headline *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 🎉 Holi Special 50% Off / Scheduled Server Upgrade"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Detailed Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Use code HOLI50 at checkout to claim instant 50% discount on all premium courses and internships!"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 text-sm resize-none"
                  required
                />
              </div>

              {/* Type & Target */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Alert Type / Styling
                  </label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="info">🔵 Information (Blue / Purple)</option>
                    <option value="promotion">🟠 Special Promotion (Amber / Gold)</option>
                    <option value="warning">🟡 Important Warning (Yellow)</option>
                    <option value="urgent">🔴 Urgent / Critical (Red / Rose)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Target Audience
                  </label>
                  <select
                    value={target}
                    onChange={(e: any) => setTarget(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="all">🌍 Everyone (All Users & Visitors)</option>
                    <option value="students">🎓 Only Students</option>
                    <option value="teachers">👨‍🏫 Only Teachers</option>
                    <option value="admins">🛡️ Only Admins</option>
                  </select>
                </div>
              </div>

              {/* Link CTA & Button Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    CTA Destination Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="e.g. /courses or https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="e.g. Claim Offer / View Details"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Auto-Expiry Date & Time (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 [color-scheme:dark]"
                />
              </div>

              {/* Live Preview */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Live Banner Preview:
                </p>
                <div
                  className={`p-3 rounded-xl border text-white text-xs flex items-center justify-between gap-3 ${
                    type === "urgent"
                      ? "bg-gradient-to-r from-red-600 to-rose-700 border-red-500/40"
                      : type === "promotion"
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 border-amber-400/40"
                      : type === "warning"
                      ? "bg-gradient-to-r from-yellow-600 to-amber-700 border-yellow-400/40"
                      : "bg-gradient-to-r from-blue-600 to-indigo-700 border-blue-400/40"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold underline">
                      {title || "Headline Here"}:
                    </span>
                    <span className="truncate">
                      {message || "Your message will appear here..."}
                    </span>
                  </div>
                  {link && (
                    <span className="bg-white/20 text-white font-bold px-2 py-0.5 rounded-full shrink-0 text-[10px]">
                      {linkText || "View"} →
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {submitting ? "Publishing..." : "Publish Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
