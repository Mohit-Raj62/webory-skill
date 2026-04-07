"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Calendar, 
  Users, 
  ArrowRight, 
  Zap, 
  Timer, 
  Code, 
  LayoutGrid, 
  CheckCircle2,
  Lock,
  Loader2,
  Sparkles,
  Rocket,
  FileCode,
  ListChecks,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Award } from "lucide-react";
import Link from "next/link";

// ─── Countdown Timer Component ─────────────────────────────────────
function CountdownTimer({ targetDate, label }: { targetDate: string; label: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Clock size={12} />
        <span className="text-[10px] font-black uppercase tracking-widest">Time&apos;s Up!</span>
      </div>
    );
  }

  const blocks = [
    { value: timeLeft.days, unit: "D" },
    { value: timeLeft.hours, unit: "H" },
    { value: timeLeft.minutes, unit: "M" },
    { value: timeLeft.seconds, unit: "S" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Timer size={10} className="text-orange-500" />
        <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {blocks.map((block, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1.5 min-w-[36px] text-center">
              <span className="text-base font-black text-white tabular-nums">{String(block.value).padStart(2, "0")}</span>
              <span className="text-[7px] font-black text-gray-600 ml-0.5">{block.unit}</span>
            </div>
            {i < blocks.length - 1 && <span className="text-gray-600 font-black text-xs">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Pulsing Live Badge ────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const isLive = status === "live";
  const isCompleted = status === "completed";
  
  return (
    <div className={`px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 ${
      isLive ? 'bg-red-600' : isCompleted ? 'bg-gray-700' : 'bg-orange-600'
    }`}>
      {isLive && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-200" />
        </span>
      )}
      {status}
    </div>
  );
}

interface Hackathon {
  _id: string;
  title: string;
  slug: string;
  description: string;
  theme: string;
  domains: string[];
  startDate: string;
  endDate: string;
  status: "upcoming" | "live" | "completed";
  registrationDeadline: string;
  prizes: { title: string; reward: string; value: number }[];
  rules?: string[];
  problemStatement?: string;
  totalParticipants: number;
  totalSubmissions?: number;
}

const MOCK_HACKATHON: Hackathon = {
    _id: "preview_1",
    title: "Webory UI/UX Masters 2026",
    slug: "ui-ux-masters-2026",
    description: "Design and build the future of Webory with glassmorphism and modern React architecture. Winners get direct internship offers and exclusive Webory merchandise.",
    theme: "Modern Interface Design",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    registrationDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "live",
    problemStatement: "The current Webory interface is functional but lacks the 'premium' feel that modern developers expect. We want you to redesign the landing page and dashboard using Glassmorphism, Framer Motion, and a cohesive design system. Focus on performance and micro-interactions.",
    rules: [
        "Use React/Next.js and TailwindCSS.",
        "Must be fully responsive.",
        "Include at least 3 custom animations."
    ],
    prizes: [
        { title: "Champion", reward: "₹10,000 + Internship", value: 5000 },
        { title: "Runner Up", reward: "₹5,000 + Merchandise", value: 2500 }
    ],
    totalParticipants: 142,
    totalSubmissions: 89
};

export default function HackathonArena() {
  const [hackathons, setHackathons] = useState<Array<Hackathon>>([MOCK_HACKATHON]);
  const [mySubmissions, setMySubmissions] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [targetHackathon, setTargetHackathon] = useState<Hackathon | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [resHacks, resSubs] = await Promise.all([
                fetch("/api/hackathons"),
                fetch("/api/me/hackathons/certificates")
            ]);

            if (resHacks.ok) {
                const data = await resHacks.json();
                if (data.data?.length > 0) setHackathons(data.data);
            }

            if (resSubs.ok) {
                const data = await resSubs.json();
                setMySubmissions(data.data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const handleJoin = async (hackathonId: string, domain?: string) => {
    if (hackathonId === "preview_1") {
        return toast.info("This is a preview Hackathon. Real events will appear once published by Admin.");
    }

    const hackathon = hackathons.find(h => h._id === hackathonId);
    if (!hackathon) return;

    // Multiple domains check
    if (!domain && hackathon.domains && hackathon.domains.length > 0) {
        if (hackathon.domains.length === 1) {
            // Auto-join with the only domain
            return handleJoin(hackathonId, hackathon.domains[0]);
        }
        setTargetHackathon(hackathon);
        setIsDomainModalOpen(true);
        return;
    }
    
    setJoiningId(hackathonId);
    try {
      const res = await fetch("/api/hackathons/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            hackathonId, 
            domain: domain || hackathon.theme || "General" 
        })
      });

      const data = await res.json();
      if (res.status === 401) {
        toast.error("Please login to join the battle");
        router.push(`/login?redirect=/hackathons`);
        return;
      }

      if (res.ok) {
        toast.success(data.message || "Welcome to the Battle! 🚀");
        setIsDomainModalOpen(false);
        router.push(`/hackathons/${hackathonId}/submit`);
      } else {
        toast.error(data.error || "Failed to join");
      }
    } catch (error) {
        toast.error("Network error. Please try again.");
    } finally {
        setJoiningId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30">
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-40 pb-20 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />

        <div className="container mx-auto px-4 text-center space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md"
            >
                <Trophy className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Webory Hackathon Arena v1.0</span>
            </motion.div>
            
            <motion.h1 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[1] md:leading-[0.9]"
            >
                Build. <span className="text-orange-600">Ship.</span> <br className="hidden sm:block" />
                Scale. <span className="text-gray-400 opacity-20 outline-text">Repeat.</span>
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-2xl mx-auto text-gray-500 font-medium text-base md:text-lg leading-relaxed px-4 md:px-0"
            >
                The ultimate battleground for developers and designers. Show your skills, win exclusive rewards, and get fast-tracked into top tech roles.
            </motion.p>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 pt-4 px-4 sm:px-0 w-full"
            >
                <Button 
                    onClick={() => document.getElementById('arena')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-black px-8 md:px-12 h-14 md:h-16 w-full sm:w-auto rounded-2xl md:rounded-3xl text-sm md:text-lg shadow-2xl shadow-orange-500/20"
                >
                    Explore Challenges
                </Button>
                <Button 
                    variant="ghost" 
                    onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-gray-400 hover:text-white font-black px-8 md:px-12 h-14 md:h-16 w-full sm:w-auto rounded-2xl md:rounded-3xl flex items-center justify-center gap-3 bg-white/5 sm:bg-transparent border border-white/5 sm:border-transparent"
                >
                    <Rocket className="w-5 h-5" />
                    How it Works
                </Button>
            </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="container mx-auto px-4 -mt-10 mb-20 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl divide-y md:divide-y-0 md:divide-x divide-white/5">
              {[
                { label: "Total Hackathons", value: `${hackathons.length}`, icon: LayoutGrid },
                { label: "Community Builders", value: `${hackathons.reduce((sum, h) => sum + (h.totalParticipants || 0), 0)}+`, icon: Users },
                { label: "Rewards Won", value: `${hackathons.reduce((sum, h: any) => sum + (h.totalXpDistributed || 0), 0)} XP`, icon: Trophy },
                { label: "Code Submissions", value: `${hackathons.reduce((sum, h) => sum + (h.totalSubmissions || 0), 0)}+`, icon: Code },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center py-4 md:p-4">
                    <stat.icon className="w-5 h-5 text-gray-600 mb-2" />
                    <span className="text-xl md:text-2xl font-black text-white">{stat.value}</span>
                    <span className="text-[9px] md:text-[10px] font-bold text-gray-600 uppercase tracking-widest text-center">{stat.label}</span>
                </div>
              ))}
          </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="container mx-auto px-4 pb-32 space-y-16">
          <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Your Battle <span className="text-orange-500 italic">Blueprint</span></h2>
              <p className="text-gray-500 font-medium max-w-xl mx-auto">From registering your team to claiming your cash rewards, here is exactly how Webory Hackathons operate.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              <div className="hidden lg:block absolute top-[45%] left-10 right-10 h-[2px] bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 -z-10" />
              {[
                  {
                      step: "01",
                      title: "Discover & Apply",
                      desc: "Browse Active Battles, review the problem statements, and join a hackathon that fits your skills.",
                      icon: Zap
                  },
                  {
                      step: "02",
                      title: "Pick Your Role",
                      desc: "Whether you are a UI/UX Designer, Backend Architect, or AI Engineer—team up and assign roles.",
                      icon: Users
                  },
                  {
                      step: "03",
                      title: "Build & Submit",
                      desc: "Code relentlessly for 48 hours. Deploy your project and submit your GitHub repo & Live Demo links.",
                      icon: Code
                  },
                  {
                      step: "04",
                      title: "Win Royal Rewards",
                      desc: "Get judged by industry experts. Top teams receive cash prizes, physical swags, and Official Industrial Certificates.",
                      icon: Award
                  }
              ].map((s, i) => (
                  <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 space-y-4 md:space-y-6 relative group hover:border-orange-500/30 transition-all duration-300">
                      <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-orange-500/5 rounded-bl-[3rem] md:rounded-bl-[4rem] rounded-tr-[1.5rem] md:rounded-tr-[2rem] flex justify-center items-center pointer-events-none">
                          <span className="text-xl md:text-2xl font-black italic text-white/10 group-hover:text-orange-500/30 transition-colors">{s.step}</span>
                      </div>
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/10">
                          <s.icon className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="space-y-1.5 md:space-y-2 relative z-10">
                          <h3 className="text-base md:text-lg font-black uppercase tracking-tight text-white">{s.title}</h3>
                          <p className="text-[11px] md:text-xs text-gray-500 font-medium leading-relaxed">{s.desc}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Main Content: The Arena */}
      <div id="arena" className="container mx-auto px-4 pb-40 space-y-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/5">
              <div className="space-y-2">
                  <h2 className="text-3xl font-black uppercase tracking-tight">Active Battles</h2>
                  <p className="text-gray-500 font-medium">Register now and start building your legacy.</p>
              </div>
              <div className="flex gap-2">
                  <button className="px-5 py-2 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-500 text-[10px] font-black uppercase tracking-widest">Ongoing</button>
                  <button className="px-5 py-2 rounded-full border border-white/5 bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest">Upcoming</button>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loading ? (
                <div className="col-span-full py-20 flex justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
                </div>
            ) : (
                hackathons.map((h, i) => (
                    <motion.div 
                        key={h._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`group relative p-1 lg:p-1.5 rounded-[2rem] md:rounded-[3.5rem] bg-white/[0.02] border transition-all duration-700 overflow-hidden ${
                            h.status === 'live' 
                              ? 'border-red-500/20 hover:border-red-500/40 shadow-[0_0_60px_-12px_rgba(239,68,68,0.15)]' 
                              : 'border-white/5 hover:border-orange-500/30'
                        }`}
                    >
                        <div className="flex flex-col md:flex-row h-full rounded-[1.8rem] md:rounded-[3rem] bg-[#0A0A0A] overflow-hidden">
                            {/* Visual Side */}
                            <div className={`w-full md:w-2/5 relative h-52 md:h-auto overflow-hidden flex items-center justify-center shrink-0 ${
                                h.status === 'live' 
                                  ? 'bg-gradient-to-br from-red-600 via-orange-600 to-amber-500' 
                                  : h.status === 'completed' 
                                    ? 'bg-gradient-to-br from-gray-700 to-gray-900'
                                    : 'bg-gradient-to-br from-orange-600 to-indigo-600'
                            }`}>
                                <Code className="w-16 h-16 md:w-20 md:h-20 text-white/20 scale-150 group-hover:scale-[2] group-hover:rotate-12 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
                                <div className="absolute top-4 left-4 md:top-6 md:left-6">
                                    <StatusBadge status={h.status} />
                                </div>
                                {/* Countdown on the visual side */}
                                {h.status !== 'completed' && (
                                  <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                                    <CountdownTimer 
                                      targetDate={h.status === 'live' ? h.endDate : h.startDate}
                                      label={h.status === 'live' ? 'Ends In' : 'Starts In'}
                                    />
                                  </div>
                                )}
                            </div>

                            {/* Info Side */}
                            <div className="w-full md:w-3/5 p-5 md:p-8 lg:p-10 space-y-6 flex flex-col justify-between">
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <Zap className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">{h.theme}</span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight leading-tight uppercase group-hover:text-orange-500 transition-colors">
                                        {h.title}
                                    </h3>
                                    <p className="text-gray-500 text-xs md:text-sm line-clamp-3 leading-relaxed font-medium">
                                        {h.description}
                                    </p>
                                </div>

                                <div className="space-y-5 md:space-y-6">
                                    <div className="flex flex-wrap items-center gap-4 md:gap-6 border-y border-white/5 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[7px] md:text-[8px] font-black text-gray-600 uppercase tracking-widest">Participants</span>
                                            <span className="text-base md:text-lg font-black text-white">{h.totalParticipants}+</span>
                                        </div>
                                        <div className="w-px h-8 bg-white/5" />
                                        <div className="flex flex-col">
                                            <span className="text-[7px] md:text-[8px] font-black text-gray-600 uppercase tracking-widest">Theme</span>
                                            <span className="text-sm font-black text-orange-500 uppercase tracking-tight">{h.theme.split(' ').slice(0,2).join(' ')}</span>
                                        </div>
                                        <button 
                                            onClick={() => setExpandedId(expandedId === h._id ? null : h._id)}
                                            className={`ml-auto text-[10px] font-black uppercase tracking-widest transition-all px-4 py-2 rounded-xl border ${
                                                expandedId === h._id 
                                                  ? 'bg-orange-600/10 text-orange-500 border-orange-500/30' 
                                                  : 'bg-white/5 text-gray-500 hover:text-white border-white/5 hover:border-white/20'
                                            }`}
                                        >
                                            {expandedId === h._id ? '✕ Close' : '📄 Read Problem'}
                                        </button>
                                    </div>


                                    <div className="flex items-center gap-4">
                                        {h.status === 'completed' ? (
                                            <>
                                                {mySubmissions.find(s => s.hackathonId?._id === h._id)?.certificateId ? (
                                                    <Button 
                                                        onClick={() => router.push(`/certificates/${mySubmissions.find(s => s.hackathonId?._id === h._id).certificateId.certificateId}`)}
                                                        className="flex-1 h-14 rounded-2xl bg-orange-600 text-white font-black uppercase shadow-xl hover:bg-orange-700"
                                                    >
                                                        <Award className="mr-2" size={18} /> View Certificate
                                                    </Button>
                                                ) : (
                                                    <Button disabled className="flex-1 h-14 rounded-2xl bg-white/5 text-gray-600 font-black uppercase border border-white/5">
                                                        Battle Finished
                                                    </Button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Button 
                                                    onClick={() => handleJoin(h._id)}
                                                    disabled={joiningId === h._id}
                                                    className="flex-1 h-14 rounded-2xl bg-white text-gray-950 font-black uppercase shadow-xl hover:bg-gray-200"
                                                >
                                                    {joiningId === h._id ? <Loader2 className="animate-spin" /> : "Join Battle"}
                                                </Button>
                                                <Link 
                                                    href={`/hackathons/${h._id}/submit`}
                                                    className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-white transition-all"
                                                >
                                                    <ArrowRight className="w-5 h-5" />
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))
            )}
          </div>
      </div>

      {/* ═══════ FULLSCREEN DETAILS POPUP MODAL ═══════ */}
      <AnimatePresence>
        {expandedId && (() => {
          const h = hackathons.find(hk => hk._id === expandedId);
          if (!h) return null;
          return (
            <motion.div
              key="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
              onClick={() => setExpandedId(null)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
              
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0A0A0A] border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl"
              >
                {/* Modal Header */}
                <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/5 px-5 py-4 md:p-8 flex items-center justify-between">
                  <div className="space-y-1 pr-4">
                    <h2 className="text-lg md:text-2xl font-black italic uppercase tracking-tighter leading-tight">{h.title}</h2>
                    <div className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-400">{h.theme}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setExpandedId(null)}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Body */}
                <div className="px-5 py-5 md:p-8 space-y-5 md:space-y-6">
                  {/* Problem Statement */}
                  <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-orange-500/30 via-transparent to-orange-500/10">
                    <div className="space-y-3 md:space-y-4 p-5 md:p-6 rounded-2xl bg-[#0A0A0A]">
                      <div className="flex items-center gap-2 text-orange-500">
                        <FileCode size={18} />
                        <span className="text-xs md:text-sm font-black uppercase tracking-widest">Problem Statement</span>
                      </div>
                      <p className="text-sm md:text-base text-gray-300 font-medium leading-relaxed md:leading-[1.9] whitespace-pre-wrap">
                        {h.problemStatement || "No problem statement provided for this challenge. Please check back soon or follow the theme: " + h.theme}
                      </p>
                    </div>
                  </div>

                  {/* Timeline & How to Enter */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4 p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 text-indigo-500">
                        <Calendar size={16} />
                        <span className="text-xs md:text-sm font-black uppercase tracking-widest">Event Timeline</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <span className="text-xs md:text-sm font-bold text-gray-500 uppercase">Registration Deadline</span>
                          <span className="text-xs md:text-sm font-black text-white">{new Date(h.registrationDeadline || h.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <span className="text-xs md:text-sm font-bold text-gray-500 uppercase">Submission Opens</span>
                          <span className="text-xs md:text-sm font-black text-white">{new Date(h.startDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}</span>
                        </div>
                        <div className="flex items-center justify-between text-orange-500">
                          <span className="text-xs md:text-sm font-black uppercase">Final Deadline</span>
                          <span className="text-xs md:text-sm font-black">{new Date(h.endDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 text-green-500">
                        <Rocket size={16} />
                        <span className="text-xs md:text-sm font-black uppercase tracking-widest">How to Enter</span>
                      </div>
                      <div className="space-y-4">
                        {[
                          { s: "1", t: "Join the Battle", d: "Click the 'Join Battle' button." },
                          { s: "2", t: "Build your code", d: "Solve the problem using your expertise." },
                          { s: "3", t: "Submit Demo", d: "Provide GitHub & Live Demo links." }
                        ].map((step, idx) => (
                          <div key={idx} className="flex gap-3 items-start">
                            <div className="w-7 h-7 rounded-full bg-green-500/10 flex items-center justify-center text-xs font-black text-green-500 shrink-0">{step.s}</div>
                            <div className="space-y-0.5">
                              <div className="text-xs md:text-sm font-black uppercase text-white">{step.t}</div>
                              <div className="text-xs text-gray-500 font-medium">{step.d}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rules & Prizes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3 p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2 text-blue-500">
                        <ListChecks size={16} />
                        <span className="text-xs md:text-sm font-black uppercase tracking-widest">Ground Rules</span>
                      </div>
                      <ul className="space-y-3">
                        {(h.rules || ["Follow the standard guidelines."]).map((rule: string, idx: number) => (
                          <li key={idx} className="text-xs md:text-sm text-gray-400 font-medium flex items-start gap-2.5 leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3 p-5 md:p-6 rounded-2xl bg-[#0F0F0F] border border-yellow-500/10">
                      <div className="flex items-center gap-2 text-yellow-500">
                        <Trophy size={16} />
                        <span className="text-xs md:text-sm font-black uppercase tracking-widest">Reward Pool</span>
                      </div>
                      <div className="space-y-3">
                        {(h.prizes || []).map((prize: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 last:pb-0">
                            <span className="text-xs md:text-sm font-bold text-gray-400 uppercase">{prize.title}</span>
                            <span className="text-xs md:text-sm font-black text-white">{prize.reward}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-[#0A0A0A]/95 backdrop-blur-xl border-t border-white/5 px-5 py-4 md:p-8 flex gap-3 md:gap-4">
                  <Button 
                    onClick={() => { setExpandedId(null); handleJoin(h._id); }}
                    className="flex-1 h-12 md:h-14 rounded-2xl bg-white text-gray-950 font-black uppercase shadow-xl hover:bg-gray-200 text-sm md:text-base"
                  >
                    Join Battle
                  </Button>
                  <Button 
                    onClick={() => setExpandedId(null)}
                    variant="outline"
                    className="h-12 md:h-14 rounded-2xl border-white/10 text-white font-black uppercase px-6 md:px-8 hover:bg-white/5 text-sm md:text-base"
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Rewards Showcase */}
      <div id="rewards" className="container mx-auto px-4 pb-40">
          <div className="rounded-[2.5rem] md:rounded-[4rem] bg-gradient-to-br from-zinc-900 to-black p-6 md:p-12 lg:p-24 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 md:-right-20 md:-top-20 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-orange-600/10 rounded-full blur-[80px] md:blur-[100px] group-hover:bg-orange-600/20 transition-all duration-700" />
              
              <div className="max-w-3xl space-y-6 md:space-y-8 relative z-10">
                  <h4 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] text-orange-500">The Spoils of Victory</h4>
                  <h2 className="text-3xl md:text-4xl lg:text-6xl font-black leading-[1] md:leading-[0.9] tracking-tight uppercase italic break-words">
                      More than just a <br className="hidden md:block" /><span className="text-orange-600">Certificate.</span>
                  </h2>
                  <p className="text-gray-400 md:text-gray-500 text-sm md:text-lg font-medium leading-relaxed uppercase tracking-tighter">
                      Winning a Webory hackathon opens doors. From verified industry credentials to direct meetings with tech leads and physical gift kits—your hard work deserves massive returns.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pt-4 md:pt-8">
                      <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/5">
                          <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-orange-600/20 text-orange-500"><CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /></div>
                          <div>
                              <div className="font-black uppercase text-sm">Industrial Creds</div>
                              <p className="text-[10px] md:text-xs text-gray-500 font-medium mt-1 uppercase tracking-tight">Verifiable blockchain-ready certifications for your LinkedIn.</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                          <div className="p-3 rounded-2xl bg-blue-600/20 text-blue-500"><Sparkles className="w-6 h-6" /></div>
                          <div>
                              <div className="font-black uppercase text-sm">Exclusive Swag</div>
                              <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-tight">Redeem points for premium hoodies, kits, and merchandise.</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* ═══════ DOMAIN SELECTION MODAL ═══════ */}
      <AnimatePresence>
        {isDomainModalOpen && targetHackathon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setIsDomainModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white"
              >
                ✕
              </button>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight italic">Select Domain</h3>
                  <p className="text-xs font-medium text-gray-500">Pick a category for <span className="text-orange-500">{targetHackathon.title}</span>. You cannot change this later.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2">
                  {targetHackathon.domains.map((domain, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDomain(domain)}
                      className={`p-4 rounded-2xl border transition-all text-left group ${
                        selectedDomain === domain 
                          ? 'bg-orange-600/10 border-orange-500 text-white' 
                          : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold uppercase tracking-tight text-xs">{domain}</span>
                        {selectedDomain === domain && <CheckCircle2 size={16} className="text-orange-500" />}
                      </div>
                    </button>
                  ))}
                </div>
                
                <Button 
                  onClick={() => handleJoin(targetHackathon._id, selectedDomain)}
                  disabled={!selectedDomain || joiningId !== null}
                  className="w-full h-14 bg-white text-black font-black uppercase rounded-2xl hover:bg-orange-600 hover:text-white transition-all shadow-xl"
                >
                  {joiningId ? <Loader2 className="animate-spin" /> : "Confirm Registration"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
