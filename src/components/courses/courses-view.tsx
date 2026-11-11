"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { 
    Search, 
    Clock, 
    BookOpen, 
    Star, 
    ArrowRight, 
    PlayCircle, 
    X,
    Users,
    Briefcase
} from "lucide-react";

interface CourseItem {
    _id: string;
    title: string;
    slug?: string;
    description: string;
    level?: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    duration?: string;
    language?: string;
    thumbnail?: string;
    isPopular?: boolean;
    isFree?: boolean;
    modulesCount?: number;
    videosCount?: number;
    studentsCount?: string | number;
}

interface CoursesViewProps {
    courses: CourseItem[];
    enrolledCourseIds: string[];
}

export function CoursesView({ courses, enrolledCourseIds = [] }: CoursesViewProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLevel, setSelectedLevel] = useState<string>("All");

    const safeCourses = useMemo(() => Array.isArray(courses) ? courses : [], [courses]);

    // Filter Logic
    const filteredCourses = useMemo(() => {
        return safeCourses.filter((course) => {
            const matchesSearch = 
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
            return matchesSearch && matchesLevel;
        });
    }, [safeCourses, searchQuery, selectedLevel]);

    return (
        <main className="min-h-screen bg-[#020617] text-slate-100 relative overflow-hidden font-sans selection:bg-blue-600/30">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-blue-600/10 via-cyan-900/5 to-transparent blur-[120px] pointer-events-none -z-10" />
            <div className="absolute top-40 right-[10%] w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            <Navbar />

            <div className="relative z-10 pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
                
                {/* Clean, Human Header */}
                <div className="mb-8 sm:mb-10 pt-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                        Explore Courses
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-2xl leading-relaxed">
                        Industry-aligned programs with practical projects, verified certificates, and mentor support.
                    </p>
                </div>

                {/* Search & Filter Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8">
                    {/* Search Bar */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input 
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 bg-white/[0.04] border border-white/10 rounded-lg pl-9 pr-8 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Level Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
                            <button
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                                    selectedLevel === level
                                        ? "bg-white text-gray-950 font-semibold"
                                        : "bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.07] border border-white/5"
                                }`}
                            >
                                {level === "All" ? "All Levels" : level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Courses Listing Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => {
                            const isEnrolled = enrolledCourseIds.includes(course._id);
                            const courseUrl = `/courses/${course.slug || course._id}`;
                            const isFree = course.price === 0;

                            return (
                                <div
                                    key={course._id}
                                    className="group flex flex-col rounded-xl bg-[#0B0F19]/90 border border-white/10 hover:border-white/25 hover:bg-[#0E1422] transition-all duration-200 overflow-hidden"
                                >
                                    {/* Course Thumbnail */}
                                    <Link href={courseUrl} className="block relative aspect-video w-full overflow-hidden bg-slate-900 shrink-0">
                                        {course.thumbnail ? (
                                            <img 
                                                src={course.thumbnail} 
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-gray-500 text-xs">
                                                <span>Course Preview</span>
                                            </div>
                                        )}

                                        {/* Simple level pill on thumbnail */}
                                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                                            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-black/75 backdrop-blur-sm text-gray-200 border border-white/10">
                                                {course.level || "Beginner"}
                                            </span>
                                            {isFree && (
                                                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500 text-black">
                                                    Free
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    {/* Card Content */}
                                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug">
                                                <Link href={courseUrl}>
                                                    {course.title}
                                                </Link>
                                            </h2>

                                            <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">
                                                Mentored by Vijay Kumar (IIT Mandi Alumnus) & Webory Team
                                            </p>

                                            <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                                                {course.description || "Master core concepts and build real production projects."}
                                            </p>

                                            {/* Minimal Stats Row (No clumsy boxes) */}
                                            <div className="flex items-center gap-2.5 text-xs text-gray-400 mt-3 pt-3 border-t border-white/5">
                                                <span className="flex items-center gap-1 text-amber-400 font-medium">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                    4.8
                                                </span>
                                                <span className="text-gray-600">•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-gray-400" />
                                                    {course.duration || "Self-Paced"}
                                                </span>
                                                {course.modulesCount && course.modulesCount > 0 ? (
                                                    <>
                                                        <span className="text-gray-600">•</span>
                                                        <span className="flex items-center gap-1">
                                                            <BookOpen className="w-3 h-3 text-gray-400" />
                                                            {course.modulesCount} Modules
                                                        </span>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>

                                        {/* Pricing & Button */}
                                        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                                            <div>
                                                {isFree ? (
                                                    <div className="flex items-baseline gap-1.5">
                                                        <span className="text-lg font-bold text-emerald-400">Free</span>
                                                        {course.originalPrice && course.originalPrice > 0 ? (
                                                            <span className="text-xs text-gray-500 line-through">₹{course.originalPrice}</span>
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-baseline gap-1.5">
                                                        <span className="text-lg font-bold text-white">₹{course.price}</span>
                                                        {course.originalPrice && course.originalPrice > course.price ? (
                                                            <span className="text-xs text-gray-500 line-through">₹{course.originalPrice}</span>
                                                        ) : null}
                                                    </div>
                                                )}
                                                <span className="text-[10px] text-gray-400 block">Certificate included</span>
                                            </div>

                                            {isEnrolled ? (
                                                <Link 
                                                    href={courseUrl}
                                                    className="h-8 px-3 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                                                >
                                                    <PlayCircle className="w-3.5 h-3.5" />
                                                    <span>Continue</span>
                                                </Link>
                                            ) : (
                                                <Link 
                                                    href={courseUrl}
                                                    className="h-8 px-3.5 rounded-lg bg-white hover:bg-gray-100 text-gray-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                                >
                                                    <span>View Course</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </Link>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Clean Premium Empty State */
                    <div className="text-center py-12 px-6 sm:px-8 rounded-xl bg-[#0c1322] border border-slate-800 max-w-lg mx-auto space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 mx-auto flex items-center justify-center">
                            <BookOpen size={22} />
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-lg font-semibold text-white">
                                New Courses Updating
                            </h3>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                                {searchQuery || selectedLevel !== "All"
                                    ? "Is filter ke mutabiq abhi koi course available nahi hai. Aap filters reset karke doosre tracks dekh sakte hain."
                                    : "Naye technology aur project-based certification courses update ho rahe hain. Jald hi naye batches open honge. Tab tak aap hamari internships explore kar sakte hain."}
                            </p>
                        </div>
                        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                            {(searchQuery || selectedLevel !== "All") && (
                                <button
                                    onClick={() => {
                                        setSelectedLevel("All");
                                        setSearchQuery("");
                                    }}
                                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition-colors"
                                >
                                    Reset Filters
                                </button>
                            )}
                            <Link
                                href="/internships"
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5"
                            >
                                <Briefcase size={15} />
                                <span>View Internships</span>
                            </Link>
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs sm:text-sm font-medium transition-colors"
                            >
                                Home
                            </Link>
                        </div>
                    </div>
                )}

            </div>

            <Footer />
        </main>
    );
}
