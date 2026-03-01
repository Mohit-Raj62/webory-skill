"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Search,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Briefcase,
  Award,
  X,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Verification {
  _id: string;
  employeeId: string;
  fullName: string;
  phone: string;
  email: string;
  positionApplied: string;
  dateOfBirth: string;
  currentAddress: string;
  documents: Record<string, string>;
  declaration: boolean;
  currentStep: number;
  status: string;
  createdAt: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  interview_cleared: { label: "Interview Cleared", color: "text-blue-600", bg: "bg-blue-100" },
  document_verification: { label: "Doc Verification", color: "text-amber-600", bg: "bg-amber-100" },
  offer_letter: { label: "Offer Letter", color: "text-purple-600", bg: "bg-purple-100" },
  joining: { label: "Joining", color: "text-green-600", bg: "bg-green-100" },
};

const DOC_LABELS: Record<string, string> = {
  resume: "Resume",
  aadharFront: "Aadhar (Front)",
  aadharBack: "Aadhar (Back)",
  panCard: "PAN Card",
  marksheet10th: "10th Marksheet",
  marksheet12th: "12th Marksheet",
  degree: "Degree / Certificate",
  passportPhoto: "Passport Photo",
  cancelledCheque: "Cancelled Cheque",
  experienceLetter: "Experience Letter",
};

const STEPS = [
  { step: 1, label: "Interview Cleared", icon: CheckCircle2 },
  { step: 2, label: "Doc Verification", icon: FileText },
  { step: 3, label: "Offer Letter", icon: Briefcase },
  { step: 4, label: "Joining", icon: Award },
];

export default function AdminEmployeeVerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchVerifications();
  }, [search, statusFilter]);

  const fetchVerifications = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/employee-verification?${params}`);
      const data = await res.json();

      if (data.success) {
        setVerifications(data.data);
      } else {
        toast.error("Failed to load verifications");
      }
    } catch (err) {
      toast.error("Failed to load verifications");
    } finally {
      setLoading(false);
    }
  };

  const updateStep = async (id: string, step: number) => {
    setUpdating(id);
    const statusMap: Record<number, string> = {
      1: "interview_cleared",
      2: "document_verification",
      3: "offer_letter",
      4: "joining",
    };

    try {
      const res = await fetch(`/api/employee-verification/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentStep: step, status: statusMap[step] }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Status updated!");
        fetchVerifications();
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      toast.error("Failed to update");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white">
            <Shield size={20} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Employee KYC Verifications
            </h1>
            <p className="text-sm text-gray-400">
              Review and manage employee verification documents
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = verifications.filter((v) => v.status === key).length;
          return (
            <div
              key={key}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setStatusFilter(key === statusFilter ? "all" : key)}
            >
              <p className="text-xs text-gray-400 mb-1">{cfg.label}</p>
              <p className="text-2xl font-bold text-white">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 placeholder:text-gray-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 [&>option]:text-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="interview_cleared">Interview Cleared</option>
          <option value="document_verification">Document Verification</option>
          <option value="offer_letter">Offer Letter</option>
          <option value="joining">Joining</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-gray-500" size={24} />
        </div>
      ) : verifications.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
          <Users className="mx-auto text-gray-600 mb-3" size={40} />
          <p className="text-gray-500">No verifications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {verifications.map((v) => {
            const cfg = STATUS_CONFIG[v.status] || STATUS_CONFIG.document_verification;
            const isExpanded = expandedId === v._id;

            return (
              <motion.div
                key={v._id}
                layout
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
              >
                {/* Summary Row */}
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : v._id)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {v.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-semibold">{v.fullName}</h3>
                      <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded font-mono">
                        {v.employeeId}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {v.email} · {v.positionApplied}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color} hidden md:inline-block`}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-xs text-gray-500 hidden md:block">
                    {new Date(v.createdAt).toLocaleDateString("en-IN")}
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={18} className="text-gray-500" />
                  )}
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-5 space-y-6">
                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Phone</p>
                            <p className="text-sm text-white">{v.phone}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">DOB</p>
                            <p className="text-sm text-white">
                              {new Date(v.dateOfBirth).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Position</p>
                            <p className="text-sm text-white">{v.positionApplied}</p>
                          </div>
                          <div className="md:col-span-3">
                            <p className="text-xs text-gray-500 mb-1">Address</p>
                            <p className="text-sm text-white">{v.currentAddress}</p>
                          </div>
                        </div>

                        {/* Bank Details */}
                        {v.bankDetails && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-white/10 pt-6">
                            <div className="md:col-span-3">
                              <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Bank Details</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Bank Name</p>
                              <p className="text-sm text-white font-medium">{v.bankDetails.bankName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Account Number</p>
                              <p className="text-sm text-white font-mono">{v.bankDetails.accountNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">IFSC Code</p>
                              <p className="text-sm text-white font-mono">{v.bankDetails.ifscCode}</p>
                            </div>
                          </div>
                        )}

                        {/* Progress Steps Control */}
                        <div>
                          <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">
                            Update Progress
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {STEPS.map((s) => {
                              const Icon = s.icon;
                              const isActive = v.currentStep >= s.step;
                              const isCurrent = v.currentStep === s.step;
                              return (
                                <button
                                  key={s.step}
                                  disabled={updating === v._id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateStep(v._id, s.step);
                                  }}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                                    isCurrent
                                      ? "bg-blue-600 text-white ring-2 ring-blue-400"
                                      : isActive
                                        ? "bg-green-600/20 text-green-400 border border-green-500/30"
                                        : "bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10"
                                  }`}
                                >
                                  <Icon size={14} />
                                  {s.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Documents */}
                        <div>
                          <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wider">
                            Documents
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(v.documents || {}).map(
                              ([key, url]) => {
                                if (!url) return null;
                                return (
                                  <div
                                    key={key}
                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                                  >
                                    <FileText
                                      size={16}
                                      className="text-blue-400 flex-shrink-0"
                                    />
                                    <span className="text-sm text-white flex-1 truncate">
                                      {DOC_LABELS[key] || key}
                                    </span>
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Eye size={12} /> View
                                    </a>
                                    <a
                                      href={url}
                                      download
                                      className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300 font-medium"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Download size={12} /> Download
                                    </a>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
