"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, ChevronLeft, ChevronRight, CheckCircle,
    MoreVertical, Settings, Maximize, Minimize, Expand,
    MessageCircle, HelpCircle, FileText, Lock
} from "lucide-react";
import { toast } from "sonner";

export default function VideoPlayerPage() {
    const { id: courseId, videoIndex } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState < any > (null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState < any > (null);
    const videoRef = useRef < HTMLVideoElement > (null);
    const [hasMarkedAsWatched, setHasMarkedAsWatched] = useState(false);
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
    const [userEmail, setUserEmail] = useState('');
    const [watermarkPosition, setWatermarkPosition] = useState({ x: 10, y: 10 });
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [checkingEnrollment, setCheckingEnrollment] = useState(true);
    const [showTrialEndedModal, setShowTrialEndedModal] = useState(false);

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
                        const enrolled = enrollData.enrollments.some((e: any) => 
                            e.course?._id === courseId || e.course === courseId
                        );
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

    const currentIndex = parseInt(videoIndex as string);
    const currentVideo = course?.videos?.[currentIndex];

    // Enhanced watched check logic
    const isWatched = (index: number) => {
        if (index === currentIndex && hasMarkedAsWatched) return true;
        return progress?.watchedVideos?.some((w: any) => w.videoIndex === index && w.watchedPercentage >= 90);
    };

    const isCurrentVideoWatched = isWatched(currentIndex);

    useEffect(() => {
        fetchData();
        fetchNotes();
    }, [courseId, videoIndex]);

    // Access Control Logic
    useEffect(() => {
        if (loading || checkingEnrollment || !course) return;

        // Access Control Logic
        let isFreeVideo = false;
        if (course.modules && course.modules.length > 0) {
            // Sort modules just in case, though API usually sorts them
            const sortedModules = [...course.modules].sort((a: any, b: any) => a.order - b.order);
            const firstModule = sortedModules[0];
            const firstModuleVideoCount = firstModule.videos?.length || 0;
            
            // The videoIndex is a global index across all modules
            // So if currentIndex < number (videos in module 1), it belongs to module 1
            // AND user must be logged in (userEmail proxy)
            if (currentIndex < firstModuleVideoCount && userEmail) {
                isFreeVideo = true;
            }
        } else {
             // Fallback for courses without modules structure (though API helps prevent this)
             // or if modules array is empty but videos exist
             if (currentIndex === 0 && userEmail) isFreeVideo = true;
        }

        if (!isEnrolled && !isFreeVideo) {
            if (!userEmail) {
                 toast.error("Please login to verify Free Trial access");
            } else {
                 toast.error("You must enroll to continue watching");
            }
            router.push(`/courses/${courseId}`);
        }
    }, [loading, checkingEnrollment, course, isEnrolled, currentIndex, courseId, router, userEmail]);

    const fetchData = async () => {
        try {
            // Fetch course and progress in parallel
            const [resCourse, resProgress] = await Promise.all([
                fetch(`/api/courses/${courseId}`),
                fetch(`/api/courses/${courseId}/progress`)
            ]);

            if (resCourse.ok) {
                const data = await resCourse.json();
                setCourse(data.course);
            }

            if (resProgress.ok) {
                const progressData = await resProgress.json();
                setProgress(progressData);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
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

    const saveNote = async () => {
        if (!newNote.trim()) return;

        const currentTime = videoRef.current?.currentTime || 0;
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

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const jumpToTimestamp = (timestamp: string) => {
        if (!videoRef.current) return;
        const parts = timestamp.split(':').map(Number);
        let seconds = 0;
        if (parts.length === 3) {
            seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            seconds = parts[0] * 60 + parts[1];
        }
        videoRef.current.currentTime = seconds;
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
        if (hasMarkedAsWatched) return;

        try {
            // Get duration - for YouTube videos, parse from duration string (e.g., "10:30" -> 630 seconds)
            let durationInSeconds = videoRef.current?.duration || 0;
            
            if (!durationInSeconds && currentVideo?.duration) {
                // Parse duration string like "10:30" or "1:05:30"
                const parts = currentVideo.duration.split(':').map(Number);
                if (parts.length === 2) {
                    // MM:SS format
                    durationInSeconds = parts[0] * 60 + parts[1];
                } else if (parts.length === 3) {
                    // HH:MM:SS format
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

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (hasMarkedAsWatched) return;
            
            // Prevent forward seeking (anti-cheat)
            if (video.currentTime > lastValidTime + 1) {
                console.log('Forward seek detected, reverting to:', lastValidTime);
                video.currentTime = lastValidTime;
                return;
            }
            
            // Update last valid time
            setLastValidTime(video.currentTime);
            
            // Cap progress at 100%
            const percentage = Math.min((video.currentTime / video.duration) * 100, 100);
            setVideoProgress(percentage);
            // console.log('Video progress:', percentage.toFixed(2) + '%');
            
            if (percentage >= 90) {
                // console.log('90% reached, marking as watched');
                markAsWatched(Math.round(percentage));
            }
        };

        const handleEnded = () => {
             // Check if this was the last free video
            const checkFreeTrialCompletion = () => {
                if (!course || !course.modules || isEnrolled) return;
                
                const sortedModules = [...course.modules].sort((a: any, b: any) => a.order - b.order);
                const firstModule = sortedModules[0];
                const firstModuleVideoCount = firstModule.videos?.length || 0;
                
                // If this is the last video of the first module (index is 0-based, so count - 1)
                if (currentIndex === firstModuleVideoCount - 1) {
                    setShowTrialEndedModal(true);
                }
            };

            if (!hasMarkedAsWatched) {
                console.log('Video ended, marking as watched');
                markAsWatched(100);
                checkFreeTrialCompletion();
            } else {
                 checkFreeTrialCompletion();
            }
        };

        const handleLoadedMetadata = () => {
            console.log('Video loaded, duration:', video.duration);
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("ended", handleEnded);
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
        }
    };

    const goToNext = () => {
        if (currentIndex < (course?.videos?.length || 0) - 1) {
            router.push(`/courses/${courseId}/video/${currentIndex + 1}`);
            setHasMarkedAsWatched(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                Loading video...
            </div>
        );
    }

    if (!currentVideo) {
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
                <div className="max-w-7xl mx-auto flex items-center justify-between">
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
                                {currentVideo.title}
                            </h1>
                        </div>
                    </div>
                    {isCurrentVideoWatched && (
                        <div className="flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                            <CheckCircle size={20} className="text-green-500" />
                            <span className="text-sm text-green-500 font-medium hidden sm:inline">Completed</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className={`mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6 transition-all duration-300 ${isTheaterMode ? 'max-w-full' : 'max-w-7xl'}`}>
                {/* Video Player Section */}
                <div className="flex-1 w-full">
                    <div className="relative group" ref={playerContainerRef}>
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                            {currentVideo.url.includes('youtube.com') || currentVideo.url.includes('youtu.be') ? (
                                <>
                                    <iframe
                                        src={`${currentVideo.url.replace('m.youtube.com', 'www.youtube.com').replace('watch?v=', 'embed/')}?rel=0&modestbranding=1&controls=1`}
                                        className="w-full h-full"
                                        allowFullScreen
                                        title={currentVideo.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                    {/* Moving Watermark for YouTube */}
                                    {userEmail && (
                                        <div 
                                            className="absolute pointer-events-none select-none transition-all duration-1000 ease-in-out"
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
                                </>
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
                            {hasMarkedAsWatched && (
                                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-in fade-in duration-300">
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 text-center max-w-md mx-4 shadow-2xl transform scale-100 transition-all">
                                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                                            <CheckCircle size={32} className="text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Video Completed!</h2>
                                        <p className="text-gray-400 mb-6">You've successfully watched this lesson.</p>

                                        <div className="flex gap-3 justify-center">
                                            <Button
                                                onClick={() => {
                                                    if (videoRef.current) {
                                                        videoRef.current.currentTime = 0;
                                                        videoRef.current.play();
                                                    }
                                                    setHasMarkedAsWatched(false);
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

                    {/* Controls Bar */}
                    <div className="flex items-center justify-between mt-4 bg-gray-900/50 p-2 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-2">
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
                        {!isCurrentVideoWatched && (currentVideo?.url?.includes('youtube.com') || currentVideo?.url?.includes('youtu.be')) ? (
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => markAsWatched(100)}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white animate-in fade-in slide-in-from-bottom-2"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark as Watched
                                </Button>
                            </div>
                        ) : isCurrentVideoWatched ? (
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

                    {/* Video Description */}
                    <div className="mt-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
                        <h2 className="text-xl font-semibold mb-2">{currentVideo.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>⏱️ {currentVideo.duration}</span>
                            {isCurrentVideoWatched && (
                                <span className="flex items-center gap-1 text-green-500">
                                    <CheckCircle size={14} />
                                    Watched
                                </span>
                            )}
                        </div>
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
                                            const currentTime = videoRef.current?.currentTime || 0;
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
                    <div className="w-full lg:w-96 flex-shrink-0">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-4 border border-gray-700 sticky top-6" style={{ maxHeight: 'calc(100vh - 120px)' }}>
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
                                <h2 className="text-lg font-semibold">Course Content</h2>
                                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full border border-blue-500/20">
                                    {course?.videos?.length || 0} videos
                                </span>
                            </div>

                            <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                                {course?.modules && course.modules.length > 0 ? (
                                    course.modules
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
