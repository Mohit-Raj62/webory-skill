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
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black border border-white/10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <FileCheck size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Examination Submitted Successfully!
            </h1>
            <p className="text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
              Your test answers have been saved and registered on the server. The instructor has configured this examination to release scores manually after authorized review.
            </p>
            <div className="pt-4">
              <Link
                href="/exams"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 inline-block"
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
              className={`p-6 sm:p-8 rounded-3xl border text-center space-y-6 ${
                summary?.passed
                  ? "bg-gradient-to-b from-emerald-950/40 via-[#07131b] to-black border-emerald-500/30"
                  : "bg-gradient-to-b from-red-950/40 via-[#190909] to-black border-red-500/30"
              }`}
            >
              <div className="space-y-2">
                <span
                  className={`text-[11px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${
                    summary?.passed
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                      : "bg-red-500/15 text-red-300 border-red-500/40"
                  }`}
                >
                  {summary?.passed ? "🎉 Congratulations • PASSED" : "Needs Improvement • FAILED"}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white pt-1">
                  {examTitle}
                </h1>
              </div>

              {/* Score Number Display */}
              <div className="py-2">
                <div className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                  {summary?.obtainedMarks}
                  <span className="text-2xl sm:text-3xl text-gray-400 font-normal">
                    {" "}
                    / {summary?.totalMarks}
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-emerald-400 mt-1">
                  {summary?.percentage}% Overall Score
                </p>
              </div>

              {/* Statistics Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs max-w-2xl mx-auto pt-2">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 size={13} /> Correct
                  </span>
                  <p className="text-base font-bold text-white">{summary?.correctAnswers}</p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-red-400 font-semibold flex items-center justify-center gap-1">
                    <XCircle size={13} /> Incorrect
                  </span>
                  <p className="text-base font-bold text-white">{summary?.incorrectAnswers}</p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-gray-400 font-semibold flex items-center justify-center gap-1">
                    <HelpCircle size={13} /> Skipped
                  </span>
                  <p className="text-base font-bold text-white">
                    {summary?.unattemptedQuestions}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-blue-400 font-semibold flex items-center justify-center gap-1">
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
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <BookOpen size={18} className="text-blue-400" />
                  <h2 className="text-lg font-bold text-white">
                    Official Answer Key &amp; Explanations
                  </h2>
                </div>

                <div className="space-y-4">
                  {questionBreakdown.map((item: any, qIdx: number) => {
                    const isCorrect = item.isCorrect;
                    const isAttempted = item.selectedAnswer !== null;

                    return (
                      <div
                        key={item.questionId || qIdx}
                        className={`p-5 rounded-2xl border text-xs space-y-3 ${
                          isCorrect
                            ? "bg-emerald-500/[0.04] border-emerald-500/25"
                            : isAttempted
                            ? "bg-red-500/[0.04] border-red-500/25"
                            : "bg-white/[0.02] border-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-sm">
                            Question {qIdx + 1}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isCorrect
                                ? "bg-emerald-500/20 text-emerald-400"
                                : isAttempted
                                ? "bg-red-500/20 text-red-400"
                                : "bg-gray-500/20 text-gray-400"
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
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-2">
                <BookOpen size={24} className="text-gray-500 mx-auto" />
                <h3 className="text-white font-semibold text-sm">Answer Key Restricted</h3>
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

