"use client";

import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  CheckCircle2,
  X,
  FileText,
  User,
  Shield,
  Briefcase,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Camera,
  CreditCard,
  GraduationCap,
  Award,
  FileCheck,
  Building,
  Hash,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Barcode, Map as GlobeIcon, Download } from "lucide-react";
import dynamic from "next/dynamic";

const IdCardModal = dynamic(() => import("@/components/teacher/id-card-modal").then(mod => mod.IdCardModal), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm shadow-inner"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
});

// Document config
const DOCUMENT_FIELDS = [
  { key: "resume", label: "Upload Resume", accept: ".pdf", required: true, icon: FileText, description: "PDF format only" },
  { key: "aadharFront", label: "Aadhar Card (Front)", accept: ".pdf,.jpg,.jpeg,.png", required: true, icon: CreditCard, description: "PDF or JPG" },
  { key: "aadharBack", label: "Aadhar Card (Back)", accept: ".pdf,.jpg,.jpeg,.png", required: true, icon: CreditCard, description: "PDF or JPG" },
  { key: "panCard", label: "PAN Card", accept: ".pdf,.jpg,.jpeg,.png", required: true, icon: CreditCard, description: "PDF or JPG" },
  { key: "marksheet10th", label: "10th Marksheet", accept: ".pdf,.jpg,.jpeg,.png", required: true, icon: GraduationCap, description: "PDF or JPG" },
  { key: "marksheet12th", label: "12th Marksheet", accept: ".pdf,.jpg,.jpeg,.png", required: true, icon: GraduationCap, description: "PDF or JPG" },
  { key: "degree", label: "Degree / Certificate", accept: ".pdf,.jpg,.jpeg,.png", required: true, icon: Award, description: "PDF or JPG" },
  { key: "passportPhoto", label: "Passport Size Photo", accept: ".jpg,.jpeg,.png", required: true, icon: Camera, description: "JPG/PNG only" },
  { key: "cancelledCheque", label: "Cancelled Cheque / Passbook", accept: ".pdf,.jpg,.jpeg,.png", required: false, icon: CreditCard, description: "Optional — PDF or JPG" },
  { key: "experienceLetter", label: "Experience Letter", accept: ".pdf,.jpg,.jpeg,.png", required: false, icon: FileCheck, description: "Optional — PDF or JPG" },
];

const STEPS = [
  { step: 1, label: "Interview Cleared", icon: CheckCircle2 },
  { step: 2, label: "Document Verification", icon: FileText },
  { step: 3, label: "Offer Letter", icon: Briefcase },
  { step: 4, label: "Joining", icon: Award },
];

export default function TeacherProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    positionApplied: "",
    dateOfBirth: "",
    currentAddress: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });
  const [documents, setDocuments] = useState<Record<string, string>>({});
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<Record<string, string>>({});
  const [declaration, setDeclaration] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [currentStep, setCurrentStep] = useState(2);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showIdModal, setShowIdModal] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/employee-verification/me");
        const json = await res.json();
        if (json.success && json.data) {
          setEmployeeId(json.data.employeeId);
          setCurrentStep(json.data.currentStep || 2);
          setVerificationStatus(json.data.status || "document_verification");
          setFormData({
            fullName: json.data.fullName || "",
            phone: json.data.phone || "",
            email: json.data.email || "",
            positionApplied: json.data.positionApplied || "",
            dateOfBirth: json.data.dateOfBirth ? new Date(json.data.dateOfBirth).toISOString().split('T')[0] : "",
            currentAddress: json.data.currentAddress || "",
            bankName: json.data.bankDetails?.bankName || "",
            accountNumber: json.data.bankDetails?.accountNumber || "",
            ifscCode: json.data.bankDetails?.ifscCode || "",
          });
          setSubmitted(true);
        } else if (json.success && json.userDefaults) {
          setFormData(prev => ({
            ...prev,
            fullName: json.userDefaults.fullName || "",
            email: json.userDefaults.email || "",
            phone: json.userDefaults.phone || "",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDocUpload = useCallback(
    async (key: string, file: File) => {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF and JPG/PNG files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB.");
        return;
      }

      setUploadingDoc(key);
      try {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("empId", "TEMP");
        uploadData.append("empName", formData.fullName || "Applicant");
        uploadData.append("documentType", key);

        const res = await fetch("/api/upload/kyc-document", { method: "POST", body: uploadData });
        const result = await res.json();

        if (!result.success) throw new Error(result.error || "Upload failed");

        setDocuments((prev) => ({ ...prev, [key]: result.url }));
        setFileNames((prev) => ({ ...prev, [key]: file.name }));
        toast.success(`${file.name} uploaded successfully!`);
      } catch (err: any) {
        toast.error(err.message || "Failed to upload document");
      } finally {
        setUploadingDoc(null);
      }
    },
    [formData.fullName]
  );

  const removeDocument = (key: string) => {
    setDocuments((prev) => { const c = { ...prev }; delete c[key]; return c; });
    setFileNames((prev) => { const c = { ...prev }; delete c[key]; return c; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phone)) { toast.error("Phone number must be exactly 10 digits."); return; }
    
    if (!formData.bankName || !formData.accountNumber || !formData.ifscCode) { toast.error("Please fill in complete bank details."); return; }

    const missingDocs = DOCUMENT_FIELDS.filter((d) => d.required && !documents[d.key]);
    if (missingDocs.length > 0) { toast.error(`Please upload: ${missingDocs.map((d) => d.label).join(", ")}`); return; }
    if (!declaration) { toast.error("Please accept the declaration."); return; }

    setSubmitting(true);
    try {
      // Build nested bank details payload
      const payload = {
        ...formData,
        documents,
        declaration,
        bankDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
        },
      };

      const res = await fetch("/api/employee-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Submission failed");

      setEmployeeId(data.data.employeeId);
      setCurrentStep(2);
      setVerificationStatus("document_verification");
      setSubmitted(true);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit verification");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {!submitted && (
        <>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 md:p-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Shield size={22} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold">Teacher Profile — Employee Verification</h1>
              </div>
              <p className="text-white/70 text-sm mt-1">
                Complete your KYC to proceed with your onboarding at Webory Skills
              </p>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="px-4 md:px-8 -mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6"
            >
              <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-0 right-0 h-1 bg-white/10 rounded-full mx-10 hidden sm:block" />
                <div
                  className="absolute top-5 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-10 hidden sm:block transition-all duration-500"
                  style={{ width: `calc(${((currentStep - 1) / 3) * 100}% - 5rem)` }}
                />
                {STEPS.map((s) => {
                  const Icon = s.icon;
                  const isCompleted = s.step < currentStep;
                  const isCurrent = s.step === currentStep;
                  return (
                    <div key={s.step} className="flex flex-col items-center gap-2 relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        isCompleted ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                        : isCurrent ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20"
                        : "bg-white/10 text-gray-500"
                      }`}>
                        {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={18} />}
                      </div>
                      <span className={`text-xs font-semibold text-center leading-tight hidden sm:block ${
                        isCompleted ? "text-green-400" : isCurrent ? "text-blue-400" : "text-gray-600"
                      }`}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </>
      )}

      {/* Content */}
      <div className="px-4 md:px-8 py-6">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mt-8"
          >
            {/* Main ID Card Container */}
            <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] border border-white/10 shadow-2xl">
              {/* Decorative Background Elements */}
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-20"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative p-8 md:p-10">
                {/* Header Section: Avatar, Name, Status */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-10 border-b border-white/10 pb-8">
                  <div className="relative group">
                    <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                      <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center border-2 border-transparent group-hover:bg-transparent transition-colors duration-300">
                        <span className="text-4xl font-bold text-white tracking-wider">
                          {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : "W"}
                        </span>
                      </div>
                    </div>
                    {/* Status Badge overlay */}
                    <div className="absolute -bottom-3 -right-3">
                      {currentStep >= 4 ? (
                        <div className="flex items-center gap-1.5 bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 shadow-lg shadow-green-500/20 backdrop-blur-md">
                          <CheckCircle2 size={14} className="fill-green-500/20" />
                          <span className="text-xs font-bold tracking-wide">VERIFIED</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30 shadow-lg shadow-amber-500/20 backdrop-blur-md">
                          <Loader2 size={14} className="animate-spin" />
                          <span className="text-xs font-bold tracking-wide">PENDING</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                      {formData.fullName}
                    </h1>
                    <p className="text-lg text-blue-400 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                      <Briefcase size={18} />
                      {formData.positionApplied || "Employee"}
                    </p>
                    
                    {/* Digital Employee ID Bar & Actions */}
                    <div className="flex flex-col gap-4 mt-2">
                      <div className="inline-flex flex-col relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                        <div className="relative flex items-center bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                          <div className="px-5 py-3 bg-white/5 border-r border-white/10 flex items-center justify-center">
                            <CreditCard size={22} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <div className="px-6 py-2 flex flex-col justify-center">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">
                              Employee ID
                            </span>
                            <span className="font-mono text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-[0.2em]">
                              {employeeId}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => setShowIdModal(true)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-semibold transition-colors w-fit"
                      >
                        <CreditCard size={16} /> View Physical ID
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <User size={16} /> Contact Profile
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email Card */}
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Mail size={16} />
                      </div>
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Email Address</p>
                      <p className="text-base text-gray-200 font-medium truncate" title={formData.email}>
                        {formData.email}
                      </p>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Phone size={16} />
                      </div>
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Phone Number</p>
                      <p className="text-base text-gray-200 font-medium">
                        +91 {formData.phone}
                      </p>
                    </div>
                    
                    {/* Address Card (Spans full width) */}
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors md:col-span-2 group">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <MapPin size={16} />
                      </div>
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-semibold">Current Address</p>
                      <p className="text-base text-gray-200 font-medium leading-relaxed">
                        {formData.currentAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-500 text-center md:text-left flex-1">
                    {currentStep === 4 
                      ? "Your profile is active and fully verified."
                      : "We'll notify you via email when your KYC status updates."}
                  </p>
                  <Link
                    href="/teacher"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors shrink-0 w-full md:w-auto"
                  >
                    Go to Workspace
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Personal Information</h2>
                <p className="text-xs text-gray-500">Fill in your personal details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <User size={13} className="text-gray-500" /> Full Name <span className="text-red-400">*</span>
                </label>
                <input type="text" id="fullName" name="fullName" required placeholder="Enter your full name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 placeholder:text-gray-600 transition-all"
                  value={formData.fullName} onChange={handleInputChange} />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Phone size={13} className="text-gray-500" /> Phone Number <span className="text-red-400">*</span>
                </label>
                <input type="tel" id="phone" name="phone" required maxLength={10} placeholder="9876543210"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 placeholder:text-gray-600 transition-all"
                  value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })} />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Mail size={13} className="text-gray-500" /> Email Address <span className="text-red-400">*</span>
                </label>
                <input type="email" id="email" name="email" required placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 placeholder:text-gray-600 transition-all opacity-70 cursor-not-allowed"
                  value={formData.email} readOnly />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="positionApplied" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Briefcase size={13} className="text-gray-500" /> Position Applied <span className="text-red-400">*</span>
                </label>
                <input type="text" id="positionApplied" name="positionApplied" required placeholder="e.g. Frontend Developer Instructor"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 placeholder:text-gray-600 transition-all"
                  value={formData.positionApplied} onChange={handleInputChange} />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="dateOfBirth" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Calendar size={13} className="text-gray-500" /> Date of Birth <span className="text-red-400">*</span>
                </label>
                <input type="date" id="dateOfBirth" name="dateOfBirth" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
                  value={formData.dateOfBirth} onChange={handleInputChange} />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="currentAddress" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <MapPin size={13} className="text-gray-500" /> Current Address <span className="text-red-400">*</span>
                </label>
                <textarea id="currentAddress" name="currentAddress" required rows={3} placeholder="Enter your complete current address"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none placeholder:text-gray-600 transition-all"
                  value={formData.currentAddress} onChange={handleInputChange} />
              </div>
            </div>
          </motion.div>

          {/* Bank Details Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                <Building size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Bank Details</h2>
                <p className="text-xs text-gray-500">Provide bank details for salary and payments</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="bankName" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Building size={13} className="text-gray-500" /> Bank Name <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <input type="text" id="bankName" name="bankName" required placeholder="e.g. State Bank of India"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                    value={formData.bankName} onChange={handleInputChange} />
                  <Building size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="accountNumber" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Hash size={13} className="text-gray-500" /> Account Number <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <input type="text" id="accountNumber" name="accountNumber" required placeholder="Account number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                    value={formData.accountNumber} onChange={handleInputChange} />
                  <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="ifscCode" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                  <Barcode size={13} className="text-gray-500" /> IFSC Code <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <input type="text" id="ifscCode" name="ifscCode" required placeholder="e.g. SBIN0001234"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600 uppercase"
                    value={formData.ifscCode} onChange={handleInputChange} />
                  <Barcode size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Document Upload Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Upload size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Document Upload</h2>
                <p className="text-xs text-gray-500">Upload each document separately</p>
              </div>
            </div>

            {/* Rules */}
            <div className="bg-white/5 rounded-xl p-3 mb-5 border border-white/10">
              <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400">
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> PDF / JPG allowed only</span>
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Max file size: 5MB</span>
                <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Auto-renamed to EmpID_Name_Document</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DOCUMENT_FIELDS.map((doc) => {
                const Icon = doc.icon;
                const isUploaded = !!documents[doc.key];
                const isUploading = uploadingDoc === doc.key;

                return (
                  <div key={doc.key} className={`relative rounded-xl border border-dashed transition-all ${
                    isUploaded ? "border-green-500/40 bg-green-500/10"
                    : isUploading ? "border-blue-500/40 bg-blue-500/10"
                    : "border-white/15 bg-white/5 hover:border-blue-500/30 hover:bg-blue-500/5"
                  }`}>
                    <input type="file" id={`doc-${doc.key}`} accept={doc.accept} className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) handleDocUpload(doc.key, e.target.files[0]); }}
                      disabled={isUploading} />

                    {isUploading ? (
                      <div className="flex items-center gap-4 p-4">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <Loader2 size={18} className="animate-spin" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-blue-300">Uploading...</p>
                          <div className="mt-1.5 h-1 bg-blue-500/20 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ) : isUploaded ? (
                      <div className="flex items-center gap-4 p-4">
                        <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                          <CheckCircle2 size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-green-300">{doc.label}</p>
                          <p className="text-xs text-green-500/70 truncate">{fileNames[doc.key]}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <label htmlFor={`doc-${doc.key}`} className="text-xs text-blue-400 hover:underline cursor-pointer font-medium">Replace</label>
                          <button type="button" onClick={() => removeDocument(doc.key)}
                            className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor={`doc-${doc.key}`} className="flex items-center gap-4 p-4 cursor-pointer">
                        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-500">
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-300">
                            {doc.label}{doc.required && <span className="text-red-400 ml-1">*</span>}
                          </p>
                          <p className="text-xs text-gray-600">{doc.description}</p>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <Upload size={13} />
                        </div>
                      </label>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Upload progress */}
            <div className="mt-5 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(Object.keys(documents).length / DOCUMENT_FIELDS.filter((d) => d.required).length) * 100}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {Object.keys(documents).length}/{DOCUMENT_FIELDS.filter((d) => d.required).length} required
              </span>
            </div>
          </motion.div>

          {/* Declaration */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400"><Shield size={20} /></div>
              <div>
                <h2 className="text-lg font-bold text-white">Declaration</h2>
                <p className="text-xs text-gray-500">Please read and accept the declaration</p>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                declaration ? "border-green-500/40 bg-green-500/10" : "border-white/10 bg-white/5 hover:border-blue-500/30"
              }`}
              onClick={() => setDeclaration(!declaration)}
            >
              <label className="flex items-start gap-4 cursor-pointer">
                <div className="mt-0.5">
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    declaration ? "bg-green-500 border-green-500" : "bg-transparent border-gray-600"
                  }`}>
                    {declaration && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-200 mb-1">
                    I confirm all information provided is correct and belongs to me.
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Providing fake or incorrect information may result in immediate termination of employment.
                    All documents uploaded are authentic originals and belong to the applicant.
                  </p>
                </div>
              </label>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <button type="submit" disabled={submitting || !declaration}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] text-lg">
              {submitting ? (
                <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" size={22} /> Submitting Verification...</span>
              ) : (
                <span className="flex items-center justify-center gap-3"><Shield size={22} /> Submit Verification</span>
              )}
            </button>
            <p className="text-center text-xs text-gray-600 mt-3">
              Your documents are securely stored and will only be accessed by authorized personnel.
            </p>
          </motion.div>
        </form>
        )}
      <IdCardModal 
        isOpen={showIdModal} 
        onClose={() => setShowIdModal(false)} 
        formData={formData} 
        employeeId={employeeId} 
      />
    </div>
  </div>
);
}
