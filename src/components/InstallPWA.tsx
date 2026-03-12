"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface InstallPWAProps {
    variant?: "sidebar" | "navbar";
}

export function InstallPWA({ variant = "sidebar" }: InstallPWAProps) {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        console.log("PWA: Monitoring install prompt...");
        
        // Check for iOS
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);

        // Check if already installed
        if (window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone) {
            console.log("PWA: App is already installed (standalone mode)");
            setIsInstalled(true);
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            console.log("PWA: 'beforeinstallprompt' event fired!");
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        
        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            alert("To install on iOS: Tap the 'Share' button in Safari and select 'Add to Home Screen' 📱");
            return;
        }

        if (!installPrompt) {
            alert("To install: Use your browser's menu (3 dots) and select 'Install App' or 'Add to Home Screen'.");
            return;
        }

        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        
        if (outcome === "accepted") {
            setInstallPrompt(null);
            setIsInstalled(true);
        }
    };

    // If already installed or manually dismissed, hide
    if (isInstalled || !isVisible) {
        return null;
    }

    // On desktop, we only show if the prompt is ready (to be less intrusive)
    // On mobile, we can show a fallback button
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    
    if (!installPrompt && !isIOS && !isMobile && variant === "navbar") {
        return null; 
    }

    if (variant === "navbar") {
        return (
            <button
                onClick={handleInstallClick}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-xs font-medium animate-pulse hover:animate-none"
            >
                <Download size={14} />
                <span>Get App</span>
            </button>
        );
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
                    <h3 className="text-sm font-semibold text-white">Webory Skills App</h3>
                    <p className="text-xs text-gray-400">{isIOS ? "Add to Home Screen" : "Install for better experience"}</p>
                </div>
            </div>
            <button
                onClick={handleInstallClick}
                className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all transform active:scale-95"
            >
                {isIOS ? "How to Install" : (installPrompt ? "Install Now" : "Get App")}
            </button>
        </div>
    );
}
