"use client";

import { useEffect, useState, useRef, use } from "react";
import ShakaPlayer from "shaka-player-react";
import "shaka-player-react/dist/controls.css";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function RecordedCoursePlayer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const playerRef = useRef<any>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you would fetch the course modules and videos from the database
    // For this example, we'll simulate fetching an HLS URL that was processed by our FFmpeg backend
    
    const fetchVideo = async () => {
      // Mock API call to get the video URL
      // const res = await fetch(`/api/courses/${courseId}/videos/1`);
      // const data = await res.json();
      // setVideoUrl(data.hlsUrl);
      
      // Simulating a processed HLS URL from Cloudflare R2
      setVideoUrl("https://videos.webory.in/hls/mock-id/index.m3u8");
    };

    fetchVideo();
  }, [id]);

  useEffect(() => {
    if (playerRef.current && videoUrl) {
      const player = playerRef.current.getPlatform(); // get shaka-player instance
      
      // Configure buffer optimization
      player.configure({
        streaming: {
          bufferingGoal: 30, // 30 seconds of buffer
          rebufferingGoal: 2, 
          bufferBehind: 30,
        }
      });
    }
  }, [videoUrl]);

  if (!videoUrl) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        Loading Course Video...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Course
        </button>
        
        <h1 className="text-3xl font-black mb-6 tracking-tight">Understanding React Server Components</h1>
        
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 aspect-video relative">
          <ShakaPlayer
            ref={playerRef}
            src={videoUrl}
            autoPlay={false}
            className="w-full h-full"
            chromeless={false}
          />
        </div>
        
        <div className="mt-8 bg-slate-900/40 border border-white/5 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-2">Lesson Resources</h2>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer">📄 Slides.pdf</li>
            <li className="flex items-center gap-2 hover:text-blue-400 cursor-pointer">💻 SourceCode.zip</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
