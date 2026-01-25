"use client";

import { useEffect, useState } from "react";
import { ClipboardList, FileText, Award, TrendingUp, CheckCircle, XCircle } from "lucide-react";

export function GradesDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/user/grades");
            if (res.ok) {
                const result = await res.json();
                setData(result);
            } else {
                throw new Error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Failed to fetch grades", error);
            setError("Failed to load grades. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="glass-card p-6 rounded-2xl">
                <p className="text-gray-400">Loading grades...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-card p-6 rounded-2xl text-center">
                <XCircle className="mx-auto text-red-500 mb-4" size={48} />
                <p className="text-red-400 mb-4">{error}</p>
                <button 
                    onClick={fetchGrades}
                    className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    const { quizAttempts, assignmentSubmissions, stats } = data;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            {/* Stats Cards - Balanced Version */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                            <ClipboardList className="text-purple-400" size={20} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Quizzes</p>
                            <p className="text-2xl font-black text-white">{stats.totalQuizzes}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                            <CheckCircle className="text-green-400" size={20} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Passed</p>
                            <p className="text-2xl font-black text-white">{stats.passedQuizzes}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                            <TrendingUp className="text-blue-400" size={20} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Avg Score</p>
                            <p className="text-2xl font-black text-white">{stats.avgQuizScore}%</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                            <FileText className="text-orange-400" size={20} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Graded</p>
                            <p className="text-2xl font-black text-white">
                                {stats.gradedAssignments}<span className="text-slate-600">/{stats.totalAssignments}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Quiz Results - Balanced */}
            {quizAttempts.length > 0 && (
                <div className="glass-card p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl">
                    <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
                        <ClipboardList size={20} className="text-purple-400" />
                        Recent Quiz Results
                    </h3>
                    <div className="space-y-3">
                        {quizAttempts.map((attempt: any) => (
                            <div key={attempt._id} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 group/item hover:bg-white/[0.07] transition-colors">
                                <div>
                                    <h4 className="text-base text-white font-black tracking-tight mb-1 group-hover/item:text-purple-400 transition-colors uppercase">{attempt.quizId?.title || "Quiz"}</h4>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span>{attempt.courseId?.title || "Course"}</span>
                                        <span className="text-slate-700">|</span>
                                        <span>{new Date(attempt.submittedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 text-right">
                                    <div className="shrink-0">
                                        <div className="text-2xl font-black text-white tracking-tighter">
                                            {attempt.obtainedMarks}<span className="text-slate-600">/{attempt.totalMarks}</span>
                                        </div>
                                        <div className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${attempt.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {attempt.percentage}% • {attempt.passed ? 'Passed' : 'Failed'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Assignment Submissions - Balanced */}
            {assignmentSubmissions.length > 0 && (
                <div className="glass-card p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl">
                    <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3 uppercase tracking-widest">
                        <FileText size={20} className="text-green-400" />
                        Assignment Submissions
                    </h3>
                    <div className="space-y-3">
                        {assignmentSubmissions.map((submission: any) => (
                            <div key={submission._id} className="bg-white/5 p-5 rounded-2xl border border-white/5 group/sub hover:bg-white/[0.07] transition-colors">
                                <div className="flex justify-between items-center mb-3 gap-4">
                                    <div className="flex-1">
                                        <h4 className="text-base text-white font-black tracking-tight mb-1 group-hover/sub:text-emerald-400 transition-colors uppercase">{submission.assignmentId?.title || "Assignment"}</h4>
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                            <span>{submission.courseId?.title || "Course"}</span>
                                            <span className="text-slate-700">|</span>
                                            <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        {submission.status === 'graded' ? (
                                            <>
                                                <div className="text-2xl font-black text-white tracking-tighter">
                                                    {submission.marksObtained}<span className="text-slate-600">/{submission.assignmentId?.totalMarks || 0}</span>
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mt-0.5">Graded</div>
                                            </>
                                        ) : (
                                            <div className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">Awaiting Grade</div>
                                        )}
                                    </div>
                                </div>
                                {submission.feedback && (
                                    <div className="mt-3 p-4 bg-blue-500/5 border border-white/5 rounded-xl">
                                        <p className="text-slate-400 text-xs leading-relaxed italic">"{submission.feedback}"</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {quizAttempts.length === 0 && assignmentSubmissions.length === 0 && (
                <div className="glass-card p-12 rounded-2xl text-center">
                    <Award className="mx-auto text-gray-600 mb-4" size={48} />
                    <p className="text-gray-400">No grades yet. Start taking quizzes and submitting assignments!</p>
                </div>
            )}
        </div>
    );
}
