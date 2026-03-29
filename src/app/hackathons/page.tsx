"use client";

import { useEffect, useState, useMemo } from "react";
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
  Rocket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Award } from "lucide-react";
import Link from "next/link";

interface Hackathon {
  _id: string;
  title: string;
  slug: string;
  description: string;
  theme: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "live" | "completed";
  prizes: { title: string; reward: string; value: number }[];
  totalParticipants: number;
}

const MOCK_HACKATHON: Hackathon = {
    _id: "preview_1",
    title: "Webory UI/UX Masters 2026",
    slug: "ui-ux-masters-2026",
    description: "Design and build the future of Webory with glassmorphism and modern React architecture. Winners get direct internship offers and exclusive Webory merchandise.",
    theme: "Modern Interface Design",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "live",
    prizes: [
        { title: "Champion", reward: "₹10,000 + Internship", value: 5000 },
        { title: "Runner Up", reward: "₹5,000 + Merchandise", value: 2500 }
    ],
    totalParticipants: 142
};

export default function HackathonArena() {
  const [hackathons, setHackathons] = useState<Array<Hackathon>>([MOCK_HACKATHON]);
  const [mySubmissions, setMySubmissions] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);
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

  const handleJoin = async (hackathonId: string) => {
    if (hackathonId === "preview_1") {
        return toast.info("This is a preview Hackathon. Real events will appear once published by Admin.");
    }
    
    setJoiningId(hackathonId);
    try {
      const res = await fetch("/api/hackathons/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hackathonId })
      });

      const data = await res.json();
      if (res.status === 401) {
        toast.error("Please login to join the battle");
        router.push(`/login?redirect=/hackathons`);
        return;
      }

      if (res.ok) {
        toast.success(data.message || "Welcome to the Battle! 🚀");
        // Redirect to submission page for this hackathon
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
                { label: "Total Hackathons", value: "24+", icon: LayoutGrid },
                { label: "Community Builders", value: "2.5k+", icon: Users },
                { label: "Rewards Won", value: "₹5L+", icon: Trophy },
                { label: "Code Submissions", value: "8.2k+", icon: Code },
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
                        className="group relative p-1 lg:p-1.5 rounded-[2rem] md:rounded-[3.5rem] bg-white/[0.02] border border-white/5 hover:border-orange-500/30 transition-all duration-700 overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row h-full rounded-[1.8rem] md:rounded-[3rem] bg-[#0A0A0A] overflow-hidden">
                            {/* Visual Side */}
                            <div className="w-full md:w-2/5 relative h-52 md:h-auto overflow-hidden bg-gradient-to-br from-orange-600 to-indigo-600 flex items-center justify-center shrink-0">
                                <Code className="w-16 h-16 md:w-20 md:h-20 text-white/20 scale-150 group-hover:scale-[2] group-hover:rotate-12 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
                                <div className="absolute top-4 left-4 md:top-6 md:left-6 px-4 py-1.5 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                                    {h.status}
                                </div>
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
                                    <div className="flex items-center gap-6 md:gap-8 border-y border-white/5 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-[7px] md:text-[8px] font-black text-gray-600 uppercase tracking-widest">Partici.</span>
                                            <span className="text-base md:text-lg font-black text-white">{h.totalParticipants}+</span>
                                        </div>
                                        <div className="w-px h-8 bg-white/5 md:hidden" />
                                        <div className="flex flex-col">
                                            <span className="text-[7px] md:text-[8px] font-black text-gray-600 uppercase tracking-widest">Time Left</span>
                                            <span className="text-base md:text-lg font-black text-orange-500">2d 14h</span>
                                        </div>
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

      <Footer />
    </main>
  );
}
