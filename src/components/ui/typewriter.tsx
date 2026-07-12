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
        
        const currentWord = words[index];

        if (subIndex === currentWord.length && !reverse) {
            // Reached end of word, wait longer before deleting so users can read
            const timeout = setTimeout(() => setReverse(true), 4000); // Wait 4 seconds
            return () => clearTimeout(timeout);
        }

        if (subIndex === 0 && reverse) {
            // Finished deleting, wait a bit before starting the next word
            setReverse(false);
            const timeout = setTimeout(() => {
                setIndex((prev) => (prev + 1) % words.length);
            }, 1000); // 1 second pause before typing next word
            return () => clearTimeout(timeout);
        }

        // Calculate a human-like delay
        let delay = 0;
        
        if (reverse) {
            // When humans delete, they hold backspace (fast & steady)
            delay = 40; 
        } else {
            // Base typing speed - SLOWED DOWN
            delay = 120 + Math.random() * 100; // Between 120ms and 220ms per letter
            
            // 15% chance to have a micro-pause (thinking / finger slip)
            if (Math.random() < 0.15) {
                delay += 250 + Math.random() * 200; // Pause for extra 250-450ms
            }
            
            // Slower on capital letters or hyphens (shift key / reaching)
            const nextChar = currentWord[subIndex];
            if (nextChar && (nextChar === nextChar.toUpperCase() || nextChar === '-')) {
                delay += 150;
            }
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, delay);

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
