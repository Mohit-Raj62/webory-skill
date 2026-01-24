"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Database, Globe, Palette, BookOpen } from "lucide-react";

interface PopularCourse {
    _id: string;
    title: string;
    level: string;
    studentsCount: string;
    color: string;
    icon?: string; // Icon name string if coming from DB, or component hardcoded
}

interface CoursesPreviewProps {
    popularCourses?: any[]; // Using any[] for now to map DB fields to UI
}

// Fallback data if no popular courses found
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
        <section id="courses" className="py-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Courses</span>
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl">
                            Master in-demand skills with our expert-led, project-based curriculum.
                        </p>
                    </div>
                    <Link href="/courses" className="hidden md:flex">
                        <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-6 group transition-all">
                            View All Courses <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayCourses.map((course, index) => {
                         const Icon = course.icon && typeof course.icon === 'string' ? getIcon(course.icon) : (course.icon || BookOpen);
                         
                        return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-black/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${course.color} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity`} />

                            <div className="relative z-10">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={26} />
                                </div>
                                
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">{course.title}</h3>
                                
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-gray-400 border border-white/5">
                                        {course.level}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        {course.studentsCount || course.students} Students
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors group-hover:translate-x-1" />
                                </div>
                            </div>
                        </motion.div>
                    )})}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/courses">
                        <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-8 w-full">
                            View All Courses <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
