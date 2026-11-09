"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Search, ExternalLink, Edit2, Save, X, Calendar, Award, Trash2, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        price?: number;
    };
    status: string;
    assignedExam?: {
        _id: string;
        title: string;
        duration?: number;
        totalMarks?: number;
        passingPercentage?: number;
    };
    examScore?: number;
    examPercentage?: number;
    examPassed?: boolean;
    examCompletedAt?: string;
    resume: string;
    resumeType?: 'file' | 'link';
    coverLetter: string;
    appliedAt: string;
    startDate?: string;
    duration?: string; // Official duration
    interviewDate?: string;
    interviewLink?: string;
    college?: string;
    currentYear?: string;
    linkedin?: string;
    portfolio?: string;
    preferredDuration?: string;
    referralCode?: string;
    collegeApprovalLetter?: string;
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState < Application[] > ([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    // Edit Modal State
    const [editingApp, setEditingApp] = useState < Application | null > (null);
    const [editForm, setEditForm] = useState({
        startDate: "",
        duration: "",
        status: "",
        resume: ""
    });

    // Interview Modal State
    const [interviewApp, setInterviewApp] = useState<Application | null>(null);
    const [interviewForm, setInterviewForm] = useState({
        date: "",
        time: "",
        link: ""
    });

    // Exam Assignment Modal State
    const [examModalApp, setExamModalApp] = useState<Application | null>(null);
    const [selectedExamId, setSelectedExamId] = useState<string>("");
    const [availableExams, setAvailableExams] = useState<any[]>([]);
    const [examAssigning, setExamAssigning] = useState(false);

    // View Details Modal State
    const [viewApp, setViewApp] = useState<Application | null>(null);

    useEffect(() => {
        fetchApplications();
        fetch("/api/admin/exams")
            .then((res) => res.json())
            .then((data) => {
                if (data.exams) setAvailableExams(data.exams);
            })
            .catch((err) => console.error("Failed to load exams", err));
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await fetch("/api/admin/internship-applications");
            if (res.ok) {
                const data = await res.json();
                setApplications(data.applications || []);
                setErrorMsg("");
            } else {
                setErrorMsg("Failed to load applications. The server might be busy.");
            }
        } catch (error) {
            console.error("Failed to fetch applications", error);
            setErrorMsg("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (app: Application) => {
        setEditingApp(app);
        setEditForm({
            startDate: app.startDate ? new Date(app.startDate).toISOString().split('T')[0] : "",
            duration: app.duration || "",
            status: app.status,
            resume: app.resume || ""
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

    const openViewModal = (app: Application) => {
        setViewApp(app);
    };

    const handleUpdateApplication = async () => {
        if (!editingApp) return;

        // Ensure resume link is absolute
        let resumeLink = editForm.resume;
        if (resumeLink && !resumeLink.startsWith('http://') && !resumeLink.startsWith('https://') && resumeLink !== "Pending Upload") {
            resumeLink = `https://${resumeLink}`;
        }

        const payload = {
            ...editForm,
            resume: resumeLink
        };

        try {
            const res = await fetch(`/api/admin/applications/${editingApp._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                setApplications(
                    applications.map((app) =>
                        app._id === editingApp._id ? data.application : app
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

    const handleAssignExamAndMove = async () => {
        if (!examModalApp) return;
        try {
            setExamAssigning(true);
            const res = await fetch(`/api/admin/applications/${examModalApp._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: "exam_pending",
                    assignedExam: selectedExamId || null,
                }),
            });

            if (res.ok) {
                const assignedObj = availableExams.find((e) => e._id === selectedExamId);
                setApplications(
                    applications.map((app) =>
                        app._id === examModalApp._id
                            ? {
                                  ...app,
                                  status: "exam_pending",
                                  assignedExam: assignedObj || app.assignedExam,
                              }
                            : app
                    )
                );
                setExamModalApp(null);
                setSelectedExamId("");
                alert("Candidate moved to Assessment Round successfully!");
            } else {
                alert("Failed to assign exam");
            }
        } catch (error) {
            console.error("Assign error:", error);
            alert("Error assigning exam");
        } finally {
            setExamAssigning(false);
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

    const handleDeleteApplication = async (appId: string) => {
        if (!confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/applications/${appId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setApplications(applications.filter(app => app._id !== appId));
                alert("Application deleted successfully");
            } else {
                alert("Failed to delete application");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete application");
        }
    };

    const filteredApplications = applications.filter((app) => {
        let matchesFilter = false;
        
        const isPaid = (app.internship?.price || 0) > 0;
        
        // Ignore placeholder transaction IDs like 'PENDING_PAYU' or 'PENDING_UPGRADE'
        const isValidTransaction = app.transactionId && !app.transactionId.startsWith('PENDING');
        const hasSubmittedPayment = isValidTransaction && (app.amountPaid || 0) > 0;
        
        // If it's a paid internship and they haven't submitted payment, it's Pending Payment.
        const isPendingPayment = app.status === 'pending' && isPaid && !hasSubmittedPayment;
        
        // If it's a free internship, OR if they have submitted payment proof, it's Pending Review.
        const isPendingReview = app.status === 'pending' && (!isPaid || hasSubmittedPayment);

        switch (filter) {
            case 'all':
                matchesFilter = true;
                break;
            case 'pending_payment':
                matchesFilter = isPendingPayment;
                break;
            case 'pending_review':
                matchesFilter = isPendingReview;
                break;
            case 'interview_scheduled':
                matchesFilter = app.status === 'interview_scheduled';
                break;
            case 'accepted':
                matchesFilter = app.status === 'accepted';
                break;
            case 'rejected':
                matchesFilter = app.status === 'rejected';
                break;
            default:
                matchesFilter = app.status === filter;
        }

        const matchesSearch =
            app.student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.internship?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const pendingReviewCount = applications.filter(a => a.status === 'pending' && !(a.internship?.price || 0)).length;
    const pendingPaymentCount = applications.filter(a => a.status === 'pending' && (a.internship?.price || 0) > 0).length;


    if (loading) {
        return (
            <div className="p-8">
                <div className="text-white flex items-center gap-3">
                   <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                   Loading applications...
                </div>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="p-8">
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl text-center">
                    <p className="text-red-400 mb-4">{errorMsg}</p>
                    <Button onClick={() => { setLoading(true); fetchApplications(); }} className="bg-red-600 hover:bg-red-700">
                       Try Again
                    </Button>
                </div>
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
                        {["all", "pending_review", "pending_payment", "exam_pending", "exam_completed", "interview_pending", "interview_scheduled", "accepted", "rejected"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg transition-all capitalize whitespace-nowrap ${filter === f
                                    ? f === "all" ? "bg-blue-600 text-white" :
                                        f === "pending_review" ? "bg-yellow-600 text-white" :
                                            f === "pending_payment" ? "bg-orange-600 text-white" :
                                                f === "exam_pending" ? "bg-cyan-600 text-white font-bold" :
                                                    f === "exam_completed" ? "bg-teal-600 text-white font-bold" :
                                                        f === "interview_pending" ? "bg-indigo-600 text-white" :
                                                            f === "interview_scheduled" ? "bg-purple-600 text-white" :
                                                                f === "accepted" ? "bg-green-600 text-white" :
                                                                    "bg-red-600 text-white"
                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                                    }`}
                            >
                                {f === 'pending_review' ? 'Review Needed' : f === 'pending_payment' ? 'Payment Pending' : f === 'exam_pending' ? 'Exam Pending' : f === 'exam_completed' ? 'Exam Done' : f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                 <div className="glass-card p-3 rounded-xl">
                    <p className="text-gray-400 text-xs mb-0.5">Total</p>
                    <p className="text-2xl font-bold text-white">{applications.length}</p>
                </div>
                <div className="glass-card p-3 rounded-xl">
                    <p className="text-gray-400 text-xs mb-0.5">Review Needed</p>
                    <p className="text-2xl font-bold text-yellow-400">
                        {pendingReviewCount}
                    </p>
                </div>
                <div className="glass-card p-3 rounded-xl">
                    <p className="text-gray-400 text-xs mb-0.5">Exam Round</p>
                    <p className="text-2xl font-bold text-cyan-400">
                        {applications.filter((a) => a.status === "exam_pending" || a.status === "exam_completed").length}
                    </p>
                </div>
                <div className="glass-card p-3 rounded-xl">
                    <p className="text-gray-400 text-xs mb-0.5">Payment Pending</p>
                    <p className="text-2xl font-bold text-orange-400">
                        {pendingPaymentCount}
                    </p>
                </div>
                <div className="glass-card p-3 rounded-xl">
                    <p className="text-gray-400 text-xs mb-0.5">Interviews</p>
                    <p className="text-2xl font-bold text-purple-400">
                        {applications.filter((a) => a.status === "interview_scheduled").length}
                    </p>
                </div>
                <div className="glass-card p-3 rounded-xl">
                    <p className="text-gray-400 text-xs mb-0.5">Accepted</p>
                    <p className="text-2xl font-bold text-green-400">
                        {applications.filter((a) => a.status === "accepted").length}
                    </p>
                </div>
                <div className="glass-card p-3 rounded-xl">
                    <p className="text-gray-400 text-xs mb-0.5">Rejected</p>
                    <p className="text-2xl font-bold text-red-400">
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
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === "pending"
                                            ? ((app.internship?.price || 0) > 0 && !(app.transactionId && !app.transactionId.startsWith('PENDING_') && (app.amountPaid || 0) > 0))
                                                ? "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                                                : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                                            : app.status === "exam_pending"
                                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                                : app.status === "exam_completed"
                                                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                                                    : app.status === "interview_pending"
                                                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                                        : app.status === "interview_scheduled"
                                                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                                            : app.status === "accepted"
                                                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                                                : "bg-red-500/20 text-red-300 border border-red-500/30"
                                            }`}
                                    >
                                        {app.status === 'pending' 
                                            ? ((app.internship?.price || 0) > 0 && !(app.transactionId && !app.transactionId.startsWith('PENDING_') && (app.amountPaid || 0) > 0)) ? 'PAYMENT PENDING' : 'REVIEW NEEDED'
                                            : app.status === 'exam_pending' ? 'ASSESSMENT PENDING'
                                            : app.status === 'exam_completed' ? 'EXAM COMPLETED'
                                            : app.status === 'interview_pending' ? 'INTERVIEW PENDING'
                                            : app.status === 'accepted' && (app.internship?.price || 0) > 0 ? 'PAYMENT COMPLETE'
                                            : app.status.toUpperCase().replace('_', ' ')
                                        }
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm mb-1">{app.student?.email}</p>
                                <p className="text-white font-medium">
                                    Applied for: {app.internship?.title} at {app.internship?.company}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                </p>

                                {/* Assigned Exam & Score Information */}
                                {app.assignedExam && (
                                    <div className="flex items-center gap-1.5 text-xs text-cyan-400 mt-1.5">
                                        <CheckSquare size={13} className="shrink-0" />
                                        <span>Allotted Exam: <strong>{app.assignedExam.title}</strong></span>
                                    </div>
                                )}

                                {app.status === 'exam_completed' && (
                                    <div className="flex items-center gap-2 mt-2 text-xs flex-wrap">
                                        <span className="text-gray-400">Exam Evaluation:</span>
                                        <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/10">
                                            {app.examPercentage !== null && app.examPercentage !== undefined ? `${app.examPercentage}%` : "Completed"}
                                            {app.examScore !== null && app.examScore !== undefined ? ` (${app.examScore} marks)` : ""}
                                        </span>
                                        {app.examPassed !== null && (
                                            <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] tracking-wider ${
                                                app.examPassed ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
                                            }`}>
                                                {app.examPassed ? "PASSED" : "FAILED"}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Summarized Details */}
                                <div className="flex gap-4 mt-2">
                                     <button onClick={() => openViewModal(app)} className="text-blue-400 text-xs hover:underline flex items-center gap-1">
                                        <ExternalLink size={12}/> View Application Details
                                     </button>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-wrap justify-end items-center">
                                <Button
                                    onClick={() => openEditModal(app)}
                                    variant="outline"
                                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                                >
                                    <Edit2 size={16} className="mr-2" />
                                    Edit
                                </Button>

                                {(app.status === "pending" || app.status === "exam_pending") && (
                                    <Button
                                        onClick={() => {
                                            setExamModalApp(app);
                                            setSelectedExamId(app.assignedExam?._id || (availableExams[0]?._id || ""));
                                        }}
                                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs"
                                    >
                                        <CheckSquare size={16} className="mr-1.5" />
                                        {app.status === "exam_pending" ? "Change Exam" : "Move to Exam"}
                                    </Button>
                                )}

                                {(app.status === "pending" || app.status === "exam_completed") && (
                                    <Button
                                        onClick={() => openInterviewModal(app)}
                                        className="bg-purple-600 hover:bg-purple-700 text-xs"
                                    >
                                        <Calendar size={16} className="mr-1.5" />
                                        Schedule Interview
                                    </Button>
                                )}

                                {(app.status === "interview_scheduled" || app.status === "interview_pending") && (
                                    <Link href={`/admin/live?type=interview&applicationId=${app._id}`}>
                                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                                            Start Live Interview
                                        </Button>
                                    </Link>
                                )}

                                {(app.status === "pending" || app.status === "exam_pending" || app.status === "exam_completed" || app.status === "interview_pending" || app.status === "interview_scheduled") && (
                                    <>
                                        <Button
                                            onClick={() => handleStatusChange(app._id, "accepted")}
                                            className="bg-green-600 hover:bg-green-700 text-xs"
                                        >
                                            <CheckCircle size={16} className="mr-1.5" />
                                            Accept
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusChange(app._id, "rejected")}
                                            className="bg-red-600 hover:bg-red-700 text-xs"
                                        >
                                            <XCircle size={16} className="mr-1.5" />
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
                                        Mark Completed
                                    </Button>
                                )}

                                <Button
                                    onClick={() => handleDeleteApplication(app._id)}
                                    className="bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white"
                                    title="Delete Application"
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredApplications.length === 0 && (
                <div className="text-center py-12 text-gray-400">No applications found</div>
            )}

            {/* View Details Modal */}
            {viewApp && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Application Details</h2>
                                <p className="text-sm text-gray-400">{viewApp.student?.firstName} {viewApp.student?.lastName}</p>
                            </div>
                            <button onClick={() => setViewApp(null)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Academic Info */}
                            <div className="space-y-4">
                                <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Academic Profile</h3>
                                <div className="space-y-3">
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">College/University</p>
                                        <p className="text-white font-medium">{viewApp.college || "N/A"}</p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Current Year</p>
                                        <p className="text-white font-medium">{viewApp.currentYear || "N/A"}</p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Applied At</p>
                                        <p className="text-white font-medium">{new Date(viewApp.appliedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Preference Info */}
                            <div className="space-y-4">
                                <h3 className="text-blue-400 text-xs font-bold uppercase tracking-wider">Preferences</h3>
                                <div className="space-y-3">
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Start Date (Preferred)</p>
                                        <p className="text-white font-medium">{viewApp.startDate ? new Date(viewApp.startDate).toLocaleDateString() : "N/A"}</p>
                                    </div>
                                    <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Duration (Preferred)</p>
                                        <p className="text-white font-medium">{viewApp.preferredDuration || "N/A"}</p>
                                    </div>
                                     <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                        <p className="text-xs text-gray-500 mb-1">Referral Code</p>
                                        <p className="text-white font-medium tracking-widest">{viewApp.referralCode || "NONE"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Links */}
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider">Professional Links & Resume</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <a 
                                        href={viewApp.linkedin || "#"} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${viewApp.linkedin ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20' : 'bg-gray-800/50 border-gray-700 cursor-not-allowed opacity-50'}`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <ExternalLink size={14} className="text-blue-400"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">LinkedIn</p>
                                            <p className="text-sm font-medium text-white truncate max-w-[150px]">{viewApp.linkedin ? "View Profile" : "Not Provided"}</p>
                                        </div>
                                    </a>

                                    <a 
                                        href={viewApp.portfolio || "#"} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${viewApp.portfolio ? 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20' : 'bg-gray-800/50 border-gray-700 cursor-not-allowed opacity-50'}`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <ExternalLink size={14} className="text-purple-400"/>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Portfolio</p>
                                            <p className="text-sm font-medium text-white truncate max-w-[150px]">{viewApp.portfolio ? "View Portfolio" : "Not Provided"}</p>
                                        </div>
                                    </a>
                                </div>

                                <div className="bg-black/30 p-4 rounded-xl border border-white/5 mt-2">
                                     <div className="flex justify-between items-center mb-2">
                                        <p className="text-xs text-gray-400">Resume / CV</p>
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 uppercase">{viewApp.resumeType || 'FILE'}</span>
                                     </div>
                                     {viewApp.resume ? (
                                        <a href={viewApp.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-400 hover:underline bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20">
                                            <CheckCircle size={16}/>
                                            <span className="text-sm font-bold">Open Resume Document</span>
                                            <ExternalLink size={12} className="ml-auto"/>
                                        </a>
                                     ) : (
                                        <div className="text-yellow-500 flex items-center gap-2 text-sm bg-yellow-500/5 p-3 rounded-lg border border-yellow-500/20">
                                            <Clock size={16}/>
                                            <span>No Resume Uploaded</span>
                                        </div>
                                     )}
                                </div>
                                
                                {viewApp.collegeApprovalLetter && (
                                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 mt-2">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-xs text-gray-400">College Approval Letter</p>
                                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 uppercase">PDF</span>
                                        </div>
                                        <a href={viewApp.collegeApprovalLetter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline bg-blue-500/5 p-3 rounded-lg border border-blue-500/20">
                                            <CheckCircle size={16}/>
                                            <span className="text-sm font-bold">Open Approval Letter</span>
                                            <ExternalLink size={12} className="ml-auto"/>
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Cover Letter */}
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-orange-400 text-xs font-bold uppercase tracking-wider">Cover Letter (Why You?)</h3>
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                                    <p className="text-sm text-gray-300 leading-relaxed italic">
                                        "{viewApp.coverLetter || "No cover letter provided."}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button onClick={() => setViewApp(null)} className="bg-white hover:bg-gray-200 text-black">
                                Close Details
                            </Button>
                        </div>
                    </div>
                </div>
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
                                    <option value="interview_pending" className="bg-slate-800">Interview Pending</option>
                                    <option value="interview_scheduled" className="bg-slate-800">Interview Scheduled</option>
                                    <option value="accepted" className="bg-slate-800">Accepted</option>
                                    <option value="rejected" className="bg-slate-800">Rejected</option>
                                    <option value="completed" className="bg-slate-800">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Official Start Date</label>
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

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Resume Link ({`<a href="...">`})</label>
                                <input
                                    type="url"
                                    value={editForm.resume}
                                    onChange={(e) => setEditForm({ ...editForm, resume: e.target.value })}
                                    placeholder="https://drive.google.com/..."
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

            {/* Exam Assignment Modal */}
            {examModalApp && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-5 border-b border-white/10 pb-3">
                            <div>
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <CheckSquare size={18} className="text-cyan-400" />
                                    <span>Move to Assessment Round</span>
                                </h2>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {examModalApp.student?.firstName} {examModalApp.student?.lastName} • {examModalApp.internship?.title}
                                </p>
                            </div>
                            <button onClick={() => setExamModalApp(null)} className="text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                                    Choose Examination to Assign:
                                </label>
                                {availableExams.length > 0 ? (
                                    <select
                                        value={selectedExamId}
                                        onChange={(e) => setSelectedExamId(e.target.value)}
                                        className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-white text-sm focus:border-cyan-500 outline-none"
                                    >
                                        <option value="">-- Select an Examination --</option>
                                        {availableExams.map((e) => (
                                            <option key={e._id} value={e._id} className="bg-slate-800 text-white">
                                                {e.title} ({e.duration} mins • {e.totalMarks || 100} marks)
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-xs text-amber-400 italic bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                                        No active examinations found. Create an examination first in the Examination Management panel.
                                    </p>
                                )}
                            </div>

                            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 space-y-1">
                                <p className="font-semibold">Candidate Experience:</p>
                                <p className="text-cyan-300/80 leading-relaxed">
                                    Candidate's application status will update to <strong>Online Assessment Round (Pending)</strong> and a direct <strong>[ Take Assessment Exam ]</strong> button will appear on their dashboard card.
                                </p>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button onClick={() => setExamModalApp(null)} variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800">
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleAssignExamAndMove}
                                    disabled={examAssigning}
                                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                                >
                                    {examAssigning ? "Assigning..." : "Confirm & Send"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
