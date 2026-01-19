"use client";

import { X } from "lucide-react";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    // Keeping other props to avoid type errors in parent
    courseTitle: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    courseId?: string;
    internshipId?: string;
    userId: string;
    userName: string;
    userEmail: string;
    mobileNumber?: string;
    resourceType?: "course" | "internship";
}

export function PaymentModal({
    isOpen,
    onClose,
}: PaymentModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6">
            <div className="glass-card w-full max-w-md p-8 rounded-3xl relative border border-white/10 bg-[#0a0a0a] text-center">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white/70 hover:text-white"
                >
                    <X size={20} />
                </button>
                
                <h2 className="text-2xl font-bold text-white mb-4">Test Modal</h2>
                <p className="text-gray-300 mb-6">
                    If you can see this on iOS, the crash was caused by the logic inside the previous modal (hooks, Payment gateway script, etc).
                </p>
                
                <div className="bg-green-500/20 text-green-400 p-4 rounded-xl border border-green-500/30">
                    ✅ Isolation Test Active
                </div>
            </div>
        </div>
    );
}
