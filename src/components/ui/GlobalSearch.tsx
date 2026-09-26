"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Search,
  X,
  Loader2,
  GraduationCap,
  Briefcase,
  Trophy,
  BookOpen,
  Code2,
  Bot,
  BrainCircuit,
  Orbit,
  Monitor,
  ShieldCheck,
  Users,
  Info,
  Mail,
  FileText,
  MessageSquare,
  ArrowUpRight,
  Compass,
  Sparkles,
  Zap,
} from "lucide-react";
import { SearchResultItem } from "@/app/api/search/route";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  GraduationCap,
  Briefcase,
  Trophy,
  BookOpen,
  Code2,
  Bot,
  BrainCircuit,
  Orbit,
  Monitor,
  ShieldCheck,
  Users,
  Info,
  Mail,
  FileText,
  MessageSquare,
  Compass,
};

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "course", label: "Courses" },
  { id: "internship", label: "Internships" },
  { id: "tool", label: "AI & Tools" },
  { id: "page", label: "Pages" },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

const QUICK_SUGGESTIONS: SearchResultItem[] = [
  {
    id: "sug-fs",
    title: "Full Stack Development with Gen AI",
    description: "Production web development + AI engineering track",
    type: "course",
    url: "/courses/full-stack-development-with-gen-ai",
    badge: "Featured",
    iconName: "GraduationCap",
  },
  {
    id: "sug-py",
    title: "Python for Beginners",
    description: "Hands-on programming foundation with projects",
    type: "course",
    url: "/courses/python-for-beginners",
    badge: "\u20b9100",
    iconName: "GraduationCap",
  },
  {
    id: "sug-int",
    title: "Web Development Internship",
    description: "Real-world projects, live code reviews & certification",
    type: "internship",
    url: "/internships/web-development-internship",
    badge: "Remote",
    iconName: "Briefcase",
  },
  {
    id: "sug-devlab",
    title: "DevLab Code Playground",
    description: "Online browser runner for Python, JS, C++, Java",
    type: "tool",
    url: "/playground",
    badge: "IDE",
    iconName: "Code2",
  },
  {
    id: "sug-verify",
    title: "Verify Certificate",
    description: "Instant QR & ID credential authenticity verification",
    type: "page",
    url: "/verify-certificate",
    badge: "Official",
    iconName: "ShieldCheck",
  },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -12, scale: 0.96, filter: "blur(8px)" },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { type: "spring" as const, damping: 26, stiffness: 380, staggerChildren: 0.04, delayChildren: 0.05 },
  },
  exit: { opacity: 0, y: -8, scale: 0.97, filter: "blur(4px)", transition: { duration: 0.18, ease: "easeIn" } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: "spring" as const, damping: 28, stiffness: 450 } },
};

export function NavbarExpandableSearch() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 800);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsExpanded(false);
    };
    if (isExpanded) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsExpanded((prev) => { const next = !prev; if (next) setTimeout(() => inputRef.current?.focus(), 60); return next; });
      } else if (e.key === "Escape" && isExpanded) setIsExpanded(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded) setTimeout(() => inputRef.current?.focus(), 80);
    else { setQuery(""); setResults([]); setSelectedIndex(0); }
  }, [isExpanded]);

  const fetchSearchResults = useCallback(async (q: string, type: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (type && type !== "all") params.set("type", type);
      params.set("limit", "12");
      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) { const data = await res.json(); setResults(data.results || []); }
    } catch (err) { console.error("Search fetch error:", err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!isExpanded) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setSelectedIndex(0);
    searchTimeoutRef.current = setTimeout(() => fetchSearchResults(query, activeCategory), 150);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [query, activeCategory, isExpanded, fetchSearchResults]);

  const displayedResults = query
    ? results.filter((item) => (activeCategory === "all" ? true : item.type === activeCategory))
    : QUICK_SUGGESTIONS;

  const handleSelectResult = (item: SearchResultItem) => { setIsExpanded(false); router.push(item.url); };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (displayedResults.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); const next = (selectedIndex + 1) % displayedResults.length; setSelectedIndex(next); scrollIntoView(next); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const prev = (selectedIndex - 1 + displayedResults.length) % displayedResults.length; setSelectedIndex(prev); scrollIntoView(prev); }
    else if (e.key === "Enter") { e.preventDefault(); if (displayedResults[selectedIndex]) handleSelectResult(displayedResults[selectedIndex]); }
  };

  const scrollIntoView = (index: number) => {
    if (!listRef.current) return;
    const elements = listRef.current.querySelectorAll("[data-nav-search-item]");
    const el = elements[index] as HTMLElement;
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const highlightMatch = (text: string, q: string) => {
    if (!q || !text) return text;
    const regex = new RegExp(`(${q.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <span key={i} className="text-cyan-300 font-bold bg-cyan-500/20 px-0.5 rounded">{part}</span> : part
    );
  };

  const getTypeStyle = (type: SearchResultItem["type"]) => {
    switch (type) {
      case "course": return { bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/30", label: "Course" };
      case "internship": return { bg: "bg-blue-500/20 text-blue-300 border-blue-500/40", iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm shadow-blue-500/30", label: "Internship" };
      case "tool": return { bg: "bg-purple-500/20 text-purple-300 border-purple-500/40", iconBg: "bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-sm shadow-purple-500/30", label: "Tool" };
      case "hackathon": return { bg: "bg-amber-500/20 text-amber-300 border-amber-500/40", iconBg: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-500/30", label: "Hackathon" };
      default: return { bg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40", iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm shadow-cyan-500/30", label: "Page" };
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      <AnimatePresence initial={false} mode="wait">
        {!isExpanded ? (
          <motion.button
            key="icon-btn"
            initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.7, rotate: 15 }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            onClick={() => setIsExpanded(true)}
            aria-label="Search"
            title="Search (Ctrl + K)"
            className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-purple-600/20 hover:from-blue-600/40 hover:via-indigo-600/35 hover:to-purple-600/40 border border-blue-500/40 hover:border-blue-400/90 text-blue-300 hover:text-white transition-all duration-300 shadow-md shadow-blue-500/15 hover:shadow-blue-500/40 group cursor-pointer overflow-hidden"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
            {isPulsing && !shouldReduceMotion && (
              <motion.span
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 rounded-xl border border-blue-400/60 pointer-events-none"
              />
            )}
            <motion.div animate={isPulsing ? { scale: [1, 1.15, 1] } : {}} transition={{ duration: 0.5 }}>
              <Search size={15} className="text-blue-400 group-hover:text-cyan-300 transition-all duration-200 drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]" />
            </motion.div>
          </motion.button>
        ) : (
          <motion.div
            key="input-bar"
            initial={{ opacity: 0, width: 36, scaleX: 0.5 }}
            animate={{ opacity: 1, width: 260, scaleX: 1 }}
            exit={{ opacity: 0, width: 36, scaleX: 0.5 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            style={{ transformOrigin: "left" }}
            className="relative flex items-center h-9 bg-gradient-to-r from-[#080f24] via-[#0d1535] to-[#080f24] border border-blue-500/70 rounded-xl px-2.5 shadow-[0_0_24px_-4px_rgba(59,130,246,0.55)] ring-1 ring-blue-500/20"
          >
            <motion.div
              className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {loading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}>
                <Loader2 size={13} className="text-cyan-400 shrink-0 mr-1.5" />
              </motion.div>
            ) : (
              <Search size={13} className="text-cyan-400 shrink-0 mr-1.5 drop-shadow-[0_0_6px_rgba(6,182,212,0.7)]" />
            )}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search courses, tools..."
              className="w-full bg-transparent border-none outline-none text-white text-xs placeholder:text-blue-300/45 font-medium"
            />
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 500 }}
              onClick={(e) => { e.stopPropagation(); if (query) setQuery(""); else setIsExpanded(false); }}
              className="text-gray-500 hover:text-white p-0.5 ml-1 rounded hover:bg-blue-500/25 transition-colors shrink-0"
            >
              <X size={13} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full mt-2.5 left-0 w-80 sm:w-96 bg-gradient-to-b from-[#080e22]/98 via-[#090d1e]/98 to-[#060918]/98 border border-blue-500/30 rounded-2xl shadow-[0_24px_70px_-10px_rgba(10,18,50,0.95),0_0_40px_-8px_rgba(59,130,246,0.3)] overflow-hidden z-[70] backdrop-blur-3xl"
          >
            <motion.div
              className="h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {query && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-1.5 px-3 py-2 border-b border-blue-500/15 bg-blue-950/20 overflow-x-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {CATEGORIES.map((cat, i) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04, type: "spring", stiffness: 500 }}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`relative px-2.5 py-0.5 rounded-lg text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/30 border border-blue-400/30"
                          : "text-blue-200/70 hover:text-white bg-blue-950/40 hover:bg-blue-900/50 border border-blue-500/20"
                      }`}
                    >
                      {cat.label}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}

            <motion.div ref={listRef} className="max-h-72 overflow-y-auto p-2 space-y-0.5" style={{ scrollbarWidth: "none" }}>
              {!query && (
                <motion.div variants={itemVariants} className="px-2 py-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent flex items-center gap-1.5 uppercase">
                    <motion.div animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                      <Sparkles size={11} className="text-blue-400" />
                    </motion.div>
                    Quick Suggestions
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1 h-1 rounded-full bg-emerald-400 inline-block" />
                    Popular
                  </span>
                </motion.div>
              )}

              {displayedResults.length > 0 ? (
                displayedResults.map((item, index) => {
                  const typeStyle = getTypeStyle(item.type);
                  const IconComponent = item.iconName ? ICON_MAP[item.iconName] || Search : Search;
                  const isSelected = index === selectedIndex;
                  return (
                    <motion.div
                      key={item.id || index}
                      variants={itemVariants}
                      data-nav-search-item
                      onClick={() => handleSelectResult(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 600, damping: 30 }}
                      className={`group flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-600/25 via-indigo-600/18 to-transparent border border-blue-500/45 shadow-sm shadow-blue-500/20 text-white"
                          : "hover:bg-gradient-to-r hover:from-white/[0.06] hover:to-transparent border border-transparent text-gray-300"
                      }`}
                    >
                      <motion.div whileHover={{ scale: 1.12, rotate: -5 }} transition={{ type: "spring", stiffness: 500 }} className={`w-8 h-8 rounded-xl ${typeStyle.iconBg} flex items-center justify-center shrink-0`}>
                        <IconComponent size={15} />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-white truncate">{highlightMatch(item.title, query)}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${typeStyle.bg}`}>{item.badge || typeStyle.label}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{highlightMatch(item.description, query)}</p>
                      </div>
                      <motion.div animate={isSelected ? { x: 2, y: -2 } : { x: 0, y: 0 }} transition={{ type: "spring", stiffness: 500 }}>
                        <ArrowUpRight size={14} className={`shrink-0 transition-colors ${isSelected ? "text-cyan-400" : "text-gray-600 group-hover:text-cyan-400"}`} />
                      </motion.div>
                    </motion.div>
                  );
                })
              ) : !loading ? (
                <motion.div variants={itemVariants} className="py-8 px-3 text-center space-y-2">
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }} className="text-3xl mx-auto w-fit">🔍</motion.div>
                  <p className="text-xs text-blue-200 font-semibold">No results for &quot;{query}&quot;</p>
                  <p className="text-[10px] text-gray-500">Try Python, Full Stack, DevLab, or Internships</p>
                </motion.div>
              ) : (
                <div className="p-2 space-y-1.5">
                  {[...Array(3)].map((_, i) => (
                    <motion.div key={i} animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }} className="flex items-center gap-2.5 p-2 rounded-xl">
                      <div className="w-8 h-8 rounded-xl bg-white/10" />
                      <div className="flex-1 space-y-1.5"><div className="h-2.5 bg-white/10 rounded-full w-3/4" /><div className="h-2 rounded-full w-1/2" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} /></div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="px-3 py-1.5 bg-[#04070F]/80 border-t border-blue-500/20 flex items-center justify-between text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300 font-mono text-[9px]">↑↓</kbd> navigate
                <kbd className="px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300 font-mono text-[9px] ml-1">↵</kbd> open
                <kbd className="px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-500/30 text-blue-300 font-mono text-[9px] ml-1">Esc</kbd> close
              </span>
              <span className="flex items-center gap-1.5">
                <motion.span animate={{ opacity: [1, 0.3, 1], scale: [1, 0.85, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span className="text-[9px] font-medium">Webory Search</span>
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MobileNavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      setResults([]);
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const fetchResults = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=10`);
      if (res.ok) { const data = await res.json(); setResults(data.results || []); }
    } catch (e) {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => fetchResults(query), 150);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [query, isOpen, fetchResults]);

  const displayedResults = query ? results : QUICK_SUGGESTIONS.slice(0, 4);

  const getTypeStyle = (type: SearchResultItem["type"]) => {
    switch (type) {
      case "course": return { bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600" };
      case "internship": return { bg: "bg-blue-500/20 text-blue-300 border-blue-500/30", iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600" };
      case "tool": return { bg: "bg-purple-500/20 text-purple-300 border-purple-500/30", iconBg: "bg-gradient-to-br from-purple-500 to-fuchsia-600" };
      case "hackathon": return { bg: "bg-amber-500/20 text-amber-300 border-amber-500/30", iconBg: "bg-gradient-to-br from-amber-500 to-orange-600" };
      default: return { bg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30", iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600" };
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.88, rotate: -10 }}
        onClick={() => setIsOpen(true)}
        aria-label="Search"
        className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/35 text-blue-400 hover:text-white hover:border-blue-400/70 hover:shadow-md hover:shadow-blue-500/25 transition-all"
      >
        <Search size={15} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex flex-col justify-start"
            onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-xl" />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl pointer-events-none"
            />

            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ type: "spring", damping: 24, stiffness: 380, delay: 0.04 }}
              className="relative m-3 mt-16 bg-gradient-to-b from-[#0b1022] to-[#080c1c] border border-blue-500/35 rounded-2xl overflow-hidden shadow-[0_30px_80px_-10px_rgba(5,12,35,0.98),0_0_50px_-8px_rgba(59,130,246,0.35)]"
            >
              <motion.div className="h-[2px] bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500" animate={{ scaleX: [0, 1] }} transition={{ duration: 0.4, ease: "easeOut" }} />

              <div className="flex items-center px-4 py-3.5 border-b border-blue-500/20 gap-3 bg-blue-950/15">
                <motion.div initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 500 }}>
                  {loading ? <Loader2 size={17} className="text-cyan-400 animate-spin shrink-0" /> : <Search size={17} className="text-cyan-400 shrink-0 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />}
                </motion.div>
                <motion.input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, internships, tools..."
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 }}
                  className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-blue-300/45 font-medium"
                />
                <motion.button
                  whileHover={{ scale: 1.12, rotate: 90 }}
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 500 }}
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={17} />
                </motion.button>
              </div>

              {!query && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="px-4 pt-3 pb-1 flex items-center gap-1.5">
                  <motion.div animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}>
                    <Zap size={11} className="text-amber-400" />
                  </motion.div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300/60">Quick Suggestions</span>
                </motion.div>
              )}

              <div className="max-h-[55vh] overflow-y-auto p-2 space-y-1" style={{ scrollbarWidth: "none" }}>
                {displayedResults.map((item, i) => {
                  const style = getTypeStyle(item.type);
                  const Icon = item.iconName ? ICON_MAP[item.iconName] || Search : Search;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.18, type: "spring", stiffness: 450, damping: 30 }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setIsOpen(false); router.push(item.url); }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-600/15 border border-transparent hover:border-blue-500/30 cursor-pointer transition-all group"
                    >
                      <motion.div whileHover={{ scale: 1.1, rotate: -5 }} className={`w-9 h-9 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
                        <Icon size={16} className="text-white" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.description}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${style.bg}`}>{item.badge || item.type}</span>
                    </motion.div>
                  );
                })}
                {query && !loading && displayedResults.length === 0 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-10 text-center space-y-2">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-3xl">🔍</motion.div>
                    <p className="text-sm text-white font-semibold">Nothing found</p>
                    <p className="text-xs text-gray-500">Try a different keyword</p>
                  </motion.div>
                )}
              </div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="px-4 py-2 bg-[#040810]/70 border-t border-blue-500/15 flex items-center justify-between">
                <span className="text-[10px] text-gray-500">Tap a result to navigate</span>
                <span className="flex items-center gap-1.5">
                  <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span className="text-[9px] text-gray-500 font-medium">Live Search</span>
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
