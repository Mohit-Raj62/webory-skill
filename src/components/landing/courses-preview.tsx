"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Database, Globe, Palette, BookOpen, Users, Zap } from "lucide-react";

interface PopularCourse {
    _id: string;
    title: string;
    level: string;
    studentsCount: string;
    color: string;
    icon?: string;
}

interface CoursesPreviewProps {
    popularCourses?: any[];
}

const fallbackCourses = [
    {
        title: "Full Stack Development",
        icon: Globe,
        level: "Advanced",
        studentsCount: "10+",
        color: "from-blue-500 to-cyan-500",
    },
    {
        title: "UI/UX Design",
        icon: Palette,
        level: "Intermediate",
        studentsCount: "10+",
        color: "from-purple-500 to-pink-500",
    },
    {
        title: "Backend Architecture",
        icon: Database,
        level: "Advanced",
        studentsCount: "10+",
        color: "from-orange-500 to-red-500",
    },
    {
        title: "Frontend Mastery",
        icon: Code2,
        level: "Beginner",
        studentsCount: "10+",
        color: "from-green-500 to-emerald-500",
    },
];

const getIcon = (iconName: string) => {
    switch(iconName) {
        case "Code2": return Code2;
        case "Database": return Database;
        case "Palette": return Palette;
        case "Globe": return Globe;
        default: return BookOpen;
    }
};

export function CoursesPreview({ popularCourses = [] }: CoursesPreviewProps) {
    const displayCourses = popularCourses.length > 0 ? popularCourses : fallbackCourses;

    return (
        <section id="courses" className="py-24 relative overflow-hidden bg-slate-950/20">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                            <Zap size={12} className="fill-current" /> Featured Paths
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter text-white">
                            Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Skill Paths</span>
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed font-light">
                            Master in-demand skills with our expert-led, project-based curriculum designed for outcomes.
                        </p>
                    </div>
                    <Link href="/courses" className="hidden md:flex">
                        <Button className="bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 rounded-xl px-6 h-12 font-bold transition-all group">
                            Explore All Paths <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-all" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayCourses.map((course, index) => {
                         const Icon = course.icon && typeof course.icon === 'string' ? getIcon(course.icon) : (course.icon || BookOpen);
                         
                        return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-slate-900/40 backdrop-blur-xl p-5 rounded-[1.5rem] border border-white/5 hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden flex flex-col h-full"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${course.color} opacity-5 blur-3xl rounded-full group-hover:opacity-10 transition-opacity`} />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-5 text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                                    <Icon size={22} />
                                </div>
                                
                                <h3 className="text-lg font-black text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1 tracking-tight">{course.title}</h3>
                                
                                <div className="absolute top-4 right-4 z-20">
                                    <span className="px-3 py-1 bg-emerald-500 text-black rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/40 animate-pulse">
                                        Free Preview
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mb-6">
                                    <span className="px-2.5 py-1 bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/5">
                                        {course.level}
                                    </span>
                                </div>

                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5 text-[11px] font-bold text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <Users size={14} className="text-blue-500" />
                                        {course.studentsCount || course.students} Learners
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
                                </div>
                            </div>
                        </motion.div>
                    )})}
                </div>

                <div className="mt-10 text-center md:hidden">
                    <Link href="/courses">
                        <Button className="bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 rounded-xl px-8 h-12 w-full font-bold">
                            View All Courses <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
