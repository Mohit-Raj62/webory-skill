"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, ArrowRight, Download, Home, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import Link from "next/link";
import { motion } from "framer-motion";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const txnid = searchParams.get("txnid");
    
    return (
        <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card w-full max-w-md p-0 rounded-3xl border border-green-500/20 shadow-2xl shadow-green-900/20 overflow-hidden relative z-10 mx-4"
        >
            {/* Header / Hero Section */}
            <div className="bg-gradient-to-b from-green-900/40 to-transparent p-8 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-green-500/10 blur-3xl pointer-events-none"></div>
                 
                 <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30 relative z-10"
                 >
                    <Check size={40} className="text-white stroke-[3]" />
                 </motion.div>
                 
                 <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Payment Successful!</h1>
                 <p className="text-green-200/80 text-sm">
                    Welcome aboard! Your enrollment is complete.
                 </p>
            </div>

            <div className="p-6 space-y-6 bg-black/40">
                {/* Transaction Details Card */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                         <span className="text-gray-400 text-sm">Transaction ID</span>
                         <span className="text-white font-mono text-sm tracking-wide bg-white/5 px-2 py-1 rounded">{txnid || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                         <span className="text-gray-400 text-sm">Status</span>
                         <span className="text-green-400 font-bold text-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Confirmed
                         </span>
                    </div>
                     <div className="flex justify-between items-center">
                         <span className="text-gray-400 text-sm">Access</span>
                         <span className="text-blue-400 font-bold text-sm">Instant Access Active</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Link href="/profile" className="block w-full">
                        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-14 rounded-xl text-lg font-bold shadow-lg shadow-green-900/20 group">
                            Go to Dashboard <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/">
                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-gray-400 hover:text-white h-12 rounded-xl">
                                <Home className="mr-2" size={16} /> Home
                            </Button>
                        </Link>
                         <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-gray-400 hover:text-white h-12 rounded-xl">
                                <Share2 className="mr-2" size={16} /> Share
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <main className="min-h-screen bg-black relative flex flex-col font-sans selection:bg-green-500/30">
            <Navbar />

            <div className="flex-1 flex items-center justify-center relative p-4 sm:p-6 overflow-hidden">
                {/* Background Ambient Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-green-900/10 to-transparent pointer-events-none"></div>

                <Suspense fallback={<div className="text-white animate-pulse">Verifying Payment...</div>}>
                    <PaymentSuccessContent />
                </Suspense>
            </div>

            <Footer />
        </main>
    );
}
