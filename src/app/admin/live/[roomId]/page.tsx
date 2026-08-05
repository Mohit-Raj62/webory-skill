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

export default function AdminLiveRoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = use(params);
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(`/api/livekit/token?room=${roomId}&isHost=true`);

        const data = await res.json();
        if (data.token) {
          setToken(data.token);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
  }, [roomId]);

  const handleEndClass = async () => {
    if (!confirm("Are you sure you want to end this live class for everyone?")) return;
    
    try {
      // Send end request to backend
      await fetch("/api/live/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      router.push("/admin/live");
    } catch (error) {
      console.error("Error ending class", error);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-bold">Initializing Live Room...</h2>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
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
        isHost={true} 
        onEndClass={handleEndClass} 
      />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
