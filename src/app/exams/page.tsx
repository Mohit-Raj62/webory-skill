"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { useAuth } from "@/components/auth/session-provider";
import {
  CheckSquare,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  AlertCircle,
  Trophy,
  EyeOff,
  Home,
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
  status: "live" | "scheduled" | "completed";
  startDate?: string;
  endDate?: string;
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

  return (
    <main className="min-h-screen bg-[#020617] relative overflow-hidden font-sans text-gray-200">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[130px] -z-10 rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] -z-10 rounded-full" />

      <Navbar />

      {!loading && !isAccessible ? (
        <div className="pt-28 sm:pt-36 pb-24 container mx-auto px-4 max-w-xl text-center space-y-6">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0b1120]/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <EyeOff size={30} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Examinations Currently Inactive</h2>
              <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                Online exams are currently not open for candidates. Whenever an examination goes live, this portal will open automatically.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95"
              >
                <Home size={16} />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-28 sm:pt-32 pb-20 container mx-auto px-4 max-w-6xl space-y-8">
          {/* Admin Warning Banner if Hidden */}
          {!examsEnabled && isAdmin && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <EyeOff size={16} />
                </div>
                <span><strong>Admin Preview Mode:</strong> Exams are currently <strong>HIDDEN</strong> from public students. You have access because you are an admin.</span>
              </div>
              <Link 
                href="/admin/exams" 
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-black font-extrabold hover:bg-amber-400 transition-colors shrink-0 text-center"
              >
                Open Admin Controls
              </Link>
            </div>
          )}

          {/* Hero Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <CheckSquare size={14} />
            <span>Webory Skills Assessment Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Online Examinations &amp; Assessments
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Take timed evaluations, test your programming knowledge, monitor your results, and review complete answer keys.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-center gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "live"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Examinations ({liveExams.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "upcoming"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Calendar size={15} />
            <span>Upcoming Scheduled ({upcomingExams.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "history"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Trophy size={15} />
            <span>My Results ({attemptedExams.length})</span>
          </button>
        </div>

        {/* Examination Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading available examinations...</p>
          </div>
        ) : activeTab === "live" ? (
          liveExams.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 p-8 space-y-3">
              <CheckSquare size={32} className="text-gray-500 mx-auto" />
              <h3 className="text-white font-semibold text-lg">No Live Examinations Right Now</h3>
              <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
                Currently, there are no examinations live for your enrolled courses. Check back when your instructor schedules the next test.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {liveExams.map((exam) => {
                const hasActive = exam.myAttempt?.status === "in-progress";
                const isSubmitted = exam.myAttempt?.status === "submitted";

                return (
                  <div
                    key={exam._id}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-blue-500/5 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 uppercase">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Now
                        </span>
                        <span className="text-xs text-gray-400 font-medium">
                          {exam.subject}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                        {exam.title}
                      </h3>

                      {exam.description && (
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {exam.description}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <Clock size={13} className="text-blue-400" />
                          <span>{exam.duration} Minutes</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <CheckSquare size={13} className="text-purple-400" />
                          <span>{exam.totalQuestions} Questions</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <ShieldCheck size={13} className="text-emerald-400" />
                          <span>{exam.totalMarks} Marks</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <Award size={13} className="text-amber-400" />
                          <span>Pass: {exam.passingPercentage}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="pt-2 border-t border-white/5">
                      {isSubmitted ? (
                        <Link
                          href={`/exams/${exam._id}/result`}
                          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10 transition-all"
                        >
                          <span>View My Result</span>
                          <ArrowRight size={14} />
                        </Link>
                      ) : hasActive ? (
                        <Link
                          href={`/exams/${exam._id}/take`}
                          className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all animate-pulse"
                        >
                          <span>Resume Active Exam</span>
                          <ArrowRight size={14} />
                        </Link>
                      ) : (
                        <Link
                          href={`/exams/${exam._id}`}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all"
                        >
                          <span>Start Examination</span>
                          <ArrowRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : activeTab === "upcoming" ? (
          upcomingExams.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 p-8 space-y-3">
              <Calendar size={32} className="text-gray-500 mx-auto" />
              <h3 className="text-white font-semibold text-lg">No Scheduled Upcoming Exams</h3>
              <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
                Any upcoming tests announced by the instructor will appear in this section.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcomingExams.map((exam) => (
                <div
                  key={exam._id}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      SCHEDULED
                    </span>
                    <h3 className="text-base font-bold text-white">{exam.title}</h3>
                    <p className="text-xs text-gray-400">{exam.subject}</p>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-2">
                    <Clock size={13} />
                    <span>Duration: {exam.duration} mins</span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* History / Results Tab */
          attemptedExams.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 p-8 space-y-3">
              <Trophy size={32} className="text-gray-500 mx-auto" />
              <h3 className="text-white font-semibold text-lg">No Attempt History</h3>
              <p className="text-gray-400 text-xs sm:text-sm max-w-md mx-auto">
                Once you complete an examination, your scores, performance metrics, and answer reviews will be listed here.
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
                    className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 uppercase">
                          {exam.subject}
                        </span>
                        {hasScore && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              att?.passed
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-red-500/15 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {att?.passed ? "PASSED" : "FAILED"}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white">{exam.title}</h3>
                      <p className="text-xs text-gray-400">
                        Submitted:{" "}
                        {att?.submittedAt
                          ? new Date(att.submittedAt).toLocaleDateString()
                          : "Recently"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      {hasScore ? (
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">
                            {att?.score} / {exam.totalMarks}
                          </p>
                          <p className="text-xs text-emerald-400 font-semibold">
                            {att?.percentage}%
                          </p>
                        </div>
                      ) : (
                        <div className="text-right text-xs text-amber-400">
                          <span>Awaiting Publication</span>
                        </div>
                      )}

                      <Link
                        href={`/exams/${exam._id}/result`}
                        className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <span>View Report</span>
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

