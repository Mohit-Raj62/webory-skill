"use client";

import { useEffect, useState, useRef, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, ChevronLeft, ChevronRight, CheckCircle,
    Play, Pause, Lock, FileText, Video as VideoIcon, 
    ArrowRight, ChevronDown, ChevronUp, PlayCircle
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/ui/navbar";

export default function InternshipVideoPlayerPage({ params }: { params: Promise<{ id: string, videoIndex: string }> }) {
    const { id: internshipId, videoIndex } = use(params);
    const router = useRouter();
    const [internship, setInternship] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAccepted, setIsAccepted] = useState(false);
    const [ytApiLoaded, setYtApiLoaded] = useState(false);
    const ytPlayerRef = useRef<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [selectedTier, setSelectedTier] = useState<string | null>(null);

    const currentIndex = parseInt(videoIndex as string) || 0;
    
    // Flatten videos from modules or use flat videos list
    const getAllVideos = () => {
        if (!internship) return [];
        if (internship.modules && internship.modules.length > 0 && internship.modules.some((m: any) => m.videos && m.videos.length > 0)) {
            return internship.modules
                .filter((m: any) => {
                    if (!m.tierAccess || m.tierAccess.length === 0) return true;
                    return m.tierAccess.includes(selectedTier || "Basic");
                })
                .sort((a: any, b: any) => a.order - b.order)
                .reduce((acc: any[], module: any) => [...acc, ...(module.videos || [])], []);
        }
        return internship.videos || [];
    };

    const videos = getAllVideos();
    const currentVideo = videos[currentIndex];

    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?\s*v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = currentVideo?.url ? getYouTubeId(currentVideo.url) : null;
    const isYouTube = !!videoId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/admin/internships/${internshipId}`);
                if (res.ok) {
                    const data = await res.json();
                    setInternship(data.internship);
                }
            } catch (error) {
                console.error("Failed to fetch internship", error);
            } finally {
                setLoading(false);
            }
        };

        const checkAccess = async () => {
            try {
                const res = await fetch("/api/user/applications");
                if (res.ok) {
                    const data = await res.json();
                    const app = data.applications.find(
                        (a: any) => a.internship?._id?.toString() === internshipId || a.internship?.toString() === internshipId
                    );
                    setIsAccepted(app?.status === 'accepted' || app?.status === 'completed' || (app?.amountPaid > 0 && app?.status !== 'rejected'));
                    if (app) setSelectedTier(app.selectedTier || "Basic");
                }
            } catch (e) {}
        };

        fetchData();
        checkAccess();
    }, [internshipId]);

    // Load YouTube API
    useEffect(() => {
        if ((window as any).YT) {
            setYtApiLoaded(true);
            return;
        }

        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        (window as any).onYouTubeIframeAPIReady = () => {
            setYtApiLoaded(true);
        };
    }, []);

    useEffect(() => {
        if (!ytApiLoaded || !isYouTube || !videoId) return;

        if (ytPlayerRef.current) {
            try { ytPlayerRef.current.destroy(); } catch (e) {}
        }

        new (window as any).YT.Player('yt-player', {
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
            },
            events: {
                onReady: (event: any) => {
                    ytPlayerRef.current = event.target;
                },
                onStateChange: (event: any) => {
                    setIsPlaying(event.data === 1);
                }
            }
        });

        return () => {
            if (ytPlayerRef.current) {
                try { ytPlayerRef.current.destroy(); } catch (e) {}
                ytPlayerRef.current = null;
            }
        };
    }, [ytApiLoaded, currentIndex, videoId, isYouTube]);

    const goToNext = () => {
        if (currentIndex < videos.length - 1) {
            router.push(`/internships/${internshipId}/video/${currentIndex + 1}`);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            router.push(`/internships/${internshipId}/video/${currentIndex - 1}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Loading Player...
            </div>
        );
    }

    if (!isAccepted && currentIndex > 0) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-8">
                <Lock size={64} className="text-slate-700 mb-6" />
                <h2 className="text-2xl font-bold mb-4">Content Locked</h2>
                <p className="text-slate-400 text-center max-w-md mb-8">
                    You need to be accepted into this internship to access this video content.
                </p>
                <Button onClick={() => router.push(`/internships/${internshipId}`)} className="bg-blue-600">
                    Back to Internship
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            <div className="pt-24 px-4 md:px-8 max-w-[1600px] mx-auto pb-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Player Area */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <Button
                                variant="ghost"
                                onClick={() => router.push(`/internships/${internshipId}`)}
                                className="text-slate-400 hover:text-white"
                            >
                                <ArrowLeft className="mr-2" size={18} /> Back
                            </Button>
                            <h1 className="text-xl font-bold truncate max-w-[60%]">
                                {currentVideo?.title || "Lesson"}
                            </h1>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={goToPrevious} 
                                    disabled={currentIndex === 0}
                                    className="border-white/10 hover:bg-white/5"
                                >
                                    <ChevronLeft size={18} />
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={goToNext} 
                                    disabled={currentIndex === videos.length - 1}
                                    className="border-white/10 hover:bg-white/5"
                                >
                                    <ChevronRight size={18} />
                                </Button>
                            </div>
                        </div>

                        <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                            {isYouTube ? (
                                <div id="yt-player" className="w-full h-full" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                                    <p className="text-slate-500">Invalid video source.</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 bg-white/5 border border-white/5 rounded-3xl p-8">
                            <h2 className="text-2xl font-bold mb-4">About this Lesson</h2>
                            <p className="text-slate-400 leading-relaxed">
                                {internship.title} - Session {currentIndex + 1}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-4">
                                <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <VideoIcon size={14} /> Training Material
                                </div>
                                <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle size={14} /> Verified Content
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Playlist */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
                            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="font-black text-sm uppercase tracking-widest text-slate-500">Curriculum</h3>
                            </div>
                            <div className="p-2 space-y-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {videos.map((video: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => router.push(`/internships/${internshipId}/video/${idx}`)}
                                        className={`w-full flex items-start gap-4 p-4 rounded-2xl transition-all ${
                                            idx === currentIndex 
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                                                : "hover:bg-white/5 text-slate-400 hover:text-white"
                                        }`}
                                    >
                                        <div className={`mt-0.5 ${idx === currentIndex ? "text-white" : "text-slate-600"}`}>
                                            {idx === currentIndex ? <PlayCircle size={18} /> : <PlayCircle size={18} />}
                                        </div>
                                        <div className="text-left">
                                            <span className="text-sm font-bold block leading-tight mb-1">{video.title}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${idx === currentIndex ? "text-blue-100" : "text-slate-500"}`}>
                                                {video.duration}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                                {videos.length === 0 && (
                                    <p className="text-center py-8 text-slate-600 text-sm">No videos found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
