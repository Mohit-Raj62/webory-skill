import React from "react";
import { motion } from "framer-motion";
import { User, Phone, Mail, Briefcase, Calendar, MapPin } from "lucide-react";

interface PersonalInfoFormProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFormData: any;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
  formData, 
  handleInputChange,
  setFormData 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.2 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6"
    >
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
  );
};
