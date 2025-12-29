"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/session-provider";
import { User, Mail, Award, Briefcase, LogOut, ExternalLink, Trophy, Calendar, Video, FileText, Clock, Upload } from "lucide-react";
import { ActivityDashboard } from "@/components/dashboard/activity-dashboard";
import { GradesDashboard } from "@/components/dashboard/grades-dashboard";

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    _id: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState < UserProfile | null > (null);
    const [enrollments, setEnrollments] = useState < any[] > ([]);
    const [applications, setApplications] = useState < any[] > ([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState < 'courses' | 'internships' | 'grades' > ('courses');
    const [uploadingAppId, setUploadingAppId] = useState<string | null>(null);
    const router = useRouter();
    const { refreshAuth } = useAuth();

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, appId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploadingAppId(appId);

        try {
            // 1. Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload/resume", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");
            const uploadData = await uploadRes.json();

            // 2. Update Application with Resume URL
            const updateRes = await fetch(`/api/student/applications/${appId}/resume`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resume: uploadData.url }),
            });

            if (updateRes.ok) {
                // Update local state
                setApplications(apps => apps.map(app => 
                    app._id === appId ? { ...app, resume: uploadData.url } : app
                ));
            }
        } catch (error) {
            console.error("Resume upload error:", error);
            alert("Failed to upload resume");
        } finally {
            setUploadingAppId(null);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch auth and dashboard data in parallel
                const [resAuth, resDash] = await Promise.all([
                    fetch("/api/auth/me"),
                    fetch("/api/user/dashboard")
                ]);

                if (!resAuth.ok) throw new Error("Not authenticated");
                const userData = await resAuth.json();
                setUser(userData.user);

                if (resDash.ok) {
                    const dashData = await resDash.json();
                    setEnrollments(dashData.enrollments);
                    setApplications(dashData.applications);
                }
            } catch (error) {
                console.error("Profile fetch error:", error);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            await refreshAuth();
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-white">Loading profile...</div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="glass-card p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white">
                            {user.firstName[0]}
                            {user.lastName[0]}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-white mb-2">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
                                <Mail size={16} /> {user.email}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3 justify-center md:justify-start">
                                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm border border-blue-500/30 capitalize">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <Button onClick={() => router.push(`/portfolio/${user._id}`)} className="bg-blue-600 hover:bg-blue-700">
                                    <ExternalLink className="mr-2 h-4 w-4" /> Portfolio
                                </Button>
                                <Button onClick={() => router.push('/resume')} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                                    <Briefcase className="mr-2 h-4 w-4" /> Resume
                                </Button>
                            </div>
                            <Button variant="outline" onClick={handleLogout} className="border-red-500/30 text-red-400 hover:bg-red-500/10 w-full">
                                <LogOut className="mr-2 h-4 w-4" /> Log Out
                            </Button>
                        </div>
                    </div>

                    {/* Activity Dashboard Tabs */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Student Dashboard</h2>

                        {/* Tab Buttons */}
                        <div className="flex gap-4 mb-6 flex-wrap">
                            <button
                                onClick={() => setActiveTab('courses')}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'courses'
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Course Activities
                            </button>
                            <button
                                onClick={() => setActiveTab('internships')}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTab === 'internships'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Internship Activities
                            </button>
                            <button
                                onClick={() => setActiveTab('grades')}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${activeTab === 'grades'
                                    ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                <Trophy size={18} />
                                My Grades
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'courses' && (
                            <ActivityDashboard category="course" title="Courses" />
                        )}
                        {activeTab === 'internships' && (
                            <ActivityDashboard category="internship" title="Internships" />
                        )}
                        {activeTab === 'grades' && (
                            <GradesDashboard />
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Enrolled Courses */}
                        <div className="glass-card p-6 rounded-2xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Award className="text-blue-400" /> Enrolled Courses
                            </h2>

                            {enrollments.length > 0 ? (
                                <div className="space-y-4">
                                    {enrollments
                                        .filter((enrollment: any) => enrollment.course)
                                        .map((enrollment, index) => (
                                            <div key={index} className="bg-white/5 p-4 rounded-xl flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-white font-bold">{enrollment.course?.title || "Unknown Course"}</h3>
                                                        <div className="w-full bg-gray-700 h-2 rounded-full mt-2 w-32">
                                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(enrollment.progress || 0, 100)}%` }}></div>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1">{Math.min(enrollment.progress || 0, 100)}% Complete</p>
                                                    </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-blue-400"
                                                    onClick={() => router.push(`/courses/${enrollment.course._id}`)}
                                                >
                                                    Continue
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    <p>You haven't enrolled in any courses.</p>
                                    <Button variant="link" className="text-blue-400 mt-2" onClick={() => router.push('/courses')}>
                                        Explore Courses
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Applied Internships */}
                        <div className="glass-card p-6 rounded-2xl">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Briefcase className="text-purple-400" /> Internship Applications
                            </h2>

                            {applications.length > 0 ? (
                                <div className="space-y-4">
                                    {applications
                                        .filter((app: any) => app.internship)
                                        .map((app, index) => (
                                            <div key={index} className="bg-white/5 p-4 rounded-xl">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-white font-bold">{app.internship?.title || "Unknown Internship"}</h3>
                                                    <span className={`px-2 py-1 rounded text-xs ${app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        app.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                                            app.status === 'interview_scheduled' ? 'bg-purple-500/20 text-purple-400' :
                                                                'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {app.status.toUpperCase().replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-2">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>

                                                {/* Interview Details */}
                                                {app.status === 'interview_scheduled' && app.interviewDate && (
                                                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mb-3">
                                                        <div className="flex items-center gap-2 text-purple-300 font-semibold mb-1">
                                                            <Calendar size={14} />
                                                            <span>Interview Scheduled</span>
                                                        </div>
                                                        <p className="text-white text-sm mb-2">
                                                            {new Date(app.interviewDate).toLocaleString()}
                                                        </p>
                                                        {app.interviewLink && (
                                                            <a
                                                                href={app.interviewLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-md transition-colors"
                                                            >
                                                                <Video size={12} />
                                                                Join Interview
                                                            </a>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex gap-3 flex-wrap">
                                                    {app.resume && app.resume !== "Pending Upload" ? (
                                                        <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 flex items-center gap-1 hover:underline">
                                                            View Resume <ExternalLink size={10} />
                                                        </a>
                                                    ) : (
                                                        <div>
                                                            <input
                                                                type="file"
                                                                id={`resume-upload-${app._id}`}
                                                                className="hidden"
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                onChange={(e) => handleFileUpload(e, app._id)}
                                                            />
                                                            <label
                                                                htmlFor={`resume-upload-${app._id}`}
                                                                className={`text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                                                                    uploadingAppId === app._id 
                                                                    ? "text-gray-400" 
                                                                    : "text-blue-400 hover:text-blue-300"
                                                                }`}
                                                            >
                                                                {uploadingAppId === app._id ? (
                                                                    <>Uploading... <Clock size={10} className="animate-spin" /></>
                                                                ) : (
                                                                    <>Upload Resume <Upload size={10} /></>
                                                                )}
                                                            </label>
                                                        </div>
                                                    )}
                                                    {(app.status === 'accepted' || app.status === 'completed') && (
                                                        <>
                                                            <button
                                                                onClick={() => router.push(`/internships/${app.internship._id}/tasks`)}
                                                                className="text-xs text-purple-400 flex items-center gap-1 hover:underline font-semibold"
                                                            >
                                                                <FileText size={12} /> View Tasks
                                                            </button>
                                                            {(app.status === 'accepted' || app.status === 'completed') && (
                                                                <button
                                                                    onClick={() => router.push(`/internships/applications/${app._id}/offer-letter`)}
                                                                    className="text-xs text-green-400 flex items-center gap-1 hover:underline font-semibold"
                                                                >
                                                                    📄 Download Joining Letter
                                                                </button>
                                                            )}
                                                            {app.status === 'completed' && (
                                                                <button
                                                                    onClick={() => router.push(`/internships/applications/${app._id}/certificate`)}
                                                                    className="text-xs text-blue-400 flex items-center gap-1 hover:underline font-semibold"
                                                                >
                                                                    🎓 Download Certificate
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    <p>No active applications yet.</p>
                                    <Button variant="link" className="text-blue-400 mt-2" onClick={() => router.push('/internships')}>
                                        Browse Internships
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
