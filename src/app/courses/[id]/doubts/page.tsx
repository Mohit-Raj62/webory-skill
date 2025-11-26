"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function MyDoubtsPage() {
    const { id: courseId } = useParams();
    const router = useRouter();
    const [doubts, setDoubts] = useState < any[] > ([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState < 'all' | 'pending' | 'answered' > ('all');

    useEffect(() => {
        fetchDoubts();
    }, [courseId]);

    const fetchDoubts = async () => {
        try {
            const res = await fetch(`/api/courses/${courseId}/doubts`);
            if (res.ok) {
                const data = await res.json();
                setDoubts(data.doubts || []);
            }
        } catch (error) {
            console.error("Failed to fetch doubts", error);
            toast.error("Failed to load doubts");
        } finally {
            setLoading(false);
        }
    };

    const filteredDoubts = doubts.filter(doubt => {
        if (filter === 'all') return true;
        return doubt.status === filter;
    });

    const pendingCount = doubts.filter(d => d.status === 'pending').length;
    const answeredCount = doubts.filter(d => d.status === 'answered').length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 p-6">
                <div className="max-w-7xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/courses/${courseId}`)}
                        className="text-gray-400 hover:text-white hover:bg-gray-800 mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Course
                    </Button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        My Doubts
                    </h1>
                    <p className="text-gray-400 mt-2">View all your questions and answers</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition-all ${filter === 'all'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        All ({doubts.length})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg transition-all ${filter === 'pending'
                                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        Pending ({pendingCount})
                    </button>
                    <button
                        onClick={() => setFilter('answered')}
                        className={`px-4 py-2 rounded-lg transition-all ${filter === 'answered'
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        Answered ({answeredCount})
                    </button>
                </div>

                {/* Doubts List */}
                {filteredDoubts.length > 0 ? (
                    <div className="space-y-4">
                        {filteredDoubts.map((doubt) => (
                            <div
                                key={doubt._id}
                                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
                            >
                                {/* Doubt Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        {doubt.videoTitle && (
                                            <p className="text-sm text-blue-400 mb-2">
                                                📹 Video: {doubt.videoTitle}
                                            </p>
                                        )}
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {doubt.question}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Asked on {new Date(doubt.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${doubt.status === 'answered'
                                                ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                                                : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                            }`}
                                    >
                                        {doubt.status === 'answered' ? '✓ Answered' : '⏳ Pending'}
                                    </span>
                                </div>

                                {/* Answer Section */}
                                {doubt.status === 'answered' && doubt.answer && (
                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-semibold text-green-400">
                                                💡 Answer:
                                            </span>
                                            {doubt.answeredBy && (
                                                <span className="text-xs text-gray-500">
                                                    by {doubt.answeredBy.name}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-300 whitespace-pre-wrap bg-gray-800/50 p-4 rounded-lg">
                                            {doubt.answer}
                                        </p>
                                        {doubt.answeredAt && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                Answered on {new Date(doubt.answeredAt).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {filter === 'all'
                                ? 'No doubts yet. Ask your first question!'
                                : `No ${filter} doubts`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
