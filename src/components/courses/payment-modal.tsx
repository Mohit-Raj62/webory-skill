"use client";

import { useState, useEffect } from "react";
import { X, CreditCard, Lock, Tag, Check, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    courseTitle: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    gstPercentage?: number;
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
    courseTitle,
    price,
    originalPrice,
    discountPercentage,
    gstPercentage = 0,
    courseId,
    internshipId,
    userId,
    userName,
    userEmail,
    mobileNumber,
    resourceType = "course"
}: PaymentModalProps) {
    const [loading, setLoading] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [validatingPromo, setValidatingPromo] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [finalPrice, setFinalPrice] = useState(Math.round(price + (price * gstPercentage / 100)));
    const [basePrice, setBasePrice] = useState(price); // Price after course discount, before promo
    const [errorMessage, setErrorMessage] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(mobileNumber || "");

    const resourceId = resourceType === "course" ? courseId : internshipId;

    // HISTORY API HACK DISABLED:
    // This was likely causing the crash on iOS Safari.
    // Re-enabling this requires careful testing with 'popstate' and 'pushState' limits.
    /*
    useEffect(() => {
        if (isOpen) {
            try {
                window.history.pushState({ modalOpen: true }, "", window.location.href);
            } catch (e) {
                console.warn("History pushState failed", e);
            }

            const handlePopState = (event: PopStateEvent) => {
                onClose();
            };

            window.addEventListener("popstate", handlePopState);

            return () => {
                window.removeEventListener("popstate", handlePopState);
            };
        }
    }, [isOpen, onClose]);
    */

    const handleClose = () => {
        // Simple close without history manipulation for now
        onClose();
        
        /* 
        try {
            if (window.history.state?.modalOpen) {
                window.history.back();
            } else {
                onClose();
            }
        } catch (e) {
            onClose();
        }
        */
    };

    const handleValidatePromo = async () => {
        setErrorMessage("");
        if (!promoCode.trim()) {
            setErrorMessage("Please enter a promo code");
            return;
        }

        setValidatingPromo(true);
        try {
            const res = await fetch("/api/promo-codes/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: promoCode,
                    itemType: resourceType,
                    price: price,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setAppliedPromo(data.promoCode);

                // Calculate new base price
                let newBasePrice = price;
                if (data.promoCode.discountType === "percentage") {
                    newBasePrice = Math.round(price * (1 - data.promoCode.discountValue / 100));
                } else {
                    newBasePrice = Math.max(0, price - data.promoCode.discountValue);
                }

                setBasePrice(newBasePrice);
                const gstAmount = newBasePrice * (gstPercentage / 100);
                setFinalPrice(Math.round(newBasePrice + gstAmount));

                toast.success(`Promo code applied! You save ₹${price - newBasePrice}`);
            } else {
                const error = await res.json();
                const msg = error.error || "Invalid promo code";
                setErrorMessage(msg);
                toast.error(msg);
                setAppliedPromo(null);
                setBasePrice(price);
                setFinalPrice(Math.round(price + (price * gstPercentage / 100)));
            }
        } catch (error) {
            console.error("Error validating promo code:", error);
            setErrorMessage("Failed to validate promo code");
            setAppliedPromo(null);
            setBasePrice(price);
            setFinalPrice(Math.round(price + (price * gstPercentage / 100)));
        } finally {
            setValidatingPromo(false);
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoCode("");
        setBasePrice(price);
        setFinalPrice(Math.round(price + (price * gstPercentage / 100)));
        toast.info("Promo code removed");
    };

    const loadBoltScript = () => {
        return new Promise((resolve) => {
            if ((window as any).bolt) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            const isTest = process.env.NEXT_PUBLIC_PAYU_TEST_MODE === 'true';
            script.src = isTest 
                ? "https://sboxcheckout-static.citruspay.com/bolt/run/bolt.min.js" 
                : "https://checkout-static.citruspay.com/bolt/run/bolt.min.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const submitPayUForm = (params: any, url: string) => {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = url;

        for (const key in params) {
            if (Object.prototype.hasOwnProperty.call(params, key)) {
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = params[key];
                form.appendChild(input);
            }
        }
        document.body.appendChild(form);
        form.submit();
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (phoneNumber.length !== 10) {
            toast.error("Please enter a valid 10-digit mobile number");
            return;
        }

        if (!resourceId) {
            toast.error("Invalid resource ID");
            return;
        }

        setLoading(true);

        try {
            const scriptLoaded = await loadBoltScript();
            if (!scriptLoaded) {
                toast.error("Failed to load payment gateway. Please check connection.");
                setLoading(false);
                return;
            }

            const txnid = "Txn" + new Date().getTime() + Math.floor(Math.random() * 10000);
            const productinfo = courseTitle;
            const firstname = userName || "User"; 
            const email = userEmail || "user@example.com";
            
            console.log("Payment Debug:", {
                mode: process.env.NEXT_PUBLIC_PAYU_TEST_MODE,
                txnid,
                firstname,
                amount: finalPrice,
                resourceType
            });
            
            const res = await fetch("/api/payment/payu/hash", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    txnid,
                    amount: finalPrice,
                    productinfo,
                    firstname,
                    email,
                    udf1: userId,
                    udf2: resourceType,
                    udf3: resourceId
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Failed to initiate payment");
                setLoading(false);
                return;
            }

            const hash = data.hash;
            const key = data.key;
            const surl = `${window.location.origin}/api/payment/payu/response`;
            const furl = `${window.location.origin}/api/payment/payu/response`;

            const paymentData = {
                key,
                txnid,
                hash,
                amount: finalPrice.toString(),
                firstname,
                email,
                phone: phoneNumber,
                productinfo,
                surl,
                furl,
                udf1: userId,
                udf2: resourceType,
                udf3: resourceId
            };

            const bolt = (window as any).bolt;
            bolt.launch(paymentData, {
                responseHandler: function(BOLT: any) {
                    console.log("Bolt Response:", BOLT.response);
                    
                    if (BOLT.response.txnStatus === 'SUCCESS') {
                         submitPayUForm(BOLT.response, surl);
                    } else if (BOLT.response.txnStatus === 'CANCEL') {
                        setLoading(false);
                        toast.error("Payment Cancelled");
                    } else {
                        setLoading(false);
                        toast.error("Payment Failed: " + (BOLT.response.txnMessage || "Unknown Error"));
                        // Optional: Log failure to backend if needed, but don't redirect
                    }
                },
                catchException: function(BOLT: any) {
                    console.error("Bolt Error:", BOLT.message);
                    toast.error("Payment Error: " + BOLT.message);
                    setLoading(false);
                }
            });

        } catch (error) {
            console.error("Payment Error:", error);
            toast.error("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6">
            <div className="glass-card w-full max-w-md p-0 rounded-3xl relative border border-white/10 shadow-2xl shadow-purple-500/20 max-h-[90vh] overflow-y-auto bg-[#0a0a0a]">
                {/* Header with Gradient */}
                <div className="relative p-6 pb-8 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-black/50 overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2.5 bg-black/30 hover:bg-white/20 rounded-full text-white/90 hover:text-white transition-all z-20 backdrop-blur-sm"
                        aria-label="Close"
                    >
                        <X size={22} />
                    </button>
                    
                    {/* Optional Back Button Visual (for mobile feel) */}
                        <button
                        onClick={handleClose}
                        className="absolute top-4 left-4 p-2.5 bg-black/30 hover:bg-white/20 rounded-full text-white/90 hover:text-white transition-all z-20 backdrop-blur-sm md:hidden"
                        aria-label="Back"
                    >
                        <ArrowLeft size={22} />
                    </button>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 rotate-3">
                            <CreditCard size={32} className="text-white drop-shadow-md" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Secure Checkout</h2>
                        <p className="text-blue-200/80 text-sm mt-1 font-medium text-center px-4">
                            Complete your purchase for <br/>
                            <span className="text-white font-semibold">{courseTitle}</span>
                        </p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Price Display */}
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">Course Price</span>
                            <span className="text-white font-medium">₹{basePrice}</span>
                        </div>
                        
                        {gstPercentage > 0 && (
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400 text-sm">GST ({gstPercentage}%)</span>
                                <span className="text-white font-medium">₹{Math.round(basePrice * gstPercentage / 100)}</span>
                            </div>
                        )}

                        <div className="h-px bg-white/10 my-2"></div>

                        <div className="flex justify-between items-end">
                            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Payable</span>
                            <div className="flex flex-col items-end">
                                {originalPrice && (discountPercentage || 0) > 0 && !appliedPromo && (
                                    <span className="text-gray-500 line-through text-xs">₹{Math.round(originalPrice + (originalPrice * gstPercentage / 100))}</span>
                                )}
                                <span className="text-4xl font-bold tracking-tight text-white">₹{finalPrice}</span>
                            </div>
                        </div>

                        {appliedPromo && (
                            <div className="mt-3 flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 w-fit">
                                <Tag size={12} />
                                <span>Code {appliedPromo.code} Applied</span>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handlePayment} className="space-y-5">
                        {/* Phone Number Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                                Mobile Number <span className="text-red-400">*</span>
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors">
                                    <div className="bg-white/10 p-1.5 rounded-md">
                                        <span className="text-xs font-bold text-white">+91</span>
                                    </div>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Enter 10-digit number"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-14 pr-4 text-white placeholder:text-gray-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                />
                            </div>
                        </div>

                        {/* Promo Code Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                                Discount Code
                            </label>

                            {!appliedPromo ? (
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Have a coupon?"
                                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-purple-500/50 outline-none uppercase text-sm font-medium transition-colors"
                                            value={promoCode}
                                            onChange={(e) => {
                                                setPromoCode(e.target.value.toUpperCase());
                                                setErrorMessage("");
                                            }}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={handleValidatePromo}
                                        disabled={validatingPromo || !promoCode.trim()}
                                        className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 rounded-xl px-6 transition-all"
                                    >
                                        {validatingPromo ? "..." : "Apply"}
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-green-900/20 border border-green-500/30 rounded-xl p-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-1 bg-green-500/20 rounded-full">
                                            <Check size={14} className="text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-green-400 font-bold text-sm">{appliedPromo.code}</p>
                                            <p className="text-green-500/70 text-xs">
                                                Saved ₹{price - basePrice}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleRemovePromo}
                                        className="text-white/40 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                            {errorMessage && (
                                <p className="text-red-400 text-xs mt-1 ml-1 flex items-center gap-1">
                                    <AlertCircle size={12} />
                                    {errorMessage}
                                </p>
                            )}
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-xl py-6 relative overflow-hidden group border-0"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <div className="relative flex flex-col items-center">
                                    <span className="text-lg font-bold">
                                        {loading ? "Processing..." : `Pay ₹${finalPrice} Now`}
                                    </span>
                                    {!loading && <span className="text-[10px] uppercase tracking-widest opacity-80">Secure via PayU Bolt</span>}
                                </div>
                            </Button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                                <Lock size={12} />
                                <span>256-bit SSL Encrypted Payment</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
