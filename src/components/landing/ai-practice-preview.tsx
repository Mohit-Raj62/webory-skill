"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Rocket, ArrowRight, CheckCircle2, Timer, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AIPracticePreview() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">New Feature</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Preparation</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Practice with our AI-powered suite designed to simulate real-world scenarios. 
            From logical reasoning to technical interviews, get instant feedback and improve daily.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Aptitude Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <BrainCircuit className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">Aptitude & Logic Test</h3>
              <p className="text-gray-400 mb-6">
                Sharpen your problem-solving skills with progressive difficulty questions.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "30 Questions (Easy, Medium, Hard)",
                  "30s Timer per Question",
                  "Instant Solutions & Logic",
                  "Performance Analytics"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/ai-prep?mode=aptitude">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 group-hover:translate-x-1 transition-all">
                  Start Practice <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Interview Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                <Rocket className="w-7 h-7" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">AI Mock Interview</h3>
              <p className="text-gray-400 mb-6">
                Face realistic technical interviews with our AI mentor and get detailed feedback.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "15 Technical Questions",
                  "Role-specific Scenarios",
                  "Real-time Answer Analysis",
                  "Comprehensive Feedback Report"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/ai-prep?mode=interview">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2 group-hover:translate-x-1 transition-all">
                  Start Interview <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
