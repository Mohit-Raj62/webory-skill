"use client";

import { useEffect } from "react";

export function SecurityProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Only run in production to avoid making development a nightmare
        if (process.env.NODE_ENV === "development") return;

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Disable F12
            if (e.key === "F12") {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Inspect, Console, Elements)
            if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+U (View Source)
            if (e.ctrlKey && e.key === "u") {
                e.preventDefault();
                return false;
            }

            // Disable Ctrl+S (Save Page)
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                return false;
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        // Optional: Deter common console-based inspection
        const originalLog = console.log;
        console.log = (...args) => {
             if (typeof args[0] === 'string' && args[0].includes('Webory')) {
                 originalLog(...args);
             }
        };

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return <>{children}</>;
}
