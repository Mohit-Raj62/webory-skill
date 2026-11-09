"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight, CheckCircle2, CheckSquare } from "lucide-react";
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
                            viewport={{ once: true, margin: "100px" }}
                            className="glass-card p-6 rounded-2xl hover:border-purple-500/50 transition-all group will-change-transform will-change-opacity"
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

                            <div className="pt-4 border-t border-white/10 space-y-2">
                                <p className="text-xs text-gray-400 font-medium">
                                    Status: <span className={`${
                                        application.status === 'accepted' ? 'text-green-400' :
                                        application.status === 'rejected' ? 'text-red-400' :
                                        application.status === 'exam_pending' ? 'text-cyan-400 font-bold' :
                                        application.status === 'exam_completed' ? 'text-emerald-400 font-semibold' :
                                        application.status === 'interview_scheduled' ? 'text-purple-400' :
                                        application.status === 'interview_pending' ? 'text-indigo-400' :
                                        'text-yellow-400'
                                    }`}>
                                        {application.status === 'exam_pending' ? 'Online Assessment Round (Pending)' :
                                         application.status === 'exam_completed' ? 'Assessment Completed' :
                                         application.status === 'interview_pending' ? 'Interview Pending' : 
                                         application.status === 'interview_scheduled' ? 'Interview Scheduled' : 
                                         application.status === 'accepted' ? 'Accepted' : 
                                         application.status === 'rejected' ? 'Rejected' : 
                                         application.status === 'completed' ? 'Completed' : 
                                         'Under Review'}
                                    </span>
                                </p>

                                {application.status === 'exam_pending' && (
                                    <div className="pt-1">
                                        <Link href={application.assignedExam ? `/exams/${application.assignedExam._id}` : "/exams"}>
                                            <Button className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs py-2 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition-all active:scale-95">
                                                <CheckSquare size={14} />
                                                <span>Take Assessment Exam</span>
                                            </Button>
                                        </Link>
                                    </div>
                                )}

                                {application.status === 'exam_completed' && (
                                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
                                        <span className="text-gray-400">Exam Result:</span>
                                        <span className="text-emerald-300 font-bold">
                                            {application.examPercentage !== null && application.examPercentage !== undefined
                                                ? `${application.examPercentage}%`
                                                : "Submitted"}
                                            {application.examPassed !== null && (
                                                <span className={application.examPassed ? "text-emerald-400 ml-1.5" : "text-amber-400 ml-1.5"}>
                                                    ({application.examPassed ? "Passed" : "Under Review"})
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                )}
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
