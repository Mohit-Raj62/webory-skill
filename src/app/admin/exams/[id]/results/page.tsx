"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Download,
  Search,
  Eye,
  EyeOff,
  Trophy,
  CheckCircle,
  XCircle,
  HelpCircle,
  Edit3,
  ChevronRight,
  ShieldCheck,
  CheckSquare,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function ExamResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>({
    totalSubmissions: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0,
    passedCount: 0,
    failedCount: 0,
    passPercentage: 0,
  });
  const [attempts, setAttempts] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [questionAnalytics, setQuestionAnalytics] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"submissions" | "leaderboard" | "analytics">("submissions");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Publishing toggles
  const [resultsPublished, setResultsPublished] = useState(false);
  const [answerKeyPublished, setAnswerKeyPublished] = useState(false);
  const [explanationVisibility, setExplanationVisibility] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);

  // Student Report Inspection Modal
  const [selectedAttempt, setSelectedAttempt] = useState<any | null>(null);

  // Manual adjustment modal
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustAttempt, setAdjustAttempt] = useState<any | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(1);
  const [adjustReason, setAdjustReason] = useState("Grace marks / Review discrepancy");
  const [adjustLoading, setAdjustLoading] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/exams/${id}/results?search=${encodeURIComponent(search)}&status=${statusFilter}`
      );
      const data = await res.json();
      if (data.success) {
        setExam(data.exam);
        setAnalytics(data.analytics);
        setAttempts(data.attempts || []);
        setLeaderboard(data.leaderboard || []);
        setQuestionAnalytics(data.questionAnalytics || []);
        setResultsPublished(Boolean(data.exam?.resultsPublished));
        setAnswerKeyPublished(Boolean(data.exam?.answerKeyPublished));
        setExplanationVisibility(Boolean(data.exam?.explanationVisibility));
      } else {
        toast.error(data.error || "Failed to load results");
      }
    } catch {
      toast.error("Error fetching examination results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [id, statusFilter]);

  // Handle Visibility Switch
  const handleTogglePublish = async (
    field: "resultsPublished" | "answerKeyPublished" | "explanationVisibility",
    value: boolean
  ) => {
    try {
      setToggleLoading(true);
      const res = await fetch(`/api/admin/exams/${id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await res.json();
      if (data.success) {
        if (field === "resultsPublished") setResultsPublished(value);
        if (field === "answerKeyPublished") setAnswerKeyPublished(value);
        if (field === "explanationVisibility") setExplanationVisibility(value);
        toast.success(
          value ? `${field} published to students!` : `${field} hidden from students!`
        );
      } else {
        toast.error(data.error || "Failed to update visibility");
      }
    } catch {
      toast.error("Error updating permissions");
    } finally {
      setToggleLoading(false);
    }
  };

  // Handle Manual Marks Adjustment
  const handleSaveAdjustment = async () => {
    if (!adjustAttempt) return;
    try {
      setAdjustLoading(true);
      const res = await fetch(`/api/admin/exams/${id}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: adjustAttempt._id,
          adjustmentAmount,
          reason: adjustReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Marks adjusted successfully");
        setAdjustModalOpen(false);
        fetchResults();
      } else {
        toast.error(data.error || "Failed to adjust marks");
      }
    } catch {
      toast.error("Error adjusting marks");
    } finally {
      setAdjustLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (attempts.length === 0) {
      toast.error("No submissions to export");
      return;
    }

    const headers = [
      "Student Name",
      "Email",
      "Marks Obtained",
      "Total Marks",
      "Percentage",
      "Result Status",
      "Time Taken (seconds)",
      "Submission Date",
    ];

    const rows = attempts.map((att) => [
      `"${att.studentId?.firstName || ""} ${att.studentId?.lastName || ""}"`,
      `"${att.studentId?.email || ""}"`,
      att.evaluation?.obtainedMarks || 0,
      exam?.totalMarks || 0,
      `${att.evaluation?.percentage || 0}%`,
      att.evaluation?.passed ? "PASSED" : "FAILED",
      att.evaluation?.timeTakenSeconds || 0,
      new Date(att.submittedAt).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exam?.title || "Exam"}_Results.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Results exported to CSV successfully");
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/exams"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <BarChart3 size={18} />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Results & Performance Analytics
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {exam?.title || "Loading..."} • Passing: {exam?.passingMarks} marks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <FileSpreadsheet size={15} />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Admin Visibility Permission Controls Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-black border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-400" />
            <span>Student Visibility Controls</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Admin can keep scores or answer keys hidden until ready, or publish them with one click.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Results Published Switch */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-xs text-gray-300 font-medium">Publish Results:</span>
            <button
              onClick={() => handleTogglePublish("resultsPublished", !resultsPublished)}
              disabled={toggleLoading}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                resultsPublished
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-gray-800 text-gray-400 border border-white/10"
              }`}
            >
              {resultsPublished ? "🟢 Published" : "🔒 Hidden"}
            </button>
          </div>

          {/* Answer Key Published Switch */}
          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-xs text-gray-300 font-medium">Publish Answer Key:</span>
            <button
              onClick={() => handleTogglePublish("answerKeyPublished", !answerKeyPublished)}
              disabled={toggleLoading}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                answerKeyPublished
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-gray-800 text-gray-400 border border-white/10"
              }`}
            >
              {answerKeyPublished ? "🟢 Published" : "🔒 Hidden"}
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <p className="text-xs text-gray-400 font-medium">Submissions</p>
          <p className="text-2xl font-bold text-white mt-1">{analytics.totalSubmissions}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Students evaluated</p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
          <p className="text-xs text-blue-400 font-medium">Average Score</p>
          <p className="text-2xl font-bold text-blue-300 mt-1">{analytics.averageScore}</p>
          <p className="text-[11px] text-blue-400/70 mt-0.5">Out of {exam?.totalMarks || 0}</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
          <p className="text-xs text-emerald-400 font-medium">Highest Score</p>
          <p className="text-2xl font-bold text-emerald-300 mt-1">{analytics.highestScore}</p>
          <p className="text-[11px] text-emerald-400/70 mt-0.5">Top student mark</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <p className="text-xs text-amber-400 font-medium">Lowest Score</p>
          <p className="text-2xl font-bold text-amber-300 mt-1">{analytics.lowestScore}</p>
          <p className="text-[11px] text-amber-400/70 mt-0.5">Lowest mark recorded</p>
        </div>

        <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20">
          <p className="text-xs text-purple-400 font-medium">Pass Percentage</p>
          <p className="text-2xl font-bold text-purple-300 mt-1">{analytics.passPercentage}%</p>
          <p className="text-[11px] text-purple-400/70 mt-0.5">
            {analytics.passedCount} Passed / {analytics.failedCount} Failed
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-1">
        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "submissions"
              ? "bg-white/10 text-white border border-white/20"
              : "text-gray-400 hover:text-white"
          }`}
        >
          All Submissions ({attempts.length})
        </button>

        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === "leaderboard"
              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
              : "text-gray-400 hover:text-white"
          }`}
        >
          <Trophy size={14} className="text-amber-400" />
          <span>Leaderboard & Ranking</span>
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "analytics"
              ? "bg-white/10 text-white border border-white/20"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Question Accuracy Analytics
        </button>
      </div>

      {/* SUBMISSIONS TAB */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02] border border-white/10 p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  statusFilter === "all" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("passed")}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  statusFilter === "passed"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Passed
              </button>
              <button
                onClick={() => setStatusFilter("failed")}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  statusFilter === "failed"
                    ? "bg-red-500/20 text-red-300"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Failed
              </button>
            </div>

            <div className="relative min-w-[240px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400 text-sm">Loading submissions...</div>
          ) : attempts.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 p-8 space-y-2">
              <p className="text-white font-semibold text-base">No submissions found</p>
              <p className="text-gray-400 text-xs">
                As soon as students complete and submit this examination, their evaluations will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
              <table className="w-full text-left text-xs text-gray-300">
                <thead className="bg-white/5 border-b border-white/10 text-[11px] uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Score</th>
                    <th className="py-3 px-4">Percentage</th>
                    <th className="py-3 px-4">Result</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4">Time Taken</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {attempts.map((att) => {
                    const student = att.studentId || {};
                    const name = `${student.firstName || "Student"} ${student.lastName || ""}`.trim();
                    const evalData = att.evaluation || {};
                    const isPassed = evalData.passed;

                    return (
                      <tr key={att._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-semibold text-white">{name}</p>
                          <p className="text-[11px] text-gray-400">{student.email}</p>
                        </td>

                        <td className="py-3 px-4 font-bold text-white">
                          {evalData.obtainedMarks} / {evalData.totalMarks}
                        </td>

                        <td className="py-3 px-4 font-mono font-medium text-white">
                          {evalData.percentage}%
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              isPassed
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-red-500/15 text-red-400 border-red-500/30"
                            }`}
                          >
                            {isPassed ? "PASSED" : "FAILED"}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-[11px] text-gray-400">
                          {evalData.correctAnswers} Correct, {evalData.incorrectAnswers} Wrong
                        </td>

                        <td className="py-3 px-4 text-[11px] text-gray-400">
                          {Math.floor((evalData.timeTakenSeconds || 0) / 60)}m{" "}
                          {(evalData.timeTakenSeconds || 0) % 60}s
                        </td>

                        <td className="py-3 px-4 text-[11px] text-gray-400">
                          {new Date(att.submittedAt).toLocaleDateString()}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedAttempt(att)}
                              className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-[11px] font-semibold"
                            >
                              Review Answers
                            </button>
                            <button
                              onClick={() => {
                                setAdjustAttempt(att);
                                setAdjustmentAmount(1);
                                setAdjustModalOpen(true);
                              }}
                              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                              title="Adjust marks manually"
                            >
                              <Edit3 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* LEADERBOARD TAB */}
      {activeTab === "leaderboard" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Trophy size={16} className="text-amber-400" />
              <span>Official Examination Leaderboard</span>
            </h3>

            <div className="space-y-2">
              {leaderboard.map((item) => (
                <div
                  key={item.rank}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    item.rank === 1
                      ? "bg-amber-500/10 border-amber-500/30 text-white"
                      : item.rank === 2
                      ? "bg-slate-400/10 border-slate-400/30 text-white"
                      : item.rank === 3
                      ? "bg-amber-700/10 border-amber-700/30 text-white"
                      : "bg-white/[0.01] border-white/5 text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        item.rank === 1
                          ? "bg-amber-400 text-black shadow-md shadow-amber-400/30"
                          : item.rank === 2
                          ? "bg-gray-300 text-black"
                          : item.rank === 3
                          ? "bg-amber-600 text-white"
                          : "bg-white/5 text-gray-400"
                      }`}
                    >
                      {item.rank}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-xs">{item.name}</p>
                      <p className="text-[11px] text-gray-400">{item.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs text-right">
                    <div>
                      <p className="font-bold text-white text-sm">
                        {item.score} / {item.totalMarks}
                      </p>
                      <p className="text-[11px] text-gray-400">{item.percentage}%</p>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      <span>
                        {Math.floor(item.timeTakenSeconds / 60)}m {item.timeTakenSeconds % 60}s
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QUESTION ACCURACY ANALYTICS TAB */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-white">Question-wise Accuracy Rate</h3>
            <p className="text-xs text-gray-400">
              Identify which questions students found difficult or easy to refine your curriculum.
            </p>

            <div className="space-y-3 pt-2">
              {questionAnalytics.map((qa, idx) => (
                <div
                  key={qa.questionId}
                  className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-white">
                      Q{idx + 1}. {qa.questionText}
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-white/10 text-gray-300">
                      {qa.difficulty}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-400">
                        Accuracy: {qa.accuracyRate}% ({qa.correctCount} correct)
                      </span>
                      <span className="text-gray-500">{qa.marks} Mark(s)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          qa.accuracyRate >= 70
                            ? "bg-emerald-500"
                            : qa.accuracyRate >= 40
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${qa.accuracyRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= STUDENT REVIEW MODAL ================= */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div>
                <h3 className="text-base font-bold text-white">
                  Student Assessment Review: {selectedAttempt.studentId?.firstName}{" "}
                  {selectedAttempt.studentId?.lastName}
                </h3>
                <p className="text-xs text-gray-400">
                  Score: {selectedAttempt.evaluation?.obtainedMarks} /{" "}
                  {selectedAttempt.evaluation?.totalMarks} ({selectedAttempt.evaluation?.percentage}%)
                </p>
              </div>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {(selectedAttempt.evaluation?.questionBreakdown || []).map(
                (qb: any, qIdx: number) => {
                  const isCorrect = qb.isCorrect;
                  const isAttempted = qb.selectedAnswer !== null;

                  return (
                    <div
                      key={qb.questionId || qIdx}
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        isCorrect
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : isAttempted
                          ? "bg-red-500/5 border-red-500/30"
                          : "bg-white/[0.02] border-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">
                          Question {qIdx + 1} ({qb.marksAwarded} Marks)
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
                          {isCorrect ? "CORRECT" : isAttempted ? "INCORRECT" : "NOT ATTEMPTED"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-200 font-medium">{qb.questionText}</p>

                      {qb.options && qb.options.length > 0 && (
                        <div className="space-y-1 pt-1">
                          {qb.options.map((opt: string, optIdx: number) => {
                            const isStudentPick =
                              Array.isArray(qb.selectedAnswer)
                                ? qb.selectedAnswer.includes(optIdx)
                                : Number(qb.selectedAnswer) === optIdx;
                            const isAnswerKey =
                              Array.isArray(qb.correctAnswer)
                                ? qb.correctAnswer.includes(optIdx)
                                : Number(qb.correctAnswer) === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`p-2 rounded-lg border flex items-center justify-between ${
                                  isAnswerKey
                                    ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold"
                                    : isStudentPick
                                    ? "bg-red-500/10 border-red-500/40 text-red-300"
                                    : "bg-black/20 border-white/5 text-gray-400"
                                }`}
                              >
                                <span>
                                  {String.fromCharCode(65 + optIdx)}. {opt}
                                </span>
                                {isStudentPick && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-white">
                                    Student Choice
                                  </span>
                                )}
                                {isAnswerKey && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                    Correct Answer
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {qb.explanation && (
                        <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-[11px] text-gray-400 mt-2">
                          <strong className="text-gray-300">Explanation:</strong> {qb.explanation}
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>

            <div className="p-4 border-t border-white/10 flex justify-end bg-black/40">
              <button
                type="button"
                onClick={() => setSelectedAttempt(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADJUST MARKS MODAL ================= */}
      {adjustModalOpen && adjustAttempt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Adjust Marks for {adjustAttempt.studentId?.firstName}
            </h3>
            <p className="text-xs text-gray-400">
              Current Marks: <strong>{adjustAttempt.evaluation?.obtainedMarks}</strong> /{" "}
              {exam?.totalMarks}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  Marks to Add / Deduct (e.g. +1 or -2)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  Audit Reason for Adjustment
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setAdjustModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={adjustLoading}
                onClick={handleSaveAdjustment}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                {adjustLoading ? "Saving..." : "Apply Adjustment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

