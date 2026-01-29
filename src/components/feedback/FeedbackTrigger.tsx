"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { FeedbackForm } from "./FeedbackForm";

export function FeedbackTrigger() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 group"
                aria-label="Give Feedback"
            >
                <div className="relative">
                    <MessageSquare size={20} className="group-hover:animate-pulse" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                    </span>
                </div>
                <span className="text-sm font-bold pr-1">Feedback</span>
            </button>

            <FeedbackForm isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
