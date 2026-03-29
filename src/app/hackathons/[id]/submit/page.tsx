"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Github, 
  Globe, 
  MessageSquare, 
  Code, 
  Rocket, 
  Loader2, 
  CheckCircle,
  ArrowLeft,
  Layout
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function HackathonSubmissionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hackathon, setHackathon] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    githubUrl: "",
    demoUrl: "",
    techStack: ""
  });

  useEffect(() => {
    // Fetch hackathon details to verify registration and title
    fetch(`/api/hackathons/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setHackathon(data.data);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/hackathons/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hackathonId: id,
          ...formData,
          techStack: formData.techStack.split(",").map(s => s.trim())
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Project submitted successfully! 🚀");
        router.push("/hackathons");
      } else {
        toast.error(data.error || "Submission failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 container mx-auto px-4 max-w-3xl">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
        >
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group mb-6"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Back to Arena</span>
            </button>
            <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-none">
                Submit Your <span className="text-orange-500">Masterpiece</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2">Uploading for: {hackathon?.title || "Loading..."}</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white/[0.02] border border-white/5 p-8 lg:p-12 rounded-[3.5rem] shadow-2xl backdrop-blur-3xl">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Project Name *</label>
                    <div className="relative">
                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 transition-colors w-4 h-4" />
                        <Input 
                            value={formData.projectName}
                            onChange={e => setFormData({...formData, projectName: e.target.value})}
                            placeholder="e.g. Webory Dash" 
                            className="bg-white/[0.03] border-white/5 pl-12 h-14 rounded-2xl text-white focus:border-orange-500/50"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Tell us about your project *</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-5 text-gray-600 w-4 h-4" />
                        <textarea 
                            value={formData.projectDescription}
                            onChange={e => setFormData({...formData, projectDescription: e.target.value})}
                            placeholder="What problem does it solve? What features did you build?"
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 pl-12 min-h-[180px] outline-none text-white focus:border-orange-500/50 transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">GitHub Repository *</label>
                        <div className="relative">
                            <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                            <Input 
                                value={formData.githubUrl}
                                onChange={e => setFormData({...formData, githubUrl: e.target.value})}
                                placeholder="https://github.com/..." 
                                className="bg-white/[0.03] border-white/5 pl-12 h-14 rounded-2xl text-white focus:border-orange-500/50"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Live Demo / Video URL</label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                            <Input 
                                value={formData.demoUrl}
                                onChange={e => setFormData({...formData, demoUrl: e.target.value})}
                                placeholder="https://demo.com" 
                                className="bg-white/[0.03] border-white/5 pl-12 h-14 rounded-2xl text-white focus:border-orange-500/50"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Tech Stack (comma separated) *</label>
                    <div className="relative">
                        <Code className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                        <Input 
                            value={formData.techStack}
                            onChange={e => setFormData({...formData, techStack: e.target.value})}
                            placeholder="e.g. React, Next.js, Node, MongoDB" 
                            className="bg-white/[0.03] border-white/5 pl-12 h-14 rounded-2xl text-white focus:border-orange-500/50"
                            required
                        />
                    </div>
                </div>
            </div>

            <Button 
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-[2rem] bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-[0.1em] text-lg shadow-2xl shadow-orange-500/20 active:scale-95 transition-all"
            >
                {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Rocket className="mr-2 h-5 w-5" />}
                Ship My Project
            </Button>
        </form>
      </div>

      <Footer />
    </main>
  );
}
