"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Lock, Calendar, Tag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (transactionId: string, promoCode?: string) => void;
    courseTitle: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
}

export function PaymentModal({
    isOpen,
    onClose,
    onSuccess,
    courseTitle,
    price,
    originalPrice,
    discountPercentage
}: PaymentModalProps) {
    const [loading, setLoading] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [promoCode, setPromoCode] = useState("");
    const [validatingPromo, setValidatingPromo] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState < any > (null);
    const [finalPrice, setFinalPrice] = useState(price);

    const handleValidatePromo = async () => {
        if (!promoCode.trim()) {
            toast.error("Please enter a promo code");
            return;
        }

        setValidatingPromo(true);
        try {
            const res = await fetch("/api/promo-codes/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: promoCode,
                    itemType: "course",
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setAppliedPromo(data.promoCode);

                // Calculate new price
                let newPrice = price;
                if (data.promoCode.discountType === "percentage") {
                    newPrice = Math.round(price * (1 - data.promoCode.discountValue / 100));
                } else {
                    newPrice = Math.max(0, price - data.promoCode.discountValue);
                }

                setFinalPrice(newPrice);
                toast.success(`Promo code applied! You save ₹${price - newPrice}`);
            } else {
                const error = await res.json();
                toast.error(error.error || "Invalid promo code");
                setAppliedPromo(null);
                setFinalPrice(price);
            }
        } catch (error) {
            console.error("Error validating promo code:", error);
            toast.error("Failed to validate promo code");
            setAppliedPromo(null);
            setFinalPrice(price);
        } finally {
            setValidatingPromo(false);
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoCode("");
        setFinalPrice(price);
        toast.info("Promo code removed");
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate payment processing
        setTimeout(() => {
            setLoading(false);
            const transactionId = "TXN-" + Math.random().toString(36).substr(2, 9).toUpperCase();
            onSuccess(transactionId, appliedPromo?.code);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="glass-card w-full max-w-md p-8 rounded-2xl relative border-blue-500/30 max-h-[90vh] overflow-y-auto"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                            <CreditCard size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Secure Checkout</h2>
                        <p className="text-gray-400 mt-2">
                            Purchasing <span className="text-white font-semibold">{courseTitle}</span>
                        </p>

                        {/* Price Display */}
                        <div className="mt-4 space-y-2">
                            {originalPrice && discountPercentage && discountPercentage > 0 ? (
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-gray-500 line-through text-lg">₹{originalPrice}</span>
                                    <span className="text-3xl font-bold text-white">₹{price}</span>
                                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-semibold border border-green-500/30">
                                        {discountPercentage}% OFF
                                    </span>
                                </div>
                            ) : (
                                <p className="text-3xl font-bold text-white">₹{price}</p>
                            )}

                            {appliedPromo && finalPrice !== price && (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                    <p className="text-sm text-gray-400">Final Price with Promo Code:</p>
                                    <p className="text-2xl font-bold text-green-400">₹{finalPrice}</p>
                                    <p className="text-xs text-green-500 mt-1">
                                        You save ₹{price - finalPrice} more!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4">
                        {/* Promo Code Section */}
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                            <label className="text-sm text-gray-300 block mb-2 flex items-center gap-2">
                                <Tag size={16} className="text-purple-400" />
                                Have a Promo Code?
                            </label>

                            {!appliedPromo ? (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter code"
                                        className="flex-1 bg-black/20 border border-white/10 rounded-lg p-2 text-white focus:border-purple-500/50 outline-none uppercase"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleValidatePromo}
                                        disabled={validatingPromo || !promoCode.trim()}
                                        className="bg-purple-600 hover:bg-purple-700"
                                    >
                                        {validatingPromo ? "..." : "Apply"}
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-green-500/20 border border-green-500/30 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                        <Check size={18} className="text-green-400" />
                                        <span className="text-white font-semibold">{appliedPromo.code}</span>
                                        <span className="text-green-400 text-sm">
                                            ({appliedPromo.discountType === "percentage"
                                                ? `${appliedPromo.discountValue}% off`
                                                : `₹${appliedPromo.discountValue} off`})
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemovePromo}
                                        className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="text-sm text-gray-300 block mb-2">Card Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    maxLength={19}
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-blue-500/50 outline-none font-mono"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                />
                                <CreditCard className="absolute left-3 top-3.5 text-gray-500" size={18} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">Expiry Date</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-blue-500/50 outline-none font-mono"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                    />
                                    <Calendar className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">CVC</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        maxLength={3}
                                        placeholder="123"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 pl-10 text-white focus:border-blue-500/50 outline-none font-mono"
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value)}
                                    />
                                    <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0 py-6 text-lg font-bold mt-6"
                        >
                            {loading ? "Processing..." : `Pay ₹${finalPrice}`}
                        </Button>

                        <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                            <Lock size={12} /> Payments are secure and encrypted.
                        </p>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
