import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Briefcase, CreditCard, User, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

interface IdCardViewProps {
  formData: any;
  employeeId: string;
  currentStep: number;
  setShowIdModal: (show: boolean) => void;
}

export const IdCardView: React.FC<IdCardViewProps> = ({ 
  formData, 
  employeeId, 
  currentStep, 
  setShowIdModal 
}) => {
  return (
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
  );
};
