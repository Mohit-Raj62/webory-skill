"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, AlertTriangle, ArrowRight, Bell, Sparkles, X } from "lucide-react";

interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "promotion" | "urgent";
  target: "all" | "students" | "teachers" | "admins";
  link?: string;
  linkText?: string;
}

export function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load dismissed list
    try {
      const stored = localStorage.getItem("dismissed_announcements");
      if (stored) {
        setDismissedIds(JSON.parse(stored));
      }
    } catch {}

    fetch("/api/announcements/active")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.announcements) {
          setAnnouncements(data.announcements);
        }
      })
      .catch(() => {});
  }, []);

  if (!mounted) return null;

  // Filter out dismissed
  const visible = announcements.filter((a) => !dismissedIds.includes(a._id));
  if (visible.length === 0) return null;

  const current = visible[currentIndex % visible.length];
  if (!current) return null;

  const handleDismiss = () => {
    const updated = [...dismissedIds, current._id];
    setDismissedIds(updated);
    try {
      localStorage.setItem("dismissed_announcements", JSON.stringify(updated));
    } catch {}
  };

  const getStyle = (type: Announcement["type"]) => {
    switch (type) {
      case "urgent":
        return {
          bg: "bg-gradient-to-r from-red-600 via-rose-600 to-red-700",
          border: "border-red-400/40",
          icon: <AlertCircle className="w-4 h-4 text-white animate-pulse" />,
          badge: "bg-red-950/60 text-red-200 border-red-500/50",
          badgeText: "CRITICAL ALERT",
        };
      case "promotion":
        return {
          bg: "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600",
          border: "border-amber-300/40",
          icon: <Sparkles className="w-4 h-4 text-white" />,
          badge: "bg-amber-950/60 text-amber-100 border-amber-400/50",
          badgeText: "SPECIAL OFFER",
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700",
          border: "border-yellow-400/40",
          icon: <AlertTriangle className="w-4 h-4 text-white" />,
          badge: "bg-yellow-950/60 text-yellow-100 border-yellow-400/50",
          badgeText: "IMPORTANT NOTICE",
        };
      case "info":
      default:
        return {
          bg: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600",
          border: "border-blue-400/40",
          icon: <Bell className="w-4 h-4 text-white" />,
          badge: "bg-blue-950/60 text-blue-100 border-blue-400/50",
          badgeText: "ANNOUNCEMENT",
        };
    }
  };

  const style = getStyle(current.type);

  return (
    <div
      className={`relative z-50 text-white ${style.bg} border-b ${style.border} shadow-lg py-2.5 px-4 transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs md:text-sm">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="p-1 rounded-md bg-white/10 shrink-0">
            {style.icon}
          </span>

          <span
            className={`hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${style.badge}`}
          >
            {style.badgeText}
          </span>

          <div className="truncate flex items-center gap-2">
            <span className="font-bold underline decoration-white/40 underline-offset-2">
              {current.title}:
            </span>
            <span className="text-white/95 font-medium truncate">
              {current.message}
            </span>
          </div>

          {current.link && (
            <Link
              href={current.link}
              className="hidden md:inline-flex items-center gap-1 font-bold text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs transition-colors shrink-0"
            >
              {current.linkText || "View Details"}
              <ArrowRight size={12} />
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {visible.length > 1 && (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="text-[11px] font-semibold text-white/80 hover:text-white px-2 py-0.5 rounded bg-black/20 hover:bg-black/30 transition-colors"
              title="Next Announcement"
            >
              {(currentIndex % visible.length) + 1}/{visible.length} Next →
            </button>
          )}
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
