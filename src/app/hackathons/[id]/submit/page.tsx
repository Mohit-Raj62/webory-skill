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
  Layout,
  Users,
  User,
  Plus,
  Trash2,
  ArrowRight,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  name: string;
  email: string;
  phone: string;
  role: string;
  college: string;
  course: string;
  branch: string;
  year: string;
}

export default function HackathonSubmissionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [hackathon, setHackathon] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1); // 1 = Team Setup, 2 = Project Details
  const [isExisting, setIsExisting] = useState(false); // true if editing existing submission
  const [fetchingExisting, setFetchingExisting] = useState(true);
  
  // Team Registration State
  const [participationType, setParticipationType] = useState<"individual" | "team">("individual");
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "", email: "", phone: "", role: "", college: "", course: "", branch: "", year: "" }
  ]);

  // Project Submission State
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    githubUrl: "",
    demoUrl: "",
    techStack: ""
  });

  useEffect(() => {
    // Fetch hackathon info
    fetch(`/api/hackathons/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setHackathon(data.data);
      })
      .catch(err => console.error(err));

    // Fetch existing submission
    fetch(`/api/hackathons/submit?hackathonId=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const sub = data.data;
          setIsExisting(true);
          setParticipationType(sub.participationType || "individual");
          setTeamName(sub.teamName || "");
          if (sub.teamMemberDetails && sub.teamMemberDetails.length > 0) {
            setTeamMembers(sub.teamMemberDetails);
          }
          setFormData({
            projectName: sub.projectName || "",
            projectDescription: sub.projectDescription || "",
            githubUrl: sub.githubUrl || "",
            demoUrl: sub.demoUrl || "",
            techStack: Array.isArray(sub.techStack) ? sub.techStack.join(", ") : (sub.techStack || "")
          });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setFetchingExisting(false));
  }, [id]);

  const addTeamMember = () => {
    if (teamMembers.length >= 5) {
      toast.error("Maximum 5 team members allowed.");
      return;
    }
    setTeamMembers([...teamMembers, { name: "", email: "", phone: "", role: "", college: "", course: "", branch: "", year: "" }]);
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length <= 1) {
      toast.error("At least one team member is required.");
      return;
    }
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const validateStep1 = () => {
    if (participationType === "team") {
      if (!teamName.trim()) {
        toast.error("Please enter your team name.");
        return false;
      }
      for (let i = 0; i < teamMembers.length; i++) {
        if (!teamMembers[i].name.trim() || !teamMembers[i].email.trim()) {
          toast.error(`Please fill Name and Email for team member ${i + 1}.`);
          return false;
        }
      }
    }
    return true;
  };

  const goToStep2 = async () => {
    if (validateStep1()) {
      setLoading(true);
      try {
        const res = await fetch("/api/hackathons/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hackathonId: id,
            participationType,
            teamName: participationType === "team" ? teamName : "",
            teamMemberDetails: participationType === "team" ? teamMembers : [],
            isDraft: true,
          })
        });

        const data = await res.json();
        if (res.ok) {
          setIsExisting(true);
          toast.success(data.updated ? "Team updated! 💾" : "Team registered successfully! 🎉");
          setCurrentStep(2);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          toast.error(data.error || "Failed to save registration.");
        }
      } catch (error) {
        toast.error("Network error saving draft.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/hackathons/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hackathonId: id,
          participationType,
          teamName: participationType === "team" ? teamName : "",
          teamMemberDetails: participationType === "team" ? teamMembers : [],
          ...formData,
          techStack: formData.techStack.split(",").map(s => s.trim())
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || (data.updated ? "Submission updated successfully! ✅" : "Project submitted successfully! 🚀"));
        router.push("/hackathons");
        router.refresh();
      } else {
        toast.error(data.error || "Submission failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: "Team Setup", icon: Users },
    { num: 2, title: "Project Details", icon: Code }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      
      <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
        {fetchingExisting ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
          </div>
        ) : (
        <>
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
        >
            <button 
                onClick={() => currentStep === 2 ? setCurrentStep(1) : router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group mb-6"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {currentStep === 2 ? "Back to Team Setup" : "Back to Arena"}
                </span>
            </button>
            <h1 className="text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-none">
                {isExisting ? "Update" : "Submit"} Your <span className="text-orange-500">Masterpiece</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2">Uploading for: {hackathon?.title || "Loading..."}</p>
        </motion.div>

        {/* Existing Submission Banner */}
        {isExisting && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-green-600/10 border border-green-500/20 flex items-start gap-4"
          >
            <div className="p-2 rounded-xl bg-green-600/20 text-green-500 shrink-0 mt-0.5">
              <CheckCircle size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase text-green-400">You&apos;ve already submitted!</h4>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Your previous submission is loaded below. You can edit any field and click &quot;Update&quot; to save changes, or simply go back if nothing needs to change.
              </p>
            </div>
          </motion.div>
        )}

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-10">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center gap-3 flex-1">
              <div 
                onClick={() => step.num < currentStep ? setCurrentStep(step.num) : null}
                className={`flex items-center gap-3 flex-1 p-4 rounded-2xl border transition-all cursor-pointer ${
                  currentStep === step.num 
                    ? 'bg-orange-600/10 border-orange-500/30 text-orange-500' 
                    : currentStep > step.num 
                      ? 'bg-green-600/10 border-green-500/30 text-green-500'
                      : 'bg-white/[0.02] border-white/5 text-gray-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                  currentStep === step.num 
                    ? 'bg-orange-600 text-white' 
                    : currentStep > step.num 
                      ? 'bg-green-600 text-white'
                      : 'bg-white/5 text-gray-600'
                }`}>
                  {currentStep > step.num ? <CheckCircle size={14} /> : step.num}
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase tracking-widest opacity-60">Step {step.num}</div>
                  <div className="text-xs font-black uppercase">{step.title}</div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-[2px] shrink-0 ${currentStep > step.num ? 'bg-green-500' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ════════════ STEP 1: TEAM SETUP ════════════ */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="bg-white/[0.02] border border-white/5 p-8 lg:p-12 rounded-[3rem] shadow-2xl backdrop-blur-3xl space-y-8">
                {/* Participation Type Toggle */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">How are you participating?</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setParticipationType("individual")}
                      className={`relative p-6 rounded-2xl border-2 transition-all text-left space-y-3 group ${
                        participationType === "individual"
                          ? "border-orange-500 bg-orange-600/5 shadow-lg shadow-orange-500/10"
                          : "border-white/5 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        participationType === "individual" ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-600'
                      }`}>
                        <User size={20} />
                      </div>
                      <div>
                        <h3 className="font-black uppercase text-sm">Individual</h3>
                        <p className="text-[10px] text-gray-500 font-medium mt-1">Solo warrior. You&apos;re on your own.</p>
                      </div>
                      {participationType === "individual" && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle size={16} className="text-orange-500" />
                        </div>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setParticipationType("team")}
                      className={`relative p-6 rounded-2xl border-2 transition-all text-left space-y-3 group ${
                        participationType === "team"
                          ? "border-orange-500 bg-orange-600/5 shadow-lg shadow-orange-500/10"
                          : "border-white/5 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        participationType === "team" ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-600'
                      }`}>
                        <Users size={20} />
                      </div>
                      <div>
                        <h3 className="font-black uppercase text-sm">Team</h3>
                        <p className="text-[10px] text-gray-500 font-medium mt-1">Two or more. Build together.</p>
                      </div>
                      {participationType === "team" && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle size={16} className="text-orange-500" />
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Team Details - Only shown for team participation */}
                <AnimatePresence>
                  {participationType === "team" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden space-y-8"
                    >
                      {/* Team Name */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 flex items-center gap-2">
                          <Shield size={10} /> Team Name *
                        </label>
                        <div className="relative">
                          <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                          <Input 
                              value={teamName}
                              onChange={e => setTeamName(e.target.value)}
                              placeholder="e.g., Code Crusaders" 
                              className="bg-white/[0.03] border-white/5 pl-12 h-14 rounded-2xl text-white focus:border-orange-500/50"
                          />
                        </div>
                      </div>

                      {/* Team Members List */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 flex items-center gap-2">
                            <Users size={10} /> Team Members ({teamMembers.length}/5)
                          </label>
                          <Button
                            type="button"
                            onClick={addTeamMember}
                            disabled={teamMembers.length >= 5}
                            className="bg-white/5 border border-dashed border-white/10 hover:bg-white/10 text-white text-xs font-black uppercase h-9 px-4 rounded-xl"
                          >
                            <Plus size={12} className="mr-1.5" /> Add Member
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {teamMembers.map((member, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="relative p-[1px] rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-white/5"
                            >
                              <div className="bg-[#0A0A0A] rounded-3xl p-6 space-y-4">
                                {/* Member Header */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-orange-600/10 text-orange-500 flex items-center justify-center text-xs font-black">
                                      {idx + 1}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                      {idx === 0 ? "Team Leader" : `Member ${idx + 1}`}
                                    </span>
                                  </div>
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => removeTeamMember(idx)}
                                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-all"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </div>

                                {/* Member Form Content */}
                                <div className="space-y-6">
                                  {/* Primary Details Row */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-3.5 h-3.5" />
                                      <Input 
                                        value={member.name}
                                        onChange={e => updateTeamMember(idx, "name", e.target.value)}
                                        placeholder="Full Name *"
                                        className="bg-white/[0.03] border-white/5 pl-10 h-12 rounded-xl text-white text-sm focus:border-orange-500/50"
                                      />
                                    </div>
                                    <div className="relative">
                                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-3.5 h-3.5" />
                                      <Input 
                                        type="email"
                                        value={member.email}
                                        onChange={e => updateTeamMember(idx, "email", e.target.value)}
                                        placeholder="Email Address *"
                                        className="bg-white/[0.03] border-white/5 pl-10 h-12 rounded-xl text-white text-sm focus:border-orange-500/50"
                                      />
                                    </div>
                                  </div>

                                  {/* Contact, Role & Year Row */}
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="relative">
                                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-3.5 h-3.5" />
                                      <Input 
                                        value={member.phone}
                                        onChange={e => updateTeamMember(idx, "phone", e.target.value)}
                                        placeholder="Phone"
                                        className="bg-white/[0.03] border-white/5 pl-10 h-12 rounded-xl text-white text-sm focus:border-orange-500/50"
                                      />
                                    </div>
                                    <div className="relative">
                                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-3.5 h-3.5" />
                                      <Input 
                                        value={member.role}
                                        onChange={e => updateTeamMember(idx, "role", e.target.value)}
                                        placeholder="Role (e.g. Frontend)"
                                        className="bg-white/[0.03] border-white/5 pl-10 h-12 rounded-xl text-white text-sm focus:border-orange-500/50"
                                      />
                                    </div>
                                    <div className="relative">
                                      <select 
                                        value={member.year}
                                        onChange={e => updateTeamMember(idx, "year", e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/5 h-12 rounded-xl text-white text-sm focus:border-orange-500/50 outline-none px-4 appearance-none"
                                      >
                                        <option value="" disabled className="bg-black text-gray-400">Academic Year</option>
                                        <option value="1st Year" className="bg-black">1st Year</option>
                                        <option value="2nd Year" className="bg-black">2nd Year</option>
                                        <option value="3rd Year" className="bg-black">3rd Year</option>
                                        <option value="4th Year" className="bg-black">4th Year</option>
                                        <option value="Graduated" className="bg-black">Graduated</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Education Section */}
                                  <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 space-y-4">
                                    <div className="flex items-center gap-2 mb-1">
                                      <GraduationCap size={14} className="text-gray-500" />
                                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Education Details</span>
                                    </div>
                                    <div className="relative">
                                      <Input 
                                        value={member.college}
                                        onChange={e => updateTeamMember(idx, "college", e.target.value)}
                                        placeholder="College or organization name"
                                        className="bg-white/[0.03] border-white/5 px-4 h-12 rounded-xl text-white text-sm focus:border-orange-500/50"
                                      />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <Input 
                                        value={member.course}
                                        onChange={e => updateTeamMember(idx, "course", e.target.value)}
                                        placeholder="Course (e.g. B.Tech)"
                                        className="bg-white/[0.03] border-white/5 px-4 h-12 rounded-xl text-white text-sm focus:border-orange-500/50"
                                      />
                                      <Input 
                                        value={member.branch}
                                        onChange={e => updateTeamMember(idx, "branch", e.target.value)}
                                        placeholder="Branch (e.g. CS)"
                                        className="bg-white/[0.03] border-white/5 px-4 h-12 rounded-xl text-white text-sm focus:border-orange-500/50"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Individual Info Panel */}
                {participationType === "individual" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 rounded-2xl bg-orange-600/5 border border-orange-500/10 flex items-start gap-4"
                  >
                    <div className="p-3 rounded-xl bg-orange-600/20 text-orange-500 shrink-0">
                      <User size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black uppercase">Solo Participation</h4>
                      <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                        You will be registered as an individual participant. Your logged-in account details will be used for verification. Click &quot;Next&quot; to proceed to project submission.
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Next Button */}
              <Button 
                type="button"
                onClick={goToStep2}
                disabled={loading}
                className="w-full h-16 rounded-[2rem] bg-white hover:bg-orange-500 text-black hover:text-white font-black uppercase tracking-[0.1em] text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                  <>
                    Next: Project Details
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {/* ════════════ STEP 2: PROJECT DETAILS ════════════ */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Team Summary Banner */}
              {participationType === "team" && (
                <div className="mb-8 p-4 rounded-2xl bg-orange-600/5 border border-orange-500/10 flex items-center gap-4">
                  <div className="p-2 rounded-xl bg-orange-600/20 text-orange-500">
                    <Users size={16} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Team</span>
                    <div className="text-sm font-black text-white">{teamName} · {teamMembers.length} member{teamMembers.length > 1 ? "s" : ""}</div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setCurrentStep(1)} 
                    className="text-[9px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400"
                  >
                    Edit Team
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8 bg-white/[0.02] border border-white/5 p-8 lg:p-12 rounded-[3rem] shadow-2xl backdrop-blur-3xl">
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
                    {isExisting ? "Update My Project" : "Ship My Project"}
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        </>
        )}
      </div>

      <Footer />
    </main>
  );
}
