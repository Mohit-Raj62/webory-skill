"use client";

import { useState, useEffect } from "react";

export function Typewriter({ words, textClassName = "" }: { words: string[], textClassName?: string }) {
    const [index, setIndex] = useState(0);
    const [subIndex, setSubIndex] = useState(0);
    const [blink, setBlink] = useState(true);
    const [reverse, setReverse] = useState(false);

    // Blinking cursor effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setBlink((prev) => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    // Typing logic
    useEffect(() => {
        if (words.length === 0) return;
        
        if (subIndex === words[index].length && !reverse) {
            // Reached end of word, wait before deleting
            const timeout = setTimeout(() => setReverse(true), 2500);
            return () => clearTimeout(timeout);
        }

        if (subIndex === 0 && reverse) {
            // Finished deleting, move to next word
            setReverse(false);
            setIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const typingSpeed = reverse ? 50 : 100; // Delete faster than typing
        const variance = Math.random() * 50; // Add some human-like variance

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, typingSpeed + variance);

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse, words]);

    return (
        <span className="inline-flex items-center min-w-[20px]">
            <span className={textClassName}>{words[index].substring(0, subIndex)}</span>
            <span 
                className={`inline-block w-[3px] md:w-[4px] h-[0.9em] bg-purple-400 ml-[4px] align-middle ${blink ? 'opacity-100' : 'opacity-0'} transition-opacity duration-75`}
                style={{ transform: 'translateY(-2px)' }}
            ></span>
        </span>
    );
}
