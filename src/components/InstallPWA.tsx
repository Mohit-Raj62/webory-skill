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
    const [isChecking, setIsChecking] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        console.log("PWA: Monitoring install prompt...");
        
        const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);

        if (window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone) {
            setIsInstalled(true);
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            console.log("PWA: 'beforeinstallprompt' event fired!");
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
            setIsChecking(false);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        
        // Also check if already installed via another way
        window.addEventListener("appinstalled", () => {
            setIsInstalled(true);
            setInstallPrompt(null);
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            setMessage("iOS: Tap 'Share' in Safari, then 'Add to Home Screen' 📱");
            setTimeout(() => setMessage(null), 5000);
            return;
        }

        if (installPrompt) {
            await installPrompt.prompt();
            const { outcome } = await installPrompt.userChoice;
            if (outcome === "accepted") {
                setInstallPrompt(null);
                setIsInstalled(true);
            }
        } else {
            setIsChecking(true);
            setMessage("Checking... Please click the 3-dot menu and select 'Install App' if this button doesn't respond.");
            setTimeout(() => {
                setIsChecking(false);
                setMessage(null);
            }, 6000);
        }
    };

    if (isInstalled || !isVisible) return null;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    
    // For desktop, wait for prompt to be ready
    if (!installPrompt && !isIOS && !isMobile && variant === "navbar") {
        return null; 
    }

    return (
        <div className="relative">
            {message && (
                <div className="fixed bottom-20 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
                    <div className="bg-blue-600 text-white p-3 rounded-xl shadow-2xl text-xs font-semibold text-center border border-white/20">
                        {message}
                    </div>
                </div>
            )}
            
            {variant === "navbar" ? (
                <button
                    onClick={handleInstallClick}
                    disabled={isChecking}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider animate-pulse hover:animate-none disabled:opacity-50"
                >
                    <Download size={12} strokeWidth={isChecking ? 1 : 3} className={isChecking ? "animate-spin" : ""} />
                    <span>{isChecking ? "..." : "App"}</span>
                </button>
            ) : (
                <div className="mx-3 mb-3 p-3 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 relative group overflow-hidden transition-all hover:border-blue-500/40">
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="absolute top-1 right-1 text-gray-500 hover:text-white transition-colors"
                    >
                        <X size={12} />
                    </button>
                    <div className="flex items-center gap-2 mb-1.5">
                        <div className="p-1.5 rounded-md bg-blue-600 text-white">
                            <Download size={14} className={isChecking ? "animate-spin" : ""} />
                        </div>
                        <div>
                            <h3 className="text-[11px] font-bold text-white uppercase tracking-tight">App</h3>
                            <p className="text-[9px] text-gray-400">Better experience</p>
                        </div>
                    </div>
                    <button
                        onClick={handleInstallClick}
                        disabled={isChecking}
                        className="w-full py-1.5 px-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition-all transform active:scale-95 disabled:opacity-50"
                    >
                        {isChecking ? "Checking..." : (isIOS ? "Setup" : (installPrompt ? "Install" : "Get"))}
                    </button>
                </div>
            )}
        </div>
    );
}
