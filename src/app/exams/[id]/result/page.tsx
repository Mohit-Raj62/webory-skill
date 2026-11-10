"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowLeft,
  FileCheck,
  Award,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

export default function StudentExamResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/exams/${id}/result`);
        const data = await res.json();
        if (data.success) {
          setResultData(data);
        } else {
          toast.error(data.error || "Failed to load examination results");
        }
      } catch {
        toast.error("Error retrieving results");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400 text-sm">Evaluating examination submission...</p>
        </div>
      </main>
    );
  }

  if (!resultData) {
    return (
      <main className="min-h-screen bg-[#020617] flex items-center justify-center text-white p-4">
        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-4 max-w-md">
          <AlertCircle size={36} className="text-amber-400 mx-auto" />
          <h2 className="text-xl font-bold">No Submission Found</h2>
          <p className="text-sm text-gray-400">
            You haven&apos;t submitted this examination yet.
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

  const { isResultVisible, isAnswerKeyVisible, summary, questionBreakdown, examTitle } =
    resultData;

  return (
    <main className="min-h-screen bg-[#020617] relative font-sans text-gray-200">
      <Navbar />

      <div className="pt-28 sm:pt-32 pb-20 container mx-auto px-4 max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/exams"
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to All Examinations</span>
          </Link>
        </div>

        {/* When Admin keeps results hidden */}
        {!isResultVisible ? (
          <div className="p-8 sm:p-12 rounded-2xl bg-[#0f172a]/70 border border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
              <FileCheck size={28} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Examination Submitted Successfully
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
              Your test responses have been safely saved. Scores will be released by the instructor after evaluation.
            </p>
            <div className="pt-2">
              <Link
                href="/exams"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-block transition-colors"
              >
                Return to Exams Portal
              </Link>
            </div>
          </div>
        ) : (
          /* When Results are Visible */
          <div className="space-y-6">
            {/* Score Card Hero */}
            <div
              className={`p-6 sm:p-8 rounded-2xl border text-center space-y-5 bg-[#0f172a]/80 ${
                summary?.passed
                  ? "border-emerald-500/30"
                  : "border-red-500/30"
              }`}
            >
              <div className="space-y-2">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border uppercase tracking-wider ${
                    summary?.passed
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}
                >
                  {summary?.passed ? "Passed" : "Needs Improvement"}
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white pt-1">
                  {examTitle}
                </h1>
              </div>

              {/* Score Number Display */}
              <div className="py-1">
                <div className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                  {summary?.obtainedMarks}
                  <span className="text-xl sm:text-2xl text-gray-400 font-normal">
                    {" "}
                    / {summary?.totalMarks}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-emerald-400 mt-1">
                  {summary?.percentage}% Overall Score
                </p>
              </div>

              {/* Statistics Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs max-w-xl mx-auto pt-1">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-emerald-400 font-medium flex items-center justify-center gap-1">
                    <CheckCircle2 size={13} /> Correct
                  </span>
                  <p className="text-base font-bold text-white">{summary?.correctAnswers}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-red-400 font-medium flex items-center justify-center gap-1">
                    <XCircle size={13} /> Incorrect
                  </span>
                  <p className="text-base font-bold text-white">{summary?.incorrectAnswers}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-gray-400 font-medium flex items-center justify-center gap-1">
                    <HelpCircle size={13} /> Skipped
                  </span>
                  <p className="text-base font-bold text-white">
                    {summary?.unattemptedQuestions}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-blue-400 font-medium flex items-center justify-center gap-1">
                    <Clock size={13} /> Time Spent
                  </span>
                  <p className="text-base font-bold text-white">
                    {Math.floor((summary?.timeTakenSeconds || 0) / 60)}m{" "}
                    {(summary?.timeTakenSeconds || 0) % 60}s
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Key & Explanations Review Section */}
            {isAnswerKeyVisible ? (
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <BookOpen size={16} className="text-slate-400" />
                  <h2 className="text-base font-semibold text-white">
                    Official Answer Key &amp; Explanations
                  </h2>
                </div>

                <div className="space-y-3">
                  {questionBreakdown.map((item: any, qIdx: number) => {
                    const isCorrect = item.isCorrect;
                    const isAttempted = item.selectedAnswer !== null;

                    return (
                      <div
                        key={item.questionId || qIdx}
                        className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                          isCorrect
                            ? "bg-emerald-500/[0.04] border-emerald-500/20"
                            : isAttempted
                            ? "bg-red-500/[0.04] border-red-500/20"
                            : "bg-[#0f172a]/70 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white text-xs">
                            Question {qIdx + 1}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                              isCorrect
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : isAttempted
                                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {isCorrect
                              ? `+${item.marksAwarded} Marks`
                              : isAttempted
                              ? `${item.marksAwarded} Marks`
                              : "Skipped"}
                          </span>
                        </div>

                        <p className="text-sm text-gray-100 font-medium leading-relaxed">
                          {item.questionText}
                        </p>

                        {/* Options breakdown */}
                        {item.options && item.options.length > 0 && (
                          <div className="space-y-1.5 pt-1">
                            {item.options.map((opt: string, optIdx: number) => {
                              const isStudentPick =
                                Array.isArray(item.selectedAnswer)
                                  ? item.selectedAnswer.includes(optIdx)
                                  : Number(item.selectedAnswer) === optIdx;
                              const isAnswerKey =
                                Array.isArray(item.correctAnswer)
                                  ? item.correctAnswer.includes(optIdx)
                                  : Number(item.correctAnswer) === optIdx;

                              return (
                                <div
                                  key={optIdx}
                                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                                    isAnswerKey
                                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-200 font-semibold"
                                      : isStudentPick
                                      ? "bg-red-500/15 border-red-500/40 text-red-200"
                                      : "bg-black/30 border-white/5 text-gray-400"
                                  }`}
                                >
                                  <span>
                                    <strong>{String.fromCharCode(65 + optIdx)}.</strong> {opt}
                                  </span>

                                  <div className="flex items-center gap-1.5">
                                    {isStudentPick && (
                                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white font-medium">
                                        Your Choice
                                      </span>
                                    )}
                                    {isAnswerKey && (
                                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                        Correct Answer Key
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* In-depth Explanation */}
                        {item.explanation && (
                          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-gray-300 space-y-1 mt-2">
                            <span className="font-bold text-blue-400 block">Explanation:</span>
                            <p className="leading-relaxed">{item.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#0f172a]/40 border border-slate-800 text-center space-y-2">
                <BookOpen size={24} className="text-gray-500 mx-auto" />
                <h3 className="text-white font-medium text-sm">Answer Key Restricted</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Detailed answer keys and explanations for this examination will be published by the instructor at a later stage.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

