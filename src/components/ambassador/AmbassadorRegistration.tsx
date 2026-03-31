"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function AmbassadorRegistration({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    college: "",
    linkedin: "",
    reason: ""
  });
  const [registering, setRegistering] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    try {
      const res = await fetch("/api/ambassador/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Application submitted! 🚀");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto mt-10"
    >
      <div className="bg-[#0A0A0A] border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-blue-500/20">
              <Trophy size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-3">Join the Leaders</h1>
            <p className="text-gray-400">Apply now to represent Webory at your campus.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">College / University</label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({...formData, college: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:bg-black focus:border-blue-500 transition-all outline-none placeholder:text-gray-600"
                placeholder="e.g. IIT Bombay"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">LinkedIn Profile</label>
              <input
                type="url"
                required
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:bg-black focus:border-blue-500 transition-all outline-none placeholder:text-gray-600"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

             <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Motivational Statement</label>
              <textarea
                required
                rows={4}
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:bg-black focus:border-blue-500 transition-all outline-none placeholder:text-gray-600 resize-none"
                placeholder="Why do you want to join? What makes you a good leader?"
              />
            </div>

            <Button 
              type="submit" 
              disabled={registering}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-6 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
            >
              {registering ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" /> Submitting...</span> : "Submit Application"}
            </Button>
          </form>
      </div>
    </motion.div>
  );
}
