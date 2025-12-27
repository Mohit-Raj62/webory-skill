"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Search, X, Briefcase, MapPin, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Job {
    _id: string;
    title: string;
    description: string;
    requirements: string[];
    location: string;
    salary: string;
    type: string;
    workMode: string;
    isActive: boolean;
}

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requirements: "", // Textarea, split by newline
        location: "",
        salary: "",
        type: "Full-time",
        workMode: "Remote",
        isActive: true
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch("/api/jobs?all=true");
            const data = await res.json();
            if(data.success) {
                setJobs(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch jobs", error);
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (job?: Job) => {
        if (job) {
            setEditingJob(job);
            setFormData({
                title: job.title,
                description: job.description,
                requirements: job.requirements.join("\n"),
                location: job.location,
                salary: job.salary,
                type: job.type,
                workMode: job.workMode || "Remote",
                isActive: job.isActive
            });
        } else {
            setEditingJob(null);
            setFormData({
                title: "",
                description: "",
                requirements: "",
                location: "",
                salary: "",
                type: "Full-time",
                workMode: "Remote",
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                requirements: formData.requirements.split("\n").filter(r => r.trim() !== "")
            };

            let res;
            if (editingJob) {
                res = await fetch(`/api/jobs/${editingJob._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch("/api/jobs", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            const data = await res.json();
            if(data.success) {
                toast.success(editingJob ? "Job updated successfully" : "Job created successfully");
                setIsModalOpen(false);
                fetchJobs();
            } else {
                toast.error(data.error || "Failed to save job");
            }
            
        } catch (error) {
            console.error("Error saving job:", error);
            toast.error("Failed to save job");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this job?")) return;
        try {
            const res = await fetch(`/api/jobs/${id}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if(data.success) {
                toast.success("Job deleted successfully");
                fetchJobs();
            } else {
                toast.error(data.error || "Failed to delete job");
            }
        } catch (error) {
            console.error("Error deleting job:", error);
            toast.error("Failed to delete job");
        }
    };

    const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-white">Loading jobs...</div>;

    return (
        <div className="p-8 relative min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Jobs Management</h1>
                    <p className="text-sm md:text-base text-gray-400">Create, edit and manage job listings.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700">
                    <Plus size={20} className="mr-2" />
                    Post New Job
                </Button>
            </div>

            {/* Search */}
            <div className="glass-card p-4 rounded-2xl mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500/50 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                    <div key={job._id} className={`glass-card p-6 rounded-2xl border ${job.isActive ? 'border-green-500/30' : 'border-red-500/30'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{job.title}</h3>
                                <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                                    <MapPin size={14} /> {job.location}
                                </p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${job.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                {job.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        
                        <div className="space-y-2 mb-6">
                            <p className="text-sm text-gray-300 flex items-center gap-2">
                                <DollarSign size={16} className="text-green-400" /> {job.salary}
                            </p>
                            <p className="text-sm text-gray-300 flex items-center gap-2">
                                <Briefcase size={16} className="text-blue-400" /> {job.type}
                            </p>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button onClick={() => handleOpenModal(job)} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                                <Edit2 size={16} />
                            </Button>
                            <Button onClick={() => handleDelete(job._id)} variant="destructive" className="bg-red-900/50 hover:bg-red-800 text-red-300 border border-red-800">
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Job Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl my-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">{editingJob ? 'Edit Job' : 'Post New Job'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Job Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Salary</label>
                                    <input
                                        type="text"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    >
                                        <option value="Full-time" className="bg-slate-800">Full-time</option>
                                        <option value="Part-time" className="bg-slate-800">Part-time</option>
                                        <option value="Internship" className="bg-slate-800">Internship</option>
                                        <option value="Contract" className="bg-slate-800">Contract</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Status</label>
                                    <select
                                        value={formData.isActive ? "true" : "false"}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    >
                                        <option value="true" className="bg-slate-800">Active</option>
                                        <option value="false" className="bg-slate-800">Inactive</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Work Mode</label>
                                    <select
                                        value={formData.workMode}
                                        onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    >
                                        <option value="Remote" className="bg-slate-800">Remote</option>
                                        <option value="Hybrid" className="bg-slate-800">Hybrid</option>
                                        <option value="On-site" className="bg-slate-800">On-site</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    placeholder="Describe the role, teaching responsibilities, and team culture..."
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Skills & Requirements (One per line)</label>
                                <textarea
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    rows={4}
                                    placeholder={"e.g.\n- Expertise in React & Next.js\n- Experience teaching or mentoring students\n- Strong communication skills"}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button onClick={() => setIsModalOpen(false)} variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800">
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
                                    {editingJob ? 'Update Job' : 'Create Job'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
