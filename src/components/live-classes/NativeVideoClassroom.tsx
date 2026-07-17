"use client";

import { useEffect, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  Chat,
  GridLayout,
  ParticipantTile,
  useTracks,
  LayoutContextProvider,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles";
import { useAuth } from "@/components/auth/session-provider";
import { Loader2, PenTool, X, Info, MessageSquare, LayoutTemplate, Users } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Excalidraw to prevent SSR issues
const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  { ssr: false }
);

interface NativeVideoClassroomProps {
  roomName: string;
  isTeacher: boolean;
}

// Custom classroom layout utilizing LiveKit components natively
function ClassroomLayout({ isTeacher, showWhiteboard, setShowWhiteboard }: any) {
  // Fetch all camera and screenshare tracks
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div className="flex w-full h-full bg-[#0a0a0a]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Webory Branding Header */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20 pointer-events-none bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <span className="text-white font-semibold drop-shadow-md">Webory Live Class</span>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              LIVE
            </span>
          </div>
        </div>

        <div className="flex-1 relative w-full h-full flex items-center justify-center bg-[#0a0a0a]">
          {showWhiteboard ? (
            <div className="absolute inset-0 bg-white z-10 flex flex-col rounded-tl-lg overflow-hidden border-t border-l border-white/10">
              <div className="h-10 w-full bg-blue-50 text-blue-800 text-xs px-4 flex items-center justify-between border-b border-blue-200 shrink-0">
                <div className="flex items-center gap-2 font-medium">
                  <Info size={14} className="text-blue-600" />
                  <span>Share your screen (using the control bar below) to broadcast this whiteboard to students.</span>
                </div>
                {isTeacher && (
                  <button 
                    onClick={() => setShowWhiteboard(false)} 
                    className="px-3 py-1 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 rounded-md shadow-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    <X size={14} /> Close Whiteboard
                  </button>
                )}
              </div>
              <div className="flex-grow w-full relative">
                <Excalidraw 
                  theme="light"
                  viewModeEnabled={false}
                  zenModeEnabled={false}
                  gridModeEnabled={false}
                  UIOptions={{
                    canvasActions: {
                      loadScene: false,
                      export: { saveFileToDisk: true },
                      saveAsImage: true
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full p-4 pb-0 pt-16">
              <GridLayout tracks={tracks} style={{ height: '100%', width: '100%' }}>
                <ParticipantTile />
              </GridLayout>
            </div>
          )}
        </div>
        
        {/* Control Bar Area */}
        <div className="h-20 bg-[#111] border-t border-white/5 flex items-center justify-center px-4 relative shrink-0">
          <ControlBar />
          
          {isTeacher && (
            <button 
              onClick={() => setShowWhiteboard(!showWhiteboard)}
              className={`absolute left-6 flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                showWhiteboard 
                  ? 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]'
              }`}
            >
              {showWhiteboard ? <LayoutTemplate size={18} /> : <PenTool size={18} />}
              {showWhiteboard ? 'Switch to Video' : 'Open Whiteboard'}
            </button>
          )}
        </div>
      </div>
      
      {/* Right Sidebar - Chat & Participants */}
      <div className="w-[340px] hidden md:flex flex-col bg-[#111] border-l border-white/5 relative z-20 shadow-2xl">
        <div className="h-16 border-b border-white/5 flex items-center px-6 shrink-0 bg-gradient-to-r from-[#1a1a1a] to-[#111]">
          <MessageSquare size={18} className="text-indigo-400 mr-3" />
          <h3 className="text-white font-medium tracking-wide">Class Discussion</h3>
        </div>
        <div className="flex-1 relative livekit-custom-chat-wrapper">
           <Chat />
        </div>
      </div>
    </div>
  );
}

export default function NativeVideoClassroom({
  roomName,
  isTeacher,
}: NativeVideoClassroomProps) {
  const { user, loading: authLoading } = useAuth();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const fetchToken = async () => {
      try {
        let url = `/api/livekit/token?room=${roomName}&isHost=${isTeacher}`;
        
        if (!user && !isTeacher) {
          const guestName = prompt("Please enter your name to join the class:");
          if (!guestName) {
            setError("Name is required to join.");
            return;
          }
          url += `&username=${encodeURIComponent(guestName)}`;
        }

        const resp = await fetch(url);
        if (!resp.ok) {
          throw new Error("Failed to get token");
        }
        const data = await resp.json();
        setToken(data.token);
      } catch (e: any) {
        console.error(e);
        setError("Error connecting to the live class.");
      }
    };

    fetchToken();
  }, [roomName, isTeacher, authLoading, user]);

  if (authLoading || (!token && !error)) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[600px] bg-black/50 rounded-2xl border border-white/10 backdrop-blur-sm">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <h3 className="text-xl font-bold text-white tracking-wide">Connecting to Webory Live...</h3>
        <p className="text-gray-400 mt-2">Setting up secure high-definition video connection</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[600px] bg-black/50 rounded-2xl border border-red-500/30 backdrop-blur-sm">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-red-400 mb-2">Connection Failed</h3>
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-140px)] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/10 relative">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        style={{ height: "100%", width: "100%" }}
        connect={true}
      >
        <LayoutContextProvider>
          <ClassroomLayout 
            isTeacher={isTeacher} 
            showWhiteboard={showWhiteboard} 
            setShowWhiteboard={setShowWhiteboard} 
          />
        </LayoutContextProvider>
        
        {/* Renders audio from other participants automatically */}
        <RoomAudioRenderer />
      </LiveKitRoom>
      
      {/* We need some minor global overrides to ensure the LiveKit Chat takes the full height of our custom sidebar */}
      <style dangerouslySetInnerHTML={{__html: `
        .livekit-custom-chat-wrapper .lk-chat {
          height: 100% !important;
          max-height: 100% !important;
          width: 100% !important;
          border: none !important;
          background: transparent !important;
          border-radius: 0 !important;
        }
        .livekit-custom-chat-wrapper .lk-chat-messages {
          padding: 1rem !important;
        }
      `}} />
    </div>
  );
}
