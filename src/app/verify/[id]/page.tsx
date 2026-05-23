import dbConnect from "@/lib/db";
import EmployeeVerification from "@/models/EmployeeVerification";
import PaymentProof from "@/models/PaymentProof";
import Application from "@/models/Application";
import MentorshipPayment from "@/models/MentorshipPayment";
import User from "@/models/User";
import Course from "@/models/Course";
import Internship from "@/models/Internship";
import { Navbar } from "@/components/ui/navbar";
import { notFound } from "next/navigation";
import { Shield, CheckCircle2, Briefcase, Loader2, Receipt, Calendar, Mail, Phone, AlertCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function VerifyEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  
  // Await the params explicitly (Next.js 15+ App Router requirement)
  const { id } = await params;

  // Try to find the record by the dynamic [id] param in EmployeeVerification.
  const record = await EmployeeVerification.findOne({ employeeId: id }).lean();

  let paymentRecord: any = null;
  let paymentType: "course" | "internship" | "mentorship" | null = null;
  let paymentItemTitle = "";
  let studentDetails: { name: string; email: string; phone?: string } | null = null;

  if (!record) {
    // 1. Check in PaymentProof
    const proof = await PaymentProof.findOne({ transactionId: id })
      .populate("student")
      .populate("course")
      .populate("internship")
      .lean();

    if (proof) {
      paymentRecord = proof;
      paymentType = proof.paymentType as "course" | "internship";
      
      const studentObj = proof.student as any;
      if (studentObj) {
        studentDetails = {
          name: `${studentObj.firstName} ${studentObj.lastName}`,
          email: studentObj.email,
          phone: studentObj.phone || undefined,
        };
      }
      
      if (proof.paymentType === "course" && proof.course) {
        paymentItemTitle = (proof.course as any).title;
      } else if (proof.paymentType === "internship" && proof.internship) {
        paymentItemTitle = (proof.internship as any).title;
      }
    } else {
      // 2. Check in Application
      const app = await Application.findOne({ transactionId: id })
        .populate("student")
        .populate("internship")
        .lean();

      if (app) {
        paymentRecord = app;
        paymentType = "internship";
        
        const studentObj = app.student as any;
        if (studentObj) {
          studentDetails = {
            name: `${studentObj.firstName} ${studentObj.lastName}`,
            email: studentObj.email,
            phone: studentObj.phone || undefined,
          };
        }
        if (app.internship) {
          paymentItemTitle = (app.internship as any).title;
        }
      } else {
        // 3. Check in MentorshipPayment
        const mentorship = await MentorshipPayment.findOne({ transactionId: id })
          .populate("user")
          .lean();

        if (mentorship) {
          paymentRecord = mentorship;
          paymentType = "mentorship";
          
          const userObj = mentorship.user as any;
          if (userObj) {
            studentDetails = {
              name: `${userObj.firstName} ${userObj.lastName}`,
              email: userObj.email,
              phone: userObj.phone || undefined,
            };
          }
          paymentItemTitle = `Mentorship Plan - ${String(mentorship.plan).toUpperCase()}`;
        }
      }
    }
  }

  // If neither record nor paymentRecord exists, return 404 page nicely
  if (!record && !paymentRecord) {
    notFound();
  }

  // Extract variables for employee record if found
  const isVerified = record ? (record.currentStep >= 4 || record.status === 'offer_letter' || record.status === 'joining') : false;

  // Extract variables for payment proof if found
  let finalStatus: "verified" | "pending" | "rejected" = "pending";
  let finalAmount = 0;
  let finalDate: Date | null = null;

  if (paymentRecord) {
    if (paymentType === "mentorship") {
      finalAmount = paymentRecord.amount;
      finalStatus = paymentRecord.status || "pending";
      finalDate = paymentRecord.createdAt ? new Date(paymentRecord.createdAt) : null;
    } else if (paymentRecord.paymentType) {
      // It's a PaymentProof
      finalAmount = paymentRecord.amount;
      finalStatus = paymentRecord.status || "pending";
      finalDate = paymentRecord.submittedAt ? new Date(paymentRecord.submittedAt) : null;
    } else {
      // It's an Application
      finalAmount = paymentRecord.amountPaid || 0;
      const appStatus = paymentRecord.status;
      if (appStatus === "accepted" || appStatus === "completed" || appStatus === "interview_scheduled" || appStatus === "interview_pending") {
        finalStatus = "verified";
      } else if (appStatus === "rejected") {
        finalStatus = "rejected";
      } else {
        finalStatus = "pending";
      }
      finalDate = paymentRecord.appliedAt ? new Date(paymentRecord.appliedAt) : null;
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-24 md:py-32 flex flex-col items-center justify-center relative">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-square bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full relative z-10 flex flex-col items-center">
          {record ? (
            // Employee Verification UI
            <div className="w-full flex flex-col items-center">
              <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Official Verification</h1>
                <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">Background Check System</p>
              </div>

              <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                {/* Status Header */}
                <div className={`absolute top-0 left-0 w-full h-2 ${isVerified ? "bg-green-500" : "bg-amber-500"}`} />
                
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-10">
                  <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 p-1 shadow-xl">
                      <div className="w-full h-full bg-[#0F172A] rounded-xl flex items-center justify-center">
                        <span className="text-4xl md:text-5xl font-bold text-white">
                          {record.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    {/* Floating Status Badge */}
                    <div className="absolute -bottom-4 -right-4">
                      {isVerified ? (
                        <div className="bg-green-500 text-white p-2.5 rounded-full shadow-lg shadow-green-500/40 ring-4 ring-[#0F172A]">
                          <CheckCircle2 size={24} />
                        </div>
                      ) : (
                        <div className="bg-amber-500 text-white p-2.5 rounded-full shadow-lg shadow-amber-500/40 ring-4 ring-[#0F172A]">
                          <Loader2 size={24} className="animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight">
                      {record.fullName}
                    </h2>
                    
                    <div className="flex items-center justify-center md:justify-start gap-2 text-blue-400 font-semibold text-lg md:text-xl mb-4">
                      <Briefcase size={20} />
                      <span>{record.positionApplied}</span>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold tracking-wide uppercase ${
                      isVerified 
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {isVerified ? "Verified Employee" : "Verification Pending"}
                    </div>
                  </div>
                </div>

                {/* Employee ID Big Banner */}
                <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 mb-8 flex flex-col items-center justify-center">
                  <span className="text-gray-500 uppercase tracking-[0.2em] text-xs font-bold mb-1">Employee ID</span>
                  <span className="font-mono text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 tracking-widest text-center">
                    {record.employeeId}
                  </span>
                </div>

                {/* Context/Warning Text */}
                <div className="w-full bg-blue-500/5 border border-blue-500/20 p-5 rounded-xl flex items-start gap-4">
                  <Shield className="text-blue-400 shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-gray-400 leading-relaxed">
                    {isVerified ? (
                      <p>This individual has successfully passed the Webory Skills internal background check and document verification protocols. They are currently an active affiliate/employee.</p>
                    ) : (
                      <p>This individual's employment profile has been created but their submitted documents and application are currently under review by our administration team. Official capacity is pending.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Premium Invoice & Payment Verification UI
            <div className="w-full flex flex-col items-center">
              <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">Official Verification</h1>
                <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">Payment & Invoice Records</p>
              </div>

              <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                {/* Accent line based on status */}
                <div className={`absolute top-0 left-0 w-full h-2 ${
                  finalStatus === "verified" ? "bg-green-500" :
                  finalStatus === "rejected" ? "bg-red-500" : "bg-amber-500"
                }`} />

                {/* Main Header / Status */}
                <div className="flex flex-col items-center text-center mb-8 pb-8 border-b border-white/10">
                  <div className="relative mb-4">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      finalStatus === "verified" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      finalStatus === "rejected" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                    }`}>
                      {finalStatus === "verified" && <CheckCircle2 size={40} className="drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
                      {finalStatus === "rejected" && <AlertCircle size={40} className="drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                      {finalStatus === "pending" && <Loader2 size={40} className="animate-spin drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />}
                    </div>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                    {finalStatus === "verified" ? "Payment Verified" :
                     finalStatus === "rejected" ? "Payment Rejected" :
                     "Verification Pending"}
                  </h2>
                  <p className="text-gray-400 text-sm max-w-md">
                    {finalStatus === "verified" ? "This transaction is authentic and has been successfully processed by Webory Skills." :
                     finalStatus === "rejected" ? "This transaction or payment proof was rejected. Please contact our support team." :
                     "The payment proof for this transaction is currently under review by our administration team."}
                  </p>
                </div>

                {/* Transaction details & Summary */}
                <div className="space-y-6">
                  {/* Big Accent Banner for Amount & Transaction ID */}
                  <div className="grid grid-cols-2 gap-4 bg-black/40 border border-white/5 rounded-2xl p-5">
                    <div className="flex flex-col items-center justify-center border-r border-white/10">
                      <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold mb-1">Amount Paid</span>
                      <span className="text-2xl font-black text-blue-400">
                        ₹{Number(finalAmount).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-gray-500 uppercase tracking-wider text-[10px] font-bold mb-1">Status</span>
                      <span className={`text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                        finalStatus === "verified" ? "bg-green-500/10 text-green-400" :
                        finalStatus === "rejected" ? "bg-red-500/10 text-red-400" :
                        "bg-amber-500/10 text-amber-400"
                      }`}>
                        {finalStatus}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 rounded-2xl p-6 border border-white/5">
                    <div>
                      <h3 className="text-gray-500 uppercase tracking-wider text-[10px] font-bold mb-3">Item Details</h3>
                      <div className="space-y-2">
                        <p className="text-white font-bold text-sm md:text-base leading-snug">
                          {paymentItemTitle || "Premium Resource Access"}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Receipt size={14} className="text-blue-400" />
                          <span className="capitalize">{paymentType || "Enrollment"}</span>
                        </div>
                        {finalDate && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Calendar size={14} className="text-blue-400" />
                            <span>{finalDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                      <h3 className="text-gray-500 uppercase tracking-wider text-[10px] font-bold mb-3">Billed To</h3>
                      {studentDetails ? (
                        <div className="space-y-2">
                          <p className="text-white font-bold text-sm md:text-base">{studentDetails.name}</p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 truncate">
                            <Mail size={14} className="text-blue-400" />
                            <span className="truncate">{studentDetails.email}</span>
                          </div>
                          {studentDetails.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                              <Phone size={14} className="text-blue-400" />
                              <span>{studentDetails.phone}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">Student details not available</p>
                      )}
                    </div>
                  </div>

                  {/* Transaction metadata / security info */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-500">Transaction ID</span>
                      <span className="font-mono text-gray-300 font-semibold">{id}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                      <span className="text-gray-500">Payment Gateway / Method</span>
                      <span className="text-gray-300 font-medium">
                        {paymentRecord.screenshot === "payu_verified" ? "PayU India" : "UPI Transfer"}
                      </span>
                    </div>
                    {finalDate && (
                      <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                        <span className="text-gray-500">Transaction Date</span>
                        <span className="text-gray-300 font-medium">
                          {finalDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}, {finalDate.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Authenticity Certificate Footnote */}
                  <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3">
                    <Shield className="text-blue-400 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-gray-400 leading-relaxed">
                      This verification record is digitally generated directly from Webory Skills ledger. Any modifications to this screen offline or on non-official domains are invalid.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

