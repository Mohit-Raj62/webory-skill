"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Search, Video, ClipboardList, FileText, Star, Eye, EyeOff, BookOpen, IndianRupee, BarChart3, MoreVertical, LayoutGrid, List, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ManageCourseTeachersModal } from "@/components/admin/ManageCourseTeachersModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    color?: string;
    instructor?: string;
    coInstructors?: string[];
}

interface Stats {
    totalCourses: number;
    totalVideos: number;
    totalRevenue: number;
}

export default function CoursesAdminPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    
    // Modal state
    const [isTeachersModalOpen, setIsTeachersModalOpen] = useState(false);
    const [selectedCourseForTeachers, setSelectedCourseForTeachers] = useState<Course | null>(null);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6, // Reduced from 9 for faster initial load
        totalPages: 1,
        totalCount: 0
    });
    
    // Calculate stats on the fly
    const stats: Stats = {
        totalCourses: courses.length,
        totalVideos: courses.reduce((sum, c) => sum + (c.videos?.length || 0), 0),
        totalRevenue: courses.reduce((sum, c) => sum + c.price, 0)
    };

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchCourses(1);
    }, [debouncedSearch]); // Re-fetch on debounced search

    const fetchCourses = async (page = pagination.page) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                includeUnavailable: "true",
                page: page.toString(),
                limit: pagination.limit.toString(),
                search: searchTerm,
                _t: Date.now().toString()
            });
            
            const res = await fetch(`/api/courses?${params}`);
            if (res.ok) {
                const data = await res.json();
                setCourses(data.courses || []);
                if (data.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        page: data.pagination.currentPage,
                        totalPages: data.pagination.totalPages,
                        totalCount: data.pagination.totalCount
                    }));
                }
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
                // Toast notification would be good here
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
            setCourses(courses.map(c => 
                c._id === course._id ? { ...c, isPopular: newStatus } : c
            ));

            const res = await fetch(`/api/admin/courses/${course._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPopular: newStatus }),
            });

            if (!res.ok) {
                setCourses(courses.map(c => 
                    c._id === course._id ? { ...c, isPopular: course.isPopular } : c
                ));
            }
        } catch (error) {
            console.error("Error toggling popular:", error);
        }
    };

    const handleToggleAvailability = async (course: Course) => {
        try {
            const newStatus = !course.isAvailable;
            setCourses(courses.map(c => 
                c._id === course._id ? { ...c, isAvailable: newStatus } : c
            ));

            const res = await fetch(`/api/admin/courses/${course._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isAvailable: newStatus }),
            });

            if (!res.ok) {
                setCourses(courses.map(c => 
                    c._id === course._id ? { ...c, isAvailable: course.isAvailable } : c
                ));
            }
        } catch (error) {
            console.error("Error toggling availability:", error);
        }
    };

    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    // Loading Skeleton
    const CourseSkeleton = () => (
        <Card className="relative border-0 bg-white/5 overflow-hidden h-full flex flex-col rounded-3xl backdrop-blur-md">
            <div className="p-7 flex-1 flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-8 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-1/2 rounded" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <div className="pt-5 border-t border-white/5 flex justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="space-y-2 text-right">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
            </div>
            <div className="p-3 bg-white/[0.02] border-t border-white/5 grid grid-cols-2 gap-2">
                <Skeleton className="h-11 rounded-xl" />
                <Skeleton className="h-11 rounded-xl" />
            </div>
        </Card>
    );

    return (
        <div className="p-8 space-y-8 min-h-screen bg-black/50 text-white">
            {/* Header */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Course Management
                    </h1>
                    <p className="text-blue-200/80 text-lg">Create, manage and organize your curriculum</p>
                </div>
                <Link href="/admin/courses/new" className="relative z-10">
                    <Button className="bg-white text-blue-900 hover:bg-blue-50 shadow-lg shadow-blue-500/20 px-6 py-6 text-lg rounded-xl transition-all hover:scale-105 active:scale-95 font-semibold">
                        <Plus size={24} className="mr-2" />
                        Create New Course
                    </Button>
                </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                {[
                    { label: "Total Courses", value: stats.totalCourses, icon: BookOpen, color: "text-blue-400", bg: "bg-blue-500/10" },
                    { label: "Total Content", value: `${stats.totalVideos} Videos`, icon: Video, color: "text-purple-400", bg: "bg-purple-500/10" },
                    { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                ].map((stat, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <Card className="border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden group hover:border-white/20 transition-all duration-300">
                             <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full ${stat.bg} blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                            <CardContent className="p-6 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <BarChart3 className="w-5 h-5 text-gray-500 opacity-50" />
                                </div>
                                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Search and Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-2 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md sticky top-4 z-20"
            >
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search courses by title, level or price..."
                        className="w-full bg-transparent border-none rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                {loading ? (
                    Array(6).fill(0).map((_, i) => <CourseSkeleton key={i} />)
                ) : (
                    <AnimatePresence>
                        {filteredCourses.map((course) => (
                            <motion.div key={course._id} variants={itemVariants} layout initial="hidden" animate="visible">
                                <Card className="relative border-0 bg-white/5 hover:bg-white/10 overflow-hidden group hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 h-full flex flex-col rounded-3xl backdrop-blur-md">
                                    {/* Gradient Border via pseudo-element - using index for variety (lighter shades) */}
                                    <div className={`absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-b ${['from-purple-400', 'from-cyan-400', 'from-emerald-400', 'from-orange-400', 'from-pink-400'][filteredCourses.indexOf(course) % 5]} to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none`} />
                                    <div className={`absolute inset-0 bg-gradient-to-b ${['from-purple-400', 'from-cyan-400', 'from-emerald-400', 'from-orange-400', 'from-pink-400'][filteredCourses.indexOf(course) % 5]} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
                                    
                                    <div className="p-7 flex-1 flex flex-col relative z-10">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className="flex gap-2">
                                                {course.isPopular && (
                                                    <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-sm shadow-yellow-900/20">
                                                        Popular
                                                    </Badge>
                                                )}
                                                {!course.isAvailable && (
                                                    <Badge variant="destructive" className="bg-red-900/20 text-red-400 border-red-500/20">
                                                        Unavailable
                                                    </Badge>
                                                )}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-white transition-colors">
                                                        <MoreVertical size={18} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-[#111] border-white/5 shadow-xl text-gray-300 backdrop-blur-xl">
                                                    <Link href={`/admin/courses/${course._id}/edit`}>
                                                        <DropdownMenuItem className="cursor-pointer hover:bg-white/5 focus:bg-white/5 focus:text-white">
                                                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleToggleAvailability(course)}
                                                        className="cursor-pointer hover:bg-white/5 focus:bg-white/5 focus:text-white"
                                                    >
                                                        {course.isAvailable ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                                                        {course.isAvailable ? "Mark Unavailable" : "Mark Available"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleTogglePopular(course)}
                                                        className="cursor-pointer hover:bg-white/5 focus:bg-white/5 focus:text-white"
                                                    >
                                                        <Star className="mr-2 h-4 w-4" fill={course.isPopular ? "currentColor" : "none"} />
                                                        {course.isPopular ? "Remove Popular" : "Mark Popular"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => {
                                                            setSelectedCourseForTeachers(course);
                                                            setIsTeachersModalOpen(true);
                                                        }}
                                                        className="cursor-pointer hover:bg-white/5 focus:bg-white/5 focus:text-white text-blue-400"
                                                    >
                                                        <Users className="mr-2 h-4 w-4" /> Manage Teachers
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => handleDelete(course._id)}
                                                        className="text-red-400 cursor-pointer hover:bg-red-900/10 focus:bg-red-900/10 focus:text-red-300"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Course
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-blue-400 transition-colors line-clamp-2">
                                            {course.title}
                                        </h3>
                                        
                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-6 flex-1">
                                            {course.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <Badge variant="outline" className="border-white/5 bg-white/5 text-gray-400 font-normal px-3 py-1">
                                                {course.level}
                                            </Badge>
                                            <Badge variant="outline" className="border-white/5 bg-white/5 text-gray-400 font-normal px-3 py-1 flex items-center gap-1.5">
                                                <Video size={12} />
                                                {course.videos?.length || 0} Videos
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between pt-5 border-t border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-0.5">Price</span>
                                                <span className="text-2xl font-bold text-white tracking-tight">
                                                    ₹{course.price.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-0.5">Enrolled</span>
                                                <div className="flex items-center gap-1.5 text-white bg-white/5 px-2 py-1 rounded-md">
                                                    <Users size={12} className="text-gray-400" />
                                                    <span className="font-medium">{course.studentsCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-3 bg-white/[0.02] border-t border-white/5 grid grid-cols-2 gap-2 relative z-10">
                                        <Link href={`/admin/courses/${course._id}/quizzes`}>
                                            <Button variant="ghost" className="w-full justify-center gap-2 text-gray-400 hover:text-purple-300 hover:bg-purple-500/10 h-11 rounded-xl transition-all group/btn">
                                                <ClipboardList size={18} className="text-purple-500/70 group-hover/btn:text-purple-400 transition-colors" />
                                                <span className="font-medium">Quizzes</span>
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/courses/${course._id}/assignments`}>
                                            <Button variant="ghost" className="w-full justify-center gap-2 text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10 h-11 rounded-xl transition-all group/btn">
                                                <FileText size={18} className="text-emerald-500/70 group-hover/btn:text-emerald-400 transition-colors" />
                                                <span className="font-medium">Assignments</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pb-12">
                    <Button
                        variant="outline"
                        onClick={() => fetchCourses(pagination.page - 1)}
                        disabled={pagination.page <= 1 || loading}
                        className="border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                    >
                        <ChevronLeft size={16} className="mr-2" /> Previous
                    </Button>
                    <div className="text-gray-400 text-sm font-medium">
                        Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => fetchCourses(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages || loading}
                        className="border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                    >
                        Next <ChevronRight size={16} className="ml-2" />
                    </Button>
                </div>
            )}

            {filteredCourses.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No courses found</h3>
                    <p className="text-gray-400 max-w-sm">
                        Try adjusting your search terms or create a new course to get started.
                    </p>
                </div>
            )}
            
            <ManageCourseTeachersModal
                isOpen={isTeachersModalOpen}
                onClose={() => {
                    setIsTeachersModalOpen(false);
                    setSelectedCourseForTeachers(null);
                }}
                course={selectedCourseForTeachers}
                onSuccess={() => fetchCourses()}
            />
        </div>
    );
}
