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

  useEffect(() => {
    const fetchExamInfo = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/exams/${id}`);
        const data = await res.json();
        if (data.success) {
          setExam(data.exam);
          setAttemptStatus(data.attemptStatus);
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

  const handleStartExam = () => {
    if (!agreed) {
      toast.error("Please agree to the examination terms before starting");
      return;
    }
    setStarting(true);
    router.push(`/exams/${id}/take`);
  };

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
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/exams"
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
          >
            Cancel
          </Link>

          {hasActiveAttempt ? (
            <button
              onClick={handleStartExam}
              disabled={starting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-bold shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all active:scale-95 animate-pulse"
            >
              <span>Resume Active Test</span>
              <ArrowRight size={16} />
            </button>
          ) : canAttempt ? (
            <button
              onClick={handleStartExam}
              disabled={!agreed || starting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all active:scale-95"
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

