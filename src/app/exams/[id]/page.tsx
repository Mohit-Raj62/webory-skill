"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import {
  ArrowLeft,
  Clock,
  CheckSquare,
  ShieldAlert,
  AlertTriangle,
  Award,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Calendar,
  Radio,
  Sparkles,
  Lock,
  Unlock,
  Timer,
} from "lucide-react";
import { toast } from "sonner";

export default function ExamInstructionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [attemptStatus, setAttemptStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [starting, setStarting] = useState(false);

  // Synchronized Slot Waiting Room State
  const [slotState, setSlotState] = useState<"waiting" | "active" | "expired">("active");
  const [secondsUntilStart, setSecondsUntilStart] = useState<number>(0);
  const [serverTimeOffsetMs, setServerTimeOffsetMs] = useState<number>(0);

  useEffect(() => {
    const fetchExamInfo = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/exams/${id}`);
        const data = await res.json();
        if (data.success) {
          setExam(data.exam);
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
      toast.error("Please agree to the examination terms before starting");
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
      <main className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Preparing examination...</p>
        </div>
      </main>
    );
  }

  if (!exam) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center text-white p-4">
        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-4 max-w-md">
          <AlertTriangle size={36} className="text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold">Examination Unavailable</h2>
          <p className="text-sm text-gray-400">
            This examination is either not published or has expired.
          </p>
          <Link
            href="/exams"
            className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
          >
            Back to Available Exams
          </Link>
        </div>
      </main>
    );
  }

  const hasActiveAttempt = attemptStatus?.hasActiveAttempt;
  const canAttempt = attemptStatus?.canAttempt;

  return (
    <main className="min-h-screen bg-[#020617] relative font-sans text-gray-200">
      <Navbar />

      <div className="pt-28 sm:pt-32 pb-20 container mx-auto px-4 max-w-4xl space-y-6">
        <Link
          href="/exams"
          className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Examinations</span>
        </Link>

        {/* Title Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900/30 via-purple-900/10 to-white/[0.02] border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              OFFICIAL ASSESSMENT
            </span>
            <span className="text-xs text-gray-400 font-medium">
              Subject: {exam.subject || "General"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {exam.title}
          </h1>

          {exam.description && (
            <p className="text-sm text-gray-300 leading-relaxed max-w-2xl">
              {exam.description}
            </p>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-gray-400 flex items-center gap-1">
                <Clock size={13} className="text-blue-400" /> Duration
              </span>
              <p className="text-sm font-bold text-white">{exam.duration} Minutes</p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-gray-400 flex items-center gap-1">
                <CheckSquare size={13} className="text-purple-400" /> Total Questions
              </span>
              <p className="text-sm font-bold text-white">{exam.totalQuestions} Qs</p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-gray-400 flex items-center gap-1">
                <Award size={13} className="text-emerald-400" /> Maximum Marks
              </span>
              <p className="text-sm font-bold text-white">{exam.totalMarks} Marks</p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-gray-400 flex items-center gap-1">
                <ShieldAlert size={13} className="text-amber-400" /> Passing Score
              </span>
              <p className="text-sm font-bold text-white">
                {exam.passingMarks} ({exam.passingPercentage}%)
              </p>
            </div>
          </div>
        </div>

        {/* Synchronized Live Exam Waiting Room Banner */}
        {exam.isSynchronizedSlot && (
          <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-950/40 via-black/60 to-purple-950/30 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      slotState === "waiting"
                        ? "bg-amber-400"
                        : slotState === "active"
                        ? "bg-emerald-400"
                        : "bg-red-400"
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${
                      slotState === "waiting"
                        ? "bg-amber-500"
                        : slotState === "active"
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }`}
                  />
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    {slotState === "waiting" && "Live Waiting Room: Exam Locked"}
                    {slotState === "active" && "Exam is Live! Ready to Start"}
                    {slotState === "expired" && "Examination Slot Ended"}
                  </h2>
                  <p className="text-[11px] text-gray-400">
                    Synchronized Live Slot • All candidates start at the exact same moment
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-blue-300/80 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 w-fit">
                <Radio size={13} className="text-blue-400 animate-pulse" />
                <span>Synced with Server Clock</span>
              </div>
            </div>

            {/* If Waiting: Prominent Countdown Timer */}
            {slotState === "waiting" && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
                    Examination Begins In
                  </p>
                  <p className="text-xs text-gray-400">
                    No need to refresh the page — the test paper will unlock automatically at 00:00:00!
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 sm:gap-4 py-2">
                  {days > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-black/80 border border-white/15 flex items-center justify-center shadow-inner">
                        <span className="text-2xl sm:text-4xl font-black text-white font-mono">
                          {String(days).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase font-semibold">Days</span>
                    </div>
                  )}

                  <div className="flex flex-col items-center">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-black/80 border border-white/15 flex items-center justify-center shadow-inner">
                      <span className="text-2xl sm:text-4xl font-black text-white font-mono">
                        {String(hours).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase font-semibold">Hours</span>
                  </div>

                  <span className="text-2xl sm:text-4xl font-bold text-blue-400 mb-5">:</span>

                  <div className="flex flex-col items-center">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-black/80 border border-white/15 flex items-center justify-center shadow-inner">
                      <span className="text-2xl sm:text-4xl font-black text-white font-mono">
                        {String(minutes).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase font-semibold">Minutes</span>
                  </div>

                  <span className="text-2xl sm:text-4xl font-bold text-blue-400 mb-5">:</span>

                  <div className="flex flex-col items-center">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-black/80 border border-blue-500/40 flex items-center justify-center shadow-inner shadow-blue-500/20">
                      <span className="text-2xl sm:text-4xl font-black text-blue-400 font-mono animate-pulse">
                        {String(seconds).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-blue-400 mt-1 uppercase font-semibold">Seconds</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                    <Calendar size={16} className="text-blue-400 shrink-0" />
                    <div>
                      <span className="text-gray-400 block text-[11px]">Scheduled Start Time</span>
                      <span className="text-white font-semibold">
                        {exam.startDate
                          ? new Date(exam.startDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
                          : "TBA"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
                    <Timer size={16} className="text-purple-400 shrink-0" />
                    <div>
                      <span className="text-gray-400 block text-[11px]">Slot Hard Deadline</span>
                      <span className="text-white font-semibold">
                        {exam.endDate
                          ? new Date(exam.endDate).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
                          : "TBA"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* If Active */}
            {slotState === "active" && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-white">The Examination Paper is Unlocked</h3>
                  <p className="text-xs text-emerald-300/80">
                    You can start your examination now.
                    {exam.strictWindowEnforcement && exam.endDate && (
                      <span className="block mt-0.5 text-amber-300">
                        Notice: Strict window enforcement is active. The exam auto-submits simultaneously for everyone at{" "}
                        {new Date(exam.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* If Expired */}
            {slotState === "expired" && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                <AlertTriangle size={24} className="text-red-400 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-white">Scheduled Exam Slot Expired</h3>
                  <p className="text-xs text-red-300/80">
                    This test concluded at{" "}
                    {exam.endDate
                      ? new Date(exam.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                      : ""}{" "}
                    on{" "}
                    {exam.endDate
                      ? new Date(exam.endDate).toLocaleDateString()
                      : ""}
                    . No new attempts can be started.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rules & Guidelines */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen size={18} className="text-blue-400" />
            <span>Important Examination Rules</span>
          </h2>

          <ul className="space-y-2.5 text-xs text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Synchronized Live Timer:</strong> The countdown timer will start immediately when you click &quot;Begin Examination&quot;. The timer is synchronized with the server clock.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Automatic Answer Saving:</strong> Every response you choose is saved instantly in real time. If your internet disconnects or your browser refreshes, your progress will be restored upon reconnecting.
              </span>
            </li>
            {exam.negativeMarking ? (
              <li className="flex items-start gap-2 text-amber-300">
                <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Negative Marking Active:</strong> Incorrect answers will deduct{" "}
                  <strong>{exam.negativeMarksPerQuestion} marks</strong> per question. Unattempted questions will not be penalized.
                </span>
              </li>
            ) : (
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>No Negative Marking:</strong> There is no penalty for incorrect answers. Attempt all questions!
                </span>
              </li>
            )}
            <li className="flex items-start gap-2">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Automatic Submission:</strong> When the timer expires (00:00), your examination will be submitted automatically.
              </span>
            </li>
          </ul>

          {/* Agreement Checkbox */}
          <div className="pt-4 border-t border-white/10">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 text-blue-600 mt-0.5"
              />
              <span className="text-xs text-gray-300">
                I have read and understood all the examination rules. I confirm that I will complete this test honestly without external malpractice.
              </span>
            </label>
          </div>
        </div>

        {/* Start / Resume Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            href="/exams"
            className="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
          >
            Cancel
          </Link>

          {hasActiveAttempt ? (
            <button
              onClick={handleStartExam}
              disabled={starting}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-bold shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 animate-pulse"
            >
              <span>Resume Active Test</span>
              <ArrowRight size={16} />
            </button>
          ) : exam.isSynchronizedSlot && slotState === "waiting" ? (
            <button
              disabled
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-900/30 border border-blue-500/30 text-blue-300 text-sm font-bold shadow-lg flex items-center justify-center gap-2 cursor-not-allowed opacity-90"
            >
              <Lock size={15} className="text-blue-400 animate-pulse" />
              <span>
                Unlocks in {hours > 0 ? `${hours}h ` : ""}{String(minutes).padStart(2, "0")}m {String(seconds).padStart(2, "0")}s
              </span>
            </button>
          ) : exam.isSynchronizedSlot && slotState === "expired" ? (
            <button
              disabled
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-red-900/30 border border-red-500/30 text-red-400 text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed"
            >
              <AlertTriangle size={15} />
              <span>Slot Expired</span>
            </button>
          ) : canAttempt || (exam.isSynchronizedSlot && slotState === "active") ? (
            <button
              onClick={handleStartExam}
              disabled={!agreed || starting}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>{starting ? "Launching Examination..." : "Begin Examination Now"}</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <div className="text-right">
              <p className="text-xs text-amber-400 font-semibold">
                Maximum Attempts ({exam.maxAttempts || 1}) Reached
              </p>
              <Link
                href={`/exams/${exam._id}/result`}
                className="text-xs text-blue-400 underline mt-0.5 block"
              >
                View Previous Result
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}

