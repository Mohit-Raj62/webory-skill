"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode } from "react";

interface Hover3DTiltProps {
    children: ReactNode;
    className?: string;
    tiltAmount?: number; // How much it tilts (lower = more tilt, e.g. 15deg)
    popOutAmount?: number; // How much children pop out in Z space
}

export function Hover3DTilt({ 
    children, 
    className = "", 
    tiltAmount = 15,
    popOutAmount = 30
}: Hover3DTiltProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${tiltAmount}deg`, `-${tiltAmount}deg`]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${tiltAmount}deg`, `${tiltAmount}deg`]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            className={`relative perspective-[1000px] ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.02, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <motion.div
                className="w-full h-full relative"
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
            >
                {/* 
                    To make children pop out, they should have style={{ transform: "translateZ(30px)" }} 
                    We can either pass this down, or just tilt the whole container.
                    Here we apply a subtle z-translation to the wrapper itself.
                */}
                <motion.div 
                    className="w-full h-full"
                    style={{ transform: `translateZ(${popOutAmount}px)` }}
                >
                    {children}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
