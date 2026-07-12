"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

interface VideoTestimonial {
    _id: string;
    studentName: string;
    roleOrCourse: string;
    videoUrl: string;
    thumbnailUrl: string;
}

export function VideoTestimonialsSection() {
    const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch("/api/video-testimonials");
                if (res.ok) {
                    const data = await res.json();
                    setTestimonials(data);
                }
            } catch (error) {
                console.error("Failed to fetch video testimonials", error);
            }
        };
        fetchVideos();
    }, []);

    // Helper to get YouTube ID and Thumbnail if missing
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getThumbnail = (t: VideoTestimonial) => {
        if (t.thumbnailUrl) return t.thumbnailUrl;
        const ytId = getYouTubeId(t.videoUrl);
        if (ytId) return `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
        return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"; // Fallback placeholder
    };

    const getEmbedUrl = (url: string) => {
        const ytId = getYouTubeId(url);
        if (ytId) return `https://www.youtube.com/embed/${ytId}?autoplay=1`;
        return url; // Assuming it's already an embed link or raw mp4 if not YT
    };

    if (testimonials.length === 0) return null;

    return (
        <section className="py-24 relative overflow-hidden bg-black">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block py-1 px-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        Success Stories
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold text-white mb-6"
                    >
                        Hear From Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Achievers</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        Real stories from students who transformed their careers through our hands-on AI-powered platform.
                    </motion.p>
                </div>

                {/* Video Carousel Grid */}
                <div 
                    ref={carouselRef}
                    className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide md:justify-center"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {testimonials.map((testimonial, idx) => (
                        <motion.div
                            key={testimonial._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="snap-center shrink-0 w-[220px] h-[390px] md:w-[240px] md:h-[426px] relative group rounded-3xl overflow-hidden bg-black border border-white/10 hover:border-blue-500/50 transition-colors shadow-2xl"
                        >
                            {activeVideo === testimonial._id ? (
                                <iframe 
                                    src={getEmbedUrl(testimonial.videoUrl)}
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="w-full h-full relative overflow-hidden">
                                    <img 
                                        src={getThumbnail(testimonial)} 
                                        alt={testimonial.studentName}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                    
                                    {/* Play Button Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all cursor-pointer"
                                         onClick={() => setActiveVideo(testimonial._id)}
                                    >
                                        <div className="w-16 h-16 rounded-full bg-blue-600/90 backdrop-blur flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.6)]">
                                            <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                                        </div>
                                    </div>

                                    {/* Student Info */}
                                    <div className="absolute bottom-0 left-0 w-full p-5 text-left">
                                        <h3 className="text-lg font-bold text-white leading-tight">{testimonial.studentName}</h3>
                                        <p className="text-emerald-400 text-sm font-medium mt-1">{testimonial.roleOrCourse}</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
