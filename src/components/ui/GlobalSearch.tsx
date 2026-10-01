"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

export function NavbarExpandableSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [navigatingUrl, setNavigatingUrl] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-close on route change
  useEffect(() => {
    setIsExpanded(false);
    setNavigatingUrl(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsExpanded((prev) => {
          const next = !prev;
          if (next) setTimeout(() => inputRef.current?.focus(), 60);
          return next;
        });
      } else if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setNavigatingUrl(null);
    }
  }, [isExpanded]);

  const fetchSearchResults = useCallback(async (q: string, type: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (type && type !== "all") params.set("type", type);
      params.set("limit", "12");

      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (err) {
      console.error("Search fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isExpanded) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setSelectedIndex(0);
    searchTimeoutRef.current = setTimeout(() => {
      fetchSearchResults(query, activeCategory);
    }, 120);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [query, activeCategory, isExpanded, fetchSearchResults]);

  const displayedResults = query
    ? results.filter((item) => (activeCategory === "all" ? true : item.type === activeCategory))
    : QUICK_SUGGESTIONS;

  // Background prefetch displayed items for instant navigation
  useEffect(() => {
    if (isExpanded && displayedResults.length > 0) {
      displayedResults.slice(0, 8).forEach((item) => {
        if (item.url && item.url.startsWith("/")) {
          router.prefetch(item.url);
        }
      });
    }
  }, [displayedResults, isExpanded, router]);

  const handleSelectResult = (item: SearchResultItem) => {
    if (navigatingUrl) return;
    setNavigatingUrl(item.url);
    router.push(item.url);
    setTimeout(() => {
      setIsExpanded(false);
      setNavigatingUrl(null);
    }, 700);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (displayedResults.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (selectedIndex + 1) % displayedResults.length;
      setSelectedIndex(next);
      scrollSelectedIntoView(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (selectedIndex - 1 + displayedResults.length) % displayedResults.length;
      setSelectedIndex(prev);
      scrollSelectedIntoView(prev);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (displayedResults[selectedIndex]) {
        handleSelectResult(displayedResults[selectedIndex]);
      }
    }
  };

  const scrollSelectedIntoView = (index: number) => {
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
      regex.test(part) ? (
        <span key={i} className="text-blue-400 font-semibold bg-blue-500/15 px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getTypeStyle = (type: SearchResultItem["type"]) => {
    switch (type) {
      case "course":
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          iconBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
          label: "Course",
        };
      case "internship":
        return {
          bg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          iconBg: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
          label: "Internship",
        };
      case "tool":
        return {
          bg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
          iconBg: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
          label: "Tool",
        };
      case "hackathon":
        return {
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          iconBg: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
          label: "Hackathon",
        };
      default:
        return {
          bg: "bg-white/10 text-gray-300 border-white/10",
          iconBg: "bg-white/10 text-gray-300 border border-white/10",
          label: "Page",
        };
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      <AnimatePresence initial={false} mode="wait">
        {!isExpanded ? (
          <motion.button
            key="icon-btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsExpanded(true)}
            aria-label="Search"
            title="Search (Ctrl + K)"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:border-blue-500/30 hover:bg-white/[0.09] text-gray-300 hover:text-white transition-all duration-300 group cursor-pointer"
          >
            <Search size={14} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
            <span className="text-xs text-gray-400 group-hover:text-gray-200 hidden xl:inline font-medium">Search...</span>
            <kbd className="hidden xl:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-gray-400 group-hover:text-gray-300">
              ⌘K
            </kbd>
          </motion.button>
        ) : (
          <motion.div
            key="input-bar"
            initial={{ opacity: 0, width: 140 }}
            animate={{ opacity: 1, width: 280 }}
            exit={{ opacity: 0, width: 140 }}
            transition={{ type: "spring", stiffness: 450, damping: 32 }}
            className="relative flex items-center h-9 bg-[#0b0f19] border border-blue-500/40 rounded-xl px-3 shadow-lg shadow-black/40"
          >
            {loading ? (
              <Loader2 size={14} className="text-blue-400 animate-spin shrink-0 mr-2" />
            ) : (
              <Search size={14} className="text-blue-400 shrink-0 mr-2" />
            )}

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search courses, internships, tools..."
              className="w-full bg-transparent border-none outline-none text-white text-xs placeholder:text-gray-500 font-medium"
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (query) setQuery("");
                else setIsExpanded(false);
              }}
              className="text-gray-400 hover:text-white p-0.5 ml-1 rounded hover:bg-white/10 transition-colors shrink-0"
              title="Close"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full mt-2 right-0 w-80 sm:w-96 bg-[#0b0f19]/95 border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-[70] backdrop-blur-2xl"
          >
            {navigatingUrl && (
              <div className="h-0.5 w-full bg-blue-950 overflow-hidden shrink-0">
                <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 animate-pulse w-full" />
              </div>
            )}

            {query && (
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.08] bg-white/[0.02] overflow-x-auto no-scrollbar">
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.05] border border-transparent"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            )}

            <div ref={listRef} className="max-h-72 overflow-y-auto p-2 space-y-1">
              {!query && (
                <div className="px-2 py-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase flex items-center gap-1.5">
                    <Sparkles size={12} className="text-blue-400" />
                    Quick Suggestions
                  </span>
                </div>
              )}

              {displayedResults.length > 0 ? (
                displayedResults.map((item, index) => {
                  const typeStyle = getTypeStyle(item.type);
                  const IconComponent = item.iconName ? ICON_MAP[item.iconName] || Search : Search;
                  const isSelected = index === selectedIndex;
                  const isNavigatingThis = navigatingUrl === item.url;

                  return (
                    <div
                      key={item.id || index}
                      data-nav-search-item
                      onClick={() => handleSelectResult(item)}
                      onMouseEnter={() => {
                        setSelectedIndex(index);
                        if (item.url?.startsWith("/")) router.prefetch(item.url);
                      }}
                      onTouchStart={() => {
                        if (item.url?.startsWith("/")) router.prefetch(item.url);
                      }}
                      className={`group flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all duration-150 ${
                        isNavigatingThis
                          ? "bg-blue-600/20 border border-blue-500/40 text-white"
                          : isSelected
                          ? "bg-white/[0.08] border border-white/10 text-white"
                          : "hover:bg-white/[0.04] border border-transparent text-gray-300"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl ${typeStyle.iconBg} flex items-center justify-center shrink-0`}>
                        {isNavigatingThis ? (
                          <Loader2 size={14} className="text-blue-400 animate-spin" />
                        ) : (
                          <IconComponent size={14} />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-white truncate">
                            {highlightMatch(item.title, query)}
                          </span>
                          <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full border ${typeStyle.bg}`}>
                            {item.badge || typeStyle.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">
                          {isNavigatingThis ? (
                            <span className="text-blue-400 font-medium animate-pulse">Opening page...</span>
                          ) : (
                            highlightMatch(item.description, query)
                          )}
                        </p>
                      </div>

                      {isNavigatingThis ? (
                        <Loader2 size={14} className="text-blue-400 animate-spin shrink-0" />
                      ) : (
                        <ArrowUpRight
                          size={14}
                          className={`text-gray-500 group-hover:text-gray-300 shrink-0 transition-all ${
                            isSelected ? "text-blue-400" : ""
                          }`}
                        />
                      )}
                    </div>
                  );
                })
              ) : !loading ? (
                <div className="py-8 px-3 text-center space-y-1">
                  <p className="text-xs text-gray-300 font-medium">No results found for &quot;{query}&quot;</p>
                  <p className="text-[10px] text-gray-500">Try searching Python, Full Stack, or Internships</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2.5 p-2 animate-pulse">
                      <div className="w-8 h-8 rounded-xl bg-white/10" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-white/10 rounded w-2/3" />
                        <div className="h-2 bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-3 py-2 bg-black/40 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-gray-300 font-mono text-[9px]">↑↓</kbd> navigate
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-gray-300 font-mono text-[9px] ml-1">↵</kbd> open
              </span>
              <span className="text-[9px] text-gray-500">Webory Search</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MobileNavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [navigatingUrl, setNavigatingUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-close on route change
  useEffect(() => {
    setIsOpen(false);
    setNavigatingUrl(null);
  }, [pathname]);

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setActiveCategory("all");
    setNavigatingUrl(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 80);
      return () => {
        clearTimeout(timer);
      };
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSearch]);

  const fetchResults = useCallback(async (q: string, type: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (type && type !== "all") params.set("type", type);
      params.set("limit", "15");

      const res = await fetch(`/api/search?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (e) {
      console.error("Mobile search fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      fetchResults(query, activeCategory);
    }, 120);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [query, activeCategory, isOpen, fetchResults]);

  const displayedResults = query
    ? results.filter((item) => (activeCategory === "all" ? true : item.type === activeCategory))
    : QUICK_SUGGESTIONS;

  // Background prefetch displayed results so click redirects instantly
  useEffect(() => {
    if (isOpen && displayedResults.length > 0) {
      displayedResults.slice(0, 10).forEach((item) => {
        if (item.url && item.url.startsWith("/")) {
          router.prefetch(item.url);
        }
      });
    }
  }, [displayedResults, isOpen, router]);

  const handleSelectResult = (item: SearchResultItem) => {
    if (navigatingUrl) return;
    setNavigatingUrl(item.url);
    router.push(item.url);
    setTimeout(() => {
      closeSearch();
      setNavigatingUrl(null);
    }, 700);
  };

  const getTypeStyle = (type: SearchResultItem["type"]) => {
    switch (type) {
      case "course":
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          iconBg: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
          label: "Course",
        };
      case "internship":
        return {
          bg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          iconBg: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
          label: "Internship",
        };
      case "tool":
        return {
          bg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
          iconBg: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
          label: "Tool",
        };
      case "hackathon":
        return {
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          iconBg: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
          label: "Hackathon",
        };
      default:
        return {
          bg: "bg-white/10 text-gray-300 border-white/10",
          iconBg: "bg-white/10 text-gray-300 border border-white/10",
          label: "Page",
        };
    }
  };

  const highlightMatch = (text: string, q: string) => {
    if (!q || !text) return text;
    const regex = new RegExp(`(${q.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="text-blue-400 font-semibold bg-blue-500/20 px-0.5 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <button
        onClick={openSearch}
        aria-label="Search"
        type="button"
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/[0.08] text-gray-300 hover:text-white active:scale-95 transition-all cursor-pointer"
      >
        <Search size={18} />
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[999999] bg-[#07090e]/98 backdrop-blur-3xl flex flex-col text-white overscroll-none"
                style={{
                  paddingTop: "max(env(safe-area-inset-top, 0px), 8px)",
                  paddingBottom: "max(env(safe-area-inset-bottom, 0px), 8px)",
                }}
              >
                {/* Indeterminate Shimmer Loading bar when navigating */}
                {navigatingUrl && (
                  <div className="h-0.5 w-full bg-blue-950 overflow-hidden shrink-0">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 animate-pulse w-full" />
                  </div>
                )}

                {/* Top Input Bar */}
                <div className="px-3 py-2.5 flex items-center gap-2 border-b border-white/[0.08] bg-[#0b0f19]/90 shrink-0">
                  <div className="relative flex-1 flex items-center h-11 bg-white/[0.06] border border-blue-500/40 focus-within:border-blue-500 rounded-xl px-3 transition-colors">
                    {loading ? (
                      <Loader2 size={16} className="text-blue-400 animate-spin shrink-0 mr-2" />
                    ) : (
                      <Search size={16} className="text-blue-400 shrink-0 mr-2" />
                    )}
                    <input
                      ref={inputRef}
                      type="search"
                      enterKeyHint="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search courses, internships, tools..."
                      className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-gray-500 font-medium"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuery("");
                          inputRef.current?.focus();
                        }}
                        className="p-1 rounded-lg text-gray-400 hover:text-white bg-white/5 active:scale-90 transition-all shrink-0 ml-1"
                        aria-label="Clear search"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white rounded-xl bg-white/[0.06] border border-white/10 active:scale-95 transition-all shrink-0"
                  >
                    Cancel
                  </button>
                </div>

                {/* Categories Filter Pills */}
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06] bg-black/40 overflow-x-auto no-scrollbar shrink-0">
                  {CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap active:scale-95 ${
                          isActive
                            ? "bg-blue-600/30 text-blue-400 border border-blue-500/40 shadow-sm shadow-blue-500/20 font-semibold"
                            : "text-gray-400 hover:text-gray-200 bg-white/[0.04] border border-white/[0.06]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Results & Suggestions List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 overscroll-contain">
                  {!query && (
                    <div className="px-1 py-1 flex items-center justify-between">
                      <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase flex items-center gap-1.5">
                        <Sparkles size={13} className="text-blue-400" />
                        Popular Searches
                      </span>
                    </div>
                  )}

                  {displayedResults.length > 0 ? (
                    displayedResults.map((item) => {
                      const typeStyle = getTypeStyle(item.type);
                      const IconComponent = item.iconName ? ICON_MAP[item.iconName] || Search : Search;
                      const isNavigatingThis = navigatingUrl === item.url;

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          onTouchStart={() => {
                            if (item.url?.startsWith("/")) router.prefetch(item.url);
                          }}
                          onMouseEnter={() => {
                            if (item.url?.startsWith("/")) router.prefetch(item.url);
                          }}
                          className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                            isNavigatingThis
                              ? "bg-blue-600/20 border border-blue-500/50 scale-[0.99] text-white shadow-lg shadow-blue-500/10"
                              : "bg-white/[0.03] hover:bg-white/[0.07] active:bg-white/[0.1] border border-white/[0.06] hover:border-blue-500/30 text-gray-300"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl ${typeStyle.iconBg} flex items-center justify-center shrink-0`}>
                            {isNavigatingThis ? (
                              <Loader2 size={18} className="text-blue-400 animate-spin" />
                            ) : (
                              <IconComponent size={18} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white truncate">
                                {highlightMatch(item.title, query)}
                              </span>
                              <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${typeStyle.bg} shrink-0`}>
                                {item.badge || typeStyle.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                              {isNavigatingThis ? (
                                <span className="text-blue-400 font-semibold animate-pulse">Opening page...</span>
                              ) : (
                                highlightMatch(item.description, query)
                              )}
                            </p>
                          </div>
                          {isNavigatingThis ? (
                            <Loader2 size={16} className="text-blue-400 animate-spin shrink-0" />
                          ) : (
                            <ArrowUpRight size={16} className="text-gray-500 shrink-0" />
                          )}
                        </div>
                      );
                    })
                  ) : !loading ? (
                    <div className="py-16 px-4 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-gray-400">
                        <Search size={22} />
                      </div>
                      <p className="text-sm text-gray-200 font-semibold">No results found for &quot;{query}&quot;</p>
                      <p className="text-xs text-gray-500">Try searching Python, Full Stack, Internships, or AI Tools</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] animate-pulse">
                          <div className="w-10 h-10 rounded-xl bg-white/10 shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3.5 bg-white/10 rounded w-3/4" />
                            <div className="h-2.5 bg-white/5 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
