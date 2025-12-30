"use client";

import { useSearchParams } from "next/navigation";
import { XCircle, AlertCircle, RotateCcw } from "lucide-react";
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card max-w-lg w-full p-8 rounded-3xl border-red-500/30 text-center relative z-10"
        >
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
                <XCircle size={48} className="text-red-400" />
            </motion.div>

            <h1 className="text-3xl font-bold text-white mb-2">Payment Failed</h1>
            <p className="text-gray-400 mb-6">
                We couldn't process your payment. If money was deducted, it will be refunded automatically within 5-7 business days.
            </p>

            <div className="bg-white/5 rounded-xl p-4 mb-8 text-left">
                {txnid && (
                    <div className="mb-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Transaction ID</p>
                        <p className="text-white font-mono text-sm">{txnid}</p>
                    </div>
                )}
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Error Reason</p>
                    <div className="flex items-center gap-2 text-red-300 text-sm">
                        <AlertCircle size={14} />
                        <span className="capitalize">{reason?.replace(/_/g, " ") || "Unknown Error"}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <Button 
                    onClick={() => window.history.back()}
                    className="w-full bg-white text-black hover:bg-gray-200 h-12 text-lg"
                >
                    <RotateCcw className="mr-2" size={18} /> Try Again
                </Button>
                <Link href="/contact">
                    <Button variant="ghost" className="w-full text-gray-400 hover:text-white">
                        Contact Support
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
}

export default function PaymentFailurePage() {
    return (
        <main className="min-h-screen bg-black relative overflow-hidden flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center relative p-4">
                {/* Background Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                    <PaymentFailureContent />
                </Suspense>
            </div>

            <Footer />
        </main>
    );
}
