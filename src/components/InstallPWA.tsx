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
            setMessage("📲 Steps to Install on iPhone:\n1. Tap 'Share' (box with arrow)\n2. Scroll down & tap 'Add to Home Screen'\n3. Tap 'Add'");
            setTimeout(() => setMessage(null), 8000);
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
            setMessage("📲 Download Steps:\n1. Click Browser Menu (3 dots ⋮)\n2. Select 'Install App' or 'Add to Home Screen'\n3. Tap 'Install'");
            setTimeout(() => {
                setIsChecking(false);
                setMessage(null);
            }, 8000);
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
                <div className="fixed inset-x-4 bottom-24 z-[9999] animate-in fade-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl border border-blue-500/30 ring-1 ring-white/10">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-blue-400 font-bold uppercase tracking-wider text-[10px]">Easy Setup Guide</span>
                            <button onClick={() => setMessage(null)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="space-y-2 whitespace-pre-line leading-relaxed text-sm font-medium">
                            {message}
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5 flex justify-center">
                            <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] uppercase font-bold tracking-tighter animate-pulse">
                                Try it now
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {variant === "navbar" ? (
                <button
                    onClick={handleInstallClick}
                    disabled={isChecking}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-[11px] font-bold uppercase tracking-wider shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 active:scale-95 disabled:opacity-50"
                >
                    <Download size={13} strokeWidth={isChecking ? 1 : 3} className={isChecking ? "animate-spin" : ""} />
                    <span>{isChecking ? "..." : "Get App"}</span>
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
                        <div className="p-1.5 rounded-md bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                            <Download size={14} className={isChecking ? "animate-spin" : ""} />
                        </div>
                        <div>
                            <h3 className="text-[11px] font-bold text-white uppercase tracking-tight">App</h3>
                            <p className="text-[9px] text-gray-400">Superior Experience</p>
                        </div>
                    </div>
                    <button
                        onClick={handleInstallClick}
                        disabled={isChecking}
                        className="w-full py-2 px-3 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-extrabold transition-all transform active:scale-95 disabled:opacity-50 shadow-md shadow-blue-600/20"
                    >
                        {isChecking ? "Loading..." : (isIOS ? "Setup" : (installPrompt ? "Install Now" : "Get App"))}
                    </button>
                </div>
            )}
        </div>
    );
}
