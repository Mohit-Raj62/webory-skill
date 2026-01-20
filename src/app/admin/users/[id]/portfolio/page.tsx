"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2, Save, ArrowLeft, ExternalLink, Briefcase, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Project {
    title: string;
    description: string;
    url: string;
    image: string;
    technologies: string[];
}

interface Experience {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface Education {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface UserPortfolio {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    skills: string[];
    socialLinks: {
        linkedin?: string;
        twitter?: string;
        website?: string;
        github?: string;
    };
    projects: Project[];
    experience: Experience[];
    education: Education[];
}

export default function AdminPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [user, setUser] = useState<UserPortfolio | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    // New/Edit Project State
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [currentProject, setCurrentProject] = useState<Project>({
        title: "", description: "", url: "", image: "", technologies: []
    });
    const [techInput, setTechInput] = useState("");
    const [editProjectIndex, setEditProjectIndex] = useState<number | null>(null);

    // Experience State
    const [showExperienceForm, setShowExperienceForm] = useState(false);
    const [currentExperience, setCurrentExperience] = useState<Experience>({
        title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: ""
    });
    const [editExperienceIndex, setEditExperienceIndex] = useState<number | null>(null);

    // Education State
    const [showEducationForm, setShowEducationForm] = useState(false);
    const [currentEducation, setCurrentEducation] = useState<Education>({
        degree: "", institution: "", location: "", startDate: "", endDate: "", current: false, description: ""
    });
    const [editEducationIndex, setEditEducationIndex] = useState<number | null>(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await fetch(`/api/admin/users/${id}/portfolio`);
            const data = await res.json();
            if (res.ok) {
                const userData = data.user;
                if (!userData.projects) userData.projects = [];
                if (!userData.socialLinks) userData.socialLinks = {};
                if (!userData.skills) userData.skills = [];
                if (!userData.experience) userData.experience = [];
                if (!userData.education) userData.education = [];
                
                // Format dates to YYYY-MM-DD for input fields if they return as strings/dates
                const formatDate = (d: any) => d ? new Date(d).toISOString().split('T')[0] : "";
                
                userData.experience = userData.experience.map((e: any) => ({
                    ...e, startDate: formatDate(e.startDate), endDate: formatDate(e.endDate)
                }));
                 userData.education = userData.education.map((e: any) => ({
                    ...e, startDate: formatDate(e.startDate), endDate: formatDate(e.endDate)
                }));

                setUser(userData);
            } else {
                toast.error(data.error);
                router.push("/admin/users");
            }
        } catch (error) {
            toast.error("Failed to load user");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/users/${id}/portfolio`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bio: user.bio,
                    skills: user.skills,
                    socialLinks: user.socialLinks,
                    projects: user.projects,
                    experience: user.experience,
                    education: user.education
                })
            });

            if (res.ok) {
                toast.success("Portfolio updated successfully");
            } else {
                const data = await res.json();
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Failed to update portfolio");
        } finally {
            setSaving(false);
        }
    };

    // --- Helper Handlers ---

    // Projects
    const handleProjectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        const newProjects = [...user.projects];
        if (editProjectIndex !== null) newProjects[editProjectIndex] = currentProject;
        else newProjects.push(currentProject);
        setUser({ ...user, projects: newProjects });
        setShowProjectForm(false);
        setEditProjectIndex(null);
        setCurrentProject({ title: "", description: "", url: "", image: "", technologies: [] });
    };
    const deleteProject = (index: number) => {
        if (user && confirm("Delete this project?")) {
            setUser({ ...user, projects: user.projects.filter((_, i) => i !== index) });
        }
    };
     const addTech = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && techInput.trim()) {
            e.preventDefault();
            setCurrentProject({ ...currentProject, technologies: [...currentProject.technologies, techInput.trim()] });
            setTechInput("");
        }
    };

    // Experience
    const handleExperienceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        const newExp = [...user.experience];
        if (editExperienceIndex !== null) newExp[editExperienceIndex] = currentExperience;
        else newExp.push(currentExperience);
        setUser({ ...user, experience: newExp });
        setShowExperienceForm(false);
        setEditExperienceIndex(null);
        setCurrentExperience({ title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" });
    };
    const deleteExperience = (index: number) => {
        if (user && confirm("Delete this experience?")) {
            setUser({ ...user, experience: user.experience.filter((_, i) => i !== index) });
        }
    };

    // Education
    const handleEducationSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        const newEdu = [...user.education];
        if (editEducationIndex !== null) newEdu[editEducationIndex] = currentEducation;
        else newEdu.push(currentEducation);
        setUser({ ...user, education: newEdu });
        setShowEducationForm(false);
        setEditEducationIndex(null);
        setCurrentEducation({ degree: "", institution: "", location: "", startDate: "", endDate: "", current: false, description: "" });
    };
    const deleteEducation = (index: number) => {
        if (user && confirm("Delete this education?")) {
            setUser({ ...user, education: user.education.filter((_, i) => i !== index) });
        }
    };


    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /></div>;
    if (!user) return null;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                   <Button variant="ghost" onClick={() => router.push('/admin/users')} className="mb-2 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
                    </Button>
                    <h1 className="text-3xl font-bold text-white">Manage Portfolio & Resume</h1>
                    <p className="text-gray-400">{user.firstName} {user.lastName} ({user.email})</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
                    {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Basic Info - 4 cols */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card p-6 rounded-xl">
                        <h2 className="text-xl font-bold text-white mb-4">Profile Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Bio</label>
                                <Textarea 
                                    value={user.bio} 
                                    onChange={(e) => setUser({...user, bio: e.target.value})}
                                    className="bg-zinc-900 border-zinc-800 text-white min-h-[120px]"
                                    placeholder="Professional summary..."
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Skills (comma separated)</label>
                                <Input 
                                    value={user.skills.join(", ")} 
                                    onChange={(e) => setUser({...user, skills: e.target.value.split(",").map(s => s.trim())})}
                                    className="bg-zinc-900 border-zinc-800 text-white"
                                    placeholder="React, Next.js, Node.js..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-xl">
                        <h2 className="text-xl font-bold text-white mb-4">Social Links</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">LinkedIn</label>
                                <Input 
                                    value={user.socialLinks.linkedin || ""} 
                                    onChange={(e) => setUser({...user, socialLinks: {...user.socialLinks, linkedin: e.target.value}})}
                                    className="bg-zinc-900 border-zinc-800 text-white"
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">GitHub</label>
                                <Input 
                                    value={user.socialLinks.github || ""} 
                                    onChange={(e) => setUser({...user, socialLinks: {...user.socialLinks, github: e.target.value}})}
                                    className="bg-zinc-900 border-zinc-800 text-white"
                                    placeholder="https://github.com/..."
                                />
                            </div>
                             <div>
                                <label className="block text-sm text-gray-400 mb-1">Portfolio Website</label>
                                <Input 
                                    value={user.socialLinks.website || ""} 
                                    onChange={(e) => setUser({...user, socialLinks: {...user.socialLinks, website: e.target.value}})}
                                    className="bg-zinc-900 border-zinc-800 text-white"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Dynamic Content - 8 cols */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Experience Section */}
                    <div className="glass-card p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center"><Briefcase className="mr-2" size={20} /> Work Experience</h2>
                            <Button size="sm" onClick={() => {
                                setCurrentExperience({ title: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" });
                                setEditExperienceIndex(null);
                                setShowExperienceForm(true);
                            }} className="bg-purple-600 hover:bg-purple-700">
                                <Plus size={16} className="mr-1" /> Add Experience
                            </Button>
                        </div>
                         <div className="space-y-4">
                            {user.experience.length === 0 && <p className="text-gray-500 text-center py-4">No experience added.</p>}
                            {user.experience.map((exp, index) => (
                                <div key={index} className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 relative group">
                                    <h3 className="font-bold text-white">{exp.title}</h3>
                                    <p className="text-sm text-gray-300">{exp.company} • {exp.location}</p>
                                    <p className="text-xs text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setCurrentExperience(exp); setEditExperienceIndex(index); setShowExperienceForm(true); }}>✏️</Button>
                                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400" onClick={() => deleteExperience(index)}><Trash2 size={14} /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education Section */}
                     <div className="glass-card p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center"><GraduationCap className="mr-2" size={20} /> Education</h2>
                            <Button size="sm" onClick={() => {
                                setCurrentEducation({ degree: "", institution: "", location: "", startDate: "", endDate: "", current: false, description: "" });
                                setEditEducationIndex(null);
                                setShowEducationForm(true);
                            }} className="bg-indigo-600 hover:bg-indigo-700">
                                <Plus size={16} className="mr-1" /> Add Education
                            </Button>
                        </div>
                         <div className="space-y-4">
                            {user.education.length === 0 && <p className="text-gray-500 text-center py-4">No education added.</p>}
                            {user.education.map((edu, index) => (
                                <div key={index} className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 relative group">
                                    <h3 className="font-bold text-white">{edu.degree}</h3>
                                    <p className="text-sm text-gray-300">{edu.institution} • {edu.location}</p>
                                    <p className="text-xs text-gray-500">{edu.startDate} - {edu.current ? 'Present' : edu.endDate}</p>
                                     <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setCurrentEducation(edu); setEditEducationIndex(index); setShowEducationForm(true); }}>✏️</Button>
                                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400" onClick={() => deleteEducation(index)}><Trash2 size={14} /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Projects Section */}
                    <div className="glass-card p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Custom Projects</h2>
                            <Button size="sm" onClick={() => {
                                setCurrentProject({ title: "", description: "", url: "", image: "", technologies: [] });
                                setEditProjectIndex(null);
                                setShowProjectForm(true);
                                setTechInput("");
                            }} className="bg-blue-600 hover:bg-blue-700">
                                <Plus size={16} className="mr-1" /> Add Project
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {user.projects.length === 0 && <p className="text-gray-500 text-center py-4">No custom projects added yet.</p>}
                            {user.projects.map((project, index) => (
                                <div key={index} className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800 relative group">
                                    <h3 className="font-bold text-white">{project.title}</h3>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {project.technologies.map(t => (
                                            <span key={t} className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-300">{t}</span>
                                        ))}
                                    </div>
                                     <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => { setCurrentProject(project); setEditProjectIndex(index); setShowProjectForm(true); setTechInput(""); }}>✏️</Button>
                                         <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400" onClick={() => deleteProject(index)}><Trash2 size={14} /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            
            {/* Project Modal */}
            {showProjectForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-4">{editProjectIndex !== null ? 'Edit Project' : 'Add Project'}</h3>
                        <form onSubmit={handleProjectSubmit} className="space-y-4">
                            <div><label className="text-gray-400 text-sm">Title</label><Input required value={currentProject.title} onChange={e => setCurrentProject({...currentProject, title: e.target.value})} className="bg-zinc-900 border-zinc-800"/></div>
                            <div><label className="text-gray-400 text-sm">Description</label><Textarea required value={currentProject.description} onChange={e => setCurrentProject({...currentProject, description: e.target.value})} className="bg-zinc-900 border-zinc-800"/></div>
                            <div><label className="text-gray-400 text-sm">URL</label><Input value={currentProject.url} onChange={e => setCurrentProject({...currentProject, url: e.target.value})} className="bg-zinc-900 border-zinc-800"/></div>
                            <div><label className="text-gray-400 text-sm">Tech Stack (Enter to add)</label>
                             <div className="flex flex-wrap gap-2 mb-2">{currentProject.technologies.map((t, i) => (<span key={i} className="text-xs bg-zinc-800 px-2 py-1 rounded">{t}</span>))}</div>
                             <Input value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={addTech} className="bg-zinc-900 border-zinc-800"/>
                            </div>
                            <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="ghost" onClick={() => setShowProjectForm(false)}>Cancel</Button><Button type="submit">Save</Button></div>
                        </form>
                    </div>
                </div>
            )}

            {/* Experience Modal */}
            {showExperienceForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-4">{editExperienceIndex !== null ? 'Edit Experience' : 'Add Experience'}</h3>
                        <form onSubmit={handleExperienceSubmit} className="space-y-4">
                            <div><label className="text-gray-400 text-sm">Job Title</label><Input required value={currentExperience.title} onChange={e => setCurrentExperience({...currentExperience, title: e.target.value})} className="bg-zinc-900 border-zinc-800"/></div>
                            <div><label className="text-gray-400 text-sm">Company</label><Input required value={currentExperience.company} onChange={e => setCurrentExperience({...currentExperience, company: e.target.value})} className="bg-zinc-900 border-zinc-800"/></div>
                            <div><label className="text-gray-400 text-sm">Location</label><Input value={currentExperience.location} onChange={e => setCurrentExperience({...currentExperience, location: e.target.value})} className="bg-zinc-900 border-zinc-800"/></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-gray-400 text-sm">Start Date</label><Input type="date" required value={currentExperience.startDate} onChange={e => setCurrentExperience({...currentExperience, startDate: e.target.value})} className="bg-zinc-900 border-zinc-800"/></div>
                                <div><label className="text-gray-400 text-sm">End Date</label><Input type="date" disabled={currentExperience.current} value={currentExperience.endDate} onChange={e => setCurrentExperience({...currentExperience, endDate: e.target.value})} className="bg-zinc-900 border-zinc-800"/></div>
                            </div>
                            <div className="flex items-center gap-2"><input type="checkbox" checked={currentExperience.current} onChange={e => setCurrentExperience({...currentExperience, current: e.target.checked})} id="exp-current"/><label htmlFor="exp-current" className="text-gray-400 text-sm">Currently working here</label></div>
                            <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="ghost" onClick={() => setShowExperienceForm(false)}>Cancel</Button><Button type="submit">Save</Button></div>
                        </form>
                    </div>
                </div>
            )}

             {/* Education Modal */}
            {showEducationForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-4">{editEducationIndex !== null ? 'Edit Education' : 'Add Education'}</h3>
                        <form onSubmit={handleEducationSubmit} className="space-y-4">
                            <div><label className="text-gray-400 text-sm">Degree</label><Input required value={currentEducation.degree} onChange={e => setCurrentEducation({...currentEducation, degree: e.target.value})} className="bg-zinc-900 border-zinc-800"/></div>
                            <div><label className="text-gray-400 text-sm">Institution</label><Input required value={currentEducation.institution} onChange={e => setCurrentEducation({...currentEducation, institution: e.target.value})} className="bg-zinc-900 border-zinc-800"/></div>
                            <div><label className="text-gray-400 text-sm">Location</label><Input value={currentEducation.location} onChange={e => setCurrentEducation({...currentEducation, location: e.target.value})} className="bg-zinc-900 border-zinc-800"/></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-gray-400 text-sm">Start Date</label><Input type="date" required value={currentEducation.startDate} onChange={e => setCurrentEducation({...currentEducation, startDate: e.target.value})} className="bg-zinc-900 border-zinc-800"/></div>
                                <div><label className="text-gray-400 text-sm">End Date</label><Input type="date" disabled={currentEducation.current} value={currentEducation.endDate} onChange={e => setCurrentEducation({...currentEducation, endDate: e.target.value})} className="bg-zinc-900 border-zinc-800"/></div>
                            </div>
                            <div className="flex items-center gap-2"><input type="checkbox" checked={currentEducation.current} onChange={e => setCurrentEducation({...currentEducation, current: e.target.checked})} id="edu-current"/><label htmlFor="edu-current" className="text-gray-400 text-sm">Currently studying here</label></div>
                            <div className="flex justify-end gap-2 pt-4"><Button type="button" variant="ghost" onClick={() => setShowEducationForm(false)}>Cancel</Button><Button type="submit">Save</Button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
