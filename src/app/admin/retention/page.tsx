"use client";

import { useState, useEffect } from "react";
import {
  Users,
  AlertTriangle,
  MessageSquare,
  Mail,
  RefreshCw,
  Search,
  BookOpen,
  Clock,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface AtRiskStudent {
  enrollmentId: string;
  studentId: string;
  name: string;
  email: string;
  phone?: string;
  courseTitle: string;
  progress: number;
  daysInactive: number;
  enrolledAt: string;
  whatsappUrl?: string;
  mailtoUrl?: string;
}

export default function AdminRetentionPage() {
  const [students, setStudents] = useState<AtRiskStudent[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "zero" | "inactive14">("all");
  const [search, setSearch] = useState("");

  const fetchRetentionData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/retention");
      const data = await res.json();
      if (data.success) {
        setStudents(data.students || []);
        setStats(data.stats || {});
      } else {
        toast.error(data.error || "Failed to load retention data");
      }
    } catch {
      toast.error("Network error loading retention data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetentionData();
  }, []);

  const filteredStudents = students.filter((s) => {
    if (filter === "zero" && s.progress > 0) return false;
    if (filter === "inactive14" && s.daysInactive < 14) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.courseTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/30 rounded-2xl">
              <AlertTriangle className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  Student Dropout & Retention Radar
                </h1>
                <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Engagement Booster
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-0.5">
                Detect inactive students and stalled course progress to send instant WhatsApp / Email nudges
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchRetentionData}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-4 py-2.5 rounded-xl transition-colors font-medium self-start md:self-auto"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Radar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Total Students Needing Nudge
              </p>
              <h3 className="text-3xl font-black text-amber-400 mt-1">
                {stats.totalAtRisk || 0}
              </h3>
              <p className="text-xs text-amber-300/80 mt-1">Enrolled 7+ days ago with slow progress</p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-rose-500/10 to-red-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Stuck at 0% Progress
              </p>
              <h3 className="text-3xl font-black text-rose-400 mt-1">
                {stats.zeroProgressCount || 0}
              </h3>
              <p className="text-xs text-rose-300/80 mt-1">Haven&apos;t started lecture 1 yet</p>
            </div>
            <div className="p-3 bg-rose-500/20 rounded-xl text-rose-400">
              <BookOpen size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-indigo-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Inactive for 14+ Days
              </p>
              <h3 className="text-3xl font-black text-purple-400 mt-1">
                {stats.inactive14DaysCount || 0}
              </h3>
              <p className="text-xs text-purple-300/80 mt-1">High risk of dropping out</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setFilter("all")}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
              filter === "all"
                ? "bg-white text-black shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            All Students ({students.length})
          </button>
          <button
            onClick={() => setFilter("zero")}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
              filter === "zero"
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            0% Progress ({stats.zeroProgressCount || 0})
          </button>
          <button
            onClick={() => setFilter("inactive14")}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
              filter === "inactive14"
                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Inactive &gt; 14 Days ({stats.inactive14DaysCount || 0})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, course, email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Students List */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center text-gray-400 animate-pulse">
            Scanning enrolled learners...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-16 text-center text-gray-400 space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-white">All Clear! No Stalled Learners</h3>
            <p className="text-sm max-w-md mx-auto text-gray-400">
              Students are actively progressing through their courses. Great job!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-black uppercase tracking-wider text-gray-400">
                  <th className="p-4">Student</th>
                  <th className="p-4">Enrolled Course</th>
                  <th className="p-4">Progress</th>
                  <th className="p-4">Inactivity</th>
                  <th className="p-4 text-right">Quick Nudge Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredStudents.map((s) => {
                  const isZero = s.progress === 0;
                  const isVeryInactive = s.daysInactive >= 14;

                  return (
                    <tr key={s.enrollmentId} className="hover:bg-white/[0.02] transition-colors">
                      {/* Student */}
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-white">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.email}</p>
                          {s.phone && (
                            <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                              📞 {s.phone}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Course */}
                      <td className="p-4">
                        <span className="font-semibold text-gray-200 block text-xs md:text-sm">
                          {s.courseTitle}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Joined on {new Date(s.enrolledAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Progress Bar */}
                      <td className="p-4">
                        <div className="space-y-1.5 w-36">
                          <div className="flex justify-between text-xs font-bold">
                            <span className={isZero ? "text-rose-400" : "text-amber-400"}>
                              {s.progress}%
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {isZero ? "Not Started" : "In Progress"}
                            </span>
                          </div>
                          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isZero
                                  ? "w-1 bg-rose-500"
                                  : "bg-gradient-to-r from-amber-500 to-emerald-400"
                              }`}
                              style={{ width: `${Math.max(s.progress, 3)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Inactive Duration */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                            isVeryInactive
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          <Clock size={11} /> {s.daysInactive} days inactive
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {s.whatsappUrl ? (
                            <a
                              href={s.whatsappUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl shadow-md transition-colors"
                              title="Send WhatsApp Nudge"
                            >
                              <MessageSquare size={13} />
                              WhatsApp Nudge
                            </a>
                          ) : (
                            <button
                              disabled
                              className="text-[11px] text-gray-500 bg-white/5 px-2.5 py-1 rounded-xl cursor-not-allowed"
                              title="No phone number on profile"
                            >
                              No WhatsApp
                            </button>
                          )}

                          {s.mailtoUrl && (
                            <a
                              href={s.mailtoUrl}
                              className="inline-flex items-center gap-1 text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 px-2.5 py-1.5 rounded-xl transition-colors"
                              title="Send Email Nudge"
                            >
                              <Mail size={13} />
                              Email
                            </a>
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
      </div>
    </div>
  );
}
