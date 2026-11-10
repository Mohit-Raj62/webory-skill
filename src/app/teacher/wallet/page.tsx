"use client";

import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  Save,
  Building2,
  Smartphone,
  Percent,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface PayoutHistoryItem {
  _id: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  paymentMethod: "upi" | "bank_transfer";
  upiId?: string;
  transactionId?: string;
  adminNote?: string;
  createdAt: string;
}

export default function TeacherWalletPage() {
  const [profile, setProfile] = useState<any>({});
  const [payouts, setPayouts] = useState<PayoutHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Payment details form
  const [upiId, setUpiId] = useState("");
  const [holderName, setHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [savingDetails, setSavingDetails] = useState(false);

  // Withdrawal Modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState<"upi" | "bank_transfer">("upi");
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/teacher/wallet");
      const data = await res.json();
      if (data.success) {
        const p = data.profile || {};
        setProfile(p);
        setPayouts(data.payouts || []);
        setUpiId(p.upiId || "");
        setHolderName(p.bankDetails?.holderName || "");
        setBankName(p.bankDetails?.bankName || "");
        setAccountNo(p.bankDetails?.accountNo || "");
        setIfsc(p.bankDetails?.ifsc || "");
      } else {
        toast.error(data.error || "Failed to load wallet");
      }
    } catch {
      toast.error("Network error loading wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingDetails(true);
      const res = await fetch("/api/teacher/wallet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upiId: upiId.trim(),
          bankDetails: {
            holderName: holderName.trim(),
            bankName: bankName.trim(),
            accountNo: accountNo.trim(),
            ifsc: ifsc.trim().toUpperCase(),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Payout details saved successfully!");
        fetchWallet();
      } else {
        toast.error(data.error || "Failed to save details");
      }
    } catch {
      toast.error("Error saving details");
    } finally {
      setSavingDetails(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(withdrawAmount);
    if (!numAmount || numAmount < 100) {
      toast.error("Minimum payout amount is ₹100");
      return;
    }

    if (withdrawMethod === "upi" && !upiId.trim()) {
      toast.error("Please enter and save your UPI ID first");
      return;
    }

    if (withdrawMethod === "bank_transfer" && (!accountNo.trim() || !ifsc.trim())) {
      toast.error("Please enter and save your Bank Account details first");
      return;
    }

    try {
      setSubmittingRequest(true);
      const res = await fetch("/api/teacher/payout-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numAmount,
          paymentMethod: withdrawMethod,
          upiId: upiId.trim(),
          bankDetails: {
            holderName: holderName.trim(),
            bankName: bankName.trim(),
            accountNo: accountNo.trim(),
            ifsc: ifsc.trim().toUpperCase(),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setShowWithdrawModal(false);
        setWithdrawAmount("");
        fetchWallet();
      } else {
        toast.error(data.error || "Failed to submit payout request");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setSubmittingRequest(false);
    }
  };

  const balance = profile.walletBalance || 0;
  const rate = profile.commissionRate ?? 70;
  const totalWithdrawn = profile.totalWithdrawn || 0;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <Wallet className="text-emerald-400" size={30} />
            My Earnings & Wallet
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Track your course commissions, manage UPI/Bank info, and withdraw earnings directly
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchWallet}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            disabled={balance < 100}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUpRight size={18} />
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Wallet Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-900/30 to-emerald-500/5">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-300/80">
            Available Wallet Balance
          </p>
          <h2 className="text-4xl font-black text-white mt-2">
            ₹{balance.toLocaleString()}
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            Min. withdrawal amount: ₹100
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/30 to-purple-500/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-300/80">
                Your Commission Share
              </p>
              <h2 className="text-4xl font-black text-purple-400 mt-2">
                {rate}%
              </h2>
              <p className="text-xs text-gray-400 mt-2">
                Auto-credited on every paid enrollment
              </p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300">
              <Percent size={24} />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-900/30 to-blue-500/5">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-300/80">
            Total Paid Out
          </p>
          <h2 className="text-4xl font-black text-blue-400 mt-2">
            ₹{totalWithdrawn.toLocaleString()}
          </h2>
          <p className="text-xs text-gray-400 mt-2">
            Successfully transferred to your account
          </p>
        </div>
      </div>

      {/* Main Content Split: Payout Methods Form & Payout History */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Payout Details Form (2 cols) */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/10 space-y-5 h-fit">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="text-indigo-400" size={20} />
              Payment Receive Settings
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Save your UPI or Bank Account so Superadmin can disburse payouts quickly
            </p>
          </div>

          <form onSubmit={handleSaveDetails} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Smartphone size={13} className="text-emerald-400" /> UPI ID (Recommended - Instant)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. yourname@okicici or 9876543210@ybl"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="border-t border-white/10 pt-3 space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Or Bank Account Details (NEFT / IMPS)
              </p>
              <input
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="Account Holder Name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-gray-500"
              />
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank Name (e.g. SBI, HDFC)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-gray-500"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  placeholder="Account Number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-gray-500"
                />
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  placeholder="IFSC Code"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder:text-gray-500 uppercase"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingDetails}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              <Save size={16} />
              {savingDetails ? "Saving..." : "Save Payout Details"}
            </button>
          </form>
        </div>

        {/* Right: Withdrawal History (3 cols) */}
        <div className="lg:col-span-3 glass-card rounded-2xl border border-white/10 overflow-hidden h-fit">
          <div className="p-5 border-b border-white/10">
            <h3 className="text-lg font-bold text-white">Withdrawal History</h3>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400 animate-pulse">
              Loading history...
            </div>
          ) : payouts.length === 0 ? (
            <div className="p-12 text-center text-gray-400 space-y-2">
              <Clock size={32} className="mx-auto text-gray-500" />
              <p className="font-semibold text-white">No Withdrawal Requests Yet</p>
              <p className="text-xs text-gray-400">
                When your wallet reaches ₹100+, click &quot;Withdraw Funds&quot; above to request a payout.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {payouts.map((p) => (
                <div
                  key={p._id}
                  className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02]"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-white">
                        ₹{p.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-gray-300">
                        {p.paymentMethod === "upi" ? "UPI" : "Bank"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Requested on{" "}
                      {new Date(p.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {p.transactionId && (
                      <p className="text-xs font-mono text-emerald-400">
                        UTR / Ref: {p.transactionId}
                      </p>
                    )}
                    {p.status === "rejected" && p.adminNote && (
                      <p className="text-xs text-red-400">Reason: {p.adminNote}</p>
                    )}
                  </div>

                  <div>
                    {p.status === "pending" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full">
                        <Clock size={12} /> Pending Superadmin Approval
                      </span>
                    )}
                    {p.status === "approved" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full">
                        <CheckCircle size={12} /> Paid Successfully
                      </span>
                    )}
                    {p.status === "rejected" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-300 bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full">
                        <XCircle size={12} /> Rejected (Refunded)
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Withdraw Funds Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-[#0b0f19] border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ArrowUpRight className="text-emerald-400" /> Request Payout
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl flex justify-between items-center text-sm">
              <span className="text-gray-300">Available to Withdraw:</span>
              <span className="font-black text-emerald-400 text-lg">
                ₹{balance.toLocaleString()}
              </span>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  min={100}
                  max={balance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Min ₹100"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod("upi")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      withdrawMethod === "upi"
                        ? "bg-emerald-600/20 border-emerald-500 text-emerald-300"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    UPI ({upiId || "Not Set"})
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawMethod("bank_transfer")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      withdrawMethod === "bank_transfer"
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    Bank ({accountNo ? `...${accountNo.slice(-4)}` : "Not Set"})
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg disabled:opacity-50"
                >
                  {submittingRequest ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

