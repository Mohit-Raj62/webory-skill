"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function InactivityLogout() {
    const router = useRouter();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityRef = useRef<number>(Date.now());
    const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds
    const THROTTLE_LIMIT = 1000; // 1 second throttle

    const logout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Auto-logout failed:", error);
        }
    };

    const resetTimer = () => {
        const now = Date.now();
        // Throttle: only reset if more than 1 second has passed since last reset
        if (now - lastActivityRef.current < THROTTLE_LIMIT) {
            return;
        }
        
        lastActivityRef.current = now;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            logout();
        }, INACTIVITY_TIMEOUT) as unknown as NodeJS.Timeout;
    };

    useEffect(() => {
        // Events that indicate user activity
        const events = [
            "mousedown",
            "mousemove",
            "keypress",
            "scroll",
            "touchstart",
            "click",
        ];

        // Reset timer on any activity
        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        // Start initial timer
        resetTimer();

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, []);

    return null; // This component doesn't render anything
}
