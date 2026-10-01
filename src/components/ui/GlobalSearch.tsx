"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    }, 150);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [query, activeCategory, isExpanded, fetchSearchResults]);

  const displayedResults = query
    ? results.filter((item) => (activeCategory === "all" ? true : item.type === activeCategory))
    : QUICK_SUGGESTIONS;

  const handleSelectResult = (item: SearchResultItem) => {
    setIsExpanded(false);
    router.push(item.url);
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
            className="absolute top-full mt-2 left-0 w-80 sm:w-96 bg-[#0b0f19]/95 border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-[70] backdrop-blur-2xl"
          >
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

                  return (
                    <div
                      key={item.id || index}
                      data-nav-search-item
                      onClick={() => handleSelectResult(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`group flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all duration-150 ${
                        isSelected
                          ? "bg-white/[0.08] border border-white/10 text-white"
                          : "hover:bg-white/[0.04] border border-transparent text-gray-300"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl ${typeStyle.iconBg} flex items-center justify-center shrink-0`}>
                        <IconComponent size={14} />
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
                          {highlightMatch(item.description, query)}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={14}
                        className={`text-gray-500 group-hover:text-gray-300 shrink-0 transition-all ${
                          isSelected ? "text-blue-400" : ""
                        }`}
                      />
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
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const openSearch = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const fetchResults = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (e) {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => fetchResults(query), 150);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [query, isOpen, fetchResults]);

  const displayedResults = query ? results : QUICK_SUGGESTIONS.slice(0, 4);

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

      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[9999] flex flex-col justify-start bg-black/90 backdrop-blur-2xl p-4 pt-12 sm:pt-16"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeSearch();
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-lg mx-auto bg-[#0b0f19] border border-blue-500/30 rounded-2xl overflow-hidden shadow-2xl shadow-black"
            >
              {/* Header / Input */}
              <div className="flex items-center px-3.5 py-3 border-b border-white/[0.08] gap-3 bg-white/[0.02]">
                {loading ? (
                  <Loader2 size={18} className="text-blue-400 animate-spin shrink-0" />
                ) : (
                  <Search size={18} className="text-blue-400 shrink-0" />
                )}
                <input
                  ref={inputRef}
                  type="search"
                  enterKeyHint="search"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses, internships, tools..."
                  className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-gray-500 font-medium"
                />
                {query ? (
                  <button
                    onClick={() => setQuery("")}
                    type="button"
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg bg-white/5 active:scale-90 transition-all"
                  >
                    <X size={16} />
                  </button>
                ) : null}
                <button
                  onClick={closeSearch}
                  type="button"
                  className="px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-white rounded-lg bg-white/5 border border-white/10 active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="max-h-[65vh] overflow-y-auto p-2 space-y-1">
                {!query && (
                  <div className="px-3 py-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} className="text-blue-400" />
                      Popular Searches
                    </span>
                  </div>
                )}

                {displayedResults.length > 0 ? (
                  displayedResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        closeSearch();
                        router.push(item.url);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.06] active:bg-white/[0.08] border border-transparent text-gray-300 hover:text-white cursor-pointer transition-all"
                    >
                      <div className="truncate mr-3">
                        <p className="text-xs sm:text-sm font-medium text-white truncate">{item.title}</p>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{item.description}</p>
                      </div>
                      <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                        {item.badge || item.type}
                      </span>
                    </div>
                  ))
                ) : !loading ? (
                  <div className="py-10 px-4 text-center space-y-1">
                    <p className="text-sm text-gray-300 font-medium">No results found for &quot;{query}&quot;</p>
                    <p className="text-xs text-gray-500">Try searching Python, Full Stack, or Internships</p>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
