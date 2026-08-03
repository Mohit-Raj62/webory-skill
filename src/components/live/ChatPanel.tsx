"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface Message {
  _id?: string;
  senderName: string;
  isInstructor: boolean;
  message: string;
  isPinned: boolean;
}

export function ChatPanel({ roomId, studentName, isInstructor = false, liveSessionId }: { roomId: string, studentName: string, isInstructor?: boolean, liveSessionId: string }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to Express Socket.IO server
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.emit("join-room", { roomId, studentName, liveSessionId });

    newSocket.on("receive-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    newSocket.on("user-joined", (data: { studentName: string }) => {
      setMessages((prev) => [...prev, { senderName: "System", isInstructor: false, message: `${data.studentName} joined the class.`, isPinned: false }]);
      scrollToBottom();
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, studentName, liveSessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit("send-message", {
      roomId,
      message: newMessage,
      senderName: studentName,
      isInstructor,
      liveSessionId
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-white/5">
      <div className="p-4 border-b border-white/5 bg-black/20">
        <h3 className="font-bold text-white tracking-tight">Live Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.senderName === "System" ? "items-center text-xs text-slate-500" : ""}`}>
            {msg.senderName !== "System" && (
              <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${msg.isInstructor ? "text-emerald-400" : "text-blue-400"}`}>
                {msg.senderName} {msg.isInstructor && " (Teacher)"}
              </span>
            )}
            <div className={msg.senderName === "System" ? "italic" : "bg-white/5 p-3 rounded-xl text-sm text-slate-200"}>
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
