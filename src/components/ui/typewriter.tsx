"use client";

import { useState, useEffect, useRef } from "react";

interface TypewriterProps {
    words: string[];
    textClassName?: string;
    cursorClassName?: string;
}

export function Typewriter({ 
    words, 
    textClassName = "bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300",
    cursorClassName = "bg-purple-400"
}: TypewriterProps) {
    const [index, setIndex] = useState(0);
    // Initialize with full first word so on Mac/Safari or initial load it is NEVER blank
    const [subIndex, setSubIndex] = useState(() => (words && words.length > 0 ? words[0].length : 0));
    const [blink, setBlink] = useState(true);
    const [reverse, setReverse] = useState(false);

    // Stable words ref to prevent re-render timer cancellations
    const wordsRef = useRef(words);
    useEffect(() => {
        wordsRef.current = words;
    }, [words]);

    // Blinking cursor effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    // Typing logic
    useEffect(() => {
        const currentWords = wordsRef.current;
        if (!currentWords || currentWords.length === 0) return;
        
        const currentWord = currentWords[index] || "";

        if (subIndex >= currentWord.length && !reverse) {
            // Reached end of word, pause to let user read
            const timeout = setTimeout(() => setReverse(true), 3500);
            return () => clearTimeout(timeout);
        }

        if (subIndex <= 0 && reverse) {
            // Finished deleting, wait a moment then move to next word
            const timeout = setTimeout(() => {
                setReverse(false);
                setIndex((prev) => (prev + 1) % currentWords.length);
            }, 600);
            return () => clearTimeout(timeout);
        }

        // Delay: faster backspacing, natural forward typing
        const delay = reverse ? 35 : (80 + Math.random() * 60);

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, delay);

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words.length]);

    if (!words || words.length === 0) return null;

    const currentWord = words[index] || words[0] || "";
    const displayText = currentWord.substring(0, subIndex);

    return (
        <span className="inline-flex items-center min-w-[20px] align-baseline">
            <span 
                className={`inline text-transparent bg-clip-text font-black tracking-tight ${textClassName}`}
                style={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "#34d399",
                    display: "inline",
                }}
            >
                {displayText}
            </span>
            <span 
                className={`inline-block w-[3px] md:w-[4px] h-[0.85em] ${cursorClassName} ml-1.5 align-baseline ${blink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-75`}
                style={{ transform: 'translateY(-2px)' }}
                aria-hidden="true"
            />
        </span>
    );
}
