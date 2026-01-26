"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, ChevronLeft, ChevronRight, CheckCircle,
    MoreVertical, Settings, Maximize, Minimize, Expand,
    MessageCircle, HelpCircle, FileText, Lock, Play, Pause
} from "lucide-react";
import { toast } from "sonner";

export default function VideoPlayerPage() {
    const { id: courseId, videoIndex } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState < any > (null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState < any > (null);
    const videoRef = useRef < HTMLVideoElement > (null);
    const ytPlayerRef = useRef < any > (null);
    const [ytApiLoaded, setYtApiLoaded] = useState(false);
    const [hasMarkedAsWatched, setHasMarkedAsWatched] = useState(false);
    const hasMarkedRef = useRef(false);
    const hasShownOverlayRef = useRef(false);
    const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
    const [isTheaterMode, setIsTheaterMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const playerContainerRef = useRef < HTMLDivElement > (null);
    const [notes, setNotes] = useState<any[]>([]);
    const [newNote, setNewNote] = useState('');
    const [showNotes, setShowNotes] = useState(false);
    const [showDoubtModal, setShowDoubtModal] = useState(false);
    const [doubtQuestion, setDoubtQuestion] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    const [lastValidTime, setLastValidTime] = useState(0);
    const lastValidTimeRef = useRef(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [watermarkPosition, setWatermarkPosition] = useState({ x: 10, y: 10 });
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [checkingEnrollment, setCheckingEnrollment] = useState(true);
    const [showTrialEndedModal, setShowTrialEndedModal] = useState(false);
    const [duration, setDuration] = useState(0);
    const durationRef = useRef(0);
    const seekerBarRef = useRef<HTMLDivElement>(null);
    const timeDisplayRef = useRef<HTMLSpanElement>(null);
    const totalTimeRef = useRef<HTMLSpanElement>(null);
    const handleEndedRef = useRef<() => void>(() => {});
    const fetchingRef = useRef(false);


    const currentIndex = parseInt(videoIndex as string) || 0;
    const currentVideo = course?.videos?.[currentIndex];
    
    const isWatched = (index: number) => {
        if (!progress || !progress.watchedVideos) return false;
        return progress.watchedVideos.some((v: any) => v.videoIndex === index);
    };
    
    const isCurrentVideoWatched = isWatched(currentIndex);

    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?\s*v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = currentVideo?.url ? getYouTubeId(currentVideo.url) : null;
    const isYouTube = !!videoId;

    // Reordered Helper Functions (Pre-defined for useEffect hooks)
    const handleEnded = () => {
        const checkFreeTrialCompletion = () => {
            if (!course || !course.modules || isEnrolled) return;
            const sortedModules = [...course.modules].sort((a: any, b: any) => a.order - b.order);
            const firstModule = sortedModules[0];
            const firstModuleVideoCount = firstModule.videos?.length || 0;
            if (currentIndex === firstModuleVideoCount - 1) {
                setShowTrialEndedModal(true);
            }
        };

        if (!hasMarkedAsWatched) {
            markAsWatched(100);
            checkFreeTrialCompletion();
        } else {
            // Only show if not already shown in this watch session
            if (!hasShownOverlayRef.current) {
                setShowCompletionOverlay(true);
                hasShownOverlayRef.current = true;
            }
            checkFreeTrialCompletion();
        }
    };

    // Keep handleEndedRef up-to-date with latest state
    useEffect(() => {
        handleEndedRef.current = handleEnded;
    }, [course, currentIndex, isEnrolled, hasMarkedAsWatched]);

    const fetchData = async () => {
        if (fetchingRef.current) return;
        fetchingRef.current = true;
        
        try {
            // Start both, but handle course data as priority
            const [resCourse, resProgress] = await Promise.all([
                fetch(`/api/courses/${courseId}`),
                fetch(`/api/courses/${courseId}/progress`)
            ]);

            if (resCourse.ok) {
                const data = await resCourse.json();
                setCourse(data.course);
                setLoading(false); 
            }

            if (resProgress.ok) {
                const progressData = await resProgress.json();
                setProgress(progressData);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            setLoading(false);
        } finally {
            fetchingRef.current = false;
        }
    };

    const fetchNotes = async () => {
        try {
            const res = await fetch(`/api/courses/${courseId}/videos/${currentIndex}/notes`);
            if (res.ok) {
                const data = await res.json();
                setNotes(data.notes || []);
            }
        } catch (error) {
            console.error("Failed to fetch notes", error);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const saveNote = async () => {
        if (!newNote.trim()) return;

        let currentTime = 0;
        if (ytPlayerRef.current) {
            currentTime = ytPlayerRef.current.getCurrentTime();
        } else {
            currentTime = videoRef.current?.currentTime || 0;
        }
        
        const timestamp = formatTime(currentTime);

        try {
            const res = await fetch(`/api/courses/${courseId}/videos/${currentIndex}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newNote, timestamp }),
            });

            if (res.ok) {
                toast.success('Note saved successfully!');
                setNewNote('');
                fetchNotes();
            }
        } catch (error) {
            console.error("Failed to save note", error);
            toast.error('Failed to save note');
        }
    };

    const deleteNote = async (noteIndex: number) => {
        try {
            const res = await fetch(`/api/courses/${courseId}/videos/${currentIndex}/notes`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ noteId: noteIndex }),
            });

            if (res.ok) {
                toast.success('Note deleted');
                fetchNotes();
            }
        } catch (error) {
            console.error("Failed to delete note", error);
        }
    };

    const jumpToTimestamp = (timestamp: string) => {
        const parts = timestamp.split(':').map(Number);
        let seconds = 0;
        if (parts.length === 3) {
            seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            seconds = parts[0] * 60 + parts[1];
        }

        if (ytPlayerRef.current) {
            ytPlayerRef.current.seekTo(seconds, true);
        } else if (videoRef.current) {
            videoRef.current.currentTime = seconds;
        }
    };

    const togglePlay = () => {
        if (ytPlayerRef.current) {
            if (isPlaying) {
                ytPlayerRef.current.pauseVideo();
            } else {
                ytPlayerRef.current.playVideo();
            }
        } else if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const askDoubt = async () => {
        if (!doubtQuestion.trim()) {
            toast.error('Please enter your question');
            return;
        }

        try {
            const res = await fetch(`/api/courses/${courseId}/doubts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: doubtQuestion,
                    videoIndex: currentIndex,
                    videoTitle: currentVideo?.title
                })
            });

            if (res.ok) {
                toast.success('Doubt submitted successfully!');
                setDoubtQuestion('');
                setShowDoubtModal(false);
            } else {
                toast.error('Failed to submit doubt');
            }
        } catch (error) {
            console.error('Failed to submit doubt', error);
            toast.error('Failed to submit doubt');
        }
    };

    const markAsWatched = async (watchedPercentage: number = 100) => {
        if (hasMarkedRef.current || hasMarkedAsWatched) return;
        hasMarkedRef.current = true; // Lock immediately to stop loop from firing again
        setHasMarkedAsWatched(true);

        try {
            // Get duration
            let durationInSeconds = 0;
            
            if (ytPlayerRef.current) {
                durationInSeconds = ytPlayerRef.current.getDuration();
            } else {
                durationInSeconds = videoRef.current?.duration || 0;
            }
            
            if (!durationInSeconds && currentVideo?.duration) {
                // Parse duration string like "10:30" or "1:05:30"
                const parts = currentVideo.duration.split(':').map(Number);
                if (parts.length === 2) {
                    durationInSeconds = parts[0] * 60 + parts[1];
                } else if (parts.length === 3) {
                    durationInSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
                }
            }

            const res = await fetch(`/api/courses/${courseId}/videos/${currentIndex}/watch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    watchedPercentage,
                    duration: durationInSeconds
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setHasMarkedAsWatched(true);
                hasMarkedRef.current = true;
                
                // Show overlay only once
                if (!hasShownOverlayRef.current) {
                    setShowCompletionOverlay(true);
                    hasShownOverlayRef.current = true;
                }
                
                toast.success(`Video marked as watched! Progress: ${Math.min(data.progress, 100)}%`);
                fetchData();
            } else {
                const error = await res.json();
                toast.error(error.error || 'Failed to mark video as watched');
            }
        } catch (error) {
            console.error("Failed to mark video as watched", error);
            toast.error('Failed to mark video as watched');
        }
    };

    // Fetch user email for watermark
    useEffect(() => {
        const fetchUserAndEnrollment = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUserEmail(data.user.email);

                    // Check enrollment
                    const resEnroll = await fetch("/api/user/enrollments");
                    if (resEnroll.ok) {
                        const enrollData = await resEnroll.json();
                        const enrolled = enrollData.enrollments.some((e: any) => {
                            const enrollCourseId = e.course?._id || e.course;
                            return String(enrollCourseId) === String(courseId);
                        });
                        setIsEnrolled(enrolled);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user/enrollment', error);
            } finally {
                setCheckingEnrollment(false);
            }
        };
        fetchUserAndEnrollment();
    }, [courseId]);

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

    // Moving watermark animation
    useEffect(() => {
        const moveWatermark = () => {
            setWatermarkPosition(prev => {
                const maxX = 80; // percentage
                const maxY = 80; // percentage
                const newX = Math.random() * maxX;
                const newY = Math.random() * maxY;
                return { x: newX, y: newY };
            });
        };

        // Move watermark every 5 seconds
        const interval = setInterval(moveWatermark, 5000);
        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        fetchData();
        fetchNotes();
        // Reset YouTube player reference on video change
        ytPlayerRef.current = null;
    }, [courseId, videoIndex]);

    useEffect(() => {
        if (!ytApiLoaded || !isYouTube) {
            console.log("YT not ready or not YT video:", { ytApiLoaded, isYouTube });
            return;
        }

        console.log("Initializing VT Player for ID:", videoId);

        // Cleanup previous player if any
        if (ytPlayerRef.current) {
            try { ytPlayerRef.current.destroy(); } catch (e) {}
        }

        let player: any = null;
        try {
            player = new (window as any).YT.Player('yt-player', {
                videoId: videoId,
                playerVars: {
                    autoplay: 1, // Start buffering/playing immediately
                    modestbranding: 1,
                    rel: 0,
                    controls: 0, // Disable native controls to hide speed/more-videos
                    showinfo: 0,
                    iv_load_policy: 3,
                    fs: 0,
                    disablekb: 1, // Disable keyboard shortcuts to prevent skipping
                },
                events: {
                    onReady: (event: any) => {
                        ytPlayerRef.current = event.target;
                    },
                    onStateChange: (event: any) => {
                        if (event.data === 0) handleEndedRef.current(); // 0 = ENDED
                        setIsPlaying(event.data === 1); // 1 = PLAYING
                        
                        // Sync duration when video starts playing or is ready
                        if (event.data === 1 || event.data === -1) {
                            const d = event.target.getDuration();
                            if (d > 0) setDuration(d);
                        }
                    }
                }
            });
        } catch (error) {
            console.error("YouTube Player initialization failed", error);
        }

        return () => {
            if (ytPlayerRef.current) {
                try { ytPlayerRef.current.destroy(); } catch (e) {}
                ytPlayerRef.current = null;
            }
        };
    }, [ytApiLoaded, currentIndex, videoId]);

    // Fast sync for ref
    useEffect(() => {
        lastValidTimeRef.current = lastValidTime;
    }, [lastValidTime]);

    // Constant Independent Smooth Seeker Sync (60fps)
    useEffect(() => {
        let animationFrameId: number;
        
        const syncLoop = () => {
            let currentTime = 0;
            let currentDuration = 0;
            let isCurrentlyPlaying = false;

            // YouTube Player Check
            if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
                try {
                    const state = ytPlayerRef.current.getPlayerState();
                    isCurrentlyPlaying = (state === 1); // 1 = PLAYING
                    currentTime = ytPlayerRef.current.getCurrentTime();
                    currentDuration = ytPlayerRef.current.getDuration();
                } catch (e) {}
            } 
            // HTML5 Video Check
            else if (videoRef.current) {
                isCurrentlyPlaying = !videoRef.current.paused;
                currentTime = videoRef.current.currentTime;
                currentDuration = videoRef.current.duration;
            }

            if (currentDuration > 0) {
                // Sync Duration Ref
                if (Math.abs(durationRef.current - currentDuration) > 0.1) {
                    durationRef.current = currentDuration;
                    setDuration(currentDuration);
                    if (totalTimeRef.current) {
                        totalTimeRef.current.textContent = formatTime(currentDuration);
                    }
                }

                if (isCurrentlyPlaying) {
                    // Anti-Cheat: Increase buffer to 5s to handle network micro-jumps
                    if (!hasMarkedRef.current && currentTime > lastValidTimeRef.current + 5) {
                        if (ytPlayerRef.current) ytPlayerRef.current.seekTo(lastValidTimeRef.current, true);
                        else if (videoRef.current) videoRef.current.currentTime = lastValidTimeRef.current;
                    } else if (currentTime > lastValidTimeRef.current) {
                        lastValidTimeRef.current = currentTime;
                        
                        // Throttle state update for hover-indicator UI to once per second
                        if (Math.abs(currentTime - lastValidTime) > 1) {
                            setLastValidTime(currentTime);
                        }
                    }

                    // Visual Update: Zero-Lag Head
                    const percentage = Math.min((currentTime / currentDuration) * 100, 100);
                    if (seekerBarRef.current) seekerBarRef.current.style.width = `${percentage}%`;
                    if (timeDisplayRef.current) timeDisplayRef.current.textContent = formatTime(currentTime);

                    // Threshold update
                    if (!hasMarkedRef.current && percentage >= 90) {
                        markAsWatched(Math.round(percentage));
                    }
                }
            }

            animationFrameId = requestAnimationFrame(syncLoop);
        };

        animationFrameId = requestAnimationFrame(syncLoop);
        return () => cancelAnimationFrame(animationFrameId);
    }, []); // Zero dependencies: Loop runs perfectly from mount to unmount

    // Auto-hide completion overlay after 5 seconds
    useEffect(() => {
        if (showCompletionOverlay) {
            const timer = setTimeout(() => {
                setShowCompletionOverlay(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showCompletionOverlay]);


    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            // Handled by requestAnimationFrame loop for better smoothness
        };

        const handleEndedHTML5 = () => {
             handleEndedRef.current();
        };

        const handleLoadedMetadata = () => {
            console.log('Video loaded, duration:', video.duration);
            setDuration(video.duration);
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("ended", handleEndedHTML5);
        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("ended", handleEndedHTML5);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
        };
    }, [hasMarkedAsWatched, currentIndex, loading, lastValidTime]);

    const toggleFullscreen = () => {
        if (!playerContainerRef.current) return;

        if (!document.fullscreenElement) {
            playerContainerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
        setShowSettings(false);
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            router.push(`/courses/${courseId}/video/${currentIndex - 1}`);
            setHasMarkedAsWatched(false);
            hasMarkedRef.current = false;
            hasShownOverlayRef.current = false;
        }
    };

    const goToNext = () => {
        if (currentIndex < (course?.videos?.length || 0) - 1) {
            router.push(`/courses/${courseId}/video/${currentIndex + 1}`);
            setHasMarkedAsWatched(false);
            hasMarkedRef.current = false;
            hasShownOverlayRef.current = false;
        }
    };

    // Non-blocking skeleton for video area
    const VideoSkeleton = () => (
        <div className="relative aspect-video bg-gray-800 rounded-xl overflow-hidden animate-pulse flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-gray-500">
                <Play size={48} className="opacity-20" />
                <p className="text-sm font-medium">Preparing Lesson...</p>
            </div>
        </div>
    );

    // Skeleton for course sidebar
    const SidebarSkeleton = () => (
        <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-gray-800/50 rounded-lg animate-pulse border border-gray-700/50" />
            ))}
        </div>
    );

    if (!loading && !currentVideo) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Video not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700 p-4 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            onClick={() => router.push(`/courses/${courseId}`)}
                            className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Course
                        </Button>
                        <div className="hidden md:block border-l border-gray-700 pl-4">
                            <h1 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate max-w-[300px]">
                                {loading ? "Loading Lesson..." : currentVideo?.title}
                            </h1>
                        </div>
                    </div>
                    {isCurrentVideoWatched && !loading && (
                        <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                            <CheckCircle size={20} className="text-green-500" />
                            <span className="text-sm text-green-500 font-medium hidden sm:inline">Completed</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className={`mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-8 transition-all duration-300 ${isTheaterMode ? 'max-w-full' : 'max-w-[1600px]'}`}>
                <div className="flex-1 w-full">
                    <div className="relative group" ref={playerContainerRef}>
                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-3xl blur-2xl opacity-40 group-hover:opacity-70 transition duration-500"></div>
                        <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5">
                            {loading ? (
                                <VideoSkeleton />
                            ) : isYouTube ? (
                                <div className="w-full h-full relative">
                                    {ytApiLoaded ? (
                                        <div key={videoId} id="yt-player" className="w-full h-full" />
                                    ) : (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=0&showinfo=0&iv_load_policy=3&fs=0`}
                                            className="w-full h-full"
                                            allowFullScreen
                                            title={currentVideo.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        />
                                    )}

                                    {/* Click Shield & Mask - Completely blocks interaction and hides "More videos" shelf */}
                                    <div 
                                        onClick={togglePlay}
                                        className={`absolute inset-0 z-[20] cursor-pointer transition-all duration-300 flex items-center justify-center ${!isPlaying ? 'bg-black' : 'bg-transparent'}`}
                                        title="Click to play/pause"
                                    >
                                        {!isPlaying && !hasMarkedAsWatched && (
                                            <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                                                <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] transform hover:scale-110 transition-transform">
                                                    <Play size={48} className="text-white fill-current ml-1" />
                                                </div>
                                                <p className="text-gray-300 font-medium tracking-wide uppercase text-xs">Click to Resume Lesson</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Additional Logo/Interaction Masks */}
                                    <div className="absolute bottom-0 right-4 w-40 h-16 bg-black z-[10] pointer-events-none" />
                                    <div className="absolute top-0 right-0 w-full h-20 bg-gradient-to-b from-black to-transparent z-[10] pointer-events-none" />
                                    <div className="absolute top-0 left-0 w-40 h-16 bg-black z-[10] pointer-events-none" />
                                    {/* Moving Watermark for YouTube */}
                                    {userEmail && (
                                        <div 
                                            className="absolute pointer-events-none select-none transition-all duration-1000 ease-in-out z-10"
                                            style={{
                                                left: `${watermarkPosition.x}%`,
                                                top: `${watermarkPosition.y}%`,
                                            }}
                                        >
                                            <div className="text-white/20 text-xs font-mono bg-black/30 px-3 py-1.5 rounded backdrop-blur-sm transform -rotate-12">
                                                {userEmail}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        src={currentVideo.url}
                                        controls
                                        controlsList="nodownload noremoteplayback"
                                        disablePictureInPicture
                                        className="w-full h-full"
                                    />
                                    {/* Moving Watermark for Direct Videos */}
                                    {userEmail && (
                                        <div 
                                            className="absolute pointer-events-none select-none transition-all duration-1000 ease-in-out z-10"
                                            style={{
                                                left: `${watermarkPosition.x}%`,
                                                top: `${watermarkPosition.y}%`,
                                            }}
                                        >
                                            <div className="text-white/40 text-xs font-mono bg-black/30 px-3 py-1.5 rounded backdrop-blur-sm transform -rotate-12">
                                                {userEmail}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Video Completed Overlay */}
                            {showCompletionOverlay && (
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-[100] animate-in fade-in duration-300">
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 text-center max-w-md mx-4 shadow-2xl transform scale-100 transition-all">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                                            <CheckCircle size={32} className="text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Video Completed!</h2>
                                        <p className="text-gray-400 mb-6">You've successfully watched this lesson.</p>

                                        <div className="flex gap-3 justify-center">
                                             <Button
                                                 onClick={() => {
                                                     if (ytPlayerRef.current) {
                                                         ytPlayerRef.current.seekTo(0, true);
                                                         ytPlayerRef.current.playVideo();
                                                     } else if (videoRef.current) {
                                                         videoRef.current.currentTime = 0;
                                                         videoRef.current.play();
                                                     }
                                                     setHasMarkedAsWatched(false);
                                                     setShowCompletionOverlay(false);
                                                 }}
                                                 variant="outline"
                                                 className="border-gray-600 hover:bg-gray-700"
                                             >
                                                 Replay
                                             </Button>
                                            {currentIndex < (course?.videos?.length || 0) - 1 && (
                                                <Button
                                                    onClick={goToNext}
                                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                                >
                                                    Next Lesson <ChevronRight size={16} className="ml-1" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seeker Bar */}
                    <div className="mt-4 px-1">
                        <div className="relative w-full h-2 bg-gray-800 rounded-full cursor-pointer group"
                            onClick={(e) => {
                                if (!duration) return;
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const clickedPercentage = (x / rect.width) * 100;
                                const clickedTime = (clickedPercentage / 100) * duration;

                                if (clickedTime <= lastValidTimeRef.current + 2) {
                                    if (seekerBarRef.current) seekerBarRef.current.style.width = `${clickedPercentage}%`;
                                    if (timeDisplayRef.current) timeDisplayRef.current.textContent = formatTime(clickedTime);
                                    
                                    if (ytPlayerRef.current) {
                                        ytPlayerRef.current.seekTo(clickedTime, true);
                                    } else if (videoRef.current) {
                                        videoRef.current.currentTime = clickedTime;
                                    }
                                } else {
                                    toast.error("Finish watching this part first!", { id: "anti-cheat" });
                                }
                            }}
                        >
                            <div 
                                 ref={seekerBarRef}
                                 className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                 style={{ width: `${videoProgress}%` }}
                            />
                            {/* Hover indicator */}
                            <div className="absolute top-0 left-0 h-full bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ width: `${(lastValidTime / (duration || 1)) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-1 px-0.5">
                            <span ref={timeDisplayRef} className="text-[10px] text-gray-500 font-mono">
                                {formatTime(videoProgress * (duration || 0) / 100)}
                            </span>
                            <span ref={totalTimeRef} className="text-[10px] text-gray-500 font-mono">
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>

                    {/* Controls Bar */}
                    <div className="flex items-center justify-between mt-4 bg-gray-900/50 p-2 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={togglePlay}
                                variant="ghost"
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            >
                                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                            </Button>
                            <Button
                                onClick={goToPrevious}
                                disabled={currentIndex === 0}
                                variant="ghost"
                                className="text-gray-400 hover:text-white hover:bg-gray-800"
                            >
                                <ChevronLeft className="mr-1 h-5 w-5" />
                                Prev
                            </Button>
                            <Button
                                onClick={goToNext}
                                disabled={currentIndex >= (course?.videos?.length || 0) - 1}
                                variant="ghost"
                                className="text-gray-400 hover:text-white hover:bg-gray-800"
                            >
                                Next
                                <ChevronRight className="ml-1 h-5 w-5" />
                            </Button>
                        </div>

                        {/* Manual Mark as Watched button - Anti-cheating enabled
                            - YouTube: Shows immediately (can't track iframe)
                            - Direct videos: NO BUTTON - must watch 90% (automatic only)
                        */}
                        {isCurrentVideoWatched ? (
                            <Button
                                disabled
                                className="bg-gray-600 text-gray-300 cursor-not-allowed"
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Already Watched
                            </Button>
                        ) : null}

                        <div className="relative">
                            <Button
                                onClick={() => setShowSettings(!showSettings)}
                                variant="ghost"
                                className="text-gray-400 hover:text-white hover:bg-gray-800"
                            >
                                <Settings className="h-5 w-5 mr-2" />
                                Controls
                            </Button>

                            {/* Dropdown Menu */}
                            {showSettings && (
                                <div className="absolute bottom-full right-0 mb-2 w-56 bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="p-1 space-y-1">
                                        <button
                                            onClick={() => { setIsTheaterMode(!isTheaterMode); setShowSettings(false); }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <Maximize className="h-4 w-4" />
                                            {isTheaterMode ? 'Exit Theater Mode' : 'Theater Mode'}
                                        </button>
                                        <button
                                            onClick={toggleFullscreen}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <Expand className="h-4 w-4" />
                                            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                        </button>
                                        <div className="h-px bg-gray-700 my-1" />
                                        <button
                                            onClick={() => { setShowNotes(!showNotes); setShowSettings(false); }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <FileText className="h-4 w-4" />
                                            {showNotes ? 'Hide Notes' : 'Show Notes'}
                                        </button>
                                        <button
                                            onClick={() => { setShowDoubtModal(true); setShowSettings(false); }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <HelpCircle className="h-4 w-4" />
                                            Ask Doubt
                                        </button>
                                        <button
                                            onClick={() => router.push(`/courses/${courseId}/doubts`)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                            My Doubts
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
                        {loading ? (
                            <div className="space-y-2">
                                <div className="h-6 w-1/3 bg-gray-800 rounded animate-pulse" />
                                <div className="h-4 w-1/4 bg-gray-800 rounded animate-pulse" />
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold mb-2">{currentVideo?.title}</h2>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span>⏱️ {currentVideo?.duration}</span>
                                    {isCurrentVideoWatched && (
                                        <span className="flex items-center gap-1 text-green-500">
                                            <CheckCircle size={14} />
                                            Watched
                                        </span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Notes Section - Toggleable */}
                    {showNotes && (
                        <div className="mt-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 animate-in fade-in slide-in-from-top-4">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                📝 My Notes
                            </h2>

                            {/* New Note Input */}
                            <div className="mb-4">
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Write your notes here..."
                                    className="w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-700 focus:border-blue-500 focus:outline-none min-h-[100px] resize-y"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={saveNote}
                                        disabled={!newNote.trim()}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-30 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                    >
                                        💾 Save Note
                                    </button>
                                    <button
                                        onClick={() => {
                                            let currentTime = 0;
                                            if (ytPlayerRef.current) {
                                                currentTime = ytPlayerRef.current.getCurrentTime();
                                            } else {
                                                currentTime = videoRef.current?.currentTime || 0;
                                            }
                                            const timestamp = formatTime(currentTime);
                                            setNewNote(newNote + ` [${timestamp}]`);
                                        }}
                                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                    >
                                        🕐 Add Timestamp
                                    </button>
                                </div>
                            </div>

                            {/* Notes List */}
                            {notes.length > 0 ? (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Saved Notes ({notes.length})</h3>
                                    {notes.map((note: any, index: number) => (
                                        <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                {note.timestamp && (
                                                    <button
                                                        onClick={() => jumpToTimestamp(note.timestamp)}
                                                        className="text-blue-400 hover:text-blue-300 text-sm font-mono bg-blue-500/10 px-2 py-1 rounded"
                                                    >
                                                        🕐 {note.timestamp}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNote(index)}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </div>
                                            <p className="text-gray-300 whitespace-pre-wrap">{note.content}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {new Date(note.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">No notes yet. Start taking notes!</p>
                            )}
                        </div>
                    )}

                    {/* Ask Doubt Modal */}
                    {showDoubtModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowDoubtModal(false)}>
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 max-w-2xl w-full mx-4 animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                    ❓ Ask Your Doubt
                                </h2>
                                <p className="text-gray-400 mb-4">
                                    Video: <span className="text-blue-400">{currentVideo?.title}</span>
                                </p>
                                <textarea
                                    value={doubtQuestion}
                                    onChange={(e) => setDoubtQuestion(e.target.value)}
                                    placeholder="Type your question here..."
                                    className="w-full bg-gray-800 text-white rounded-lg p-4 border border-gray-700 focus:border-orange-500 focus:outline-none min-h-[150px] resize-y mb-4"
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => {
                                            setShowDoubtModal(false);
                                            setDoubtQuestion('');
                                        }}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={askDoubt}
                                        disabled={!doubtQuestion.trim()}
                                        className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-30 rounded-lg text-sm font-medium transition-all"
                                    >
                                        Submit Doubt
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Free Trial Ended Modal */}
                    {showTrialEndedModal && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] animate-in fade-in duration-300">
                             <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-yellow-500/30 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-20 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                
                                <div className="relative z-10 text-center">
                                    <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/30">
                                        <Lock size={40} className="text-white" />
                                    </div>
                                    
                                    <h2 className="text-3xl font-bold text-white mb-2">Free Trial Completed!</h2>
                                    <p className="text-gray-400 mb-8 leading-relaxed">
                                        You've finished the free preview. To continue learning and unlock the full course, certificate, and resources, please enroll now.
                                    </p>

                                    <div className="space-y-3">
                                        <Button
                                            onClick={() => router.push(`/courses/${courseId}?buy=true`)}
                                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-6 text-lg font-bold rounded-xl shadow-lg shadow-orange-500/20"
                                        >
                                            Unlock Full Course
                                        </Button>
                                        <button
                                            onClick={() => router.push(`/courses/${courseId}`)}
                                            className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
                                        >
                                            Later
                                        </button>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Sidebar - Hidden in Theater Mode */}
                {!isTheaterMode && (
                    <div className="w-full lg:w-[400px] flex-shrink-0">
                        <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-md rounded-2xl p-5 border border-white/10 sticky top-6 shadow-xl" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
                                <h2 className="text-lg font-semibold">Course Content</h2>
                                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">
                                    {loading ? "..." : (course?.videos?.length || 0)} videos
                                </span>
                            </div>

                            <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                                {loading ? (
                                    <SidebarSkeleton />
                                ) : course?.modules && course.modules.length > 0 ? (
                                    [...course.modules]
                                        .sort((a: any, b: any) => a.order - b.order)
                                        .map((module: any, moduleIndex: number) => {
                                            // Calculate starting video index for this module
                                            const startIndex = course.modules
                                                .slice(0, moduleIndex)
                                                .reduce((acc: number, m: any) => acc + (m.videos?.length || 0), 0);
                                            
                                            const isModuleSidebarUnlocked = isEnrolled || moduleIndex === 0;

                                            return (
                                                <div key={moduleIndex} className="mb-4">
                                                    {/* Module Header */}
                                                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-3 rounded-lg mb-2 border border-gray-600">
                                                        <h3 className="text-sm font-bold text-white">
                                                            Module {moduleIndex + 1}: {module.title}
                                                        </h3>
                                                        {module.description && (
                                                            <p className="text-xs text-gray-400 mt-1">{module.description}</p>
                                                        )}
                                                        <div className="flex justify-between items-center mt-1">
                                                            <p className="text-xs text-gray-500">
                                                                {module.videos?.length || 0} video{(module.videos?.length || 0) !== 1 ? 's' : ''}
                                                            </p>
                                                            {!isEnrolled && moduleIndex === 0 && (
                                                                <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded uppercase font-bold">
                                                                    Free
                                                                </span>
                                                            )}
                                                            {!isModuleSidebarUnlocked && (
                                                                <Lock size={12} className="text-gray-500" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Videos in this module */}
                                                    <div className="space-y-2 pl-2">
                                                        {(module.videos || []).map((video: any, videoIndex: number) => {
                                                            const globalIndex = startIndex + videoIndex;
                                                            const watched = isWatched(globalIndex);
                                                            
                                                            return (
                                                                <button
                                                                    key={videoIndex}
                                                                    onClick={() => {
                                                                        if (isModuleSidebarUnlocked) {
                                                                            router.push(`/courses/${courseId}/video/${globalIndex}`);
                                                                            setHasMarkedAsWatched(false);
                                                                        } else {
                                                                            toast.error("Enroll to unlock this module");
                                                                        }
                                                                    }}
                                                                    className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${globalIndex === currentIndex
                                                                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500 shadow-lg shadow-blue-500/20'
                                                                        : watched
                                                                            ? 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30'
                                                                            : isModuleSidebarUnlocked 
                                                                                ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                                                                                : 'bg-gray-800/20 border-gray-700/50 opacity-60 cursor-not-allowed'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-start gap-3">
                                                                        <div className="flex-shrink-0 mt-0.5">
                                                                            {!isModuleSidebarUnlocked ? (
                                                                                <Lock size={14} className="text-gray-500" />
                                                                            ) : watched ? (
                                                                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                                                                                    <CheckCircle size={14} className="text-white" />
                                                                                </div>
                                                                            ) : (
                                                                                <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className={`text-sm font-medium ${globalIndex === currentIndex
                                                                                ? 'text-blue-400'
                                                                                : watched
                                                                                    ? 'text-green-400'
                                                                                    : 'text-white'
                                                                                }`}>
                                                                                {globalIndex + 1}. {video.title}
                                                                            </p>
                                                                            <div className="flex items-center gap-2 mt-1">
                                                                                <p className="text-xs text-gray-400">{video.duration}</p>
                                                                                {globalIndex === currentIndex && (
                                                                                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                                                                                        Playing
                                                                                    </span>
                                                                                )}
                                                                                {watched && globalIndex !== currentIndex && (
                                                                                    <span className="text-xs text-green-500">✓ Done</span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })
                                ) : (
                                    course?.videos?.map((video: any, index: number) => {
                                        const watched = isWatched(index);

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    router.push(`/courses/${courseId}/video/${index}`);
                                                    setHasMarkedAsWatched(false);
                                                }}
                                                className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${index === currentIndex
                                                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500 shadow-lg shadow-blue-500/20'
                                                    : watched
                                                        ? 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30'
                                                        : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        {watched ? (
                                                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                                                                <CheckCircle size={14} className="text-white" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium ${index === currentIndex
                                                            ? 'text-blue-400'
                                                            : watched
                                                                ? 'text-green-400'
                                                                : 'text-white'
                                                            }`}>
                                                            {index + 1}. {video.title}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <p className="text-xs text-gray-400">{video.duration}</p>
                                                            {index === currentIndex && (
                                                                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                                                                    Playing
                                                                </span>
                                                            )}
                                                            {watched && index !== currentIndex && (
                                                                <span className="text-xs text-green-500">✓ Done</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
