import dbConnect from "@/lib/db";
import EmployeeVerification from "@/models/EmployeeVerification";
import { Navbar } from "@/components/ui/navbar";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { Shield, CheckCircle2, Briefcase, Loader2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function VerifyEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  
  // Await the params explicitly (Next.js 15+ App Router requirement)
  const { id } = await params;

  // Try to find the record by the dynamic [id] param.
  const record = await EmployeeVerification.findOne({ employeeId: id }).lean();

  if (!record) {
    // If no record is found in DB, return 404 page nicely
    notFound();
  }

  const isVerified = record.currentStep >= 4 || record.status === 'offer_letter' || record.status === 'joining';
  const isPending = record.currentStep < 4;
  
  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col items-center">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-24 md:py-32 flex flex-col items-center justify-center relative">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] aspect-square bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full relative z-10 flex flex-col items-center">
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
      </main>
    </div>
  );
}
