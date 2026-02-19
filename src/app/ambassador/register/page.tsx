"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Building2, Linkedin, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AmbassadorRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Check if user is already an ambassador
    fetch("/api/ambassador/stats")
      .then((res) => {
        if (res.ok) {
            toast.info("You're already an ambassador! Redirecting to dashboard...");
            router.push("/ambassador/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const [formData, setFormData] = useState({
    college: "",
    linkedin: "",
    reason: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/ambassador/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Application submitted successfully!");
        router.push("/ambassador/dashboard");
      } else {
        if (data.error === "You have already applied") {
            toast.info("You are already an ambassador! Redirecting...", { duration: 2000 });
            router.push("/ambassador/dashboard");
            return;
        }
        toast.error(data.error || "Failed to submit application");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
      <Navbar />

      <div className="pt-32 pb-20 container mx-auto px-4 max-w-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Join the <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Revolution</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Apply to become a Campus Ambassador and lead the change in your college.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            {/* Glow Effect */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-500"></div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                {/* College Input */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Building2 size={16} /> College / University
                    </label>
                    <input 
                        type="text" 
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        placeholder="e.g. IIT Bombay" 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all hover:border-white/20"
                        required
                    />
                </div>

                {/* LinkedIn Input */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Linkedin size={16} /> LinkedIn Profile
                    </label>
                    <input 
                        type="url" 
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/your-profile" 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all hover:border-white/20"
                        required
                    />
                </div>

                {/* Reason Input */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <MessageSquare size={16} /> Why do you want to join?
                    </label>
                    <textarea 
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="Tell us about your leadership skills..." 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 h-32 resize-none transition-all hover:border-white/20"
                        required
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 rounded-xl text-lg shadow-lg shadow-blue-500/20 mt-4"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin" /> Submitting...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Submit Application <ArrowRight size={20} />
                        </span>
                    )}
                </Button>

            </form>
        </div>

      </div>

      <Footer />
    </main>
  );
}
