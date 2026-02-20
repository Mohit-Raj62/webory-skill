"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Code2, Sparkles, Terminal, ChevronLeft, Cpu, Globe, Lock } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import { useAuth } from "@/components/auth/session-provider";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

const CodeEditor = dynamic(
    () => import("@/components/playground/CodeEditor"),
    { 
        ssr: false,
        loading: () => (
            <div className="h-[75vh] w-full flex items-center justify-center bg-[#0d1117] border border-[#30363d] rounded-lg shadow-2xl">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-gray-400 font-mono text-sm animate-pulse">Loading Code Editor...</p>
                </div>
            </div>
        )
    }
);

function ErrorFallback({ error, resetErrorBoundary }: any) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-[#1e1e1e] rounded-xl border border-red-500/20 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <Terminal className="text-red-500 w-8 h-8" />
            </div>
            <h2 className="text-xl font-mono font-bold text-red-400 mb-2">System Failure</h2>
            <p className="text-gray-400 mb-6 max-w-md font-mono text-xs">{error.message}</p>
            <button
                onClick={resetErrorBoundary}
                className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 px-6 py-2 rounded-md transition-all duration-300 font-mono text-sm"
            >
                REBOOT_SYSTEM()
            </button>
        </div>
    );
}

export default function PlaygroundPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            // Redirect to login if not authenticated
            router.push("/login?callbackUrl=/playground");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-mono text-sm animate-pulse">Initializing DevLab...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
             <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[#161b22] border border-[#30363d] rounded-xl p-8 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="text-blue-400 w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
                    <p className="text-gray-400 mb-8">Access to the Webory DevLab is restricted to registered members only. Please sign in to continue.</p>
                    
                    <div className="flex flex-col gap-3">
                        <Button 
                            onClick={() => router.push("/login?callbackUrl=/playground")}
                            className="bg-blue-600 hover:bg-blue-500 text-white w-full py-6 text-lg"
                        >
                            Sign In to DevLab
                        </Button>
                        <Link 
                            href="/"
                            className="text-gray-500 hover:text-gray-400 text-sm mt-2 transition-colors"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans selection:bg-blue-500/30 pt-4 md:pt-20">
            {/* Grid Background */}
            <div className="fixed inset-0 z-0 pointer-events-none" 
                style={{
                    backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />
            
            <div className="relative z-10 container mx-auto max-w-[1600px] px-4 pb-8">
                {/* Header Section */}
                <motion.header 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2 md:mb-6 flex flex-row items-center justify-between gap-4 border-b border-[#30363d] pb-2 md:pb-6"
                >
                    <div className="flex items-center gap-3 md:gap-4">
                         <div className="h-8 w-8 md:h-12 md:w-12 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                            <Code2 className="text-blue-400 h-4 w-4 md:h-6 md:w-6" />
                        </div>
                        <div>
                            <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2 md:gap-3">
                                <span className="hidden sm:inline">Webory</span> DevLab
                                <span className="px-1.5 py-0.5 rounded text-[8px] md:text-[10px] bg-green-500/10 border border-green-500/20 text-green-400 font-mono tracking-wider uppercase">
                                    v1.0
                                </span>
                            </h1>
                            <p className="text-gray-400 text-xs md:text-sm font-mono mt-0.5 md:mt-1 hidden sm:flex items-center gap-2">
                                <Cpu size={12} /> Cloud Runtime
                                <span className="text-gray-600">|</span>
                                <Globe size={12} /> Global CDN
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#161b22] border border-[#30363d] text-xs font-mono text-gray-400">
                            <Sparkles size={12} className="text-yellow-500" />
                            <span>Powered by Webory Skills</span>
                        </div>
                        
                        <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-sm font-medium transition-colors border border-[rgba(240,246,252,0.1)]">
                            <ChevronLeft size={16} />
                            <span>Exit to Home</span>
                        </Link>
                    </div>
                </motion.header>

                <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                    onReset={() => window.location.reload()}
                >
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-lg overflow-hidden border border-[#30363d] shadow-2xl bg-[#0d1117]"
                    >
                        <CodeEditor />
                    </motion.div>
                </ErrorBoundary>
            </div>
        </div>
    );
}
