"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, ChevronLeft, ChevronRight, CheckCircle,
    MoreVertical, Settings, Maximize, Minimize,
    MessageCircle, HelpCircle, FileText
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
    const [notes, setNotes] = useState < any[] > ([]);
    const [newNote, setNewNote] = useState('');
    const [showNotes, setShowNotes] = useState(false);
    const [showDoubtModal, setShowDoubtModal] = useState(false);
    const [doubtQuestion, setDoubtQuestion] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    // Prevent screen recording and screenshots
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            return false;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                toast.error('Screenshots are disabled for this content');
            }
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                toast.error('Screenshots are disabled for this content');
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                const video = videoRef.current;
                if (video && !video.paused) {
                    // video.pause();
                }
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';
        };
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

    const fetchData = async () => {
        try {
            const resCourse = await fetch(`/api/courses/${courseId}`);
            if (resCourse.ok) {
                const data = await resCourse.json();
                setCourse(data.course);
            }

            const resProgress = await fetch(`/api/courses/${courseId}/progress`);
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
            const res = await fetch(`/api/courses/${courseId}/videos/${currentIndex}/watch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ watchedPercentage }),
            });

            if (res.ok) {
                const data = await res.json();
                setHasMarkedAsWatched(true);
                toast.success(`Video marked as watched! Progress: ${data.progress}%`);
                fetchData();
            }
        } catch (error) {
            console.error("Failed to mark video as watched", error);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            const percentage = (video.currentTime / video.duration) * 100;
            if (percentage >= 90 && !hasMarkedAsWatched) {
                markAsWatched(Math.round(percentage));
            }
        };

        const handleEnded = () => {
            if (!hasMarkedAsWatched) {
                markAsWatched(100);
            }
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("ended", handleEnded);
        };
    }, [hasMarkedAsWatched]);

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
                                <iframe
                                    src={`${currentVideo.url.replace('watch?v=', 'embed/')}?rel=0&modestbranding=1&controls=1`}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title={currentVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            ) : (
                                <video
                                    ref={videoRef}
                                    src={currentVideo.url}
                                    controls
                                    controlsList="nodownload noremoteplayback"
                                    disablePictureInPicture
                                    onContextMenu={(e) => e.preventDefault()}
                                    className="w-full h-full"
                                />
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
                                            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
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

                            <div className="space-y-2 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                                {course?.videos?.map((video: any, index: number) => {
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
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
