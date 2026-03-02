"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, PlayCircle, BookOpen, Clock, Award, Shield, Star, Users, ArrowRight, Share2, Heart, Play, Lock, ChevronDown, Check, Globe, Layout, Zap, Tablet, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
  syllabus: any[];
  instructor?: any;
}

interface CourseHeaderProps {
  course: Course;
  safeDate: (date: any) => string;
}

export const CourseHeader = ({ course, safeDate }: CourseHeaderProps) => {
  return (
    <div className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-6">
              <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest">
                {course.category}
              </span>
              <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                <Star size={14} fill="currentColor" />
                <span className="text-xs font-bold">4.9 (2.4k reviews)</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              {course.title}
            </h1>
            
            <p className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
              {course.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 border border-white/10 shadow-inner">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Students</p>
                  <p className="text-white font-bold">15,400+</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-purple-400 border border-white/10 shadow-inner">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Language</p>
                  <p className="text-white font-bold">English/Hindi</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 border border-white/10 shadow-inner">
                  <Layout size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter">Level</p>
                  <p className="text-white font-bold">All Levels</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-bold text-white/90">Last updated March 2024</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
              <Image 
                src={course.thumbnail} 
                alt={course.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all duration-300 cursor-pointer">
                <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
                  <Play fill="currentColor" size={32} className="ml-1" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-between">
                <p className="text-white font-bold flex items-center gap-2">
                  <Zap size={18} className="text-yellow-400" /> Watch Promo
                </p>
                <p className="text-white/60 text-xs font-bold">02:45 MINS</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const Curriculum = ({ syllabus }: { syllabus: any[] }) => {
  return (
    <div className="space-y-4">
      {syllabus.map((module, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group"
        >
          <div className="p-6 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 font-black text-lg border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                {idx + 1}
              </div>
              <div>
                <h3 className="text-white font-bold group-hover:text-blue-400 transition-colors">{module.title}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                  {module.lessons?.length || 0} Lessons • {module.lessons?.reduce((acc: number, curr: any) => acc + (curr.duration || 0), 0)} Mins
                </p>
              </div>
            </div>
            <ChevronDown className="text-gray-600 group-hover:text-white transition-all" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const CourseBenefits = () => {
  const BENEFITS = [
    { icon: <Shield />, title: "Lifetime Access", desc: "Learn at your own pace with no deadlines or expiry." },
    { icon: <Trophy />, title: "Verified Certificate", desc: "Get industry-recognized certificate upon completion." },
    { icon: <Users />, title: "Community Support", desc: "Join 15k+ learners in our exclusive discord community." },
    { icon: <Zap />, title: "Practical Projects", desc: "Build 5+ real-world projects for your professional portfolio." },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
      {BENEFITS.map((benefit, idx) => (
        <motion.div 
          key={idx}
          whileHover={{ y: -5 }}
          className="p-8 bg-[#0A0A0A] border border-white/10 rounded-[2rem] hover:border-blue-500/30 transition-all shadow-xl group"
        >
          <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
            {React.cloneElement(benefit.icon as React.ReactElement<any>, { size: 28 })}
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
          <p className="text-gray-500 leading-relaxed font-medium">{benefit.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};
