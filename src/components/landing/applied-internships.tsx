"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AppliedInternships() {
    const [applications, setApplications] = useState < any[] > ([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await fetch("/api/user/dashboard");
                if (res.ok) {
                    const data = await res.json();
                    setApplications(data.applications || []);
                }
            } catch (error) {
                console.error("Failed to fetch applications", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    if (loading || applications.length === 0) return null;

    return (
        <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Your <span className="text-purple-400">Applied Internships</span>
                    </h2>
                    <p className="text-xl text-gray-400">Track your internship applications</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {applications.slice(0, 3).map((application: any, index: number) => (
                        <motion.div
                            key={application._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-6 rounded-2xl hover:border-purple-500/50 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                                    <Briefcase size={24} />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20 flex items-center gap-1">
                                    <CheckCircle2 size={12} />
                                    Applied
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                {application.internship?.title || "Internship"}
                            </h3>

                            <p className="text-gray-300 text-sm mb-3">
                                {application.internship?.company || "Company"}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm text-gray-400">
                                    <MapPin size={14} className="mr-2" />
                                    {application.internship?.location || "Location"}
                                </div>
                                <div className="flex items-center text-sm text-gray-400">
                                    <Clock size={14} className="mr-2" />
                                    Applied on {new Date(application.appliedAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <p className="text-xs text-gray-500">
                                    Status: <span className="text-yellow-400">Under Review</span>
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {applications.length > 3 && (
                    <div className="text-center mt-8">
                        <Link href="/profile">
                            <Button variant="outline" className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10">
                                View All Applications
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
