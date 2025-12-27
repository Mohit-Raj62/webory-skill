"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Briefcase, MapPin, DollarSign, Send, ArrowLeft, CheckCircle2, Building2, Upload, X, Code2, GraduationCap, Zap, Globe, Plus } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  salary: string;
  type: string;
  workMode?: string;
  isActive: boolean;
}



// ... (interfaces remain same)

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  
  // Application Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    coverLetter: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs");
      const data = await response.json();
      if(data.success) {
          setJobs(data.data);
      } else {
          toast.error("Failed to load jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setTimeout(() => {
        document.getElementById("application-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setFile(e.target.files[0]);
      }
  };

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSelectedJob(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    // Phone Validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
        toast.error("Phone number must be exactly 10 digits");
        return;
    }

    if (!file) {
        toast.error("Please upload your resume");
        return;
    }

    setSubmitting(true);
    let resumeUrl = formData.resume;

    try {
       // Upload File First
       setUploading(true);
       const uploadData = new FormData();
       uploadData.append("file", file);
       
       const uploadRes = await fetch("/api/upload/resume", {
           method: "POST",
           body: uploadData
       });
       const uploadResult = await uploadRes.json();

       if (!uploadResult.success) {
           throw new Error(uploadResult.error || "Failed to upload resume");
       }
       resumeUrl = uploadResult.url;
       setUploading(false);

      // Submit Application
      const response = await fetch("/api/careers/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              jobId: selectedJob._id,
              ...formData,
              resume: resumeUrl
          })
      });
      
      const data = await response.json();
      
      if(data.success) {
          toast.success("Application submitted successfully!");
          setFormData({ name: "", email: "", phone: "", resume: "", coverLetter: "" });
          setFile(null);
          setSelectedJob(null);
      } else {
           toast.error(data.error || "Failed to submit application");
      }
    } catch (error: any) {
      console.error("Error applying:", error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Navigation & Actions */}
        <div className="flex justify-between items-center mb-16">
            <Link 
                href="/"
                className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-green-900/20 border border-white/10 hover:border-green-500/50 text-gray-300 hover:text-green-400 transition-all duration-300"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium text-sm">Back to Home</span>
            </Link>


        </div>

        {/* Hero Section */}
        <div className="mb-24 text-center">
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="inline-block mb-4 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-medium tracking-wide uppercase"
          >
            We're Hiring
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white"
          >
            Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Webory Skills</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Empowering the next generation of tech leaders.
            <span className="block mt-3 text-lg text-gray-500 font-normal">Build the future of education with us.</span>
          </motion.p>
        </div>

        {/* Why Join Us Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 max-w-5xl mx-auto"
        >
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4 text-green-400">
                    <Code2 size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Cutting-Edge Tech</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Work with the latest modern stack (Next.js 14, TypeScript, AI). We don't just teach tech; we build with it.
                </p>
            </div>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
                    <GraduationCap size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">Impact Education</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    Directly impact thousands of students. Your code and curriculum shape the developers of tomorrow.
                </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400">
                    <Zap size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">High Velocity</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                    We move fast. Ship features, iterate on feedback, and see your work go live in days, not months.
                </p>
            </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64 border-t border-white/10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-white/10 pt-12">
            
            {/* Job List Layout */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Open Roles</h2>
                <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded">{jobs.length} Positions</span>
              </div>
              
              {jobs.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-lg">
                    <p className="text-gray-500">No positions currently available.</p>
                </div>
              ) : (
                 <div className="space-y-4">
                     {jobs.map((job) => (
                      <motion.div 
                        key={job._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`group p-6 rounded-xl cursor-pointer transition-all border-l-4 ${
                            selectedJob?._id === job._id 
                            ? 'bg-white/10 border-l-blue-500 shadow-lg shadow-black/50' 
                            : 'bg-[#111] border-l-transparent border border-white/5 hover:bg-white/5 hover:border-white/10'
                        }`}
                        onClick={() => setSelectedJob(job)}
                      >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className={`text-xl font-bold mb-3 ${selectedJob?._id === job._id ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                                    {job.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 group-hover:text-gray-400">
                                    <span className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded">
                                        <MapPin size={14}/> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded">
                                        <Building2 size={14}/> {job.type}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-black/20 px-2 py-1 rounded">
                                        <Globe size={14}/> {job.workMode || "Remote"}
                                    </span>
                                </div>
                            </div>
                            {selectedJob?._id === job._id && (
                                <ArrowLeft className="rotate-180 text-white" size={20} />
                            )}
                        </div>
                      </motion.div>
                    ))}
                 </div>
              )}
            </div>

            {/* Application Panel / Details */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                  {selectedJob ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        id="application-form" 
                    >
                        {/* Job Details */}
                        <div className="mb-12">
                            <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">{selectedJob.title}</h2>
                            <div className="prose prose-invert prose-lg text-gray-300 mb-8 max-w-none leading-relaxed">
                                {selectedJob.description}
                            </div>
                            
                            {selectedJob.requirements.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Requirements</h3>
                                    <ul className="space-y-3">
                                        {selectedJob.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-300">
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0Shadow" />
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            <div className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10 w-fit">
                                <div className="text-sm text-gray-400">
                                    <span className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Salary</span>
                                    {selectedJob.salary}
                                </div>
                                <div className="w-px bg-white/10" />
                                <div className="text-sm text-gray-400">
                                    <span className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Type</span>
                                    {selectedJob.type}
                                </div>
                                <div className="w-px bg-white/10" />
                                <div className="text-sm text-gray-400">
                                    <span className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Mode</span>
                                    {selectedJob.workMode || "Remote"}
                                </div>
                            </div>
                        </div>

                      {/* Application Form */}
                      <div className="bg-[#111] rounded-2xl border border-white/10 p-8">
                          <h3 className="text-lg font-bold text-white mb-8 pb-4 border-b border-white/10">
                              Apply for this role
                          </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-400">Full Name</label>
                                    <input
                                    type="text"
                                    id="name"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-400">Email</label>
                                    <input
                                    type="email"
                                    id="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                          <div className="space-y-2">
                              <label htmlFor="phone" className="text-sm font-medium text-gray-400">Phone Number (10 digits)</label>
                              <input
                                type="tel"
                                id="phone"
                                required
                                maxLength={10}
                                placeholder="e.g. 9876543000"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all placeholder:text-gray-700"
                                value={formData.phone}
                                onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} 
                              />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Resume / CV</label>
                            <div className="relative">
                              <input
                                type="file"
                                id="resume"
                                accept=".pdf,image/*"
                                required
                                className="hidden"
                                onChange={handleFileChange}
                              />
                              <label 
                                htmlFor="resume" 
                                className={`w-full flex flex-col items-center justify-center gap-2 bg-white/5 border border-dashed rounded-lg px-4 py-8 cursor-pointer transition-all hover:bg-white/10 ${file ? 'border-green-500/50 bg-green-500/5' : 'border-white/20'}`}
                              >
                                {file ? (
                                    <>
                                        <CheckCircle2 className="text-green-500 h-6 w-6" />
                                        <span className="text-sm text-green-400 font-medium">{file.name}</span>
                                        <span className="text-xs text-gray-500">Click to change</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-6 w-6 text-gray-500" />
                                        <span className="text-sm text-gray-300">Upload Resume (PDF, JPG, PNG)</span>
                                        <span className="text-xs text-gray-600">Max 5MB</span>
                                    </>
                                )}
                              </label>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="coverLetter" className="text-sm font-medium text-gray-400">Cover Letter (Optional)</label>
                            <textarea
                              id="coverLetter"
                              rows={4}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all resize-none"
                              value={formData.coverLetter}
                              onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submitting || uploading}
                            className="w-full py-3.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {uploading ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin h-4 w-4" /> Uploading...
                              </span>
                            ) : submitting ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin h-4 w-4" /> Submitting...
                              </span>
                            ) : (
                              "Submit Application"
                            )}
                          </button>
                        </form>
                      </div>
                    </motion.div>

                  ) : (
                    <div className="hidden lg:flex flex-col items-center justify-center bg-white/5 rounded-2xl border border-white/5 h-[400px]">
                      <h3 className="text-xl font-medium text-white mb-2">Select a Role</h3>
                      <p className="text-gray-500">
                        Choose a position from the left to view details.
                      </p>
                    </div>
                  )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

