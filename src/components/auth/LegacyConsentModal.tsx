"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/session-provider";
import { Shield, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export function LegacyConsentModal() {
    const { user, loading: authLoading, refreshAuth } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [legalAccepted, setLegalAccepted] = useState(false);
    const [marketingAccepted, setMarketingAccepted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Only show for logged in users who haven't accepted the terms, and aren't on the terms/privacy pages.
        if (
            !authLoading &&
            user && 
            !(user as any).acceptedTermsVersion &&
            !pathname.startsWith('/terms') &&
            !pathname.startsWith('/privacy')
        ) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [user, authLoading, pathname]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/consent/legacy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    legalAccepted,
                    marketingAccepted,
                }),
            });

            if (res.ok) {
                await refreshAuth(); // Refresh user state
                setIsOpen(false);
            }
        } catch (error) {
            console.error("Failed to update legacy consent", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#111111] border border-white/10 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                        <Shield className="text-blue-500" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">Action Required</h2>
                        <p className="text-slate-400 text-sm">We've updated our privacy policies.</p>
                    </div>
                </div>

                <p className="text-slate-300 text-sm mb-8 leading-relaxed">
                    To continue using Skill Webory and to comply with the latest data protection laws, please review and accept our updated terms.
                </p>

                <div className="space-y-4 mb-8 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={legalAccepted}
                                onChange={(e) => setLegalAccepted(e.target.checked)}
                            />
                            <div className="w-5 h-5 rounded border border-white/20 bg-black/20 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all flex items-center justify-center">
                                <svg className={`w-3.5 h-3.5 text-white pointer-events-none ${legalAccepted ? 'opacity-100' : 'opacity-0'} transition-opacity`} viewBox="0 0 14 14" fill="none">
                                    <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                            I agree to the <Link href="/terms" target="_blank" className="text-blue-400 hover:underline">Terms</Link> and <Link href="/privacy" target="_blank" className="text-blue-400 hover:underline">Privacy Policy</Link>. <span className="text-red-400">*</span>
                        </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center mt-0.5">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={marketingAccepted}
                                onChange={(e) => setMarketingAccepted(e.target.checked)}
                            />
                            <div className="w-5 h-5 rounded border border-white/20 bg-black/20 peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all flex items-center justify-center">
                                <svg className={`w-3.5 h-3.5 text-white pointer-events-none ${marketingAccepted ? 'opacity-100' : 'opacity-0'} transition-opacity`} viewBox="0 0 14 14" fill="none">
                                    <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                            I'd like to receive marketing emails and updates. <span className="text-red-400">*</span>
                        </span>
                    </label>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading || !legalAccepted || !marketingAccepted}
                    className="w-full bg-white hover:bg-gray-100 text-black font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin text-black" size={18} /> : "I Accept & Continue"}
                </button>
            </div>
        </div>
    );
}
