"use client";

import { useState } from "react";
import { Quote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function TestimonialEditor({ initialTestimonial }: { initialTestimonial: string }) {
  const [testimonial, setTestimonial] = useState(initialTestimonial);
  const [savingTestimonial, setSavingTestimonial] = useState(false);

  const handleSaveTestimonial = async () => {
    if (!testimonial.trim()) {
      toast.error("Please write something first!");
      return;
    }
    setSavingTestimonial(true);
    try {
      const res = await fetch("/api/ambassador/testimonial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonial }),
      });
      if (res.ok) {
        toast.success("Testimonial saved! It will appear on the landing page soon. ✨");
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to save testimonial");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSavingTestimonial(false);
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Quote className="text-white" size={120} />
         </div>
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                     <Quote size={24} /> 
                </div>
                <div>
                    <h2 className="text-2xl font-bold">What You Say</h2>
                    <p className="text-sm text-gray-400">Share your journey as a Webory Ambassador.</p>
                </div>
            </div>
            
            <textarea
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white mb-6 focus:outline-none focus:border-blue-500 transition-colors resize-none placeholder:text-gray-600 min-h-[120px]"
                placeholder="Write your testimonial here... (e.g. 'Being a Webory Ambassador has helped me gain confidence and leadership skills!')"
                value={testimonial}
                onChange={(e) => setTestimonial(e.target.value)}
            />
            
            <Button 
                onClick={handleSaveTestimonial}
                disabled={savingTestimonial}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 px-8 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/10"
            >
                {savingTestimonial ? <Loader2 className="animate-spin mr-2" /> : null}
                {savingTestimonial ? "Saving..." : "Save Testimonial"}
            </Button>
         </div>
    </div>
  );
}
