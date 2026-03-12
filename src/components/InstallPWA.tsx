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
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider animate-pulse hover:animate-none shadow-lg shadow-blue-500/10"
            >
                <Download size={12} strokeWidth={3} />
                <span>App</span>
            </button>
        );
    }

    return (
        <div className="mx-3 mb-3 p-3 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 relative group overflow-hidden transition-all hover:border-blue-500/40">
            <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-1 right-1 text-gray-500 hover:text-white transition-colors"
                title="Dismiss"
            >
                <X size={12} />
            </button>
            <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-md bg-blue-600 text-white">
                    <Download size={14} />
                </div>
                <div>
                    <h3 className="text-[11px] font-bold text-white uppercase tracking-tight">App</h3>
                    <p className="text-[9px] text-gray-400">Better experience</p>
                </div>
            </div>
            <button
                onClick={handleInstallClick}
                className="w-full py-1.5 px-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all transform active:scale-95"
            >
                {isIOS ? "Setup" : (installPrompt ? "Install" : "Get")}
            </button>
        </div>
    );
}
