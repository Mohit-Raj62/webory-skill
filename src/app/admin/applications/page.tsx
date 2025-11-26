"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Search, ExternalLink, Edit2, Save, X, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Application {
    _id: string;
    student: {
        firstName: string;
        lastName: string;
        email: string;
    };
    internship: {
        title: string;
        company: string;
    };
    status: string;
    resume: string;
    coverLetter: string;
    appliedAt: string;
    startDate?: string;
    duration?: string;
    interviewDate?: string;
    interviewLink?: string;
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState < Application[] > ([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Edit Modal State
    const [editingApp, setEditingApp] = useState < Application | null > (null);
    const [editForm, setEditForm] = useState({
        startDate: "",
        duration: "",
        status: ""
    });

    // Interview Modal State
    const [interviewApp, setInterviewApp] = useState < Application | null > (null);
    const [interviewForm, setInterviewForm] = useState({
        date: "",
        time: "",
        link: ""
    });

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await fetch("/api/admin/applications");
            if (res.ok) {
                const data = await res.json();
                setApplications(data.applications || []);
            }
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (app: Application) => {
        setEditingApp(app);
        setEditForm({
            startDate: app.startDate ? new Date(app.startDate).toISOString().split('T')[0] : "",
            duration: app.duration || "",
            status: app.status
        });
    };

    const openInterviewModal = (app: Application) => {
        setInterviewApp(app);
        setInterviewForm({
            date: "",
            time: "",
            link: ""
        });
    };

    const handleUpdateApplication = async () => {
        if (!editingApp) return;

        try {
            const res = await fetch(`/api/admin/applications/${editingApp._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });

            if (res.ok) {
                const updatedApp = await res.json();
                setApplications(
                    applications.map((app) =>
                        app._id === editingApp._id ? { ...app, ...editForm } : app
                    )
                );
                setEditingApp(null);
                alert("Application updated successfully");
            } else {
                alert("Failed to update application");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update application");
        }
    };

    const handleScheduleInterview = async () => {
        if (!interviewApp) return;

        try {
            const interviewDateTime = new Date(`${interviewForm.date}T${interviewForm.time}`);

            const res = await fetch(`/api/admin/applications/${interviewApp._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "interview_scheduled",
                    interviewDate: interviewDateTime.toISOString(),
                    interviewLink: interviewForm.link
                }),
            });

            if (res.ok) {
                setApplications(
                    applications.map((app) =>
                        app._id === interviewApp._id ? {
                            ...app,
                            status: "interview_scheduled",
                            interviewDate: interviewDateTime.toISOString(),
                            interviewLink: interviewForm.link
                        } : app
                    )
                );
                setInterviewApp(null);
                alert("Interview scheduled successfully!");
            } else {
                alert("Failed to schedule interview");
            }
        } catch (error) {
            console.error("Schedule error:", error);
            alert("Failed to schedule interview");
        }
    };

    const handleStatusChange = async (appId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/applications/${appId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setApplications(
                    applications.map((app) =>
                        app._id === appId ? { ...app, status: newStatus } : app
                    )
                );
                alert(`Application ${newStatus}`);
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error("Status update error:", error);
            alert("Failed to update status");
        }
    };

    const filteredApplications = applications.filter((app) => {
        const matchesFilter = filter === "all" || app.status === filter;
        const matchesSearch =
            app.student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.internship?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-white">Loading applications...</div>
            </div>
        );
    }

    return (
        <div className="p-8 relative">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Application Review</h1>
                <p className="text-sm md:text-base text-gray-400">Review and manage internship applications</p>
            </div>

            {/* Filters */}
            <div className="glass-card p-4 rounded-2xl mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by student or internship..."
                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500/50 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {["all", "pending", "interview_scheduled", "accepted", "rejected"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg transition-all capitalize whitespace-nowrap ${filter === f
                                    ? f === "all" ? "bg-blue-600 text-white" :
                                        f === "pending" ? "bg-yellow-600 text-white" :
                                            f === "interview_scheduled" ? "bg-purple-600 text-white" :
                                                f === "accepted" ? "bg-green-600 text-white" :
                                                    "bg-red-600 text-white"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                                    }`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-6">
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Total</p>
                    <p className="text-3xl font-bold text-white">{applications.length}</p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Pending</p>
                    <p className="text-3xl font-bold text-yellow-400">
                        {applications.filter((a) => a.status === "pending").length}
                    </p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Interviews</p>
                    <p className="text-3xl font-bold text-purple-400">
                        {applications.filter((a) => a.status === "interview_scheduled").length}
                    </p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Accepted</p>
                    <p className="text-3xl font-bold text-green-400">
                        {applications.filter((a) => a.status === "accepted").length}
                    </p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Rejected</p>
                    <p className="text-3xl font-bold text-red-400">
                        {applications.filter((a) => a.status === "rejected").length}
                    </p>
                </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
                {filteredApplications.map((app) => (
                    <div key={app._id} className="glass-card p-6 rounded-2xl">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-white">
                                        {app.student?.firstName} {app.student?.lastName}
                                    </h3>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs ${app.status === "pending"
                                            ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                                            : app.status === "interview_scheduled"
                                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                                : app.status === "accepted"
                                                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                                            }`}
                                    >
                                        {app.status.toUpperCase().replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-1">{app.student?.email}</p>
                                <p className="text-white font-medium">
                                    Applied for: {app.internship?.title} at {app.internship?.company}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                </p>
                                {app.interviewDate && (
                                    <p className="text-purple-400 text-sm mt-1 font-semibold">
                                        Interview: {new Date(app.interviewDate).toLocaleString()}
                                        {app.interviewLink && (
                                            <a
                                                href={app.interviewLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 ml-2 hover:underline"
                                            >
                                                (Link <ExternalLink size={12} className="inline-block" />)
                                            </a>
                                        )}
                                    </p>
                                )}
                                {app.startDate && (
                                    <p className="text-green-400 text-sm mt-1">
                                        Start Date: {new Date(app.startDate).toLocaleDateString()} | Duration: {app.duration}
                                    </p>
                                )}
                                {app.resume && (
                                    <a
                                        href={app.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 text-sm flex items-center gap-1 mt-2 hover:underline"
                                    >
                                        View Resume <ExternalLink size={12} />
                                    </a>
                                )}
                            </div>

                            <div className="flex gap-2 flex-wrap justify-end">
                                <Button
                                    onClick={() => openEditModal(app)}
                                    variant="outline"
                                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                >
                                    <Edit2 size={16} className="mr-2" />
                                    Edit
                                </Button>

                                {app.status === "pending" && (
                                    <Button
                                        onClick={() => openInterviewModal(app)}
                                        className="bg-purple-600 hover:bg-purple-700"
                                    >
                                        <Calendar size={18} className="mr-2" />
                                        Schedule Interview
                                    </Button>
                                )}

                                {(app.status === "pending" || app.status === "interview_scheduled") && (
                                    <>
                                        <Button
                                            onClick={() => handleStatusChange(app._id, "accepted")}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle size={18} className="mr-2" />
                                            Accept
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusChange(app._id, "rejected")}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            <XCircle size={18} className="mr-2" />
                                            Reject
                                        </Button>
                                    </>
                                )}

                                {app.status === "accepted" && (
                                    <Button
                                        onClick={() => handleStatusChange(app._id, "completed")}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        <Award size={18} className="mr-2" />
                                        Mark as Completed
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredApplications.length === 0 && (
                <div className="text-center py-12 text-gray-400">No applications found</div>
            )}

            {/* Edit Modal */}
            {editingApp && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Edit Application</h2>
                            <button onClick={() => setEditingApp(null)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Status</label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                >
                                    <option value="pending" className="bg-slate-800">Pending</option>
                                    <option value="interview_scheduled" className="bg-slate-800">Interview Scheduled</option>
                                    <option value="accepted" className="bg-slate-800">Accepted</option>
                                    <option value="rejected" className="bg-slate-800">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={editForm.startDate}
                                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Duration (e.g., "3 months")</label>
                                <input
                                    type="text"
                                    value={editForm.duration}
                                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                                    placeholder="e.g., 3 months"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button onClick={() => setEditingApp(null)} variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800">
                                    Cancel
                                </Button>
                                <Button onClick={handleUpdateApplication} className="flex-1 bg-blue-600 hover:bg-blue-700">
                                    <Save size={18} className="mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Interview Modal */}
            {interviewApp && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Schedule Interview</h2>
                            <button onClick={() => setInterviewApp(null)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={interviewForm.date}
                                        onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Time</label>
                                    <input
                                        type="time"
                                        value={interviewForm.time}
                                        onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Meeting Link</label>
                                <input
                                    type="text"
                                    value={interviewForm.link}
                                    onChange={(e) => setInterviewForm({ ...interviewForm, link: e.target.value })}
                                    placeholder="e.g., Google Meet or Zoom link"
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button onClick={() => setInterviewApp(null)} variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800">
                                    Cancel
                                </Button>
                                <Button onClick={handleScheduleInterview} className="flex-1 bg-purple-600 hover:bg-purple-700">
                                    <Calendar size={18} className="mr-2" />
                                    Schedule
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
