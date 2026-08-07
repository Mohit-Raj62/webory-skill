"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const SmartFormatButton = ({ 
    text, 
    onFormatted 
}: { 
    text: string;
    onFormatted: (formattedText: string) => void;
}) => {
    const [isFormatting, setIsFormatting] = useState(false);

    const handleFormat = async () => {
        if (!text || text.trim() === "") {
            toast.error("Please enter some text to format first");
            return;
        }

        setIsFormatting(true);
        try {
            const res = await fetch("/api/ai/format-syllabus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            });

            if (!res.ok) throw new Error("Failed to format");
            const data = await res.json();
            
            if (data.formattedText) {
                onFormatted(data.formattedText);
                toast.success("AI magically formatted your syllabus!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to format syllabus. Please check your connection.");
        } finally {
            setIsFormatting(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleFormat}
            disabled={isFormatting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
            {isFormatting ? (
                <Loader2 size={14} className="animate-spin" />
            ) : (
                <Sparkles size={14} />
            )}
            {isFormatting ? "AI Formatting..." : "Smart Format"}
        </button>
    );
};
