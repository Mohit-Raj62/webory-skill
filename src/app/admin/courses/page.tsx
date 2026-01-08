"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Video, ClipboardList, FileText, Star, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Course {
    _id: string;
    title: string;
    description: string;
    level: string;
    price: number;
    studentsCount: string;
    videos: any[];
    createdAt: string;
    isPopular?: boolean;
    isAvailable?: boolean;
}

export default function CoursesAdminPage() {
    const [courses, setCourses] = useState < Course[] > ([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await fetch("/api/courses?includeUnavailable=true");
            if (res.ok) {
                const data = await res.json();
                setCourses(data.courses || []);
            }
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId: string) => {
        if (!confirm("Are you sure you want to delete this course?")) return;

        try {
            const res = await fetch(`/api/admin/courses/${courseId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setCourses(courses.filter((c) => c._id !== courseId));
                alert("Course deleted successfully");
            } else {
                alert("Failed to delete course");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete course");
        }
    };

    const handleTogglePopular = async (course: Course) => {
        try {
            const newStatus = !course.isPopular;
            // Optimistic update
            setCourses(courses.map(c => 
                c._id === course._id ? { ...c, isPopular: newStatus } : c
            ));

            const res = await fetch(`/api/admin/courses/${course._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPopular: newStatus }),
            });

            if (!res.ok) {
                // Revert on failure
                setCourses(courses.map(c => 
                    c._id === course._id ? { ...c, isPopular: course.isPopular } : c
                ));
                alert("Failed to update popular status");
            }
        } catch (error) {
            console.error("Update popular status error:", error);
            // Revert on failure
            setCourses(courses.map(c => 
                c._id === course._id ? { ...c, isPopular: course.isPopular } : c
            ));
            alert("Failed to update popular status");
        }
    };

    const handleToggleAvailability = async (course: Course) => {
        try {
            const newStatus = !course.isAvailable;
            // Optimistic update
            setCourses(courses.map(c => 
                c._id === course._id ? { ...c, isAvailable: newStatus } : c
            ));

            const res = await fetch(`/api/admin/courses/${course._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isAvailable: newStatus }),
            });

            if (!res.ok) {
                // Revert on failure
                setCourses(courses.map(c => 
                    c._id === course._id ? { ...c, isAvailable: course.isAvailable } : c
                ));
                alert("Failed to update availability status");
            }
        } catch (error) {
            console.error("Update availability status error:", error);
            // Revert on failure
            setCourses(courses.map(c => 
                c._id === course._id ? { ...c, isAvailable: course.isAvailable } : c
            ));
            alert("Failed to update availability status");
        }
    };

    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-white">Loading courses...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Course Management</h1>
                    <p className="text-gray-400">Manage all courses and content</p>
                </div>
                <Link href="/admin/courses/new" className="w-full md:w-auto">
                    <Button className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus size={20} className="mr-2" />
                        Add Course
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="glass-card p-4 rounded-2xl mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500/50 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Total Courses</p>
                    <p className="text-3xl font-bold text-white">{courses.length}</p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Total Videos</p>
                    <p className="text-3xl font-bold text-white">
                        {courses.reduce((sum, c) => sum + (c.videos?.length || 0), 0)}
                    </p>
                </div>
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">
                        ₹{courses.reduce((sum, c) => sum + c.price, 0)}
                    </p>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <div key={course._id} className="glass-card p-6 rounded-2xl hover:border-white/20 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">{course.title}</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleToggleAvailability(course)}
                                    className={`p-2 rounded-lg transition-colors ${course.isAvailable ? "text-green-400 hover:bg-green-400/10" : "text-gray-500 hover:bg-gray-500/10"}`}
                                    title={course.isAvailable ? "Mark as Unavailable" : "Mark as Available"}
                                >
                                    {course.isAvailable ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                                <button
                                    onClick={() => handleTogglePopular(course)}
                                    className={`p-2 rounded-lg transition-colors ${course.isPopular ? "text-yellow-400 hover:bg-yellow-400/10" : "text-gray-400 hover:bg-gray-500/10"}`}
                                    title={course.isPopular ? "Remove from Popular" : "Mark as Popular"}
                                >
                                    <Star size={18} fill={course.isPopular ? "currentColor" : "none"} />
                                </button>
                                <Link href={`/admin/courses/${course._id}/edit`}>
                                    <button className="p-2 hover:bg-blue-500/10 rounded-lg transition-colors text-blue-400">
                                        <Edit size={18} />
                                    </button>
                                </Link>
                                <button
                                    onClick={() => handleDelete(course._id)}
                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-red-400"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {course.description}
                        </p>

                        <div className="flex items-center justify-between text-sm">
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                {course.level}
                            </span>
                            <span className="text-gray-400 flex items-center gap-1">
                                <Video size={16} />
                                {course.videos?.length || 0} videos
                            </span>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl font-bold text-white">₹{course.price}</span>
                                <span className="text-gray-400 text-sm">{course.studentsCount} students</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Link href={`/admin/courses/${course._id}/quizzes`}>
                                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                                        <ClipboardList size={16} className="mr-1" />
                                        Quizzes
                                    </Button>
                                </Link>
                                <Link href={`/admin/courses/${course._id}/assignments`}>
                                    <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700">
                                        <FileText size={16} className="mr-1" />
                                        Assignments
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    No courses found
                </div>
            )}
        </div>
    );
}
