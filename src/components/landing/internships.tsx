"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function Internships() {
    return (
        <section id="internships" className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 to-purple-900/10 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="glass-card rounded-3xl p-8 md:p-16 text-center max-w-5xl mx-auto border-blue-500/30">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Launch Your Career with <br />
                            <span className="text-blue-400">Real Internships</span>
                        </h2>
                        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
                            Don&apos;t just learn—do. Apply your skills in real-world projects, work with the Webory team, and build a portfolio that stands out.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
                            {[
                                "Guaranteed Certification",
                                "Real-world Projects",
                                "Mentorship Support",
                                "Flexible Timings",
                                "Performance Based Stipend",
                                "Letter of Recommendation",
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-3 text-gray-300">
                                    <CheckCircle2 className="text-green-400 flex-shrink-0" size={20} />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <Link href="/internships">
                            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100 text-lg px-8 py-6 h-auto font-bold">
                                Apply for Internships Now
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
