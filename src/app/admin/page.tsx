"use client";

import { useState } from "react";
import { ClipboardList, FileText, GraduationCap, Users, BookOpen, Briefcase } from "lucide-react";
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
                            <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-all cursor-pointer group">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${section.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className="text-white" size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{section.name}</h3>
                                <p className="text-gray-400 text-sm">{section.description}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Step-by-Step Guide */}
            <div className="glass-card p-8 rounded-2xl mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">📋 How to Access Quiz & Assignment Features</h2>

                <div className="space-y-6">
                    {/* Quiz Workflow */}
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <ClipboardList size={24} className="text-purple-400" />
                            Quiz Management
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">1</span>
                                <div>
                                    <p className="font-medium text-white">Click "Courses" card above</p>
                                    <p className="text-sm text-gray-400">Opens course management page</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">2</span>
                                <div>
                                    <p className="font-medium text-white">Find your course card</p>
                                    <p className="text-sm text-gray-400">Scroll to see all courses</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">3</span>
                                <div>
                                    <p className="font-medium text-white">Click purple "Quizzes" button</p>
                                    <p className="text-sm text-gray-400">Located at bottom of course card (left side)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">4</span>
                                <div>
                                    <p className="font-medium text-white">Create & manage quizzes</p>
                                    <p className="text-sm text-gray-400">Add MCQ/True-False questions, set duration & passing score</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Workflow */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <FileText size={24} className="text-green-400" />
                            Assignment Management
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">1</span>
                                <div>
                                    <p className="font-medium text-white">Click "Courses" card above</p>
                                    <p className="text-sm text-gray-400">Opens course management page</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">2</span>
                                <div>
                                    <p className="font-medium text-white">Find your course card</p>
                                    <p className="text-sm text-gray-400">Look at bottom of each course card</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">3</span>
                                <div>
                                    <p className="font-medium text-white">Click green "Assignments" button</p>
                                    <p className="text-sm text-gray-400">Located at bottom of course card (right side)</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">4</span>
                                <div>
                                    <p className="font-medium text-white">Create assignments & grade submissions</p>
                                    <p className="text-sm text-gray-400">Set due dates, view submissions, provide marks & feedback</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="glass-card p-8 rounded-2xl">
                <h2 className="text-2xl font-bold text-white mb-6">Platform Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <BookOpen size={20} className="text-blue-400" />
                            Course Management
                        </h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li>• Create and edit courses</li>
                            <li>• Upload videos with Cloudinary</li>
                            <li>• Manage curriculum & pricing</li>
                            <li>• Track student enrollments</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            <Users size={20} className="text-orange-400" />
                            Application Review
                        </h3>
                        <ul className="space-y-2 text-gray-300 text-sm">
                            <li>• Review internship applications</li>
                            <li>• Accept/reject with one click</li>
                            <li>• View resumes & cover letters</li>
                            <li>• Filter by status (pending/accepted/rejected)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
