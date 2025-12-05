"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function InactivityLogout() {
    const router = useRouter();
    const timeoutRef = useRef < NodeJS.Timeout | null > (null);
    const INACTIVITY_TIMEOUT = 20 * 60 * 1000; // 20 minutes in milliseconds

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
            document.addEventListener(event, resetTimer);
        });

        // Start initial timer
        resetTimer();

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach((event) => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, []);

    return null; // This component doesn't render anything
}
