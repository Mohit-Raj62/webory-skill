"use client";

import { useEffect, useState } from "react";
import { ClipboardList, FileText, Award, TrendingUp, CheckCircle, XCircle } from "lucide-react";

export function GradesDashboard() {
    const [data, setData] = useState < any > (null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        try {
            const res = await fetch("/api/user/grades");
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        } catch (error) {
            console.error("Failed to fetch grades", error);
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

    if (!data) {
        return null;
    }

    const { quizAttempts, assignmentSubmissions, stats } = data;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <ClipboardList className="text-purple-400" size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs">Quizzes Taken</p>
                            <p className="text-2xl font-bold text-white">{stats.totalQuizzes}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="text-green-400" size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs">Quizzes Passed</p>
                            <p className="text-2xl font-bold text-white">{stats.passedQuizzes}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <TrendingUp className="text-blue-400" size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs">Avg Quiz Score</p>
                            <p className="text-2xl font-bold text-white">{stats.avgQuizScore}%</p>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <FileText className="text-orange-400" size={20} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-xs">Assignments</p>
                            <p className="text-2xl font-bold text-white">{stats.gradedAssignments}/{stats.totalAssignments}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Quiz Results */}
            {quizAttempts.length > 0 && (
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <ClipboardList size={24} className="text-purple-400" />
                        Recent Quiz Results
                    </h3>
                    <div className="space-y-3">
                        {quizAttempts.map((attempt: any) => (
                            <div key={attempt._id} className="bg-white/5 p-4 rounded-xl">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="text-white font-medium">{attempt.quizId?.title || "Quiz"}</h4>
                                        <p className="text-gray-400 text-sm">{attempt.courseId?.title || "Course"}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">
                                            {attempt.obtainedMarks}/{attempt.totalMarks}
                                        </div>
                                        <div className={`text-sm font-medium ${attempt.passed ? 'text-green-400' : 'text-red-400'}`}>
                                            {attempt.percentage}% - {attempt.passed ? 'PASSED' : 'FAILED'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>{new Date(attempt.submittedAt).toLocaleDateString()}</span>
                                    <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                                        {attempt.quizId?.type || 'Quiz'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Assignment Submissions */}
            {assignmentSubmissions.length > 0 && (
                <div className="glass-card p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <FileText size={24} className="text-green-400" />
                        Assignment Submissions
                    </h3>
                    <div className="space-y-3">
                        {assignmentSubmissions.map((submission: any) => (
                            <div key={submission._id} className="bg-white/5 p-4 rounded-xl">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="text-white font-medium">{submission.assignmentId?.title || "Assignment"}</h4>
                                        <p className="text-gray-400 text-sm">{submission.courseId?.title || "Course"}</p>
                                    </div>
                                    <div className="text-right">
                                        {submission.status === 'graded' ? (
                                            <>
                                                <div className="text-2xl font-bold text-white">
                                                    {submission.marksObtained}/{submission.assignmentId?.totalMarks || 0}
                                                </div>
                                                <div className="text-sm text-green-400">Graded</div>
                                            </>
                                        ) : (
                                            <div className="text-sm text-yellow-400">Pending Review</div>
                                        )}
                                    </div>
                                </div>
                                {submission.feedback && (
                                    <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <p className="text-blue-300 text-xs font-medium mb-1">Feedback:</p>
                                        <p className="text-gray-300 text-sm">{submission.feedback}</p>
                                    </div>
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                    <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
                                    {submission.status === 'late' && (
                                        <span className="px-2 py-1 rounded bg-red-500/20 text-red-300">Late</span>
                                    )}
                                </div>
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
