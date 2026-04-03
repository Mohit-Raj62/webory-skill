import React from "react";
import { Shield } from "lucide-react";
import { motion } from "framer-motion";

export const VerificationHeader = () => {
  return (
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
  );
};
