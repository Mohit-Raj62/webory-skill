"use client";

import { useEffect, useState, use } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { VideoPresets } from "livekit-client";
import { useRouter } from "next/navigation";
import PremiumLiveClassroom from "@/components/live-classes/PremiumLiveClassroom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function StudentLivePage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const router = useRouter();
  const [token, setToken] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const inviteCode = urlParams.get("inviteCode");
        const queryParams = inviteCode ? `&inviteCode=${inviteCode}` : "";
        
        // Automatically request token using the logged-in user's credentials
        const res = await fetch(`/api/livekit/token?room=${roomId}${queryParams}`);
        const data = await res.json();
        
        if (res.ok && data.token) {
          setToken(data.token);
        } else {
          setErrorMsg(data.error || "Failed to authorize. You might not have access to this class.");
        }
      } catch (error) {
        console.error("Error joining room:", error);
        setErrorMsg("Network error while joining the session.");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white p-4">
         <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
         <p className="text-emerald-400 font-bold tracking-widest uppercase text-sm animate-pulse">Authenticating...</p>
      </div>
    );
  }

  if (errorMsg || !token) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white p-4">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-md w-full backdrop-blur-xl text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
             <ShieldAlert size={32} />
          </div>
          <h1 className="text-2xl font-black mb-2 tracking-tight text-white">Access Denied</h1>
          <p className="text-red-300/80 mb-8 text-sm">{errorMsg}</p>
          
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest text-xs py-6 rounded-xl transition-all"
          >
            Return to Dashboard
          </Button>
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
      options={{
        videoCaptureDefaults: {
          resolution: VideoPresets.h1440.resolution,
        },
        publishDefaults: {
          videoSimulcast: false, // Disable simulcast to force max quality on local testing
        },
        adaptiveStream: false, // Force max quality delivery to clients
        dynacast: false
      }}
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
