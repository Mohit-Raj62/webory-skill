"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Plus,
  Search,
  Clock,
  FileText,
  Eye,
  EyeOff,
  Radio,
  Users,
  BarChart3,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

interface ExamItem {
  _id: string;
  title: string;
  subject: string;
  topic?: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  passingPercentage: number;
  status: "draft" | "hidden" | "scheduled" | "live" | "completed" | "archived";
  resultVisibility: string;
  answerKeyVisibility: string;
  resultsPublished: boolean;
  answerKeyPublished: boolean;
  submissionsCount?: number;
  activeAttemptingCount?: number;
  isSynchronizedSlot?: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export default function AdminExamsPage() {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [examsEnabled, setExamsEnabled] = useState(false);
  const [togglingVisibility, setTogglingVisibility] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.examsEnabled !== undefined) {
          setExamsEnabled(Boolean(data.examsEnabled));
        }
      })
      .catch((err) => console.error("Failed to load settings in admin exams", err));
  }, []);

  const handleToggleExamsVisibility = async () => {
    try {
      setTogglingVisibility(true);
      const nextVal = !examsEnabled;
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "examsEnabled",
          value: nextVal,
        }),
      });

      if (res.ok) {
        setExamsEnabled(nextVal);
        toast.success(
          nextVal
            ? "Exams are now VISIBLE to users in Navbar & Menus!"
            : "Exams are now HIDDEN from public Navbar & Menus!"
        );
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.error || "Failed to update visibility");
      }
    } catch {
      toast.error("Network error updating visibility");
    } finally {
      setTogglingVisibility(false);
    }
  };

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/exams?search=${encodeURIComponent(search)}&status=${statusFilter}`
      );
      const data = await res.json();
      if (data.success) {
        setExams(data.exams || []);
      } else {
        toast.error(data.error || "Failed to load exams");
      }
    } catch (err: any) {
      toast.error("Failed to fetch exams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchExams();
  };

  const handleToggleStatus = async (exam: ExamItem, newStatus: string) => {
    try {
      setActionLoadingId(exam._id);
      const res = await fetch(`/api/admin/exams/${exam._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Exam is now ${newStatus.toUpperCase()}`);
        setExams((prev) =>
          prev.map((e) => (e._id === exam._id ? { ...e, status: newStatus as any } : e))
        );
      } else {
        toast.error(data.error || "Failed to update status");
      }
    } catch {
      toast.error("Error changing status");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (examId: string) => {
    try {
      setActionLoadingId(examId);
      const res = await fetch(`/api/admin/exams/${examId}/duplicate`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Examination duplicated in Hidden mode");
        fetchExams();
      } else {
        toast.error(data.error || "Failed to duplicate");
      }
    } catch {
      toast.error("Duplicate failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (examId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" and all associated student attempts?`)) {
      return;
    }
    try {
      setActionLoadingId(examId);
      const res = await fetch(`/api/admin/exams/${examId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Exam deleted successfully");
        setExams((prev) => prev.filter((e) => e._id !== examId));
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch {
      toast.error("Delete failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Metrics
  const totalExams = exams.length;
  const liveExams = exams.filter((e) => e.status === "live").length;
  const hiddenDraftExams = exams.filter((e) => e.status === "hidden" || e.status === "draft").length;
  const totalSubmissions = exams.reduce((acc, curr) => acc + (curr.submissionsCount || 0), 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <CheckSquare size={22} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Examination Management
            </h1>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Create, schedule, monitor live tests, generate AI questions, and control results & answer keys.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/question-bank"
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white text-sm font-medium transition-all flex items-center gap-2"
          >
            <BookOpen size={16} />
            <span>Question Bank</span>
          </Link>
          <Link
            href="/admin/exams/new"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus size={18} />
            <span>Create Examination</span>
          </Link>
        </div>
      </div>

      {/* Public Visibility Quick Toggle Bar */}
      <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ${
        examsEnabled 
          ? "bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-transparent border-emerald-500/30 shadow-emerald-500/5"
          : "bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-transparent border-amber-500/30 shadow-amber-500/5"
      }`}>
        <div className="flex items-center gap-3.5 min-w-0">
          <div className={`p-2.5 rounded-xl border shrink-0 ${
            examsEnabled ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" : "bg-amber-500/20 border-amber-500/40 text-amber-400"
          }`}>
            {examsEnabled ? <Eye size={22} /> : <EyeOff size={22} />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-bold text-sm text-white">Public Visibility for Students:</span>
              <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                examsEnabled 
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                  : "bg-amber-500/20 text-amber-300 border-amber-500/40"
              }`}>
                {examsEnabled ? "● VISIBLE IN NAVBAR & MENU" : "○ HIDDEN FROM PUBLIC MENUS"}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              {examsEnabled 
                ? "Students can see the 'Exams' link in the top Navbar, mobile drawer, and Explore Menu. Turn off to hide."
                : "The Exams link is currently HIDDEN from navigation & menus for all normal users. Turn on when an exam is active."}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleExamsVisibility}
          disabled={togglingVisibility}
          className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 ${
            examsEnabled
              ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 active:scale-95"
              : "bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold shadow-lg shadow-emerald-500/25 active:scale-95"
          }`}
        >
          {togglingVisibility ? (
            <span className="animate-pulse">Updating...</span>
          ) : examsEnabled ? (
            <>
              <EyeOff size={15} />
              <span>Hide Exams from Menu</span>
            </>
          ) : (
            <>
              <Eye size={15} />
              <span>Show Exams to Users</span>
            </>
          )}
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <p className="text-xs text-gray-400 font-medium">Total Examinations</p>
          <p className="text-2xl font-bold text-white mt-1">{totalExams}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Created across subjects</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
          <div className="flex items-center justify-between">
            <p className="text-xs text-emerald-400 font-medium">Live Exams Now</p>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-2xl font-bold text-emerald-300 mt-1">{liveExams}</p>
          <p className="text-[11px] text-emerald-400/70 mt-0.5">Visible to students</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
          <p className="text-xs text-amber-400 font-medium">Hidden / Draft</p>
          <p className="text-2xl font-bold text-amber-300 mt-1">{hiddenDraftExams}</p>
          <p className="text-[11px] text-amber-400/70 mt-0.5">Under review / preparation</p>
        </div>

        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
          <p className="text-xs text-blue-400 font-medium">Total Submissions</p>
          <p className="text-2xl font-bold text-blue-300 mt-1">{totalSubmissions}</p>
          <p className="text-[11px] text-blue-400/70 mt-0.5">Completed attempts</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white/[0.02] border border-white/10 p-3 rounded-2xl">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Statuses" },
            { id: "live", label: "🟢 Live" },
            { id: "hidden", label: "🔒 Hidden" },
            { id: "draft", label: "📝 Draft" },
            { id: "scheduled", label: "⏳ Scheduled" },
            { id: "completed", label: "🏁 Completed" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search exam title, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </form>
      </div>

      {/* Exams List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading examinations...</p>
        </div>
      ) : exams.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-500">
            <CheckSquare size={28} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">No examinations found</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mt-1">
              {search || statusFilter !== "all"
                ? "Try adjusting your search query or status filter."
                : "Get started by creating your first online examination with AI questions or question bank."}
            </p>
          </div>
          <Link
            href="/admin/exams/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all"
          >
            <Plus size={16} />
            <span>Create New Exam</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {exams.map((exam) => {
            const isLive = exam.status === "live";
            const isHidden = exam.status === "hidden";
            const isLoading = actionLoadingId === exam._id;

            return (
              <div
                key={exam._id}
                className={`p-5 rounded-2xl bg-white/[0.03] border transition-all hover:border-white/20 ${
                  isLive
                    ? "border-emerald-500/30 hover:border-emerald-500/50 shadow-sm shadow-emerald-500/5"
                    : isHidden
                    ? "border-amber-500/20"
                    : "border-white/10"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Info & Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1 ${
                          isLive
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : isHidden
                            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            : exam.status === "draft"
                            ? "bg-gray-500/15 text-gray-400 border-gray-500/30"
                            : exam.status === "scheduled"
                            ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                            : "bg-purple-500/15 text-purple-400 border-purple-500/30"
                        }`}
                      >
                        {isLive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                        {exam.status}
                      </span>

                      {/* Subject Tag */}
                      {exam.subject && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300">
                          {exam.subject}
                        </span>
                      )}

                      {/* Active Attempting Count */}
                      {(exam.activeAttemptingCount || 0) > 0 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 animate-pulse">
                          <Users size={11} />
                          {exam.activeAttemptingCount} attempting now
                        </span>
                      )}

                      {/* Live Sync Slot Badge */}
                      {exam.isSynchronizedSlot && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-semibold">
                          <Clock size={11} />
                          Live Sync Slot {exam.startDate ? `(${new Date(exam.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})` : ""}
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {exam.title}
                    </h2>

                    {/* Metadata pills */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-500" />
                        <span>{exam.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText size={14} className="text-gray-500" />
                        <span>{exam.totalQuestions} Questions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-gray-500" />
                        <span>{exam.totalMarks} Marks (Pass: {exam.passingPercentage}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-blue-400">
                        <Users size={14} />
                        <span>{exam.submissionsCount || 0} Submissions</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/10">
                    {/* Live / Hide Quick Toggle Button */}
                    {isLive ? (
                      <button
                        onClick={() => handleToggleStatus(exam, "hidden")}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all flex items-center gap-1.5"
                        title="Hide examination from students"
                      >
                        <EyeOff size={14} />
                        <span>Hide Exam</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(exam, "live")}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
                        title="Make examination live for students"
                      >
                        <Eye size={14} />
                        <span>Make Live</span>
                      </button>
                    )}

                    {/* Live Monitor */}
                    <Link
                      href={`/admin/exams/${exam._id}/monitor`}
                      className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-medium transition-all flex items-center gap-1.5"
                    >
                      <Radio size={14} className="animate-pulse" />
                      <span>Monitor Live</span>
                    </Link>

                    {/* Results & Analytics */}
                    <Link
                      href={`/admin/exams/${exam._id}/results`}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-medium transition-all flex items-center gap-1.5"
                    >
                      <BarChart3 size={14} />
                      <span>Results ({exam.submissionsCount || 0})</span>
                    </Link>

                    {/* Edit Exam */}
                    <Link
                      href={`/admin/exams/${exam._id}/edit`}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
                      title="Edit examination settings & questions"
                    >
                      <Edit size={15} />
                    </Link>

                    {/* Duplicate Exam */}
                    <button
                      onClick={() => handleDuplicate(exam._id)}
                      disabled={isLoading}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-all"
                      title="Duplicate examination"
                    >
                      <Copy size={15} />
                    </button>

                    {/* Delete Exam */}
                    <button
                      onClick={() => handleDelete(exam._id, exam.title)}
                      disabled={isLoading}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                      title="Delete examination"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Sub-bar: Visibility flags */}
                <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500">
                  <div className="flex items-center gap-3">
                    <span>
                      Results:{" "}
                      <strong className={exam.resultsPublished ? "text-emerald-400" : "text-gray-400"}>
                        {exam.resultsPublished ? "Published" : exam.resultVisibility === "immediate" ? "Immediate" : "Manual / Hidden"}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Answer Key:{" "}
                      <strong className={exam.answerKeyPublished ? "text-emerald-400" : "text-gray-400"}>
                        {exam.answerKeyPublished ? "Published" : exam.answerKeyVisibility}
                      </strong>
                    </span>
                  </div>

                  <Link
                    href={`/exams/${exam._id}`}
                    target="_blank"
                    className="text-gray-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
                  >
                    <span>Preview Student View</span>
                    <ExternalLink size={11} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

