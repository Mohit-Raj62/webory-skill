"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
    User, Mail, Phone, Linkedin, Github, Globe, GraduationCap, 
    Briefcase, Trophy, Code, Save, ChevronRight, ChevronLeft, 
    Plus, Trash2, CheckCircle2, Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface StepProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export function StudentInfoForm({ initialUser }: { initialUser: any }) {
    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        firstName: initialUser.firstName || "",
        lastName: initialUser.lastName || "",
        email: initialUser.email || "",
        phone: initialUser.phone || "",
        bio: initialUser.bio || "",
        socialLinks: {
            linkedin: initialUser.socialLinks?.linkedin || "",
            github: initialUser.socialLinks?.github || "",
            twitter: initialUser.socialLinks?.twitter || "",
            website: initialUser.socialLinks?.website || "",
        },
        education: initialUser.education?.length > 0 ? initialUser.education : [
            { institution: "", degree: "", startDate: "", endDate: "", current: false, description: "", learnings: "", achievements: "" }
        ],
        experience: initialUser.experience?.length > 0 ? initialUser.experience : [],
        externalHackathons: initialUser.externalHackathons?.length > 0 ? initialUser.externalHackathons : [],
        projects: initialUser.projects?.length > 0 ? initialUser.projects : [],
        skills: initialUser.skills || [],
    });

    const router = useRouter();

    const updateFormData = (newData: any) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to update profile");

            toast.success("Profile updated successfully!");
            router.push("/profile");
            router.refresh();
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save profile. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 5));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const steps = [
        { id: 1, title: "Personal", icon: User },
        { id: 2, title: "Education", icon: GraduationCap },
        { id: 3, title: "Experience", icon: Briefcase },
        { id: 4, title: "Hackathons", icon: Trophy },
        { id: 5, title: "Skills", icon: Code },
    ];

    return (
        <div className="relative">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-12 relative px-4">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2 z-0" />
                <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 -translate-y-1/2 z-0 transition-all duration-500" 
                    style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                />
                {steps.map((s) => (
                    <div key={s.id} className="relative z-10 flex flex-col items-center">
                        <motion.button
                            onClick={() => setStep(s.id)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                step >= s.id 
                                ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20" 
                                : "bg-slate-900 border border-white/10 text-slate-500"
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <s.icon size={18} />
                        </motion.button>
                        <span className={`text-[10px] font-black uppercase tracking-widest mt-2 ${step >= s.id ? "text-white" : "text-slate-500"}`}>
                            {s.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Form Content */}
            <div className="glass-card p-6 md:p-10 rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {step === 1 && <PersonalInfoStep formData={formData} updateFormData={updateFormData} />}
                        {step === 2 && <EducationStep formData={formData} updateFormData={updateFormData} />}
                        {step === 3 && <ExperienceStep formData={formData} updateFormData={updateFormData} />}
                        {step === 4 && <HackathonsStep formData={formData} updateFormData={updateFormData} />}
                        {step === 5 && <SkillsStep formData={formData} updateFormData={updateFormData} />}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
                    <Button
                        onClick={prevStep}
                        disabled={step === 1}
                        className="h-12 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] border border-white/5 disabled:opacity-0 transition-all"
                    >
                        <ChevronLeft size={16} className="mr-2" /> Back
                    </Button>

                    {step < 5 ? (
                        <Button
                            onClick={nextStep}
                            className="h-12 px-8 rounded-2xl bg-white text-black hover:bg-blue-500 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 group shadow-xl"
                        >
                            Next Step <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-12 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20"
                        >
                            {isSaving ? "Saving..." : <><Save size={16} /> Complete Profile</>}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

function PersonalInfoStep({ formData, updateFormData }: StepProps) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400"><User size={24} /></div>
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Basic Information</h2>
                    <p className="text-sm text-slate-500 font-medium tracking-tight">Your global identity on Webory Skills.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                    <Input 
                        value={formData.firstName} 
                        onChange={(e: any) => updateFormData({ firstName: e.target.value })}
                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                    <Input 
                        value={formData.lastName} 
                        onChange={(e: any) => updateFormData({ lastName: e.target.value })}
                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <Input 
                        value={formData.email} 
                        disabled
                        className="h-12 bg-white/5 border-white/10 rounded-xl opacity-50 cursor-not-allowed"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <Input 
                        value={formData.phone} 
                        onChange={(e: any) => updateFormData({ phone: e.target.value })}
                        placeholder="+91 00000 00000"
                        className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Profile Bio (Professional Summary)</label>
                <Textarea 
                    value={formData.bio} 
                    onChange={(e: any) => updateFormData({ bio: e.target.value })}
                    placeholder="Briefly describe your passion and expertise..."
                    className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Linkedin size={12} className="text-blue-500" /> LinkedIn URL
                    </label>
                    <Input 
                        value={formData.socialLinks.linkedin} 
                        onChange={(e: any) => updateFormData({ socialLinks: { ...formData.socialLinks, linkedin: e.target.value } })}
                        placeholder="linkedin.com/in/username"
                        className="h-12 bg-white/5 border-white/10 rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        <Github size={12} className="text-purple-500" /> GitHub URL
                    </label>
                    <Input 
                        value={formData.socialLinks.github} 
                        onChange={(e: any) => updateFormData({ socialLinks: { ...formData.socialLinks, github: e.target.value } })}
                        placeholder="github.com/username"
                        className="h-12 bg-white/5 border-white/10 rounded-xl"
                    />
                </div>
            </div>
        </div>
    );
}

function EducationStep({ formData, updateFormData }: StepProps) {
    const addEducation = () => {
        const newEdu = [...formData.education, { institution: "", degree: "", startDate: "", endDate: "", current: false, description: "", learnings: "", achievements: "" }];
        updateFormData({ education: newEdu });
    };

    const removeEducation = (index: number) => {
        const newEdu = formData.education.filter((_: any, i: number) => i !== index);
        updateFormData({ education: newEdu });
    };

    const updateEdu = (index: number, field: string, value: any) => {
        const newEdu = [...formData.education];
        newEdu[index] = { ...newEdu[index], [field]: value };
        updateFormData({ education: newEdu });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400"><GraduationCap size={24} /></div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Academic Journey</h2>
                        <p className="text-sm text-slate-500 font-medium tracking-tight">Your school and university life.</p>
                    </div>
                </div>
                <Button onClick={addEducation} className="h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] border border-white/10 flex items-center gap-2">
                    <Plus size={14} /> Add Education
                </Button>
            </div>

            <div className="space-y-10">
                {formData.education.map((edu: any, index: number) => (
                    <div key={index} className="relative p-6 rounded-3xl bg-white/5 border border-white/5 group/edu overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 opacity-50" />
                        <button 
                            onClick={() => removeEducation(index)} 
                            className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover/edu:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Institution / School Name</label>
                                <Input 
                                    value={edu.institution} 
                                    onChange={(e: any) => updateEdu(index, "institution", e.target.value)}
                                    placeholder="e.g. Stanford University or Delhi Public School"
                                    className="h-12 bg-slate-900 border-white/5 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Degree / Standard</label>
                                <Input 
                                    value={edu.degree} 
                                    onChange={(e: any) => updateEdu(index, "degree", e.target.value)}
                                    placeholder="e.g. B.Tech Computer Science or 12th Grade"
                                    className="h-12 bg-slate-900 border-white/5 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                                <Input 
                                    type="date"
                                    value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ""} 
                                    onChange={(e: any) => updateEdu(index, "startDate", e.target.value)}
                                    className="h-12 bg-slate-900 border-white/5 rounded-xl text-slate-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date (or Expected)</label>
                                <Input 
                                    type="date"
                                    value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ""} 
                                    onChange={(e: any) => updateEdu(index, "endDate", e.target.value)}
                                    className="h-12 bg-slate-900 border-white/5 rounded-xl text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Sparkles size={12} className="text-yellow-500" /> Key Learnings
                                </label>
                                <Textarea 
                                    value={edu.learnings} 
                                    onChange={(e: any) => updateEdu(index, "learnings", e.target.value)}
                                    placeholder="What did you learn here? (e.g. Data Structures, Physics...)"
                                    className="min-h-[100px] bg-slate-900 border-white/5 rounded-2xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <CheckCircle2 size={12} className="text-emerald-500" /> Major Achievements
                                </label>
                                <Textarea 
                                    value={edu.achievements} 
                                    onChange={(e: any) => updateEdu(index, "achievements", e.target.value)}
                                    placeholder="What were your top wins? (e.g. 95% Marks, Debate winner...)"
                                    className="min-h-[100px] bg-slate-900 border-white/5 rounded-2xl"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ExperienceStep({ formData, updateFormData }: StepProps) {
    const addExperience = () => {
        const newExp = [...formData.experience, { title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "", learnings: "", achievements: "" }];
        updateFormData({ experience: newExp });
    };

    const removeExperience = (index: number) => {
        const newExp = formData.experience.filter((_: any, i: number) => i !== index);
        updateFormData({ experience: newExp });
    };

    const updateExp = (index: number, field: string, value: any) => {
        const newExp = [...formData.experience];
        newExp[index] = { ...newExp[index], [field]: value };
        updateFormData({ experience: newExp });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400"><Briefcase size={24} /></div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Professional Arc</h2>
                        <p className="text-sm text-slate-500 font-medium tracking-tight">Your internships, jobs, and leadership roles.</p>
                    </div>
                </div>
                <Button onClick={addExperience} className="h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] border border-white/10 flex items-center gap-2">
                    <Plus size={14} /> Add Role
                </Button>
            </div>

            <div className="space-y-8">
                {formData.experience.length === 0 && (
                    <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/5">
                        <Briefcase size={32} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-500 font-bold">No experience added yet. Internships count too!</p>
                    </div>
                )}
                {formData.experience.map((exp: any, index: number) => (
                    <div key={index} className="relative p-6 rounded-3xl bg-white/5 border border-white/5 group/exp overflow-hidden transition-all duration-300 hover:bg-white/[0.07]">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-50" />
                        <button 
                            onClick={() => removeExperience(index)} 
                            className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover/exp:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Title / Role</label>
                                <Input 
                                    value={exp.title} 
                                    onChange={(e: any) => updateExp(index, "title", e.target.value)}
                                    placeholder="e.g. Frontend Intern or Campus Ambassador"
                                    className="h-12 bg-slate-900 border-white/5 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company / Organization</label>
                                <Input 
                                    value={exp.company} 
                                    onChange={(e: any) => updateExp(index, "company", e.target.value)}
                                    placeholder="e.g. Google or University Club"
                                    className="h-12 bg-slate-900 border-white/5 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                                <Input 
                                    type="date"
                                    value={exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : ""} 
                                    onChange={(e: any) => updateExp(index, "startDate", e.target.value)}
                                    className="h-12 bg-slate-900 border-white/5 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                                <Input 
                                    type="date"
                                    value={exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ""} 
                                    onChange={(e: any) => updateExp(index, "endDate", e.target.value)}
                                    disabled={exp.current}
                                    className="h-12 bg-slate-900 border-white/5 rounded-xl disabled:opacity-30"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Description & Impact</label>
                                <Textarea 
                                    value={exp.description} 
                                    onChange={(e: any) => updateExp(index, "description", e.target.value)}
                                    placeholder="Talk about your responsibilities and the impact you made..."
                                    className="min-h-[100px] bg-slate-900 border-white/5 rounded-2xl"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function HackathonsStep({ formData, updateFormData }: StepProps) {
    const addHack = () => {
        const newHacks = [...formData.externalHackathons, { title: "", projectName: "", description: "", date: "", role: "" }];
        updateFormData({ externalHackathons: newHacks });
    };

    const removeHack = (index: number) => {
        const newHacks = formData.externalHackathons.filter((_: any, i: number) => i !== index);
        updateFormData({ externalHackathons: newHacks });
    };

    const updateHack = (index: number, field: string, value: any) => {
        const newHacks = [...formData.externalHackathons];
        newHacks[index] = { ...newHacks[index], [field]: value };
        updateFormData({ externalHackathons: newHacks });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-500"><Trophy size={24} /></div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Hackathons & Wins</h2>
                        <p className="text-sm text-slate-500 font-medium tracking-tight">External achievements outside of Webory.</p>
                    </div>
                </div>
                <Button onClick={addHack} className="h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[9px] border border-white/10 flex items-center gap-2">
                    <Plus size={14} /> Add Hackathon
                </Button>
            </div>

            <div className="space-y-6">
                {formData.externalHackathons.length === 0 && (
                    <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/5">
                        <Trophy size={32} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-500 font-bold">Participated in an external hackathon? Add it here.</p>
                    </div>
                )}
                {formData.externalHackathons.map((hack: any, index: number) => (
                    <div key={index} className="relative p-6 rounded-3xl bg-slate-900/60 border border-white/5 group/hack">
                        <button 
                            onClick={() => removeHack(index)} 
                            className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-400 opacity-0 group-hover/hack:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hackathon Title</label>
                                <Input 
                                    value={hack.title} 
                                    onChange={(e: any) => updateHack(index, "title", e.target.value)}
                                    placeholder="e.g. Smart India Hackathon"
                                    className="h-12 bg-slate-950 border-white/5 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Team Role / Contribution</label>
                                <Input 
                                    value={hack.role} 
                                    onChange={(e: any) => updateHack(index, "role", e.target.value)}
                                    placeholder="e.g. Lead Machine Learning or Backend"
                                    className="h-12 bg-slate-950 border-white/5 rounded-xl"
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Name</label>
                                <Input 
                                    value={hack.projectName} 
                                    onChange={(e: any) => updateHack(index, "projectName", e.target.value)}
                                    placeholder="e.g. HealthSync AI"
                                    className="h-12 bg-slate-950 border-white/5 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                                <Input 
                                    type="date"
                                    value={hack.date ? new Date(hack.date).toISOString().split('T')[0] : ""} 
                                    onChange={(e: any) => updateHack(index, "date", e.target.value)}
                                    className="h-12 bg-slate-950 border-white/5 rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Short Description of Project</label>
                            <Textarea 
                                value={hack.description} 
                                onChange={(e: any) => updateHack(index, "description", e.target.value)}
                                placeholder="What did you build? What was the outcome?"
                                className="min-h-[80px] bg-slate-950 border-white/5 rounded-2xl"
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex gap-4 items-center">
                <Sparkles className="text-blue-400 shrink-0" size={24} />
                <p className="text-xs text-blue-200/70 font-medium leading-relaxed">
                    <span className="text-blue-400 font-black">Pro-tip:</span> Hackathons you joined here on <span className="text-white font-bold">Webory</span> are automatically added to your resume. Only add hackathons from other platforms here!
                </p>
            </div>
        </div>
    );
}

function SkillsStep({ formData, updateFormData }: StepProps) {
    const [newSkill, setNewSkill] = useState("");

    const addSkill = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newSkill.trim()) return;
        if (formData.skills.includes(newSkill.trim())) {
            setNewSkill("");
            return;
        }
        updateFormData({ skills: [...formData.skills, newSkill.trim()] });
        setNewSkill("");
    };

    const removeSkill = (skill: string) => {
        updateFormData({ skills: formData.skills.filter((s: string) => s !== skill) });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400"><Code size={24} /></div>
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Skill Matrix</h2>
                    <p className="text-sm text-slate-500 font-medium tracking-tight">The weapons in your professional arsenal.</p>
                </div>
            </div>

            <div className="space-y-6">
                <form onSubmit={addSkill} className="flex gap-2">
                    <Input 
                        value={newSkill} 
                        onChange={(e: any) => setNewSkill(e.target.value)}
                        placeholder="e.g. Next.js, Python, Figma, AWS..."
                        className="h-12 bg-white/5 border-white/10 rounded-xl flex-1"
                    />
                    <Button type="button" onClick={() => addSkill()} className="h-12 px-6 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 font-bold uppercase tracking-widest text-[10px]">Add Skill</Button>
                </form>

                <div className="flex flex-wrap gap-2 pt-4">
                    {formData.skills.length === 0 && (
                        <p className="text-slate-500 text-sm font-medium italic">Type a skill above and press enter...</p>
                    )}
                    {formData.skills.map((skill: string, index: number) => (
                        <motion.div 
                            key={index}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 group hover:bg-white/10 transition-colors"
                        >
                            <span className="text-sm font-bold text-white tracking-tight">{skill}</span>
                            <button onClick={() => removeSkill(skill)} className="text-slate-500 hover:text-red-400 transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="pt-8 mt-8 border-t border-white/5">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Resume Preview Tip</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span className="text-white font-black uppercase text-[10px] tracking-widest">School Life</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">Adding your 10th/12th details makes your resume complete for internships.</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span className="text-white font-black uppercase text-[10px] tracking-widest">Key Learnings</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">Focus on what you learned, not just what you did. It shows growth!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
