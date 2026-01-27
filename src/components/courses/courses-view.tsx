"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Code2, Database, Globe, Palette, Terminal, Cpu, Cloud, Shield, CheckCircle, ArrowRight, BookOpen, Users, Zap, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

const iconMap: any = {
    Globe, Palette, Database, Code2, Cloud, Shield, Terminal, Cpu
};

interface CoursesViewProps {
    courses: any[];
    enrolledCourseIds: string[];
}

export function CoursesView({ courses, enrolledCourseIds }: CoursesViewProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("All");

    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 course.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLevel = selectedLevel === "All" || course.level === selectedLevel;
            return matchesSearch && matchesLevel;
        });
    }, [courses, searchQuery, selectedLevel]);

    const getIcon = (iconName: string) => {
        const Icon = iconMap[iconName] || Code2;
        return <Icon className="text-white w-8 h-8" />;
    };

    return (
        <main className="min-h-screen bg-[#020617] relative overflow-hidden font-sans">
             {/* Subtle Grid Background */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

             {/* Background Effects & Floating Elements */}
             <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-blue-600/10 via-cyan-900/5 to-transparent blur-[120px] -z-10" />
             <div className="absolute top-40 right-[10%] w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] -z-10 animate-pulse" />
             
             {/* Floating Particles/Icons for "Active" look */}
             <div className="absolute inset-0 pointer-events-none -z-10 opacity-20">
                <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-[20%] left-[15%] text-cyan-500"><Code2 size={40}/></motion.div>
                <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 1 }} className="absolute top-[15%] right-[20%] text-blue-500"><Cpu size={30}/></motion.div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} className="absolute bottom-[40%] right-[10%] text-purple-500"><Database size={35}/></motion.div>
             </div>

            <Navbar />

            <div className="pt-24 md:pt-32 pb-20 container mx-auto px-4 relative z-10">
                 {/* Hero Section */}
                <div className="text-center mb-16 relative">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 max-w-4xl bg-cyan-500/5 blur-[120px] -z-10 rounded-full" />
                    
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-lg">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                                Skill-Based Learning
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-lg">
                                <CheckCircle size={14} />
                                Industry Certification
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 text-purple-300 text-xs font-semibold backdrop-blur-md shadow-lg">
                                <Users size={14} />
                                10,000+ Students
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-5 tracking-tighter text-white leading-tight">
                            Choose a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">Skill Path</span> <span className="text-slate-500 mx-2 font-light">|</span> <span className="text-slate-200 opacity-90">Not Just a Course</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
                            Unlock your potential with <span className="text-white font-medium italic underline decoration-cyan-500/50">outcome-driven</span> paths 
                            designed to bridge the gap between learning and getting hired.
                        </p>
                    </motion.div>
                </div>

                {/* Search & Filter Bar */}
                <div className="max-w-4xl mx-auto mb-10 md:mb-16 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-cyan-400 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search for skills..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all backdrop-blur-md"
                        />
                    </div>

                    <div className="w-full md:w-auto flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md text-nowrap overflow-x-auto max-w-full no-scrollbar">
                        {["All", "Beginner", "Intermediate", "Advanced"].map(level => (
                            <button
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
                                    selectedLevel === level 
                                    ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]" 
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <AnimatePresence mode="popLayout">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    key={course._id || index}
                                    className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden hover:border-cyan-500/50 transition-all duration-700 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-2 flex flex-col h-full"
                                >
                                    {/* Animated Glowing Border (appears on hover) */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                        <div className="absolute inset-[-2px] bg-gradient-to-tr from-cyan-500/50 via-blue-500/20 to-purple-500/50 rounded-[2.1rem] blur-sm -z-10" />
                                    </div>

                                    {/* Shimmer / Light Streak Effect */}
                                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[2rem]">
                                        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-1000 ease-in-out" />
                                    </div>

                                    {/* Thumbnail or Icon Area */}
                                    <div className="h-64 relative overflow-hidden">
                                        {course.thumbnail ? (
                                            <>
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-80" />
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-1 transition-transform duration-1000"
                                                />
                                            </>
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${course.color || "from-slate-900 via-slate-950 to-slate-900"} flex items-center justify-center relative overflow-hidden`}>
                                                {/* Dynamic Icon Background Glow */}
                                                <div className="absolute w-32 h-32 bg-cyan-500/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
                                                
                                                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 group-hover:border-cyan-500/60 group-hover:bg-cyan-500/20 transition-all duration-500 backdrop-blur-md z-10 shadow-2xl transform group-hover:scale-110 group-hover:rotate-6">
                                                    {getIcon(course.icon)}
                                                </div>
                                                
                                                {/* Architectural Grid Overlay */}
                                                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:20px_20px]" />
                                            </div>
                                        )}
                                        
                                        {/* Status Badges */}
                                        <div className="absolute top-6 left-6 z-30 flex flex-wrap gap-2">
                                             {index === 0 && (
                                                 <span className="px-4 py-1.5 bg-orange-500/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-tighter rounded-full shadow-[0_4px_12px_rgba(249,115,22,0.4)] flex items-center gap-1.5 animate-pulse">
                                                    <Zap size={12} className="fill-current" />
                                                    Trending
                                                 </span>
                                             )}
                                             <span className="px-4 py-1.5 bg-cyan-500/80 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-tighter rounded-full shadow-[0_4px_12px_rgba(6,182,212,0.4)]">
                                                {course.level}
                                             </span>
                                        </div>
                                    </div>

                                    <div className="p-6 pb-8 flex flex-col flex-1 relative z-20">
                                        {/* Header Info with Neon Accent */}
                                        <div className="mb-5 flex items-center justify-between">
                                             <div className="flex items-center gap-2">
                                                 <div className="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                                                 <span className="text-[9px] font-black text-cyan-400/90 uppercase tracking-[0.2em] leading-none">
                                                    Outcome Based Path
                                                 </span>
                                             </div>
                                             <div className="flex -space-x-1">
                                                {[1,2,3].map(i => (
                                                    <div key={i} className="w-4 h-4 rounded-full border border-slate-900 bg-slate-800 shadow-lg" />
                                                ))}
                                             </div>
                                        </div>

                                        <h3 className="text-xl font-black text-white mb-2 lg:text-2xl tracking-tight leading-tight group-hover:text-cyan-300 transition-colors duration-500">
                                            {course.title}
                                        </h3>
                                        <p className="text-slate-400 text-xs mb-6 line-clamp-2 leading-relaxed font-normal opacity-80 group-hover:opacity-100 transition-opacity">
                                            {course.description}
                                        </p>

                                        {/* Feature Pills with Premium Glass Effect */}
                                        <div className="grid grid-cols-2 gap-2.5 mb-6">
                                            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition-all duration-300">
                                                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                                    <Users size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] text-slate-500 font-bold uppercase leading-none mb-1">Learners</p>
                                                    <p className="text-[10px] font-black text-white tracking-wide">{course.studentsCount || 0}+</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition-all duration-300">
                                                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                    <Shield size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] text-slate-500 font-bold uppercase leading-none mb-1">Verify</p>
                                                    <p className="text-[10px] font-black text-white tracking-wide">Included</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pricing Section - More Reward Focused */}
                                        <div className="mt-auto flex items-center justify-between mb-6 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-colors">
                                            <div className="flex flex-col">
                                                 <div className="flex items-baseline gap-1.5">
                                                    <span className="text-2xl font-black text-white tracking-tighter">
                                                        ₹{course.discountPercentage > 0 && course.originalPrice > 0
                                                            ? Math.round(course.originalPrice * (1 - course.discountPercentage / 100))
                                                            : course.price || 0}
                                                    </span>
                                                    {course.discountPercentage > 0 && (
                                                        <span className="text-xs text-slate-500 line-through font-bold decoration-slate-500/40">
                                                            ₹{course.originalPrice}
                                                        </span>
                                                    )}
                                                </div>
                                                 <span className="text-[8px] uppercase tracking-widest text-emerald-500/80 font-black mt-0.5">One-time payment</span>
                                            </div>

                                            {course.discountPercentage > 0 && (
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all">
                                                        -{course.discountPercentage}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* CTA Button */}
                                        <div className="relative">
                                            {enrolledCourseIds.includes(course._id) ? (
                                                <Button disabled className="w-full bg-slate-800/50 text-slate-500 border border-slate-700/50 h-11 rounded-xl font-black uppercase tracking-widest text-[9px] shadow-inner">
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Enrolled Successfully
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => router.push(`/courses/${course._id}`)}
                                                    className="w-full bg-white hover:bg-cyan-500 text-black hover:text-white border-0 h-11 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1 transition-all duration-300 group/btn relative overflow-hidden"
                                                >
                                                    <span className="relative z-20 flex items-center justify-center">
                                                        Master this Skill
                                                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1.5 transition-transform duration-500 ease-out" />
                                                    </span>
                                                    {/* Button Glint */}
                                                    <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:left-[100%] transition-all duration-1000" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-20 text-center"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6 border border-white/10">
                                    <Search size={32} className="text-slate-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No matching skills found</h3>
                                <p className="text-slate-400 max-w-xs mx-auto text-sm">
                                    Try adjusting your search or filter to find what you're looking for.
                                </p>
                                <Button 
                                    onClick={() => { setSearchQuery(""); setSelectedLevel("All"); }}
                                    className="mt-6 bg-white/10 hover:bg-white/20 text-white border-white/10"
                                >
                                    Clear all filters
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>

            <Footer />
        </main>
    );
}
