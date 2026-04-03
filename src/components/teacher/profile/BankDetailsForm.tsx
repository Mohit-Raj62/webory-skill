import React from "react";
import { motion } from "framer-motion";
import { Building, Hash, Barcode } from "lucide-react";

interface BankDetailsFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BankDetailsForm: React.FC<BankDetailsFormProps> = ({ 
  formData, 
  handleInputChange 
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
    >
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
  );
};
