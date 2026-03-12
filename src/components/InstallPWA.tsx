"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPWA() {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        console.log("PWA: Monitoring install prompt...");
        // Check if already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            console.log("PWA: App is already installed (standalone mode)");
            setIsInstalled(true);
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            console.log("PWA: 'beforeinstallprompt' event fired!");
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        
        // Also check if app is already installed via navigator
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then(() => {
                console.log("PWA: Service worker ready");
            });
        }

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) return;

        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        
        if (outcome === "accepted") {
            setInstallPrompt(null);
            setIsInstalled(true);
        }
    };

    if (isInstalled || !installPrompt || !isVisible) {
        return null;
    }

    return (
        <div className="mx-4 mb-4 p-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 relative group overflow-hidden transition-all hover:border-blue-500/40">
            <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors"
                title="Dismiss"
            >
                <X size={14} />
            </button>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-600 text-white">
                    <Download size={16} />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-white">Install App</h3>
                    <p className="text-xs text-gray-400">Better experience on app</p>
                </div>
            </div>
            <button
                onClick={handleInstallClick}
                className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all transform active:scale-95"
            >
                Download Now
            </button>
        </div>
    );
}
