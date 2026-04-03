import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, Briefcase, Award } from "lucide-react";

const STEPS = [
  { step: 1, label: "Interview Cleared", icon: CheckCircle2 },
  { step: 2, label: "Document Verification", icon: FileText },
  { step: 3, label: "Offer Letter", icon: Briefcase },
  { step: 4, label: "Joining", icon: Award },
];

interface ProgressBarProps {
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="px-4 md:px-8 -mt-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6"
      >
        <div className="flex items-center justify-between relative">
          {/* Background Line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-white/10 rounded-full mx-10 hidden sm:block" />
          
          {/* Progress Line */}
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
  );
};
