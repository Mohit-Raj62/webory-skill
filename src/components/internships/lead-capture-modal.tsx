"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Phone, Send, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  internshipId?: string;
  internshipTitle?: string;
}

export function LeadCaptureModal({ isOpen, onClose, internshipId, internshipTitle }: LeadCaptureModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          internshipId,
          pageUrl: window.location.href,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        toast.success("Details captured! Our team will contact you soon.");
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setFormData({ name: "", phone: "" });
        }, 3000);
      } else {
        toast.error("Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Lead submission error:", error);
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#0f111a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Gradient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all z-20"
            >
              <X size={20} />
            </button>

            <div className="p-8 pt-10">
              {isSuccess ? (
                <div className="text-center py-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h2 className="text-2xl font-black text-white mb-2">Thank You!</h2>
                  <p className="text-gray-400 text-sm">
                    We've received your interest in <span className="text-emerald-400 font-bold">{internshipTitle || "this internship"}</span>. 
                    Our mentor will call you shortly.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                        <Sparkles size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">Expert Consultancy</span>
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight mb-2">
                       Want to <span className="text-emerald-400">Apply?</span>
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Get a free consultation from our experts before you start your journey.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                        <input
                          type="text"
                          required
                          placeholder="What should we call you?"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors" size={18} />
                        <input
                          type="tel"
                          required
                          placeholder="10-digit mobile number"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.08] transition-all"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-black border-0 py-7 text-sm font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-emerald-500/20 mt-4 transition-all active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        "Saving Leads..."
                      ) : (
                        <>
                          Request a Call back <Send size={16} className="ml-2" />
                        </>
                      )}
                    </Button>
                    
                    <p className="text-[10px] text-center text-gray-600">
                      By submitting, you agree to receive career guidance calls from Webory.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
