"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ScheduledClasses from "@/components/live-classes/ScheduledClasses";

interface LiveDashboardContentProps {
  role: "admin" | "teacher";
}

export default function LiveDashboardContent({ role }: LiveDashboardContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Options state
  const [sessionType, setSessionType] = useState(searchParams.get("type") || "general");
  const [options, setOptions] = useState<any>({ courses: [], internships: [], interviews: [] });
  
  // Selection state
  const [selectedCourse, setSelectedCourse] = useState(searchParams.get("courseId") || "");
  const [selectedInternship, setSelectedInternship] = useState(searchParams.get("internshipId") || "");
  const [selectedApplication, setSelectedApplication] = useState(searchParams.get("applicationId") || "");
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState("");

  useEffect(() => {
    // Fetch courses, internships, and interviews for dropdowns
    // Both admin and teacher can use this endpoint if it doesn't have strict admin role check, or we might need to adjust.
    // For now we'll call the options endpoint. If teacher has a specific one later, we can adjust.
    const fetchOptions = async () => {
      try {
        const res = await fetch("/api/admin/live/options");
        const json = await res.json();
        if (json.success) {
          setOptions(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch options", err);
      }
    };
    fetchOptions();
  }, []);

  const handleStartLive = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Connect to Next.js API to create live session
      const res = await fetch("/api/live/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          sessionType,
          courseId: selectedCourse || undefined,
          internshipId: selectedInternship || undefined,
          applicationId: sessionType === "interview" ? (selectedApplication || undefined) : undefined,
          applicationIds: sessionType === "group-interview" ? (selectedApplications.length > 0 ? selectedApplications : undefined) : undefined,
          moduleId: selectedModule || undefined,
        }),
      });

      const data = await res.json();
      if (data.roomId) {
        // Route correctly depending on role
        if (role === "teacher") {
            router.push(`/teacher/live/${data.roomId}`);
        } else {
            router.push(`/admin/live/${data.roomId}`);
        }
      } else {
        alert("Failed to start live session: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error starting live session:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get modules for selected course/internship
  const getModules = () => {
    if (sessionType === "course" && selectedCourse) {
      const c = options.courses.find((c: any) => c._id === selectedCourse);
      return c ? c.modules : [];
    }
    if (sessionType === "internship" && selectedInternship) {
      const i = options.internships.find((i: any) => i._id === selectedInternship);
      return i ? i.modules : [];
    }
    return [];
  };

  const modulesList = getModules();

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <h1 className="text-3xl font-black mb-8 tracking-tight capitalize">{role} Live Dashboard</h1>
      
      <div className="bg-slate-900/40 border border-white/5 p-8 rounded-3xl max-w-2xl">
        <h2 className="text-xl font-bold mb-6">Start an Instant Live Class</h2>
        
        <form onSubmit={handleStartLive} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Class Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              placeholder="e.g. Introduction to React 19"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Session Type</label>
            <select
              value={sessionType}
              onChange={(e) => {
                setSessionType(e.target.value);
                setSelectedCourse("");
                setSelectedInternship("");
                setSelectedApplication("");
                setSelectedApplications([]);
                setSelectedModule("");
              }}
              className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
            >
              <option value="general">General (Open to all)</option>
              <option value="course">Course specific</option>
              <option value="internship">Internship specific</option>
              {role === "admin" && (
                <>
                  <option value="interview">1-on-1 Interview</option>
                  <option value="group-interview">Group Interview</option>
                </>
              )}
            </select>
          </div>

          {sessionType === "course" && (
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => { setSelectedCourse(e.target.value); setSelectedModule(""); }}
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                required
              >
                <option value="">-- Choose Course --</option>
                {options.courses.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>
          )}

          {sessionType === "internship" && (
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Select Internship</label>
              <select
                value={selectedInternship}
                onChange={(e) => { setSelectedInternship(e.target.value); setSelectedModule(""); }}
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                required
              >
                <option value="">-- Choose Internship --</option>
                {options.internships.map((i: any) => (
                  <option key={i._id} value={i._id}>{i.title}</option>
                ))}
              </select>
            </div>
          )}

          {(sessionType === "interview" || sessionType === "group-interview") && role === "admin" && (
            <>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Select Internship (Role)</label>
                <select
                  value={selectedInternship}
                  onChange={(e) => { setSelectedInternship(e.target.value); setSelectedApplication(""); setSelectedApplications([]); }}
                  className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  required
                >
                  <option value="">-- Choose Internship --</option>
                  {options.internships.map((i: any) => (
                    <option key={i._id} value={i._id}>{i.title}</option>
                  ))}
                </select>
              </div>

              {selectedInternship && (
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Select Interview Candidate(s)</label>
                  {sessionType === "interview" ? (
                    <select
                      value={selectedApplication}
                      onChange={(e) => setSelectedApplication(e.target.value)}
                      className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                      required
                    >
                      <option value="">-- Choose Candidate --</option>
                      {options.interviews
                        .filter((app: any) => app.internship?._id === selectedInternship)
                        .map((app: any) => (
                          <option key={app._id} value={app._id}>
                            {app.student?.firstName} {app.student?.lastName} - {new Date(app.interviewDate || app.appliedAt || Date.now()).toLocaleDateString()}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto bg-black/20 border border-white/5 rounded-xl p-4">
                      {options.interviews
                        .filter((app: any) => app.internship?._id === selectedInternship)
                        .map((app: any) => (
                          <label key={app._id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <input
                              type="checkbox"
                              checked={selectedApplications.includes(app._id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedApplications([...selectedApplications, app._id]);
                                } else {
                                  setSelectedApplications(selectedApplications.filter(id => id !== app._id));
                                }
                              }}
                              className="h-4 w-4 rounded border-white/10 bg-black/50 text-emerald-500 focus:ring-emerald-500/50"
                            />
                            <span className="text-sm text-slate-300">
                              {app.student?.firstName} {app.student?.lastName} - {new Date(app.interviewDate || app.appliedAt || Date.now()).toLocaleDateString()}
                            </span>
                          </label>
                        ))}
                      {options.interviews.filter((app: any) => app.internship?._id === selectedInternship).length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-2">No candidates found.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {(sessionType === "course" || sessionType === "internship") && modulesList.length > 0 && (
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Select Module (Optional)</label>
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              >
                <option value="">-- Entire Course/Internship --</option>
                {modulesList.map((m: any) => (
                  <option key={m._id} value={m._id}>{m.title}</option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors h-32 resize-none"
              placeholder="What will you cover in this session?"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-[0_10px_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
          >
            {loading ? "Starting..." : "Start Instant Session"}
          </button>
        </form>
      </div>
      
      <ScheduledClasses role={role} />
    </div>
  );
}
