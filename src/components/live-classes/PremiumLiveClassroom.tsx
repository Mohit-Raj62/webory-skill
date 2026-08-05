"use client";

import React, { useState, useEffect, useRef } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
  { ssr: false }
);
import "@excalidraw/excalidraw/index.css";
import {
  useTracks,
  ControlBar,
  Chat,
  useRoomContext,
  LayoutContextProvider,
  FocusLayout,
  useParticipants,
  useLocalParticipant,
  ParticipantTile,
  VideoTrack,
  AudioTrack,
  useChat,
  useTrackToggle,
  useIsSpeaking,
} from "@livekit/components-react";
import { Track, RoomEvent } from "livekit-client";
import { 
  PhoneOff, 
  MessageSquare, 
  Clock, 
  ShieldAlert, 
  X,
  Wifi,
  Users,
  Hand,
  MoreVertical,
  MicOff,
  VideoOff,
  UserMinus,
  Ban,
  BarChart2,
  Mic,
  Video,
  Bot,
  MoreHorizontal,
  MonitorUp,
  Maximize,
  Minimize,
  Smile,
  Focus,
  PenTool,
  PictureInPicture,
  Sparkles
} from "lucide-react";

interface PremiumLiveClassroomProps {
  roomName: string;
  isHost: boolean;
  onEndClass: () => void;
  title?: string;
  instructor?: string;
}

// Custom Participant Tile to guarantee video fills the box and name always shows
function CustomParticipantTile({ 
  trackRef, 
  onClick, 
  isHost,
  onModerate,
  handRaised,
  fullScreenMobile,
  objectFit
}: { 
  trackRef: any; 
  onClick?: () => void;
  isHost?: boolean;
  onModerate?: (action: 'mute_mic' | 'unmute_mic' | 'disable_camera' | 'enable_camera' | 'remove' | 'block', identity: string) => void;
  handRaised?: boolean;
  fullScreenMobile?: boolean;
  objectFit?: 'cover' | 'contain';
}) {
  const { participant } = trackRef;
  
  const hasVideo = participant.isCameraEnabled;
  const isMicrophoneEnabled = participant.isMicrophoneEnabled;
  const name = participant.name || participant.identity || "Student";
  const initial = name.charAt(0).toUpperCase();

  const isSpeaking = useIsSpeaking(participant);
  const [isFit, setIsFit] = useState(objectFit === 'contain');

  // Update internal state if prop changes (e.g. switching from main stage to side tile)
  useEffect(() => {
    setIsFit(objectFit === 'contain');
  }, [objectFit]);

  return (
    <div 
      onClick={(e) => {
        // Prevent click if clicking the menu
        if ((e.target as HTMLElement).closest('.moderation-menu')) return;
        onClick?.();
      }}
      onDoubleClick={() => setIsFit(!isFit)}
      className={`relative w-full h-full group ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Background Media Container with rounded corners */}
      <div className={`absolute inset-0 w-full h-full bg-slate-800 ${fullScreenMobile ? 'md:rounded-xl rounded-none md:border md:shadow-lg' : 'rounded-xl shadow-lg border border-white/10'} overflow-hidden transition-all duration-300 ${isSpeaking ? 'ring-2 ring-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] scale-[1.02]' : (onClick ? 'group-hover:ring-2 group-hover:ring-blue-500/50' : '')}`}>
        <style>{`
          .custom-fit-contain video { object-fit: contain !important; width: 100% !important; height: 100% !important; }
          .custom-fit-cover video { object-fit: cover !important; width: 100% !important; height: 100% !important; }
        `}</style>
        {hasVideo && trackRef.publication ? (
          <VideoTrack 
            trackRef={trackRef as any} 
            className={`absolute inset-0 w-full h-full transition-all duration-300 ${isFit ? 'custom-fit-contain' : 'custom-fit-cover'}`} 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center shadow-inner bg-slate-800">
            <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-white/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-white/50">{initial}</span>
            </div>
          </div>
        )}
        
        {/* Toggle Scale Button (YouTube like) */}
        {hasVideo && (
           <button 
             onClick={(e) => { e.stopPropagation(); setIsFit(!isFit); }}
             className="absolute top-4 right-4 z-20 p-2 bg-black/40 backdrop-blur-md rounded-lg text-white/70 hover:text-white hover:bg-black/60 transition-colors pointer-events-auto"
             title={isFit ? "Fill Screen" : "Fit to Screen"}
           >
             {isFit ? <Maximize size={16} /> : <Minimize size={16} />}
           </button>
        )}
      </div>
      
      {/* Name Overlay and Controls (Placed outside the overflow-hidden box!) */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="bg-black/40 backdrop-blur-xl px-4 py-1.5 rounded-full text-xs font-medium text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] truncate max-w-[70%] border border-white/20 flex items-center gap-2 pointer-events-auto transition-all hover:bg-black/50">
          {handRaised && <span className="text-yellow-400 animate-bounce">✋</span>}
          {name}
        </div>
        
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {!isMicrophoneEnabled && (
            <div className="bg-red-500/80 backdrop-blur-xl p-1.5 rounded-full text-white shadow-[0_0_10px_rgba(239,68,68,0.5)] border border-red-400/30">
               <PhoneOff size={14} />
            </div>
          )}

          {/* Moderation Menu (Only for host on other users) */}
          {isHost && !participant.isLocal && (
            <div className="relative moderation-menu pointer-events-auto">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="bg-black/40 hover:bg-white/20 backdrop-blur-xl p-1.5 rounded-full text-white shadow-lg border border-white/20 transition-all">
                    <MoreVertical size={14} />
                  </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                  <DropdownMenu.Content 
                    className="w-40 bg-slate-800 border border-white/10 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden py-1 z-50 animate-in fade-in zoom-in duration-200" 
                    sideOffset={5}
                    align="end"
                  >
                  {isMicrophoneEnabled ? (
                    <DropdownMenu.Item onClick={() => onModerate?.('mute_mic', participant.identity)} className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center gap-2 text-white cursor-pointer outline-none"><MicOff size={12}/> Mute Mic</DropdownMenu.Item>
                  ) : (
                    <DropdownMenu.Item onClick={() => onModerate?.('unmute_mic', participant.identity)} className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center gap-2 text-white cursor-pointer outline-none"><Mic size={12}/> Unmute Mic</DropdownMenu.Item>
                  )}
                  
                  <DropdownMenu.Separator className="h-px bg-white/10 my-1" />
                  
                  {hasVideo ? (
                    <DropdownMenu.Item onClick={() => onModerate?.('disable_camera', participant.identity)} className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center gap-2 text-white cursor-pointer outline-none"><VideoOff size={12}/> Turn Off Camera</DropdownMenu.Item>
                  ) : (
                    <DropdownMenu.Item onClick={() => onModerate?.('enable_camera', participant.identity)} className="w-full text-left px-3 py-2 text-xs hover:bg-white/10 flex items-center gap-2 text-white cursor-pointer outline-none"><Video size={12}/> Turn On Camera</DropdownMenu.Item>
                  )}
                  <DropdownMenu.Separator className="h-px bg-white/10 my-1" />
                    <DropdownMenu.Item onClick={() => onModerate?.('remove', participant.identity)} className="w-full text-left px-3 py-2 text-xs hover:bg-red-500/20 flex items-center gap-2 text-red-400 cursor-pointer outline-none"><UserMinus size={12}/> Remove</DropdownMenu.Item>
                    <DropdownMenu.Item onClick={() => onModerate?.('block', participant.identity)} className="w-full text-left px-3 py-2 text-xs hover:bg-red-500/20 flex items-center gap-2 text-red-400 font-bold cursor-pointer outline-none"><Ban size={12}/> Block</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CustomMicButton() {
  const { toggle, enabled } = useTrackToggle({ source: Track.Source.Microphone });
  
  const handleToggle = async () => {
    try {
      await toggle();
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Microphone permission denied or device not found.");
    }
  };

  return (
    <button onClick={handleToggle} className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all active:scale-95 flex flex-col items-center justify-center gap-1 ${enabled ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] border border-red-400 hover:shadow-[0_0_25px_rgba(239,68,68,0.8)]'}`}>
      {enabled ? <Mic size={20} /> : <MicOff size={20} />}
    </button>
  );
}

function CustomCameraButton() {
  const { toggle, enabled } = useTrackToggle({ source: Track.Source.Camera });

  const handleToggle = async () => {
    try {
      await toggle();
    } catch (err) {
      console.error("Camera error:", err);
      alert("Camera permission denied or device not found.");
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button onClick={handleToggle} className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all active:scale-95 flex flex-col items-center justify-center gap-1 ${enabled ? 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] border border-red-400 hover:shadow-[0_0_25px_rgba(239,68,68,0.8)]'}`}>
        {enabled ? <Video size={20} /> : <VideoOff size={20} />}
      </button>
    </div>
  );
}

function CustomScreenShareButton() {
  const { toggle, enabled } = useTrackToggle({ source: Track.Source.ScreenShare });

  const handleToggle = async () => {
    try {
      await toggle();
    } catch (err) {
      console.error("ScreenShare error:", err);
      alert("Screen sharing permission denied or not supported.");
    }
  };

  return (
    <button onClick={handleToggle} className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all active:scale-95 flex flex-col items-center justify-center gap-1 ${enabled ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] border border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}>
      <MonitorUp size={20} />
    </button>
  );
}

function CustomChat() {
  const { send, chatMessages } = useChat();
  const [input, setInput] = useState("");
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      send(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900/50">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {chatMessages.map((msg) => {
          const isLocal = msg.from?.isLocal;
          const name = msg.from?.name || msg.from?.identity || "User";
          const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          return (
            <div key={msg.id} className={`flex flex-col max-w-[85%] ${isLocal ? 'self-end items-end' : 'self-start items-start'}`}>
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[10px] font-medium text-white/50">{name}</span>
                <span className="text-[9px] text-white/30">{time}</span>
              </div>
              <div className={`px-3 py-2 rounded-2xl text-sm shadow-md ${
                isLocal 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-slate-800 text-gray-200 border border-white/10 rounded-tl-sm'
              }`}>
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>
      
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-slate-900/80 shrink-0">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Type a message..."
            className="w-full bg-slate-800/80 backdrop-blur-sm border border-white/10 rounded-full pl-4 pr-10 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors shadow-inner"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="absolute right-1.5 p-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-700 disabled:text-gray-500 text-white rounded-full transition-colors flex items-center justify-center"
          >
            <MessageSquare size={14} className="ml-[-1px] mt-[1px]" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default function PremiumLiveClassroom({ roomName, isHost, onEndClass, title, instructor }: PremiumLiveClassroomProps) {
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isMobileFullScreen, setIsMobileFullScreen] = useState(false);
  const [showPollsPanel, setShowPollsPanel] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [pinnedTrackIdentity, setPinnedTrackIdentity] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [connectionQuality, setConnectionQuality] = useState<"excellent" | "good" | "poor">("excellent");
  
  // Hand Raise State
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [raisedHands, setRaisedHands] = useState<Set<string>>(new Set());

  // Poll State
  type Poll = {
    id: string;
    question: string;
    options: string[];
    votes: Record<number, number>;
    isActive: boolean;
    hasVoted: boolean;
  };
  const [polls, setPolls] = useState<Poll[]>([]);
  const [activePollId, setActivePollId] = useState<string | null>(null);
  const [pollWidgetPos, setPollWidgetPos] = useState({ x: 0, y: 0 });
  const [isDraggingPoll, setIsDraggingPoll] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollForm, setPollForm] = useState({ question: '', options: ['', ''] });
  
  const activePoll = polls.find(p => p.id === activePollId);
  
  const room = useRoomContext();
  const allParticipants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  
  // AI Auto-Reply State
  const [isAutoReplyEnabled, setIsAutoReplyEnabled] = useState(false);
  const [processedMessages, setProcessedMessages] = useState<Set<string>>(new Set());
  const { send: sendChat, chatMessages } = useChat();

  // Premium Features State
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
  
  // Excalidraw State
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const lastWhiteboardSync = useRef<number>(0);
  const [reactions, setReactions] = useState<{ id: number, emoji: string, x: number }[]>([]);
  const [isBlurEnabled, setIsBlurEnabled] = useState(false);
  const videoStageRef = useRef<HTMLDivElement>(null);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor connection quality
  useEffect(() => {
    if (!room) return;
    
    const handleConnectionQuality = (quality: any) => {
      if (quality === 0) setConnectionQuality("excellent");
      else if (quality === 1) setConnectionQuality("good");
      else setConnectionQuality("poor");
    };

    room.on(RoomEvent.ConnectionQualityChanged, handleConnectionQuality);
    return () => {
      room.off(RoomEvent.ConnectionQualityChanged, handleConnectionQuality);
    };
  }, [room]);

  // Listen for Data Channel Messages (Moderation & Hand Raises)
  useEffect(() => {
    if (!room || !localParticipant) return;
    
    const handleDataReceived = (payload: Uint8Array, participant: any) => {
      try {
        const data = JSON.parse(new TextDecoder().decode(payload));
        const senderIdentity = participant?.identity;
        
        if (data.action === 'MUTE_MIC' && data.target === localParticipant.identity) {
          localParticipant.setMicrophoneEnabled(false);
        } else if (data.action === 'UNMUTE_MIC' && data.target === localParticipant.identity) {
          // If requested to unmute, we can enable it (browser policies permitting)
          localParticipant.setMicrophoneEnabled(true);
        } else if (data.action === 'DISABLE_CAMERA' && data.target === localParticipant.identity) {
          localParticipant.setCameraEnabled(false);
        } else if (data.action === 'ENABLE_CAMERA' && data.target === localParticipant.identity) {
          localParticipant.setCameraEnabled(true);
        } else if (data.action === 'RAISE_HAND') {
           setRaisedHands(prev => { const next = new Set(prev); next.add(senderIdentity); return next; });
        } else if (data.action === 'LOWER_HAND') {
           setRaisedHands(prev => { const next = new Set(prev); next.delete(senderIdentity); return next; });
        } else if (data.action === 'REACTION') {
           // Show floating emoji
           const newReaction = { id: Date.now(), emoji: data.emoji, x: Math.random() * 80 + 10 };
           setReactions(prev => [...prev, newReaction]);
           setTimeout(() => {
             setReactions(prev => prev.filter(r => r.id !== newReaction.id));
           }, 3000);
        } else if (data.action === 'WHITEBOARD_TOGGLE') {
           setIsWhiteboardActive(data.isActive);
        } else if (data.action === 'POLL_START') {
           const newPoll = {
             id: data.id,
             question: data.question,
             options: data.options,
             votes: {},
             isActive: true,
             hasVoted: false
           };
           setPolls(prev => [...prev, newPoll]);
           setActivePollId(data.id);
        } else if (data.action === 'POLL_VOTE') {
           setPolls(prev => prev.map(p => {
             if (p.id !== data.id) return p;
             const newVotes = { ...p.votes };
             newVotes[data.optionIndex] = (newVotes[data.optionIndex] || 0) + 1;
             return { ...p, votes: newVotes };
           }));
        } else if (data.action === 'POLL_END') {
           setPolls(prev => prev.map(p => p.id === data.id ? { ...p, isActive: false } : p));
        } else if (data.action === 'WHITEBOARD_SYNC') {
           if (excalidrawAPI) {
             excalidrawAPI.updateScene({ elements: data.elements });
           }
        }
      } catch (e) {
        console.error("Data received error", e);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room, localParticipant]);

  // AI Auto-Reply Effect
  useEffect(() => {
    if (!isAutoReplyEnabled || !isHost) return;
    
    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage && !lastMessage.from?.isLocal && !processedMessages.has(lastMessage.id)) {
      setProcessedMessages(prev => new Set(prev).add(lastMessage.id));
      
      const generateAndSendAIReply = async () => {
         try {
           const res = await fetch('/api/ai-chat', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ message: lastMessage.message })
           });
           const data = await res.json();
           if (data.reply) {
             sendChat(data.reply);
           }
         } catch (e) {
           console.error("AI Reply failed", e);
         }
      };
      
      generateAndSendAIReply();
    }
  }, [chatMessages, isAutoReplyEnabled, isHost, sendChat, processedMessages]);

  // Moderation Handler
  const handleModerate = async (action: 'mute_mic' | 'unmute_mic' | 'disable_camera' | 'enable_camera' | 'remove' | 'block', identity: string) => {
    if (['mute_mic', 'unmute_mic', 'disable_camera', 'enable_camera'].includes(action)) {
      const msg = JSON.stringify({ action: action.toUpperCase(), target: identity });
      try {
        await localParticipant.publishData(new TextEncoder().encode(msg), { reliable: true, topic: 'moderation' });
      } catch (e) { console.error(e) }
    } else {
      try {
        await fetch('/api/livekit/moderate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, room: roomName, identity })
        });
      } catch (e) {
        console.error("Moderation failed", e);
      }
    }
  };

  // Toggle Hand Raise
  const toggleHandRaise = async () => {
    if (!localParticipant) return;
    const newState = !isHandRaised;
    setIsHandRaised(newState);
    const msg = JSON.stringify({ action: newState ? 'RAISE_HAND' : 'LOWER_HAND' });
    try {
      await localParticipant.publishData(new TextEncoder().encode(msg), { reliable: true });
    } catch(e) { console.error(e) }
    
    // Update local state immediately
    if (newState) {
      setRaisedHands(prev => { const next = new Set(prev); next.add(localParticipant.identity); return next; });
    } else {
      setRaisedHands(prev => { const next = new Set(prev); next.delete(localParticipant.identity); return next; });
    }
  };

  const sendReaction = (emoji: string) => {
    if (!localParticipant) return;
    
    // Show locally
    const newReaction = { id: Date.now(), emoji, x: Math.random() * 80 + 10 };
    setReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 3000);

    // Broadcast
    const payload = JSON.stringify({ action: 'REACTION', emoji });
    localParticipant.publishData(new TextEncoder().encode(payload), { reliable: false });
  };

  const toggleWhiteboard = () => {
    if (!localParticipant || !isHost) return;
    const newState = !isWhiteboardActive;
    setIsWhiteboardActive(newState);
    
    const payload = JSON.stringify({ action: 'WHITEBOARD_TOGGLE', isActive: newState });
    localParticipant.publishData(new TextEncoder().encode(payload), { reliable: true });
  };

  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoStageRef.current) {
        const videoElement = videoStageRef.current.querySelector('video');
        if (videoElement) {
          await videoElement.requestPictureInPicture();
        } else {
          console.warn("No video element found for PiP");
        }
      }
    } catch (error) {
      console.error("PiP failed", error);
    }
  };

  // Poll Handlers
  const startPoll = async () => {
    const validOptions = pollForm.options.filter(o => o.trim() !== '');
    if (!pollForm.question || validOptions.length < 2) return;
    
    const id = Date.now().toString();
    const newPoll = { id, question: pollForm.question, options: validOptions, votes: {}, isActive: true, hasVoted: true };
    setPolls(prev => [...prev, newPoll]);
    setActivePollId(id);
    
    // Close the modal immediately so UI is responsive
    setShowPollCreator(false);
    setShowPollsPanel(false);
    setPollForm({ question: '', options: ['', ''] }); // reset
    setPollWidgetPos({ x: 0, y: 0 });
    
    const msg = JSON.stringify({ action: 'POLL_START', id, question: pollForm.question, options: validOptions });
    try {
      await localParticipant.publishData(new TextEncoder().encode(msg), { reliable: true, topic: 'poll' });
    } catch (e) {
      console.error("Failed to start poll:", e);
    }
  };

  const submitVote = async (pollId: string, optionIndex: number) => {
    const pollToVote = polls.find(p => p.id === pollId);
    if (!pollToVote || pollToVote.hasVoted) return;
    
    setPolls(prev => prev.map(p => {
       if (p.id !== pollId) return p;
       const v = {...p.votes};
       v[optionIndex] = (v[optionIndex] || 0) + 1;
       return { ...p, hasVoted: true, votes: v };
    }));
    
    const msg = JSON.stringify({ action: 'POLL_VOTE', id: pollId, optionIndex });
    try {
      await localParticipant.publishData(new TextEncoder().encode(msg), { reliable: true, topic: 'poll' });
    } catch(e) { console.error(e) }
  };

  const endPoll = async (pollId: string) => {
    setPolls(prev => prev.map(p => p.id === pollId ? { ...p, isActive: false } : p));
    const msg = JSON.stringify({ action: 'POLL_END', id: pollId });
    try {
      await localParticipant.publishData(new TextEncoder().encode(msg), { reliable: true, topic: 'poll' });
    } catch(e) { console.error(e) }
  };

  // Fetch all camera and screenshare tracks
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  // Identify Host and Screenshare for Focus
  const screenShareTrack = tracks.find(t => t.source === Track.Source.ScreenShare);
  
  // The host track is either the local user (if they are the host) OR a participant whose identity is not "guest_"
  const hostTrack = tracks.find(t => {
      if (isHost && t.participant.isLocal) return true;
      return !t.participant.identity.startsWith('guest_');
  });

  // Main track is screenshare, if not then pinned user, if not then host, if not then first person
  const mainTrack = screenShareTrack || (pinnedTrackIdentity ? tracks.find(t => t.participant.identity === pinnedTrackIdentity) : null) || hostTrack || tracks[0];
  const isMainScreenShare = mainTrack?.source === Track.Source.ScreenShare;
  
  // Side tracks are everyone else
  const sideTracks = tracks.filter(t => t.participant.identity !== mainTrack?.participant.identity);

  return (
    <div className="relative flex w-full h-[100dvh] bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* Ambient Grain Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      
      {/* Ambient Glowing Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Floating Emojis Container */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 pointer-events-none z-50 w-full max-w-2xl h-64 overflow-hidden">
        <AnimatePresence>
          {reactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 1, y: 100, x: `${r.x}%`, scale: 0.5 }}
              animate={{ opacity: 0, y: -200, x: `${r.x + (Math.random() * 20 - 10)}%`, scale: 1.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="absolute bottom-0 text-4xl sm:text-5xl drop-shadow-xl"
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isFocusMode && (
        <button 
          onClick={() => setIsFocusMode(false)}
          className="absolute top-6 right-6 z-50 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white font-medium text-sm shadow-2xl hover:bg-white/20 transition-all pointer-events-auto flex items-center gap-2 animate-in fade-in"
        >
          <Focus size={16} /> Exit Focus Mode
        </button>
      )}

      <LayoutContextProvider>
        {/* Main Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col relative transition-all duration-300 z-10"
        >
          
          {/* Top Header / Status Bar */}
          <div className={`absolute top-0 left-0 w-full p-4 sm:p-6 flex justify-between items-start z-20 transition-all duration-500 pointer-events-none bg-gradient-to-b from-black/80 to-transparent ${isFocusMode ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'}`}>
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2 bg-red-500/10 backdrop-blur-xl px-4 py-1.5 rounded-full border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)] pointer-events-auto">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <span className="text-white font-bold text-xs tracking-widest uppercase">Live</span>
              </div>
              
              <div className="bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/20 shadow-lg pointer-events-auto hidden sm:block">
                <span className="text-white font-medium text-sm truncate max-w-[200px] inline-block align-bottom">{title || "Live Session"}</span>
              </div>

              {isHost && (
                <div className="hidden md:flex items-center text-blue-300 bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 px-4 py-1.5 rounded-full text-xs font-bold shadow-[0_0_15px_rgba(59,130,246,0.2)] pointer-events-auto">
                  <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
                  Host
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pointer-events-auto">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                <Wifi className={`w-4 h-4 ${
                  connectionQuality === 'excellent' ? 'text-emerald-400' : 
                  connectionQuality === 'good' ? 'text-yellow-400' : 'text-red-400'
                }`} />
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full border border-white/20 shadow-lg text-sm font-semibold text-white">
                <Clock className="w-4 h-4 text-blue-300" />
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Video Area (YouTube Style on Mobile) */}
          <div className={`w-full relative flex transition-all duration-300 ${
            isMobileFullScreen
              ? 'fixed inset-0 z-10 bg-black h-[100dvh]' // Full screen but keeps z-10 so controls (z-30) float on top!
              : 'aspect-video w-full shrink-0 md:aspect-auto md:flex-1 md:h-full mt-20 md:mt-0' // Fixed at top for mobile (16:9), edge-to-edge for desktop
          }`}>
            {/* Center Stage (Host or Whiteboard) */}
            <div className={`flex-1 relative p-0`} ref={videoStageRef}>
              {isWhiteboardActive ? (
                 <div className="absolute inset-0 z-10 flex items-center justify-center p-2 sm:p-4 md:p-8 bg-black/40 backdrop-blur-sm pointer-events-auto">
                   <div className="w-[98vw] md:w-[92vw] lg:w-[85vw] max-w-7xl h-[88vh] md:h-[82vh] bg-white rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex flex-col border border-white/20">
                     <style>{`
                       .excalidraw-wrapper * {
                         box-sizing: border-box;
                       }
                       .excalidraw-wrapper svg {
                         display: revert !important;
                         vertical-align: revert !important;
                         max-width: none !important;
                         height: auto !important;
                       }
                     `}</style>
                     
                     <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-white/10 shrink-0">
                       <span className="text-white font-medium text-sm flex items-center gap-2">
                         <PenTool size={16} className="text-pink-400" /> Collaborative Whiteboard
                       </span>
                       <button onClick={toggleWhiteboard} className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
                         <X size={18} />
                       </button>
                     </div>
                     
                     <div className="flex-1 relative w-full h-full bg-white excalidraw-wrapper">
                       <Excalidraw 
                         theme="light" 
                         excalidrawAPI={(api) => {
                           if (!excalidrawAPI) setExcalidrawAPI(api);
                         }}
                         onChange={(elements) => {
                           if (!localParticipant) return;
                           const now = Date.now();
                           if (now - lastWhiteboardSync.current > 1000) {
                             lastWhiteboardSync.current = now;
                             const payload = JSON.stringify({ action: 'WHITEBOARD_SYNC', elements });
                             localParticipant.publishData(new TextEncoder().encode(payload), { reliable: false });
                           }
                         }}
                       />
                     </div>
                   </div>
                 </div>
              ) : mainTrack ? (
                <div className={`w-full h-full overflow-hidden bg-black relative group`}>
                  {isMainScreenShare ? (
                     <div className="w-full h-full flex items-center justify-center p-2">
                        <VideoTrack trackRef={mainTrack as any} className="w-full h-full object-contain" />
                     </div>
                  ) : (
                     <CustomParticipantTile 
                       trackRef={mainTrack}
                       isHost={isHost}
                       handRaised={raisedHands.has(mainTrack.participant.identity)}
                       onModerate={handleModerate}
                       fullScreenMobile={isMobileFullScreen}
                       objectFit="contain"
                     />
                  )}
                  {/* Subtle inner glow (Desktop only) */}
                  <div className="hidden md:block absolute inset-0 ring-1 ring-inset ring-white/5 pointer-events-none"></div>
                  
                  {/* PiP Button */}
                  <button 
                    onClick={togglePiP}
                    className="absolute top-4 right-4 md:right-4 z-40 p-2 bg-black/50 backdrop-blur-md rounded-lg text-white/80 hover:text-white transition-all shadow-lg pointer-events-auto opacity-0 group-hover:opacity-100"
                    title="Picture-in-Picture"
                  >
                    <PictureInPicture size={18} />
                  </button>

                  {/* YouTube Style Fullscreen Toggle (Mobile Only) */}
                  <button 
                    onClick={() => setIsMobileFullScreen(!isMobileFullScreen)}
                    className={`md:hidden absolute right-4 z-40 p-2 bg-black/50 backdrop-blur-md rounded-lg text-white/80 hover:text-white transition-all shadow-lg pointer-events-auto ${
                      isMobileFullScreen ? 'top-24' : 'top-4'
                    }`}
                  >
                    {isMobileFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
                  </button>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/40">
                  <div className="w-16 h-16 border-4 border-white/10 border-t-white/40 rounded-full animate-spin mb-4"></div>
                  <p className="font-medium tracking-widest uppercase text-sm">Waiting for participants...</p>
                </div>
              )}
            </div>

            {/* Right Sidebar (Students) - MOVED TO TOGGLEABLE PANEL */}
            {/* Kept empty div for layout structure if needed, or remove completely */}
          </div>
          
          {/* Main Empty Area on Mobile (Premium Info Panel) */}
          <div className="md:hidden flex-1 w-full relative p-4 flex flex-col justify-center items-center">
            {!showChat && !showParticipants && !showPollsPanel && !isMobileFullScreen && (
              <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                {/* Decorative glow effects */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-1 shadow-inner border border-white/10 flex-shrink-0">
                    <div className="w-full h-full bg-slate-900/80 rounded-xl flex items-center justify-center">
                       <img src="/favicon.png" alt="Logo" className="w-12 h-12 object-contain" onError={(e) => {
                         const target = e.currentTarget as HTMLImageElement;
                         target.style.display = 'none';
                         target.parentElement!.innerHTML = '<span class="text-2xl font-bold text-white/50">W</span>';
                       }} />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wide">{title || "Live Course Session"}</h3>
                    <p className="text-blue-400 text-sm mt-1 font-medium">by {instructor || "Expert Instructor"}</p>
                  </div>
                  
                  <div className="flex gap-4 w-full pt-4 border-t border-white/10">
                     <div className="flex-1 text-center">
                       <p className="text-2xl font-semibold text-white">{tracks.length}</p>
                       <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Participants</p>
                     </div>
                     <div className="w-px bg-white/10"></div>
                     <div className="flex-1 text-center">
                       <p className="text-lg font-semibold text-white flex items-center justify-center h-8">{isHost ? 'Host' : 'Student'}</p>
                       <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Your Role</p>
                     </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 pt-2 animate-pulse">Use the controls below to join the conversation.</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Floating Bottom Control Bar */}
          <div className={`absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 w-auto max-w-[95vw] pointer-events-none flex justify-center transition-all duration-500 ${isFocusMode ? 'opacity-0 translate-y-20 hover:opacity-100 hover:translate-y-0' : 'opacity-100 translate-y-0'}`}>
            <div className="pointer-events-auto flex items-center justify-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-2xl border border-white/20 px-4 py-3 sm:px-6 sm:py-4 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              
              <div className="flex items-center gap-2 sm:gap-3">
                <CustomMicButton />
                <CustomCameraButton />
              </div>
              
              <div className="hidden md:block w-px h-10 bg-white/20 mx-1"></div>
              
              {/* Chat Toggle (Always visible) */}
              <button 
                onClick={() => {
                  setShowChat(!showChat);
                  if (!showChat) { setShowParticipants(false); setShowPollsPanel(false); }
                }}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all active:scale-95 flex flex-col items-center justify-center gap-1 ${showChat ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-blue-400' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}
              >
                <MessageSquare size={20} />
              </button>
              
              {/* Participants Toggle (Always visible) */}
              <button 
                onClick={() => {
                  setShowParticipants(!showParticipants);
                  if (!showParticipants) { setShowChat(false); setShowPollsPanel(false); }
                }}
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all active:scale-95 flex flex-col items-center justify-center gap-1 ${showParticipants ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-blue-400' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}
              >
                <Users size={20} />
              </button>
              
              <div className="hidden md:block w-px h-10 bg-white/20 mx-1"></div>

              {/* Emoji Reactions Dropdown */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all active:scale-95 flex flex-col items-center justify-center gap-1 bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <Smile size={20} />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content 
                    className="flex gap-2 p-2 bg-slate-800/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl mb-4" 
                    sideOffset={10}
                    align="center"
                  >
                    {['❤️', '👍', '🎉', '😂', '👏', '🔥'].map(emoji => (
                      <button 
                        key={emoji} 
                        onClick={() => sendReaction(emoji)}
                        className="text-2xl hover:scale-125 transition-transform p-2 cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              {/* Desktop Only Buttons */}
              <div className="hidden md:flex items-center gap-2 sm:gap-3">
                <button 
                  onClick={toggleHandRaise}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all active:scale-95 flex flex-col items-center justify-center gap-1 ${isHandRaised ? 'bg-yellow-500 text-white shadow-[0_0_20px_rgba(234,179,8,0.6)] border border-yellow-400' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}
                >
                  <Hand size={20} />
                </button>

                {isHost && (
                  <button 
                    onClick={() => setIsAutoReplyEnabled(!isAutoReplyEnabled)}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all active:scale-95 flex flex-col items-center justify-center gap-1 ${isAutoReplyEnabled ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.6)] border border-purple-400' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}
                    title={isAutoReplyEnabled ? "AI Assistant Active" : "Enable AI Assistant"}
                  >
                    <Bot size={20} />
                  </button>
                )}

                <button 
                  onClick={() => {
                    setShowPollsPanel(!showPollsPanel);
                    if (!showPollsPanel) { setShowParticipants(false); setShowChat(false); }
                  }}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all active:scale-95 flex flex-col items-center justify-center gap-1 ${showPollsPanel ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-blue-400' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}
                  title="Poll History"
                >
                  <BarChart2 size={20} />
                </button>

                {/* Whiteboard Toggle (Host Only) */}
                {isHost && (
                   <button 
                     onClick={toggleWhiteboard}
                     className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all active:scale-95 flex flex-col items-center justify-center gap-1 ${isWhiteboardActive ? 'bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.6)] border border-pink-400' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}
                     title="Whiteboard"
                   >
                     <PenTool size={20} />
                   </button>
                )}
                
                {/* Focus Mode Toggle */}
                <button 
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all active:scale-95 flex flex-col items-center justify-center gap-1 ${isFocusMode ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.6)] border border-orange-400' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'}`}
                  title="Focus Mode"
                >
                  <Focus size={20} />
                </button>
                
                <CustomScreenShareButton />
              </div>

              {/* Mobile "More" Menu Toggle */}
              <div className="md:hidden relative">
                 <button onClick={() => setShowMoreMenu(!showMoreMenu)} className={`w-11 h-11 rounded-full transition-all flex flex-col items-center justify-center ${showMoreMenu ? 'bg-white/20 text-white' : 'bg-white/10 text-white hover:bg-white/20'} border border-white/10`}>
                   <MoreHorizontal size={20} />
                 </button>
              </div>
              
              <div className="w-px h-10 bg-white/20 mx-1 sm:mx-2"></div>
              
              {/* End Call Button */}
              <button 
                onClick={onEndClass}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center gap-2 whitespace-nowrap border border-red-400/50"
              >
                <PhoneOff size={20} />
                <span className="hidden sm:inline">{isHost ? 'End Class' : 'Leave'}</span>
              </button>
            </div>
            
            {/* Mobile More Menu Popup */}
            {showMoreMenu && (
              <div className="md:hidden absolute bottom-[110%] mb-2 right-12 w-48 bg-slate-800/95 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-2xl z-40 flex flex-col gap-1 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
                <button onClick={() => { toggleHandRaise(); setShowMoreMenu(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-medium text-white transition-colors">
                  <Hand size={16} className={isHandRaised ? 'text-yellow-400' : 'text-gray-400'} /> Raise Hand
                </button>
                <button onClick={() => { setShowPollsPanel(true); setShowParticipants(false); setShowChat(false); setShowMoreMenu(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-medium text-white transition-colors">
                  <BarChart2 size={16} className="text-gray-400" /> Polls
                </button>
                <div className="w-full flex items-center p-1">
                  <CustomScreenShareButton />
                  <span className="ml-2 text-sm font-medium text-white">Share Screen</span>
                </div>
                {isHost && (
                  <button onClick={() => { setIsAutoReplyEnabled(!isAutoReplyEnabled); setShowMoreMenu(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-medium text-white transition-colors">
                    <Bot size={16} className={isAutoReplyEnabled ? 'text-purple-400' : 'text-gray-400'} /> AI Assistant
                  </button>
                )}
                {isHost && (
                  <button onClick={() => { toggleWhiteboard(); setShowMoreMenu(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-medium text-white transition-colors">
                    <PenTool size={16} className={isWhiteboardActive ? 'text-pink-400' : 'text-gray-400'} /> Whiteboard
                  </button>
                )}
                <button onClick={() => { setIsFocusMode(true); setShowMoreMenu(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-medium text-white transition-colors">
                  <Focus size={16} className="text-gray-400" /> Focus Mode
                </button>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Participants Sidebar */}
        <div 
          className={`bg-slate-900/80 backdrop-blur-3xl border-l border-white/10 h-[100dvh] md:h-full flex flex-col transition-all duration-300 ease-out fixed inset-0 md:relative md:inset-auto md:right-0 z-[100] md:z-40 shadow-2xl ${
            showParticipants && !isFocusMode ? 'w-full md:w-[320px] translate-x-0' : 'w-[320px] translate-x-full md:hidden'
          }`}
          style={{ display: showParticipants ? 'flex' : 'none' }}
        >
          <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 shrink-0 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-blue-400" />
              <h3 className="text-white font-bold tracking-wide">Participants</h3>
            </div>
            <button onClick={() => setShowParticipants(false)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 md:hidden">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
            {sideTracks.length > 0 ? (
              <div className="flex flex-col gap-4 w-full">
                {sideTracks.map((track) => (
                  <div key={track.participant.identity} className="w-full aspect-video relative">
                    <CustomParticipantTile 
                      trackRef={track} 
                      isHost={isHost}
                      onModerate={handleModerate}
                      handRaised={raisedHands.has(track.participant.identity)}
                      onClick={() => {
                        // Toggle pin/unpin
                        if (pinnedTrackIdentity === track.participant.identity) {
                          setPinnedTrackIdentity(null);
                        } else {
                          setPinnedTrackIdentity(track.participant.identity);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/30 text-sm text-center">
                <Users size={48} className="mb-3 opacity-20" />
                <p>No other students<br/>have joined yet</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Chat Sidebar */}
        <div 
          className={`bg-slate-900/80 backdrop-blur-3xl border-l border-white/10 h-[100dvh] md:h-full flex flex-col transition-all duration-300 ease-out fixed inset-0 md:relative md:inset-auto md:right-0 z-[100] md:z-40 shadow-2xl ${
            showChat && !isFocusMode ? 'w-full md:w-[360px] translate-x-0' : 'w-[360px] translate-x-full md:hidden'
          }`}
          style={{ display: showChat ? 'flex' : 'none' }}
        >
          <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 shrink-0 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-blue-400" />
              <h3 className="text-white font-bold tracking-wide">Class Chat</h3>
            </div>
            <button onClick={() => setShowChat(false)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 md:hidden pointer-events-auto">
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 relative overflow-hidden flex flex-col pb-safe">
             <CustomChat />
          </div>
        </div>

        {/* Polls History Sidebar */}
        <div 
          className={`bg-slate-900/80 backdrop-blur-3xl border-l border-white/10 h-[100dvh] md:h-full flex flex-col transition-all duration-300 ease-out fixed inset-0 md:relative md:inset-auto md:right-0 z-[100] md:z-40 shadow-2xl ${
            showPollsPanel ? 'w-full md:w-[360px] translate-x-0' : 'w-[360px] translate-x-full md:hidden'
          }`}
          style={{ display: showPollsPanel ? 'flex' : 'none' }}
        >
          <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 shrink-0 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-400" />
              <h3 className="text-white font-bold tracking-wide">Poll History</h3>
            </div>
            <button onClick={() => setShowPollsPanel(false)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 md:hidden">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {polls.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">No polls have been created yet.</div>
            ) : (
              [...polls].reverse().map(p => {
                const totalVotes = Object.values(p.votes).reduce((a, b) => a + b, 0);
                return (
                  <div key={p.id} className="bg-slate-800 border border-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-medium text-sm">{p.question}</h4>
                      {!p.isActive && <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded uppercase font-bold">Ended</span>}
                      {p.isActive && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded uppercase font-bold">Live</span>}
                    </div>
                    <div className="text-xs text-gray-500 mb-3">{totalVotes} votes</div>
                    
                    <button 
                      onClick={() => { setActivePollId(p.id); setPollWidgetPos({x:0, y:0}); setShowPollsPanel(false); }}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-white transition-colors"
                    >
                      {p.isActive ? "Open Poll Widget" : "View Results"}
                    </button>
                  </div>
                )
              })
            )}
          </div>
          
          {isHost && (
            <div className="p-4 border-t border-white/10 shrink-0">
              <button 
                onClick={() => setShowPollCreator(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]"
              >
                Create New Poll
              </button>
            </div>
          )}
        </div>

        {/* Poll Creator Modal */}
        {showPollCreator && isHost && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Create a Poll</h2>
                <button onClick={() => setShowPollCreator(false)} className="text-gray-400 hover:text-white"><X size={20}/></button>
              </div>
              <input 
                type="text" 
                placeholder="Ask a question..." 
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 outline-none focus:border-blue-500 transition-colors"
                value={pollForm.question}
                onChange={(e) => setPollForm({...pollForm, question: e.target.value})}
              />
              <div className="space-y-3 mb-6">
                {pollForm.options.map((opt, i) => (
                  <div key={i} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={`Option ${i+1}`} 
                      className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...pollForm.options];
                        newOpts[i] = e.target.value;
                        setPollForm({...pollForm, options: newOpts});
                      }}
                    />
                    {i >= 2 && (
                      <button 
                        onClick={() => {
                          const newOpts = pollForm.options.filter((_, idx) => idx !== i);
                          setPollForm({...pollForm, options: newOpts});
                        }}
                        className="p-2.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors"
                      ><X size={16}/></button>
                    )}
                  </div>
                ))}
                {pollForm.options.length < 5 && (
                  <button 
                    onClick={() => setPollForm({...pollForm, options: [...pollForm.options, '']})}
                    className="text-sm text-blue-400 font-semibold hover:text-blue-300 transition-colors"
                  >+ Add Option</button>
                )}
              </div>
              <button 
                onClick={startPoll}
                disabled={!pollForm.question || pollForm.options.filter(o => o.trim() !== '').length < 2}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              >
                Start Poll
              </button>
            </div>
          </div>
        )}

        {/* Active Poll Widget (Draggable) */}
        {activePoll && (
          <div 
            className="fixed w-80 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[60] flex flex-col pointer-events-auto"
            style={{
               top: '80px',
               right: '24px',
               transform: `translate(${pollWidgetPos.x}px, ${pollWidgetPos.y}px)`,
               transition: isDraggingPoll ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <div 
               className="flex justify-between items-start mb-3 p-5 pb-0 cursor-move"
               onPointerDown={(e) => {
                  setIsDraggingPoll(true);
                  e.currentTarget.setPointerCapture(e.pointerId);
               }}
               onPointerMove={(e) => {
                  if (isDraggingPoll) {
                     setPollWidgetPos(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
                  }
               }}
               onPointerUp={(e) => {
                  setIsDraggingPoll(false);
                  e.currentTarget.releasePointerCapture(e.pointerId);
               }}
               onPointerCancel={(e) => {
                  setIsDraggingPoll(false);
                  e.currentTarget.releasePointerCapture(e.pointerId);
               }}
            >
              <div className="flex items-center gap-2 text-blue-400">
                <BarChart2 size={16} />
                <span className="font-bold text-sm tracking-wide uppercase select-none">Live Poll</span>
              </div>
              <button 
                 onClick={() => setActivePollId(null)} 
                 className="text-gray-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer z-10 relative"
                 onPointerDown={e => e.stopPropagation()}
              >
                <X size={16}/>
              </button>
            </div>
            
            <div className="px-5 pb-5 pt-3">
              <h3 className="text-white font-semibold mb-4 leading-tight">{activePoll.question}</h3>
              
              <div className="space-y-2">
                {activePoll.options.map((opt, i) => {
                  const totalVotes = Object.values(activePoll.votes).reduce((a, b) => a + b, 0);
                  const votes = activePoll.votes[i] || 0;
                  const percentage = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
                  
                  return (
                    <button 
                      key={i}
                      disabled={activePoll.hasVoted || !activePoll.isActive}
                      onClick={() => submitVote(activePoll.id, i)}
                      className="relative w-full text-left overflow-hidden bg-slate-800 hover:bg-slate-700 disabled:hover:bg-slate-800 border border-white/10 rounded-xl p-3 transition-colors group"
                    >
                      {(activePoll.hasVoted || !activePoll.isActive || isHost) && (
                        <div className="absolute left-0 top-0 bottom-0 bg-blue-500/20 transition-all duration-500 ease-out" style={{ width: `${percentage}%` }}></div>
                      )}
                      <div className="relative z-10 flex justify-between items-center text-sm font-medium text-white">
                        <span>{opt}</span>
                        {(activePoll.hasVoted || !activePoll.isActive || isHost) && (
                          <span className="text-blue-300 font-bold">{percentage}%</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">{Object.values(activePoll.votes).reduce((a, b) => a + b, 0)} votes</span>
                {isHost && activePoll.isActive && (
                  <button onClick={() => endPoll(activePoll.id)} className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-md font-semibold transition-colors">
                    End Poll
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </LayoutContextProvider>

      {/* Global Style Overrides for LiveKit Components */}
      <style dangerouslySetInnerHTML={{__html: `
        /* ControlBar Overrides */
        .livekit-custom-controls .lk-control-bar {
            padding: 0;
            background: transparent;
            border: none;
            gap: 0.5rem;
        }
        .livekit-custom-controls .lk-button {
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: 0.75rem;
            padding: 0.75rem;
            transition: all 0.2s;
            color: #d1d5db;
        }
        .livekit-custom-controls .lk-button:hover {
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
        }
        .livekit-custom-controls .lk-button[data-lk-source="camera"][aria-pressed="false"],
        .livekit-custom-controls .lk-button[data-lk-source="microphone"][aria-pressed="false"] {
            background-color: rgba(239, 68, 68, 0.2);
            color: #ef4444;
        }
        
        /* Focus Layout Adjustments */
        .lk-focus-layout {
            border-radius: 1rem;
            overflow: hidden;
            height: 100%;
        }
        
        /* Carousel Layout Adjustments for Sidebar */
        .lk-carousel {
            gap: 1rem;
        }
        .lk-participant-tile {
            border-radius: 0.75rem !important;
            overflow: hidden !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
        }
        
        /* Chat Overrides */
        .livekit-premium-chat .lk-chat {
            height: 100% !important;
            max-height: 100% !important;
            width: 100% !important;
            border: none !important;
            background: transparent !important;
            border-radius: 0 !important;
        }
        .livekit-premium-chat .lk-chat-messages {
            padding: 1.5rem !important;
        }
        .livekit-premium-chat .lk-chat-entry {
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            margin: 1rem;
            padding: 0.5rem;
        }
        .livekit-premium-chat .lk-chat-form-input {
            color: white;
        }
        .livekit-premium-chat .lk-chat-form-input::placeholder {
            color: #6b7280;
        }

        /* Hide the default disconnect button that comes inside ControlBar if any */
        .livekit-custom-controls .lk-disconnect-button {
            display: none !important;
        }
      `}} />
    </div>
  );
}
