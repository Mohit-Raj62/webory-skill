"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Wallet,
  Building2,
  DollarSign,
  Users,
  Sliders,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

interface PayoutItem {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  paymentMethod: "upi" | "bank_transfer";
  upiId?: string;
  bankDetails?: {
    accountNo?: string;
    ifsc?: string;
    holderName?: string;
    bankName?: string;
  };
  transactionId?: string;
  adminNote?: string;
  teacher?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    teacherProfile?: {
      walletBalance?: number;
      commissionRate?: number;
    };
  };
  processedBy?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  processedAt?: string;
  createdAt: string;
}

interface TeacherItem {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  teacherProfile?: {
    commissionRate?: number;
    walletBalance?: number;
    totalWithdrawn?: number;
    upiId?: string;
    bankDetails?: {
      accountNo?: string;
      ifsc?: string;
      holderName?: string;
      bankName?: string;
    };
  };
  createdAt: string;
}

export default function AdminPayoutsPage() {
  const [activeTab, setActiveTab] = useState<"payouts" | "teachers">("payouts");
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [search, setSearch] = useState("");

  // Approval Modal State
  const [selectedPayout, setSelectedPayout] = useState<PayoutItem | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [processing, setProcessing] = useState(false);

  // Manage Teacher Commission / Wallet Modal
  const [editingTeacher, setEditingTeacher] = useState<TeacherItem | null>(null);
  const [commissionRateInput, setCommissionRateInput] = useState<string>("70");
  const [balanceAdjustmentInput, setBalanceAdjustmentInput] = useState<string>("");
  const [adjustmentReason, setAdjustmentReason] = useState<string>("");
  const [savingTeacher, setSavingTeacher] = useState(false);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/payouts");
      const data = await res.json();
      if (data.success) {
        setPayouts(data.payouts || []);
        setTeachers(data.teachers || []);
        setStats(data.stats || {});
      } else {
        toast.error(data.error || "Failed to load payouts");
      }
    } catch {
      toast.error("Network error loading payouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout || !actionType) return;

    if (actionType === "approve" && !transactionId.trim()) {
      toast.error("Please provide Transaction / UTR ID");
      return;
    }

    try {
      setProcessing(true);
      const endpoint = `/api/admin/payouts/${selectedPayout._id}/${actionType}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: transactionId.trim(),
          adminNote: adminNote.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setSelectedPayout(null);
        setActionType(null);
        setTransactionId("");
        setAdminNote("");
        fetchPayouts();
      } else {
        toast.error(data.error || "Failed to process payout");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveTeacherSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    try {
      setSavingTeacher(true);
      const res = await fetch("/api/admin/payouts/manage-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId: editingTeacher._id,
          commissionRate: commissionRateInput,
          balanceAdjustment: balanceAdjustmentInput || 0,
          reason: adjustmentReason.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setEditingTeacher(null);
        setBalanceAdjustmentInput("");
        setAdjustmentReason("");
        fetchPayouts();
      } else {
        toast.error(data.error || "Failed to update teacher settings");
      }
    } catch {
      toast.error("Error updating teacher settings");
    } finally {
      setSavingTeacher(false);
    }
  };

  const filteredPayouts = payouts.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const teacherName = `${p.teacher?.firstName || ""} ${p.teacher?.lastName || ""}`.toLowerCase();
      const email = (p.teacher?.email || "").toLowerCase();
      const utr = (p.transactionId || "").toLowerCase();
      return teacherName.includes(q) || email.includes(q) || utr.includes(q);
    }
    return true;
  });

  const filteredTeachers = teachers.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = `${t.firstName || ""} ${t.lastName || ""}`.toLowerCase();
    const email = (t.email || "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl">
              <Wallet className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  Teacher Payouts & Commission
                </h1>
                <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  👑 Superadmin Only
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-0.5">
                Configure teacher revenue share percentages, add bonuses, and process withdrawal requests
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchPayouts}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-4 py-2.5 rounded-xl transition-colors font-medium self-start md:self-auto"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Pending Requests
              </p>
              <h3 className="text-3xl font-black text-amber-400 mt-1">
                {stats.pendingCount || 0}
              </h3>
              <p className="text-xs text-amber-300/80 mt-1">
                ₹{stats.pendingAmount?.toLocaleString() || 0} to disburse
              </p>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-400">
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-green-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Total Disbursed
              </p>
              <h3 className="text-3xl font-black text-emerald-400 mt-1">
                ₹{stats.paidAmount?.toLocaleString() || 0}
              </h3>
              <p className="text-xs text-emerald-300/80 mt-1">
                {stats.paidCount || 0} paid withdrawals
              </p>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-indigo-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Total Teachers
              </p>
              <h3 className="text-3xl font-black text-blue-400 mt-1">
                {stats.totalTeachersCount || teachers.length || 0}
              </h3>
              <p className="text-xs text-blue-300/80 mt-1">
                {stats.teachersWithBalanceCount || 0} with active balance
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Building2 size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 to-pink-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-gray-400">
                Default Commission
              </p>
              <h3 className="text-3xl font-black text-purple-400 mt-1">
                70% / 30%
              </h3>
              <p className="text-xs text-purple-300/80 mt-1">Auto-credited on course sale</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("payouts")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "payouts"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <Wallet size={17} />
            Payout Requests
            {stats.pendingCount > 0 && (
              <span className="bg-amber-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full">
                {stats.pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("teachers")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === "teachers"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <Users size={17} />
            Teachers & Commission Rates ({teachers.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === "payouts"
                ? "Search teacher, email, UTR..."
                : "Search teacher name or email..."
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* TAB 1: PAYOUT REQUESTS */}
      {activeTab === "payouts" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
            <button
              onClick={() => setFilter("pending")}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                filter === "pending"
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Pending ({stats.pendingCount || 0})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                filter === "approved"
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Approved ({stats.paidCount || 0})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                filter === "rejected"
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Rejected
            </button>
            <button
              onClick={() => setFilter("all")}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                filter === "all"
                  ? "bg-white text-black shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              All History
            </button>
          </div>

          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
            {loading ? (
              <div className="p-16 text-center text-gray-400 animate-pulse">
                Loading payout requests...
              </div>
            ) : filteredPayouts.length === 0 ? (
              <div className="p-16 text-center text-gray-400 space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-500">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-white">No Payout Requests Found</h3>
                <p className="text-sm max-w-md mx-auto text-gray-400">
                  {filter === "pending"
                    ? "No pending teacher withdrawal requests right now."
                    : "No matching payout records found."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-black uppercase tracking-wider text-gray-400">
                      <th className="p-4">Teacher</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Payment Details</th>
                      <th className="p-4">Requested On</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredPayouts.map((item) => {
                      const teacher = item.teacher;
                      const isPending = item.status === "pending";
                      const isApproved = item.status === "approved";

                      return (
                        <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                {teacher?.firstName?.[0] || "T"}
                              </div>
                              <div>
                                <p className="font-bold text-white">
                                  {teacher?.firstName} {teacher?.lastName}
                                </p>
                                <p className="text-xs text-gray-400">{teacher?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-lg font-black text-white">
                              ₹{item.amount?.toLocaleString()}
                            </span>
                          </td>
                          <td className="p-4 text-xs">
                            {item.paymentMethod === "upi" ? (
                              <div className="space-y-0.5">
                                <span className="font-semibold text-emerald-400 uppercase">UPI:</span>{" "}
                                <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">
                                  {item.upiId || "N/A"}
                                </span>
                              </div>
                            ) : (
                              <div className="space-y-0.5 text-gray-300">
                                <p className="font-bold text-white">{item.bankDetails?.holderName}</p>
                                <p className="font-mono text-[11px]">
                                  A/C: {item.bankDetails?.accountNo} | IFSC: {item.bankDetails?.ifsc}
                                </p>
                              </div>
                            )}
                            {item.transactionId && (
                              <p className="text-[11px] text-gray-400 font-mono mt-1">
                                Ref / UTR: <span className="text-emerald-300">{item.transactionId}</span>
                              </p>
                            )}
                          </td>
                          <td className="p-4 text-xs text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="p-4">
                            {isPending && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full">
                                <Clock size={12} /> Pending Review
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full">
                                <CheckCircle size={12} /> Paid & Completed
                              </span>
                            )}
                            {item.status === "rejected" && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-300 bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full">
                                <XCircle size={12} /> Rejected
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {isPending ? (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedPayout(item);
                                    setActionType("approve");
                                    setTransactionId("");
                                    setAdminNote("");
                                  }}
                                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl shadow-md transition-colors"
                                >
                                  Approve & Mark Paid
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedPayout(item);
                                    setActionType("reject");
                                    setAdminNote("");
                                  }}
                                  className="text-xs font-bold bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-300 border border-white/10 px-3 py-1.5 rounded-xl transition-colors"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">Processed</span>
                            )}
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
      )}

      {/* TAB 2: MANAGE TEACHERS & COMMISSIONS */}
      {activeTab === "teachers" && (
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-16 text-center text-gray-400 animate-pulse">
              Loading teachers list...
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="p-16 text-center text-gray-400 space-y-3">
              <Users size={32} className="mx-auto text-gray-500" />
              <h3 className="text-lg font-bold text-white">No Teachers Found</h3>
              <p className="text-sm text-gray-400">
                Assign the &quot;Teacher&quot; role to any user in User Management to configure their commission and wallet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-black uppercase tracking-wider text-gray-400">
                    <th className="p-4">Teacher</th>
                    <th className="p-4">Commission Split</th>
                    <th className="p-4">Current Wallet</th>
                    <th className="p-4">Total Withdrawn</th>
                    <th className="p-4">Saved Payout Info</th>
                    <th className="p-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredTeachers.map((t) => {
                    const rate = t.teacherProfile?.commissionRate ?? 70;
                    const bal = t.teacherProfile?.walletBalance ?? 0;
                    const withdrawn = t.teacherProfile?.totalWithdrawn ?? 0;
                    const hasUpi = t.teacherProfile?.upiId;
                    const hasBank = t.teacherProfile?.bankDetails?.accountNo;

                    return (
                      <tr key={t._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                              {t.firstName?.[0] || "T"}
                            </div>
                            <div>
                              <p className="font-bold text-white">
                                {t.firstName} {t.lastName}
                              </p>
                              <p className="text-xs text-gray-400">{t.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-300 bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full">
                            {rate}% Teacher / {100 - rate}% Platform
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-base font-black text-emerald-400">
                            ₹{bal.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-semibold text-gray-300">
                            ₹{withdrawn.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-gray-400">
                          {hasUpi ? (
                            <span className="text-emerald-300 font-mono">UPI: {t.teacherProfile?.upiId}</span>
                          ) : hasBank ? (
                            <span className="text-blue-300 font-mono">Bank: {t.teacherProfile?.bankDetails?.accountNo}</span>
                          ) : (
                            <span className="text-gray-500 italic">Not configured yet</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setEditingTeacher(t);
                              setCommissionRateInput(String(rate));
                              setBalanceAdjustmentInput("");
                              setAdjustmentReason("");
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white px-3.5 py-1.5 rounded-xl shadow-md transition-colors"
                          >
                            <Sliders size={13} />
                            Edit % / Add Balance
                          </button>
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

      {/* Action Modal (Approve or Reject Payout) */}
      {selectedPayout && actionType && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-[#0b0f19] border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {actionType === "approve" ? (
                  <>
                    <CheckCircle className="text-emerald-400" /> Confirm Payout Disbursed
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-400" /> Reject Payout Request
                  </>
                )}
              </h3>
              <button
                onClick={() => {
                  setSelectedPayout(null);
                  setActionType(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/5 text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Teacher:</span>
                <span className="font-bold text-white">
                  {selectedPayout.teacher?.firstName} {selectedPayout.teacher?.lastName} (
                  {selectedPayout.teacher?.email})
                </span>
              </div>
              <div className="flex justify-between">
                <span>Withdrawal Amount:</span>
                <span className="text-base font-black text-emerald-400">
                  ₹{selectedPayout.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment Destination:</span>
                <span className="font-mono text-white">
                  {selectedPayout.paymentMethod === "upi"
                    ? `UPI: ${selectedPayout.upiId}`
                    : `A/C: ${selectedPayout.bankDetails?.accountNo}`}
                </span>
              </div>
            </div>

            <form onSubmit={handleAction} className="space-y-4">
              {actionType === "approve" ? (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Bank UTR / Transaction Reference ID *
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. UPI/20261104/1293848123 or IMPS-98124"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 text-sm font-mono"
                    required
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Send ₹{selectedPayout.amount} via UPI/NetBanking and enter the UTR receipt here.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Reason for Rejection *
                  </label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="e.g. Invalid UPI ID / Incorrect IFSC code provided"
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500 text-sm resize-none"
                    required
                  />
                  <p className="text-[11px] text-amber-300 mt-1">
                    Note: ₹{selectedPayout.amount} will be instantly refunded back to the teacher&apos;s wallet balance.
                  </p>
                </div>
              )}

              {actionType === "approve" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Admin Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="e.g. Disbursed via HDFC Corporate Banking"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-gray-500 text-sm"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPayout(null);
                    setActionType(null);
                  }}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className={`font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all text-white ${
                    actionType === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-red-600 hover:bg-red-500"
                  } disabled:opacity-50`}
                >
                  {processing
                    ? "Processing..."
                    : actionType === "approve"
                    ? "Confirm Payment Done"
                    : "Confirm Reject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Teacher Modal (Commission % & Wallet Credit) */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-[#0b0f19] border border-white/10 rounded-3xl p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="text-purple-400" /> Manage Teacher Finance
              </h3>
              <button
                onClick={() => setEditingTeacher(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1 text-xs">
              <p className="text-sm font-bold text-white">
                {editingTeacher.firstName} {editingTeacher.lastName}
              </p>
              <p className="text-gray-400">{editingTeacher.email}</p>
              <p className="text-emerald-400 font-bold pt-1">
                Current Wallet Balance: ₹{(editingTeacher.teacherProfile?.walletBalance || 0).toLocaleString()}
              </p>
            </div>

            <form onSubmit={handleSaveTeacherSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Teacher Revenue Share (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={commissionRateInput}
                  onChange={(e) => setCommissionRateInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 text-sm font-bold"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  If set to {commissionRateInput || 70}%, Teacher earns {commissionRateInput || 70}% and Platform keeps {100 - Number(commissionRateInput || 70)}% on every course enrollment.
                </p>
              </div>

              <div className="pt-2 border-t border-white/10">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <PlusCircle size={13} className="text-emerald-400" /> Manual Wallet Credit / Adjustment (₹)
                </label>
                <input
                  type="number"
                  value={balanceAdjustmentInput}
                  onChange={(e) => setBalanceAdjustmentInput(e.target.value)}
                  placeholder="e.g. 1500 (to add ₹1500) or -500 (to deduct ₹500)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 text-sm"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Leave empty if you only want to update the % rate. Use positive numbers for bonus / fixed salary / offline sales.
                </p>
              </div>

              {balanceAdjustmentInput && Number(balanceAdjustmentInput) !== 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                    Adjustment Reason / Note
                  </label>
                  <input
                    type="text"
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    placeholder="e.g. Monthly live class honorarium / Offline batch bonus"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-gray-500 text-sm"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTeacher}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {savingTeacher ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
