"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { useAuth } from "@/components/auth/session-provider";
import {
  FileText,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight,
  Calendar,
  Trophy,
  EyeOff,
  Home,
  User,
  Radio,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Hash,
  Laptop,
  CheckSquare,
} from "lucide-react";

interface ExamCard {
  _id: string;
  title: string;
  description?: string;
  subject: string;
  topic?: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  passingPercentage: number;
  passingMarks?: number;
  negativeMarking?: boolean;
  negativeMarksPerQuestion?: number;
  maxAttempts?: number;
  status: "live" | "scheduled" | "completed";
  startDate?: string;
  endDate?: string;
  isSynchronizedSlot?: boolean;
  myAttempt?: {
    status: string;
    submittedAt?: string;
    score?: number | null;
    percentage?: number | null;
    passed?: boolean | null;
  } | null;
}

export default function StudentExamsPortalPage() {
  const { user } = useAuth();
  const [exams, setExams] = useState<ExamCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [examsEnabled, setExamsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "history">("live");
  const [currentTime, setCurrentTime] = useState<string>("");

  // Live ticking clock for exam hall realism
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }) + " IST"
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStudentExams = async () => {
      try {
        setLoading(true);

        const settingsRes = await fetch("/api/settings");
        const settingsData = await settingsRes.json();
        if (settingsData.examsEnabled !== undefined) {
          setExamsEnabled(Boolean(settingsData.examsEnabled));
        }

        const res = await fetch("/api/exams");
        const data = await res.json();
        if (data.success) {
          setExams(data.exams || []);
        }
      } catch (err) {
        console.error("Failed to load exams", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentExams();
  }, []);

  const isAdmin = user && (user.role === "admin" || user.role === "superadmin");
  const isAccessible = examsEnabled || isAdmin;

  const liveExams = exams.filter((e) => e.status === "live");
  const upcomingExams = exams.filter((e) => e.status === "scheduled");
  const attemptedExams = exams.filter((e) => Boolean(e.myAttempt));

  // Resolved candidate name and id from authenticated user profile
  const candidateName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    (user as any)?.name ||
    user?.email?.split("@")[0] ||
    "Candidate";
  const candidateRoll = user?._id ? user._id.slice(-8).toUpperCase() : "REG-ACTIVE";

  return (
    <main className="min-h-screen bg-[#060a12] text-slate-200 font-sans selection:bg-blue-600/30">
      <Navbar />

      {!loading && !isAccessible ? (
        <div className="pt-28 sm:pt-36 pb-24 container mx-auto px-4 max-w-lg text-center space-y-6">
          <div className="p-8 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <EyeOff size={24} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white tracking-tight">Examination Hall Closed</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Online examinations are currently not open for candidates. Whenever a test window is activated, it will appear here automatically.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors"
              >
                <Home size={14} />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-24 sm:pt-28 pb-20 container mx-auto px-4 max-w-6xl space-y-6">
          
          {/* Admin Warning Banner if Hidden */}
          {!examsEnabled && isAdmin && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <EyeOff size={15} className="text-amber-400 shrink-0" />
                <span><strong>Admin Test View:</strong> Public access is currently <strong>DISABLED</strong>. You are seeing this in Administrator Preview Mode.</span>
              </div>
              <Link 
                href="/admin/exams" 
                className="px-3 py-1 rounded bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors shrink-0 text-center"
              >
                Manage Exams in Admin
              </Link>
            </div>
          )}

          {/* OFFICIAL EXAMINATION DESK HEADER (REAL EXAM PORTAL LOOK) */}
          <div className="rounded-xl bg-[#0c1220] border border-slate-800 shadow-sm overflow-hidden">
            {/* Top Bar with Exam Board Branding & Live Server Clock */}
            <div className="px-4 sm:px-6 py-3 bg-[#080d18] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-sm">
                  CBT
                </div>
                <div>
                  <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">
                    Computer Based Test (CBT) Assessment Portal
                  </h1>
                  <p className="text-[11px] text-slate-400">
                    Official Candidate Examination &amp; Evaluation Center
                  </p>
                </div>
              </div>

              {/* Real-time Server Clock Strip */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-400 text-[11px]">Server Clock:</span>
                  <span className="text-white font-bold">{currentTime || "Syncing..."}</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Laptop size={13} className="text-slate-500" />
                  <span>Proctoring Engine: Active</span>
                </div>
              </div>
            </div>

            {/* Candidate Identity Strip */}
            <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs bg-[#0c1220]/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                  <User size={15} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{candidateName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      ROLL NO: {candidateRoll}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{user?.email || "Enrolled Candidate"}</p>
                </div>
              </div>

              {/* Quick Summary Numbers */}
              <div className="flex items-center gap-4 sm:gap-6 text-xs">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Live Papers</span>
                  <span className="text-sm font-bold text-emerald-400">{liveExams.length}</span>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Upcoming</span>
                  <span className="text-sm font-bold text-blue-400">{upcomingExams.length}</span>
                </div>
                <div className="h-6 w-px bg-slate-800" />
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Completed</span>
                  <span className="text-sm font-bold text-slate-200">{attemptedExams.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* OFFICIAL ADVISORY TICKER */}
          <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 flex items-start gap-2.5 text-xs text-blue-200/90">
            <AlertTriangle size={15} className="text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed">
              <span className="font-semibold text-blue-300">Important Candidate Instructions:</span>
              <span>
                {" "}Please ensure stable internet access and close background applications before launching any test. Each test paper enforces strict duration and proctoring controls (tab-switching and exiting fullscreen are recorded).
              </span>
            </div>
          </div>

          {/* TAB NAVIGATION: Real Exam Portal Filter */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setActiveTab("live")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                  activeTab === "live"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Active Examination Papers ({liveExams.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === "upcoming"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Calendar size={13} />
                <span>Scheduled Slots ({upcomingExams.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === "history"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                <Trophy size={13} />
                <span>Scorecards &amp; Attempts ({attemptedExams.length})</span>
              </button>
            </div>
          </div>

          {/* EXAM CARDS GRID */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-400 text-xs font-medium">Verifying candidate schedule &amp; test papers...</p>
            </div>
          ) : activeTab === "live" ? (
            liveExams.length === 0 ? (
              <div className="py-16 text-center rounded-xl bg-[#0c1220] border border-slate-800 p-8 space-y-2">
                <FileText size={32} className="text-slate-600 mx-auto" />
                <h3 className="text-white font-semibold text-sm">No Active Papers Scheduled Right Now</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                  There are no online examinations active at this moment for your candidate profile. Please verify your scheduled slots in the Upcoming tab.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveExams.map((exam) => {
                  const hasActive = exam.myAttempt?.status === "in-progress";
                  const isSubmitted = exam.myAttempt?.status === "submitted";

                  return (
                    <div
                      key={exam._id}
                      className="rounded-xl bg-[#0c1220] border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between overflow-hidden shadow-sm"
                    >
                      {/* Paper Admit Header */}
                      <div className="px-4 py-2.5 bg-[#080d18] border-b border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-blue-400 uppercase">
                            PAPER ID: {exam._id.slice(-6).toUpperCase()}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 text-[11px] font-medium">{exam.subject}</span>
                        </div>

                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          WINDOW OPEN
                        </span>
                      </div>

                      {/* Paper Details */}
                      <div className="p-4 sm:p-5 space-y-3.5">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-white line-clamp-2">
                            {exam.title}
                          </h3>
                          {exam.description && (
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {exam.description}
                            </p>
                          )}
                        </div>

                        {/* Official Specification Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-800/80">
                          <div className="p-2 rounded bg-slate-900/60 border border-slate-800 space-y-0.5">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Duration</span>
                            <span className="font-bold text-white text-xs">{exam.duration} Mins</span>
                          </div>

                          <div className="p-2 rounded bg-slate-900/60 border border-slate-800 space-y-0.5">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Questions</span>
                            <span className="font-bold text-white text-xs">{exam.totalQuestions} Qs</span>
                          </div>

                          <div className="p-2 rounded bg-slate-900/60 border border-slate-800 space-y-0.5">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Max Marks</span>
                            <span className="font-bold text-white text-xs">{exam.totalMarks} Marks</span>
                          </div>

                          <div className="p-2 rounded bg-slate-900/60 border border-slate-800 space-y-0.5">
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Marking</span>
                            <span className="font-bold text-white text-xs">
                              {exam.negativeMarking ? `-${exam.negativeMarksPerQuestion || 0.25} Deduct` : "No Negative"}
                            </span>
                          </div>
                        </div>

                        {/* Proctoring & Slot Info Tag */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
                          <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/80 flex items-center gap-1">
                            <ShieldCheck size={12} className="text-blue-400" />
                            Proctored CBT
                          </span>
                          {exam.isSynchronizedSlot && (
                            <span className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 flex items-center gap-1">
                              <Clock size={12} />
                              Live Synchronized Slot
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/80">
                            Single Attempt
                          </span>
                        </div>
                      </div>

                      {/* Official Action Bar */}
                      <div className="px-4 py-3 bg-[#080d18] border-t border-slate-800 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          Status: {isSubmitted ? "Submitted" : hasActive ? "In-Progress" : "Ready to Start"}
                        </span>

                        <div className="w-full sm:w-auto">
                          {isSubmitted ? (
                            <Link
                              href={`/exams/${exam._id}/result`}
                              className="w-full sm:w-auto px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                            >
                              <span>View Candidate Scorecard</span>
                              <ArrowRight size={13} />
                            </Link>
                          ) : hasActive ? (
                            <Link
                              href={`/exams/${exam._id}/take`}
                              className="w-full sm:w-auto px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                              <span>Resume In-Progress Paper</span>
                              <ArrowRight size={13} />
                            </Link>
                          ) : (
                            <Link
                              href={`/exams/${exam._id}`}
                              className="w-full sm:w-auto px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                              <span>Enter Examination Hall</span>
                              <ArrowRight size={13} />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : activeTab === "upcoming" ? (
            upcomingExams.length === 0 ? (
              <div className="py-16 text-center rounded-xl bg-[#0c1220] border border-slate-800 p-8 space-y-2">
                <Calendar size={32} className="text-slate-600 mx-auto" />
                <h3 className="text-white font-semibold text-sm">No Scheduled Slots</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                  Upcoming assessments will be posted here as soon as the examination schedule is published.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingExams.map((exam) => (
                  <div
                    key={exam._id}
                    className="rounded-xl bg-[#0c1220] border border-slate-800 flex flex-col justify-between overflow-hidden"
                  >
                    <div className="px-4 py-2.5 bg-[#080d18] border-b border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        SCHEDULED SLOT
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {exam.subject}
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3">
                      <h3 className="text-base font-bold text-white">{exam.title}</h3>
                      {exam.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{exam.description}</p>
                      )}

                      <div className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                        <div className="flex items-center gap-2">
                          <Clock size={13} className="text-slate-400" />
                          <span>Duration: <strong>{exam.duration} Minutes</strong></span>
                        </div>
                        {exam.startDate && (
                          <div className="flex items-center gap-2">
                            <Calendar size={13} className="text-slate-400" />
                            <span>
                              Scheduled Start: <strong>{new Date(exam.startDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-4 py-3 bg-[#080d18] border-t border-slate-800 text-right">
                      <span className="text-xs text-slate-400">
                        Unlocks automatically at scheduled date &amp; time
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* History / Scorecards Tab */
            attemptedExams.length === 0 ? (
              <div className="py-16 text-center rounded-xl bg-[#0c1220] border border-slate-800 p-8 space-y-2">
                <Trophy size={32} className="text-slate-600 mx-auto" />
                <h3 className="text-white font-semibold text-sm">No Attempt History</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
                  Once you complete an examination paper, your official scorecards, accuracy breakdown, and response sheets will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {attemptedExams.map((exam) => {
                  const att = exam.myAttempt;
                  const hasScore = att?.score !== null && att?.score !== undefined;

                  return (
                    <div
                      key={exam._id}
                      className="p-4 rounded-xl bg-[#0c1220] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 uppercase">
                            {exam.subject}
                          </span>
                          {hasScore && (
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                att?.passed
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-red-500/10 text-red-400 border border-red-500/20"
                              }`}
                            >
                              {att?.passed ? "QUALIFIED" : "NOT QUALIFIED"}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-white">{exam.title}</h3>
                        <p className="text-xs text-slate-400">
                          Submitted on:{" "}
                          {att?.submittedAt
                            ? new Date(att.submittedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
                            : "Recorded"}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {hasScore ? (
                          <div className="text-right">
                            <p className="text-base font-bold text-white">
                              {att?.score} / {exam.totalMarks}
                            </p>
                            <p className="text-xs text-emerald-400 font-semibold">
                              {att?.percentage}% Marks
                            </p>
                          </div>
                        ) : (
                          <div className="text-right text-xs text-amber-400">
                            <span>Evaluation Pending</span>
                          </div>
                        )}

                        <Link
                          href={`/exams/${exam._id}/result`}
                          className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
                        >
                          <span>Official Scorecard</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      )}

      <Footer />
    </main>
  );
}
