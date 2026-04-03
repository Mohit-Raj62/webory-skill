import React from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2 } from "lucide-react";

interface DeclarationSectionProps {
  declaration: boolean;
  setDeclaration: (val: boolean) => void;
}

export const DeclarationSection: React.FC<DeclarationSectionProps> = ({ 
  declaration, 
  setDeclaration 
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6"
    >
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
  );
};
