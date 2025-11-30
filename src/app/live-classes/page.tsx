"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock, Link as LinkIcon, ExternalLink } from "lucide-react";

export default function LiveClassesPage() {
    const [liveClasses, setLiveClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLiveClasses();
    }, []);

    const fetchLiveClasses = async () => {
        try {
            const res = await fetch("/api/student/live-classes");
            if (res.ok) {
                const data = await res.json();
                setLiveClasses(data.liveClasses);
            }
        } catch (error) {
            console.error("Failed to fetch live classes", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Classes</span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Join interactive live sessions, workshops, and webinars with industry experts.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center text-white">Loading classes...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {liveClasses.map((liveClass) => (
                                <div key={liveClass._id} className="glass-card p-6 rounded-2xl hover:border-blue-500/30 transition-all duration-300 group">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`p-4 rounded-2xl ${
                                            new Date(liveClass.date) > new Date() 
                                                ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400' 
                                                : 'bg-gray-800/50 text-gray-400'
                                        }`}>
                                            <Video size={28} />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                            liveClass.type === 'internship' 
                                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                                : liveClass.type === 'course'
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                                        } uppercase`}>
                                            {liveClass.type}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                                        {liveClass.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                                        {liveClass.description}
                                    </p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-xl">
                                            <Calendar size={16} className="text-blue-400" />
                                            {new Date(liveClass.date).toLocaleDateString(undefined, { 
                                                weekday: 'long', 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-xl">
                                            <Clock size={16} className="text-purple-400" />
                                            {new Date(liveClass.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {liveClass.duration} mins
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {new Date(liveClass.date) > new Date() ? (
                                            <a 
                                                href={liveClass.meetingUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-full"
                                            >
                                                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20">
                                                    Join Live Class <ExternalLink size={16} className="ml-2" />
                                                </Button>
                                            </a>
                                        ) : (
                                            <Button disabled className="w-full bg-gray-800 text-gray-500 cursor-not-allowed">
                                                Class Ended
                                            </Button>
                                        )}
                                        
                                        {liveClass.recordingUrl && (
                                            <a 
                                                href={liveClass.recordingUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-full"
                                            >
                                                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 hover:border-white/20">
                                                    Watch Recording <LinkIcon size={16} className="ml-2" />
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {liveClasses.length === 0 && !loading && (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Video size={32} className="text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Live Classes Scheduled</h3>
                            <p className="text-gray-400">Check back later for upcoming sessions.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
