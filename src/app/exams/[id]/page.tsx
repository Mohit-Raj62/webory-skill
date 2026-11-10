"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { useAuth } from "@/components/auth/session-provider";
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  Award,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Calendar,
  AlertTriangle,
  User,
  Laptop,
  CheckSquare,
  FileText,
  Lock,
  Timer,
  Info,
} from "lucide-react";
import { toast } from "sonner";

export default function ExamInstructionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [exam, setExam] = useState<any>(null);
  const [candidate, setCandidate] = useState<any>(null);
  const [attemptStatus, setAttemptStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [starting, setStarting] = useState(false);

  // Synchronized Slot Waiting Room State
  const [slotState, setSlotState] = useState<"waiting" | "active" | "expired">("active");
  const [secondsUntilStart, setSecondsUntilStart] = useState<number>(0);
  const [serverTimeOffsetMs, setServerTimeOffsetMs] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>("");

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
    const fetchExamInfo = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/exams/${id}`);
        const data = await res.json();
        if (data.success) {
          setExam(data.exam);
          if (data.candidate) {
            setCandidate(data.candidate);
          }
          setAttemptStatus(data.attemptStatus);
          setSlotState(data.slotState || "active");

          if (data.serverTime) {
            const serverMs = new Date(data.serverTime).getTime();
            const localMs = Date.now();
            const offset = serverMs - localMs;
            setServerTimeOffsetMs(offset);

            if (data.exam?.isSynchronizedSlot && data.exam?.startDate) {
              const startMs = new Date(data.exam.startDate).getTime();
              const diff = Math.max(0, Math.ceil((startMs - serverMs) / 1000));
              setSecondsUntilStart(diff);
            }
          }
        } else {
          toast.error(data.error || "Failed to load examination");
        }
      } catch {
        toast.error("Error loading examination details");
      } finally {
        setLoading(false);
      }
    };

    fetchExamInfo();
  }, [id]);

  // Synchronized Slot live ticking countdown
  useEffect(() => {
    if (!exam?.isSynchronizedSlot || !exam?.startDate) return;

    const startMs = new Date(exam.startDate).getTime();
    const endMs = exam.endDate ? new Date(exam.endDate).getTime() : 0;

    const timer = setInterval(() => {
      const currentServerMs = Date.now() + serverTimeOffsetMs;
      const diffSecs = Math.ceil((startMs - currentServerMs) / 1000);

      if (diffSecs > 0) {
        setSecondsUntilStart(diffSecs);
        setSlotState("waiting");
      } else {
        setSecondsUntilStart(0);
        if (endMs && currentServerMs > endMs) {
          setSlotState("expired");
        } else {
          setSlotState((prev) => {
            if (prev === "waiting") {
              toast.success("Examination has started! You can now begin.", {
                duration: 6000,
              });
            }
            return "active";
          });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exam, serverTimeOffsetMs]);

  const handleStartExam = () => {
    if (!agreed) {
      toast.error("Please confirm the candidate undertaking declaration before beginning");
      return;
    }
    setStarting(true);
    router.push(`/exams/${id}/take`);
  };

  const formatCountdown = (totalSecs: number) => {
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = formatCountdown(secondsUntilStart);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#060a12] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-medium">Verifying candidate credentials &amp; loading paper instructions...</p>
        </div>
      </main>
    );
  }

  if (!exam) {
    return (
      <main className="min-h-screen bg-[#060a12] flex items-center justify-center text-white p-4">
        <div className="p-8 rounded-xl bg-[#0c1220] border border-slate-800 text-center space-y-4 max-w-md">
          <AlertTriangle size={32} className="text-amber-400 mx-auto" />
          <h2 className="text-lg font-bold">Paper Unavailable</h2>
          <p className="text-xs text-slate-400">
            This examination is either not published or has expired.
          </p>
          <Link
            href="/exams"
            className="inline-block px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
          >
            Back to Available Exams
          </Link>
        </div>
      </main>
    );
  }

  const hasActiveAttempt = attemptStatus?.hasActiveAttempt;
  const canAttempt = attemptStatus?.canAttempt;

  const displayName =
    candidate?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    (user as any)?.name ||
    user?.email?.split("@")[0] ||
    "Candidate";

  const displayRoll =
    candidate?.rollNumber ||
    (user?._id ? user._id.slice(-8).toUpperCase() : "REG-ACTIVE");

  const displayEmail =
    candidate?.email ||
    user?.email ||
    "Candidate Email";

  return (
    <main className="min-h-screen bg-[#060a12] text-slate-200 font-sans selection:bg-blue-600/30">
      <Navbar />

      <div className="pt-24 sm:pt-28 pb-20 container mx-auto px-4 max-w-5xl space-y-5">
        <Link
          href="/exams"
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Examination Portal</span>
        </Link>

        {/* ================= 1. OFFICIAL CANDIDATE ADMIT / VERIFICATION HEADER ================= */}
        <div className="rounded-xl bg-[#0c1220] border border-slate-800 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-6 py-3 bg-[#080d18] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                CBT
              </div>
              <div>
                <span className="font-bold text-white uppercase tracking-wider block text-xs">
                  Official Assessment Instructions &amp; Candidate Verification
                </span>
                <span className="text-[11px] text-slate-400">
                  Paper Code: <strong className="text-blue-400 font-mono">#EXM-{exam._id.slice(-6).toUpperCase()}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Clock: {currentTime || "Synced"}</span>
              </div>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                {exam.status === "live" ? "Window Open" : exam.status}
              </span>
            </div>
          </div>

          {/* Candidate Profile Slip */}
          <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-[#0c1220]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                <User size={18} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Candidate Name</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{displayName}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    ROLL: {displayRoll}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block">{displayEmail}</span>
              </div>
            </div>

            <div className="space-y-0.5 border-t md:border-t-0 md:border-l border-slate-800/80 pt-2 md:pt-0 md:pl-4">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Paper / Subject</span>
              <span className="text-xs font-semibold text-white block">{exam.title}</span>
              <span className="text-[11px] text-blue-400 font-medium">{exam.subject || "General Engineering"}</span>
            </div>

            <div className="space-y-0.5 border-t md:border-t-0 md:border-l border-slate-800/80 pt-2 md:pt-0 md:pl-4">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Test Environment</span>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={13} />
                Secure AI Proctoring Active
              </span>
              <span className="text-[11px] text-slate-400">Single Attempt Allowed</span>
            </div>
          </div>
        </div>

        {/* ================= 2. SYNCHRONIZED SLOT WAITING ROOM (IF ACTIVE) ================= */}
        {exam.isSynchronizedSlot && (
          <div className="rounded-xl border border-blue-500/30 bg-[#080d18] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <div>
                  <h2 className="text-sm font-bold text-white">
                    {slotState === "waiting" && "Live Slot Waiting Room"}
                    {slotState === "active" && "Slot Unlocked • Ready to Begin"}
                    {slotState === "expired" && "Scheduled Slot Ended"}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Synchronized Examination — All candidates begin together.
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 font-mono bg-slate-900 px-2.5 py-1 rounded border border-slate-800 w-fit">
                Server Clock Synchronization Verified
              </div>
            </div>

            {slotState === "waiting" && (
              <div className="space-y-3 py-1">
                <p className="text-center text-xs text-slate-400">
                  Paper will automatically unlock in:
                </p>

                <div className="flex items-center justify-center gap-3">
                  {days > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xl font-bold text-white">
                        {String(days).padStart(2, "0")}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 uppercase">Days</span>
                    </div>
                  )}

                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xl font-bold text-white">
                      {String(hours).padStart(2, "0")}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 uppercase">Hours</span>
                  </div>

                  <span className="text-xl font-bold text-slate-600 mb-4">:</span>

                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-xl font-bold text-white">
                      {String(minutes).padStart(2, "0")}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 uppercase">Minutes</span>
                  </div>

                  <span className="text-xl font-bold text-slate-600 mb-4">:</span>

                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-lg bg-slate-900 border border-blue-500/40 flex items-center justify-center font-mono text-xl font-bold text-blue-400">
                      {String(seconds).padStart(2, "0")}
                    </div>
                    <span className="text-[10px] text-blue-400 mt-1 uppercase font-semibold">Seconds</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Scheduled Start</span>
                      <span className="font-semibold text-white">
                        {exam.startDate ? new Date(exam.startDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "TBA"}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                    <Timer size={14} className="text-slate-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Slot Deadline</span>
                      <span className="font-semibold text-white">
                        {exam.endDate ? new Date(exam.endDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "TBA"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 3. SCHEME OF EXAMINATION (PATTERN TABLE) ================= */}
        <div className="rounded-xl bg-[#0c1220] border border-slate-800 overflow-hidden shadow-sm">
          <div className="px-4 sm:px-6 py-3 bg-[#080d18] border-b border-slate-800 flex items-center gap-2">
            <FileText size={15} className="text-blue-400" />
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
              Scheme of Examination &amp; Evaluation Blueprint
            </h2>
          </div>

          <div className="p-4 sm:p-5 space-y-4 text-xs">
            {/* Blueprint Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" /> Allocated Time
                </span>
                <span className="text-sm font-bold text-white">{exam.duration} Minutes</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block flex items-center gap-1.5">
                  <CheckSquare size={13} className="text-slate-400" /> Total Questions
                </span>
                <span className="text-sm font-bold text-white">{exam.totalQuestions} Questions</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block flex items-center gap-1.5">
                  <Award size={13} className="text-slate-400" /> Maximum Marks
                </span>
                <span className="text-sm font-bold text-white">{exam.totalMarks} Marks</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block flex items-center gap-1.5">
                  <Award size={13} className="text-slate-400" /> Qualifying Cutoff
                </span>
                <span className="text-sm font-bold text-white">
                  {exam.passingMarks} ({exam.passingPercentage}%)
                </span>
              </div>
            </div>

            {/* Marking Criteria Strip */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-slate-400">Marking Scheme:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  +1.0 Mark for Correct
                </span>
                {exam.negativeMarking ? (
                  <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-semibold border border-red-500/20">
                    -{exam.negativeMarksPerQuestion || 0.25} Deduct for Incorrect
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                    No Negative Penalty
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-400">
                Unattempted questions: <strong>0 Marks</strong>
              </span>
            </div>
          </div>
        </div>

        {/* ================= 4. OFFICIAL CBT QUESTION PALETTE SYMBOLS (SIGNATURE EXAM LEGEND) ================= */}
        <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-4 sm:p-5 space-y-3 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <Info size={15} className="text-blue-400" />
            <h3 className="font-bold text-white uppercase tracking-wider text-xs">
              Computer Based Test (CBT) Question Palette Symbols
            </h3>
          </div>

          <p className="text-slate-400 text-[11px]">
            During the examination, the question status palette on the right side will display the status of each question using the following official symbols:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                01
              </div>
              <div>
                <span className="font-bold text-white block">Answered</span>
                <span className="text-[10px] text-slate-400">You have answered</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                02
              </div>
              <div>
                <span className="font-bold text-white block">Not Answered</span>
                <span className="text-[10px] text-slate-400">Question skipped</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                03
              </div>
              <div>
                <span className="font-bold text-white block">Review</span>
                <span className="text-[10px] text-slate-400">Marked for review</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-slate-800 text-slate-400 font-bold flex items-center justify-center shrink-0 text-xs border border-slate-700">
                04
              </div>
              <div>
                <span className="font-bold text-slate-300 block">Not Visited</span>
                <span className="text-[10px] text-slate-400">Not opened yet</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 5. GENERAL CANDIDATE CONDUCT & RULES ================= */}
        <div className="rounded-xl bg-[#0c1220] border border-slate-800 p-4 sm:p-5 space-y-3 text-xs">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
            <BookOpen size={15} className="text-blue-400" />
            <h3 className="font-bold text-white uppercase tracking-wider text-xs">
              General Examination Instructions &amp; Security Protocol
            </h3>
          </div>

          <ol className="list-decimal list-inside space-y-2 text-slate-300 text-[11px] sm:text-xs leading-relaxed">
            <li>
              <strong>Synchronized Timer:</strong> The countdown timer in the top header will display the remaining time. When the timer hits 00:00:00, the examination will be submitted automatically.
            </li>
            <li>
              <strong>Instant Server Cloud Saving:</strong> Every response chosen is saved in real time. If your network interrupts or your system reboots, your answers remain saved on the server.
            </li>
            <li>
              <strong>Proctoring &amp; Anti-Cheating:</strong> Switching browser tabs, minimizing the screen, or exiting fullscreen is recorded. Reaching the maximum warning limit will automatically disqualify and submit your test.
            </li>
            <li>
              <strong>Question Navigation:</strong> You can click on any question number in the question palette to jump directly to that question.
            </li>
          </ol>

          {/* Candidate Undertaking Declaration */}
          <div className="pt-3.5 border-t border-slate-800">
            <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 mt-0.5 focus:ring-0 shrink-0"
              />
              <span className="text-[11px] sm:text-xs text-slate-200 leading-relaxed">
                <strong>Candidate Undertaking:</strong> I declare that I am the genuine registered candidate. I have read and understood all the above instructions and agree to abide by the rules. I will not engage in any malpractice during this examination.
              </span>
            </label>
          </div>
        </div>

        {/* ================= 6. OFFICIAL PROCEED ACTION BAR ================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Link
            href="/exams"
            className="w-full sm:w-auto text-center px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel &amp; Return
          </Link>

          {hasActiveAttempt ? (
            <button
              onClick={handleStartExam}
              disabled={starting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Resume In-Progress Examination</span>
              <ArrowRight size={14} />
            </button>
          ) : exam.isSynchronizedSlot && slotState === "waiting" ? (
            <button
              disabled
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <Clock size={14} className="text-slate-400" />
              <span>
                Slot Locked • Unlocks in {hours > 0 ? `${hours}h ` : ""}{String(minutes).padStart(2, "0")}m {String(seconds).padStart(2, "0")}s
              </span>
            </button>
          ) : exam.isSynchronizedSlot && slotState === "expired" ? (
            <button
              disabled
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-red-400 text-xs font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <AlertTriangle size={14} />
              <span>Examination Slot Expired</span>
            </button>
          ) : canAttempt || (exam.isSynchronizedSlot && slotState === "active") ? (
            <button
              onClick={handleStartExam}
              disabled={!agreed || starting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider"
            >
              <span>{starting ? "Launching Test Terminal..." : "I Am Ready To Begin Test"}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <div className="text-right">
              <p className="text-xs text-amber-400 font-semibold">
                Maximum Attempts ({exam.maxAttempts || 1}) Reached
              </p>
              <Link
                href={`/exams/${exam._id}/result`}
                className="text-xs text-blue-400 hover:underline mt-0.5 block font-medium"
              >
                View Official Scorecard
              </Link>
            </div>
          )}
        </div>

      </div>

      <Footer />
    </main>
  );
}
