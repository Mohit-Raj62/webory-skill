"use client";

import { useEffect, useState, use } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useRouter } from "next/navigation";
import PremiumLiveClassroom from "@/components/live-classes/PremiumLiveClassroom";

export default function StudentLivePage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const router = useRouter();
  const [token, setToken] = useState("");
  const [name, setName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      // Connect to Next.js backend to get token
      const res = await fetch(`/api/livekit/token?room=${roomId}&username=${encodeURIComponent(name)}`);

      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setHasJoined(true);
      } else {
        alert("Failed to get token");
      }
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white p-4">
        <div className="bg-slate-900/40 border border-white/10 p-8 rounded-2xl max-w-md w-full backdrop-blur-xl">
          <h1 className="text-2xl font-black mb-2 tracking-tight">Join Live Class</h1>
          <p className="text-slate-400 mb-6 text-sm">Enter your name to join the session. No account required.</p>
          
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                placeholder="John Doe"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest text-xs py-3.5 rounded-xl transition-all"
            >
              Join Session
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={false}
      audio={false}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880"}
      connect={true}
      data-lk-theme="default"
      style={{ height: "100vh", width: "100vw", overflow: "hidden" }}
      onDisconnected={() => console.log("LiveKit disconnected!")}
    >
      <PremiumLiveClassroom 
        roomName={roomId} 
        isHost={false} 
        onEndClass={() => router.push("/")} 
      />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
