"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Radio,
  Users,
  Clock,
  Wifi,
  WifiOff,
  AlertTriangle,
  RefreshCw,
  Plus,
  Send,
  CheckCircle2,
  Hourglass,
  ShieldAlert,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface StudentMonitorItem {
  attemptId: string;
  studentId: string;
  name: string;
  email: string;
  image?: string;
  status: string;
  startTime: string;
  endTime: string;
  remainingSeconds: number;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  reviewCount: number;
  lastActivePing: string;
  secondsSincePing: number;
  connectionStatus: "online" | "idle" | "offline";
  extraMinutes: number;
  score?: number;
  percentage?: number;
  tabSwitchCount?: number;
  fullscreenExitCount?: number;
  violationCount?: number;
}

export default function ExamLiveMonitorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<any>(null);
  const [stats, setStats] = useState<any>({
    totalStudents: 0,
    currentlyAttempting: 0,
    submitted: 0,
    connectionIssues: 0,
  });
  const [students, setStudents] = useState<StudentMonitorItem[]>([]);
  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Time Extension Modal
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [targetStudent, setTargetStudent] = useState<{ id: string; name: string } | null>(null);
  const [extendMinutes, setExtendMinutes] = useState(5);
  const [extendReason, setExtendReason] = useState("Connection issue / Extra time request");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchLiveData = async (silent = false) => {
    try {
      if (!silent) setIsRefreshing(true);
      const res = await fetch(`/api/admin/exams/${id}/monitor`);
      const data = await res.json();
      if (data.success) {
        setExam(data.exam);
        setStats(data.stats);
        setStudents(data.students || []);
      }
    } catch (e) {
      if (!silent) toast.error("Failed to load live monitor data");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
    // Auto-poll every 5 seconds for live real-time sync without page reload
    const interval = setInterval(() => {
      fetchLiveData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  // Handle Extend Time
  const handleExtendTime = async (applyToAll = false) => {
    try {
      setActionLoading(true);
      const payload: any = {
        extraMinutes: extendMinutes,
        reason: extendReason,
        applyToAll,
      };
      if (!applyToAll && targetStudent) {
        payload.studentId = targetStudent.id;
      }

      const res = await fetch(`/api/admin/exams/${id}/extend-time`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || `Added ${extendMinutes} minutes`);
        setExtendModalOpen(false);
        fetchLiveData(true);
      } else {
        toast.error(data.error || "Failed to extend time");
      }
    } catch {
      toast.error("Error extending time");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Force Submit
  const handleForceSubmit = async (attemptId: string, studentName: string) => {
    if (
      !confirm(
        `Are you sure you want to end and force-submit the test for ${studentName}? Their answers will be immediately evaluated.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/exams/${id}/force-submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Exam force-submitted for ${studentName}`);
        fetchLiveData(true);
      } else {
        toast.error(data.error || "Failed to submit");
      }
    } catch {
      toast.error("Error submitting exam");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
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
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Live Examination Monitor
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Auto-Syncing 5s
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {exam?.title || "Loading..."} • Total Questions: {exam?.totalQuestions || 0}
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTargetStudent(null);
              setExtendMinutes(5);
              setExtendModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Clock size={14} />
            <span>Extend Time for All (+Mins)</span>
          </button>

          <button
            onClick={() => fetchLiveData()}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs transition-all"
            title="Refresh monitor now"
          >
            <RefreshCw size={15} className={isRefreshing ? "animate-spin" : ""} />
          </button>

          <Link
            href={`/admin/exams/${id}/results`}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 text-xs font-semibold"
          >
            View Results
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <p className="text-xs text-gray-400 font-medium">Total Registered</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.totalStudents}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">Participating students</p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-xs text-indigo-400 font-medium">Currently Attempting</p>
          <p className="text-2xl font-bold text-indigo-300 mt-1">{stats.currentlyAttempting}</p>
          <p className="text-[11px] text-indigo-400/70 mt-0.5">Active on exam screen</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <p className="text-xs text-emerald-400 font-medium">Submitted / Finished</p>
          <p className="text-2xl font-bold text-emerald-300 mt-1">{stats.submitted}</p>
          <p className="text-[11px] text-emerald-400/70 mt-0.5">Evaluated</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <p className="text-xs text-amber-400 font-medium">Connection Disruptions</p>
          <p className="text-2xl font-bold text-amber-300 mt-1">{stats.connectionIssues}</p>
          <p className="text-[11px] text-amber-400/70 mt-0.5">Ping &gt; 90s ago</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white/[0.02] border border-white/10 p-3 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <span className="text-xs text-gray-400">
          Showing {filteredStudents.length} of {students.length} students
        </span>
      </div>

      {/* Student List Table */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">
          Loading live student activity...
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/10 p-8 space-y-2">
          <Users size={32} className="text-gray-500 mx-auto" />
          <h3 className="text-white font-semibold text-base">No active students</h3>
          <p className="text-gray-400 text-xs">
            When students start attempting this examination, their live progress, timer, and connection status will stream here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-white/5 border-b border-white/10 text-[11px] uppercase tracking-wider text-gray-400">
              <tr>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Connection</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Time Left</th>
                <th className="py-3 px-4">Proctoring Alerts</th>
                <th className="py-3 px-4">Last Activity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.map((s) => {
                const isOnline = s.connectionStatus === "online";
                const isIdle = s.connectionStatus === "idle";
                const isSubmitted = s.status === "submitted" || s.status === "evaluated";

                const minsLeft = Math.floor(s.remainingSeconds / 60);
                const secsLeft = s.remainingSeconds % 60;

                return (
                  <tr key={s.attemptId} className="hover:bg-white/[0.02] transition-colors">
                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {s.name[0] || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{s.name}</p>
                          <p className="text-[11px] text-gray-400">{s.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {isSubmitted ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          SUBMITTED
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 animate-pulse">
                          ATTEMPTING
                        </span>
                      )}
                    </td>

                    {/* Connection */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {isOnline ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            <span className="text-emerald-400 font-medium">Online</span>
                          </>
                        ) : isIdle ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-amber-400" />
                            <span className="text-amber-400">Idle ({s.secondsSincePing}s)</span>
                          </>
                        ) : (
                          <>
                            <span className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
                            <span className="text-red-400 font-semibold">Offline</span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Progress */}
                    <td className="py-3 px-4">
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-white font-medium">
                            {s.answeredCount} / {s.totalQuestions}
                          </span>
                          <span className="text-gray-500">
                            {Math.round((s.answeredCount / (s.totalQuestions || 1)) * 100)}%
                          </span>
                        </div>
                        <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((s.answeredCount / (s.totalQuestions || 1)) * 100)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Remaining Time */}
                    <td className="py-3 px-4">
                      {isSubmitted ? (
                        <span className="text-gray-500">Done</span>
                      ) : (
                        <span
                          className={`font-mono font-bold ${
                            s.remainingSeconds < 300 ? "text-red-400 animate-pulse" : "text-white"
                          }`}
                        >
                          {String(minsLeft).padStart(2, "0")}:{String(secsLeft).padStart(2, "0")}
                        </span>
                      )}
                    </td>

                    {/* Proctoring Alerts */}
                    <td className="py-3 px-4">
                      {(s.tabSwitchCount && s.tabSwitchCount > 0) || (s.fullscreenExitCount && s.fullscreenExitCount > 0) ? (
                        <div className="flex flex-col gap-1 items-start">
                          {s.tabSwitchCount && s.tabSwitchCount > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              <AlertTriangle size={11} className="text-rose-400" />
                              {s.tabSwitchCount} Tab {s.tabSwitchCount === 1 ? "Switch" : "Switches"}
                            </span>
                          ) : null}
                          {s.fullscreenExitCount && s.fullscreenExitCount > 0 ? (
                            <span className="text-[10px] text-amber-400 font-medium">
                              {s.fullscreenExitCount} Exit Fullscreen
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 size={11} className="text-emerald-400" /> Clean
                        </span>
                      )}
                    </td>

                    {/* Last Activity */}
                    <td className="py-3 px-4 text-[11px] text-gray-400">
                      {s.secondsSincePing < 10
                        ? "Just now"
                        : `${s.secondsSincePing}s ago`}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isSubmitted && (
                          <>
                            <button
                              onClick={() => {
                                setTargetStudent({ id: s.studentId, name: s.name });
                                setExtendMinutes(5);
                                setExtendModalOpen(true);
                              }}
                              className="px-2 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-[11px] font-medium"
                              title="Extend examination time for this student"
                            >
                              +Time
                            </button>
                            <button
                              onClick={() => handleForceSubmit(s.attemptId, s.name)}
                              className="px-2 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[11px] font-medium"
                              title="Force submit student's examination"
                            >
                              End Test
                            </button>
                          </>
                        )}
                        {isSubmitted && (
                          <span className="text-emerald-400 font-semibold text-[11px]">
                            Score: {s.score} ({s.percentage}%)
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= EXTEND TIME MODAL ================= */}
      {extendModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Clock size={18} className="text-purple-400" />
              <h3 className="text-base font-bold text-white">
                {targetStudent ? `Extend Time for ${targetStudent.name}` : "Extend Time for ALL Active Students"}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  Extra Minutes to Grant
                </label>
                <div className="flex items-center gap-2">
                  {[5, 10, 15, 20].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setExtendMinutes(m)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${
                        extendMinutes === m
                          ? "bg-purple-600 text-white border-purple-500"
                          : "bg-white/5 border-white/10 text-gray-300 hover:text-white"
                      }`}
                    >
                      +{m}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">
                  Reason for Extension
                </label>
                <input
                  type="text"
                  value={extendReason}
                  onChange={(e) => setExtendReason(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setExtendModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleExtendTime(!targetStudent)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
              >
                {actionLoading ? "Granting..." : `Grant +${extendMinutes} Minutes`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

