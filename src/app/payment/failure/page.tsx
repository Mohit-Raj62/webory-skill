"use client";

import { useSearchParams } from "next/navigation";
import { XCircle, AlertCircle, RotateCcw, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense } from "react";

function PaymentFailureContent() {
    const searchParams = useSearchParams();
    const reason = searchParams.get("reason");
    const txnid = searchParams.get("txnid");

    return (
        <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card w-full max-w-md p-0 rounded-3xl border border-red-500/20 shadow-2xl shadow-red-900/20 overflow-hidden relative z-10 mx-4"
        >
             {/* Header / Hero Section */}
            <div className="bg-gradient-to-b from-red-900/40 to-transparent p-8 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-red-500/10 blur-3xl pointer-events-none"></div>
                 
                 <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-tr from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30 relative z-10"
                 >
                    <XCircle size={40} className="text-white stroke-[2.5]" />
                 </motion.div>
                 
                 <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Payment Failed</h1>
                 <p className="text-red-200/80 text-sm">
                    Something went wrong with your transaction.
                 </p>
            </div>

            <div className="p-6 space-y-6 bg-black/40">
                {/* Error Details Card */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 space-y-4">
                     {txnid && (
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-gray-400 text-sm">Transaction ID</span>
                            <span className="text-white font-mono text-sm tracking-wide bg-white/5 px-2 py-1 rounded">{txnid}</span>
                        </div>
                     )}
                     <div>
                         <span className="text-gray-400 text-sm block mb-2">Error Reason</span>
                         <div className="flex items-start gap-2 text-red-300 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            <span className="capitalize leading-relaxed">
                                {reason?.replace(/_/g, " ") || "The payment gateway rejected the transaction. Please try again or use a different payment method."}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Button 
                        onClick={() => window.history.back()}
                        className="w-full bg-white hover:bg-gray-200 text-black h-14 rounded-xl text-lg font-bold shadow-lg shadow-white/10 group"
                    >
                        <RotateCcw className="mr-2 group-hover:rotate-180 transition-transform duration-500" size={20} /> Try Again
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/contact">
                            <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-gray-400 hover:text-white h-12 rounded-xl">
                                <MessageSquare className="mr-2" size={16} /> Support
                            </Button>
                        </Link>
                         <Link href="/">
                             <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-gray-400 hover:text-white h-12 rounded-xl">
                                <ArrowLeft className="mr-2" size={16} /> Home
                            </Button>
                        </Link>
                    </div>
                </div>

                <p className="text-xs text-center text-gray-500 mt-4 leading-relaxed px-4">
                    Note: If any amount was deducted, it will be automatically refunded to your source account within 5-7 business days.
                </p>
            </div>
        </motion.div>
    );
}

export default function PaymentFailurePage() {
    return (
        <main className="min-h-screen bg-black relative flex flex-col font-sans selection:bg-red-500/30">
            <Navbar />

            <div className="flex-1 flex items-center justify-center relative p-4 sm:p-6 overflow-hidden">
                 {/* Background Ambient Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-900/10 to-transparent pointer-events-none"></div>

                <Suspense fallback={<div className="text-white animate-pulse">Checking status...</div>}>
                    <PaymentFailureContent />
                </Suspense>
            </div>

            <Footer />
        </main>
    );
}
