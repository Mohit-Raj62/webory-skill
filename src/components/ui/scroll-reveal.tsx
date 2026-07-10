"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type RevealStyle = "3d-tilt" | "fade-up" | "scale-up" | "3d-flip" | "slide-in-right" | "slide-in-left";

interface ScrollRevealProps {
    children: ReactNode;
    style?: RevealStyle;
    delay?: number;
}

export function ScrollReveal({ children, style = "fade-up", delay = 0 }: ScrollRevealProps) {
    const getVariants = () => {
        switch (style) {
            case "fade-up":
            default:
                return {
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                };
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }} // Only animate once so it doesn't distract
            variants={getVariants()}
            transition={{
                duration: 0.6,
                delay: delay,
                ease: "easeOut"
            }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
}
