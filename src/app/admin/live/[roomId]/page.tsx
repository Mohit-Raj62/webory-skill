"use client";

import { useEffect, useState, use } from "react";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useRouter } from "next/navigation";

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
        Initializing Live Room...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-[#020617]">
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={handleEndClass}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors shadow-lg"
        >
          End Class for All
        </button>
      </div>

      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || "ws://localhost:7880"}
        connect={true}
        data-lk-theme="default"
        style={{ height: "100%" }}
        onDisconnected={() => console.log("LiveKit disconnected!")}
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
