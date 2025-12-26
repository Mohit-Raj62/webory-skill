"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const codeSnippets = [
    "const ai = 'future';",
    "function learn() { return true; }",
    "import { Future } from 'webory';",
    "<div>Hello World</div>",
    "npm install knowledge",
    "git push origin master",
    "while(alive) { code(); }",
    "array.map(idea => build(idea))",
    "404: Limit Not Found",
    "await success();",
    "sudo make me a sandwhich",
    "console.log('Dream Big');"
];

export const BackgroundCodeAnimation = () => {
    const [elements, setElements] = useState<any[]>([]);

    useEffect(() => {
        // Generate random elements on client-side to avoid hydration mismatch
        const newElements = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
            x: Math.random() * 100, // %
            y: Math.random() * 100, // %
            duration: Math.random() * 20 + 10, // 10-30s
            delay: Math.random() * 5,
            scale: Math.random() * 0.5 + 0.5, // 0.5 - 1.0
            opacity: Math.random() * 0.5 + 0.2, // 0.2 - 0.7
        }));
        setElements(newElements);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {elements.map((el) => (
                <motion.div
                    key={el.id}
                    className="absolute font-mono whitespace-nowrap font-bold"
                    initial={{ 
                        x: `${el.x}vw`, 
                        y: `${el.y}vh`, 
                        opacity: 0, 
                        scale: el.scale,
                        filter: `blur(${el.scale < 0.7 ? 2 : 0}px)` 
                    }}
                    animate={{ 
                        y: [
                            `${el.y}vh`, 
                            `${el.y - 30}vh`, 
                            `${el.y - 60}vh`
                        ],
                        opacity: [0, el.opacity, 0], 
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        delay: el.delay,
                        ease: "linear",
                    }}
                    style={{
                        fontSize: `${el.scale}rem`,
                        color: el.scale > 0.8 ? '#60a5fa' : '#94a3b8', // Blue-400 for close, Slate-400 for far
                        textShadow: el.scale > 0.8 ? '0 0 10px rgba(96, 165, 250, 0.5)' : 'none'
                    }}
                >
                    {el.text}
                </motion.div>
            ))}
        </div>
    );
};
