"use client";

import { useState, useEffect } from "react";
import { ClipboardList, FileText, GraduationCap, Users, BookOpen, Briefcase, Star, Award, Shield, Gift, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
    const sections = [
        {
            id: "courses",
            name: "Courses",
            icon: BookOpen,
            description: "Manage courses, videos, and content",
            link: "/admin/courses",
            color: "from-blue-600 to-purple-600",
        },
        {
            id: "internships",
            name: "Internships",
            icon: Briefcase,
            description: "Manage internship listings",
            link: "/admin/internships",
            color: "from-purple-600 to-pink-600",
        },
        {
            id: "applications",
            name: "Applications",
            icon: Users,
            description: "Review student applications",
            link: "/admin/applications",
            color: "from-orange-600 to-red-600",
        },
        {
            id: "analytics",
            name: "Analytics",
            icon: GraduationCap,
            description: "View reports and statistics",
            link: "/admin/analytics",
            color: "from-green-600 to-teal-600",
        },
        {
            id: "feedback",
            name: "Feedback",
            icon: Star,
            description: "Manage user feedback",
            link: "/admin/feedback",
            color: "from-yellow-500 to-orange-500",
        },
        {
            id: "certificates",
            name: "Certificates",
            icon: Award,
            description: "Verify, generate & manage certificates",
            link: "/admin/certificates",
            color: "from-indigo-600 to-purple-600",
        },
        {
            id: "rewards",
            name: "Rewards",
            icon: Gift,
            description: "Manage ambassador reward requests",
            link: "/admin/rewards",
            color: "from-pink-600 to-rose-600",
        },
        {
            id: "consent",
            name: "Consent Logs",
            icon: Shield,
            description: "Audit user privacy consents",
            link: "/admin/consent",
            color: "from-emerald-600 to-teal-600",
        },
    ];

    return (
        <div className="p-4 md:p-8">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-sm md:text-base text-gray-400">Manage your platform from one place</p>
            </div>

            {/* Main Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <Link key={section.id} href={section.link}>
                            <div className="glass-card p-6 rounded-2xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer group border border-white/5 relative overflow-hidden shadow-lg">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.color} opacity-10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:opacity-20 transition-all duration-500`}></div>
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${section.color} shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-10`}>
                                    <Icon className="text-white" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 relative z-10">{section.name}</h3>
                                <p className="text-gray-400 text-sm font-medium relative z-10">{section.description}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Step-by-Step Guide */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                        <BookOpen size={24} className="text-indigo-400" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Guide & Workflows</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Quiz Workflow */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-purple-900/40 to-purple-500/5 border border-purple-500/20 rounded-2xl p-6 md:p-8 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500 group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-purple-500/20 transition-all duration-500"></div>
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-300 mb-6 flex items-center gap-3 relative z-10">
                            <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 shadow-inner">
                                <ClipboardList size={24} className="text-purple-300" />
                            </div>
                            Quiz Management
                        </h3>
                        <div className="space-y-2 relative z-10">
                            <div className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/30">1</span>
                                <div>
                                    <p className="font-semibold text-white text-base">Click "Courses" card</p>
                                    <p className="text-sm text-gray-400 mt-0.5">Opens course management page</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/30">2</span>
                                <div>
                                    <p className="font-semibold text-white text-base">Find your course</p>
                                    <p className="text-sm text-gray-400 mt-0.5">Scroll through the list to locate it</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/30">3</span>
                                <div>
                                    <p className="font-semibold text-white text-base">Click "Quizzes" button</p>
                                    <p className="text-sm text-gray-400 mt-0.5">Purple button at bottom left of the card</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/30">4</span>
                                <div>
                                    <p className="font-semibold text-white text-base">Create & Manage</p>
                                    <p className="text-sm text-gray-400 mt-0.5">Add MCQ questions, set passing scores</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Workflow */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-green-900/40 to-green-500/5 border border-green-500/20 rounded-2xl p-6 md:p-8 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all duration-500 group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-green-500/20 transition-all duration-500"></div>
                        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300 mb-6 flex items-center gap-3 relative z-10">
                            <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30 shadow-inner">
                                <FileText size={24} className="text-green-300" />
                            </div>
                            Assignment Management
                        </h3>
                        <div className="space-y-2 relative z-10">
                            <div className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center font-bold shadow-lg shadow-green-500/30">1</span>
                                <div>
                                    <p className="font-semibold text-white text-base">Click "Courses" card</p>
                                    <p className="text-sm text-gray-400 mt-0.5">Opens course management page</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center font-bold shadow-lg shadow-green-500/30">2</span>
                                <div>
                                    <p className="font-semibold text-white text-base">Find your course</p>
                                    <p className="text-sm text-gray-400 mt-0.5">Look at the bottom of each card</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center font-bold shadow-lg shadow-green-500/30">3</span>
                                <div>
                                    <p className="font-semibold text-white text-base">Click "Assignments" button</p>
                                    <p className="text-sm text-gray-400 mt-0.5">Green button at bottom right of the card</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center font-bold shadow-lg shadow-green-500/30">4</span>
                                <div>
                                    <p className="font-semibold text-white text-base">Grade Submissions</p>
                                    <p className="text-sm text-gray-400 mt-0.5">Set due dates, give marks & feedback</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-900/30 to-blue-500/5 border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-colors group">
                    <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
                        <BookOpen size={150} className="text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-4 flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-blue-500/20 rounded-lg border border-blue-500/30">
                            <BookOpen size={20} className="text-blue-300" />
                        </div>
                        Course Management
                    </h3>
                    <ul className="space-y-3 text-gray-300 text-sm relative z-10">
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Create and edit courses</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Upload videos with Cloudinary</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Manage curriculum & pricing</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Track student enrollments</li>
                    </ul>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-orange-900/30 to-orange-500/5 border border-orange-500/20 rounded-2xl p-6 hover:border-orange-500/40 transition-colors group">
                    <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={150} className="text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-amber-300 mb-4 flex items-center gap-3 relative z-10">
                        <div className="p-2.5 bg-orange-500/20 rounded-lg border border-orange-500/30">
                            <Users size={20} className="text-orange-300" />
                        </div>
                        Application Review
                    </h3>
                    <ul className="space-y-3 text-gray-300 text-sm relative z-10">
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Review internship applications</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Accept/reject with one click</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> View resumes & cover letters</li>
                        <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> Filter by status (pending/accepted)</li>
                    </ul>
                </div>
            </div>
            
            {/* Analytics Preview */}
            <AnalyticsPreview />
        </div>
    );
}

function AnalyticsPreview() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/overview')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="glass-card p-6 h-40 animate-pulse rounded-2xl"></div>;
    if (!stats) return null;

    return (
        <div className="glass-card border border-white/5 p-6 md:p-8 rounded-3xl mb-8 shadow-2xl relative overflow-hidden">
            {/* Subtle background glow for the whole analytics block */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-8 flex items-center gap-3">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <TrendingUp className="text-white" size={24} />
                </div>
                Platform Snapshot
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Popular Courses */}
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">🔥 Popular Courses</h3>
                    {stats.topCourses?.map((course: any, index: number) => (
                        <div key={course._id} className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-lg ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-yellow-500/30' : 'bg-white/10 text-gray-300'}`}>
                                    {index + 1}
                                </span>
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-blue-300 transition-colors">{course.title}</h4>
                                    <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {course._id.substring(0, 8)}...</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{course.views || 0}</div>
                                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Views</div>
                            </div>
                        </div>
                    ))}
                    {(!stats.topCourses || stats.topCourses.length === 0) && (
                         <div className="text-center py-8 text-gray-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">No views recorded yet.</div>
                    )}
                 </div>

                 {/* Top Learners */}
                 <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">🎓 Top Learners</h3>
                    {stats.topLearners?.map((user: any, index: number) => (
                        <div key={user._id} className="group flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-lg ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-yellow-500/30' : 'bg-white/10 text-gray-300'}`}>
                                    {index + 1}
                                </span>
                                <div>
                                    <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors">{user.firstName} {user.lastName}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-300">{user.xp || 0}</div>
                                <div className="text-[10px] uppercase tracking-wider font-bold text-gray-500">XP Points</div>
                                <div className="text-[10px] text-purple-400 mt-1 font-medium bg-purple-500/10 px-2 py-0.5 rounded-md inline-block">{user.coursesCount} Courses</div>
                            </div>
                        </div>
                    ))}
                    {(!stats.topLearners || stats.topLearners.length === 0) && (
                         <div className="text-center py-8 text-gray-500 bg-white/5 rounded-2xl border border-white/5 border-dashed">No student activity yet.</div>
                    )}
                 </div>
            </div>

             {/* Key Stats Summary */}
             <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
                <div className="bg-blue-500/10 p-5 rounded-2xl border border-blue-500/20 text-center hover:scale-[1.02] transition-transform duration-300">
                    <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-1">{stats.totalUsers || 0}</div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-400">Total Users</div>
                </div>
                <div className="bg-green-500/10 p-5 rounded-2xl border border-green-500/20 text-center hover:scale-[1.02] transition-transform duration-300">
                    <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-1">₹{stats.revenue?.toLocaleString() || 0}</div>
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-400">Total Revenue</div>
                </div>
                <div className="bg-purple-500/10 p-5 rounded-2xl border border-purple-500/20 text-center hover:scale-[1.02] transition-transform duration-300">
                     <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-300 mb-1">{stats.recentEnrollments || 0}</div>
                     <div className="text-xs font-medium uppercase tracking-wide text-gray-400">Recent Enrollments</div>
                </div>
                 <div className="bg-orange-500/10 p-5 rounded-2xl border border-orange-500/20 text-center hover:scale-[1.02] transition-transform duration-300">
                     <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 mb-1">{stats.totalApplications || 0}</div>
                     <div className="text-xs font-medium uppercase tracking-wide text-gray-400">Applications</div>
                 </div>
                 <div className="bg-indigo-500/10 p-5 rounded-2xl border border-indigo-500/20 text-center hover:scale-[1.02] transition-transform duration-300">
                     <div className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300 mb-1">{stats.pwaInstalls || 0}</div>
                     <div className="text-xs font-medium uppercase tracking-wide text-gray-400">App Installs</div>
                 </div>
             </div>
        </div>
    );
}
