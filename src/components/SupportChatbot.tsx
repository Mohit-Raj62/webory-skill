"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { MessageCircle, X, Send, Loader2, Minimize2, Bot, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIResponse {
  message: string;
  suggestedActions?: string[];
  links?: { text: string; url: string }[];
}

export default function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [shouldShow, setShouldShow] = useState(true);
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check if chatbot should be visible on current page
  useEffect(() => {
    const hiddenPaths = [
      "/admin",
      "/teacher",
      "/payment",
      "/checkout",
      "/ai-weboryskills",
      "/api",
    ];
    
    const shouldHide = hiddenPaths.some((hiddenPath) =>
      pathname?.startsWith(hiddenPath)
    );
    
    setShouldShow(!shouldHide);
  }, [pathname]);


  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/support-chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          sessionId: sessionId,
          currentPage: window.location.pathname,
          deviceType: window.innerWidth < 768 ? "mobile" : "desktop",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSessionId(data.sessionId);
        const aiResponse: AIResponse = data.response;

        const assistantMessage: Message = {
          role: "assistant",
          content: JSON.stringify(aiResponse),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: JSON.stringify({
          message:
            "Sorry, I'm having trouble connecting right now. Please try again! 😔",
        }),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const parseAssistantMessage = (content: string): AIResponse => {
    try {
      return JSON.parse(content);
    } catch {
      return { message: content };
    }
  };

  // Don't render if on hidden pages
  if (!shouldShow) {
    return null;
  }

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] right-4 md:bottom-6 md:right-6 z-[999] flex items-center print:hidden group select-none"
          >
            {/* Desktop Clean Pill */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => setIsOpen(true)}
              className="hidden md:flex items-center gap-2 mr-3 px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/80 shadow-md backdrop-blur-md cursor-pointer transition-colors duration-200"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Chat with Nexus</span>
            </motion.div>

            {/* Clean Professional Action Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative flex h-13 w-13 md:h-14 md:w-14 items-center justify-center rounded-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-700/80 shadow-lg shadow-black/25 hover:shadow-xl transition-all duration-200 cursor-pointer"
              aria-label="Open support chat"
            >
              {/* Clean Minimalist Chat Bubble Icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-white transition-transform duration-200 group-hover:scale-105"
              >
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" fill="currentColor" fillOpacity="0.15" />
                <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none" />
                <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
                <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
              </svg>

              {/* Status Indicator */}
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-900" />
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed z-[999] flex flex-col overflow-hidden bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 bottom-[calc(5rem+env(safe-area-inset-bottom,0px))] left-4 right-4 h-[65vh] max-h-[500px] md:max-h-[80vh] rounded-2xl md:left-auto md:right-6 md:bottom-6 md:w-[380px] md:h-[600px] print:hidden"
          >
            {/* Header - Professional Neutral Dark */}
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden p-0.5 shrink-0">
                  <Image
                    src="/webory-logo.png"
                    alt="Webory Logo"
                    width={40}
                    height={40}
                    className="h-full w-full object-contain rounded-full"
                    priority
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-white">Webory Nexus</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
                    Online • Support
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-slate-800 text-slate-300 hover:text-white p-2 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
                  <div className="relative h-14 w-14 mx-auto mb-3 rounded-full overflow-hidden ring-4 ring-blue-500/20 shadow-lg bg-gray-900/80 p-1">
                    <Image
                      src="/webory-logo.png"
                      alt="Webory Nexus"
                      width={56}
                      height={56}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-base">
                    Webory Nexus AI Support
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Hi! How can I help you today? 😊
                  </p>
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() =>
                        setInputMessage("What courses do you offer?")
                      }
                      className="block w-full text-left px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      📚 What courses do you offer?
                    </button>
                    <button
                      onClick={() =>
                        setInputMessage("How do I get a certificate?")
                      }
                      className="block w-full text-left px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      🎓 How do I get a certificate?
                    </button>
                    <button
                      onClick={() => setInputMessage("Tell me about AI Practice")}
                      className="block w-full text-left px-4 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      🤖 Tell me about AI Practice
                    </button>
                  </div>
                </div>
              )}

              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="h-7 w-7 rounded-full overflow-hidden shrink-0 border border-blue-400/30 bg-gray-900 shadow-sm mb-1 p-0.5">
                      <Image
                        src="/webory-logo.png"
                        alt="Webory Nexus"
                        width={28}
                        height={28}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-600"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <AssistantMessage content={msg.content} />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}
                    <p
                      className={`text-xs mt-1 ${msg.role === "user" ? "text-white/70" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-end gap-2 justify-start">
                  <div className="h-7 w-7 rounded-full overflow-hidden shrink-0 border border-blue-400/30 bg-gray-900 shadow-sm mb-1 p-0.5">
                    <Image
                      src="/webory-logo.png"
                      alt="Webory Nexus"
                      width={28}
                      height={28}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Typing...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Component to render assistant messages with formatting
function AssistantMessage({ content }: { content: string }) {
  const data = (() => {
    try {
      return JSON.parse(content);
    } catch {
      return { message: content };
    }
  })();

  return (
    <div className="space-y-2">
      <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown>{data.message}</ReactMarkdown>
      </div>

      {data.suggestedActions && data.suggestedActions.length > 0 && (
        <div className="space-y-1 mt-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Suggested actions:
          </p>
          {data.suggestedActions.map((action: string, idx: number) => (
            <div
              key={idx}
              className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded"
            >
              • {action}
            </div>
          ))}
        </div>
      )}

      {data.links && data.links.length > 0 && (
        <div className="space-y-1 mt-2">
          {data.links.map((link: { text: string; url: string }, idx: number) => (
            <a
              key={idx}
              href={link.url}
              className="block text-xs text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 {link.text}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
