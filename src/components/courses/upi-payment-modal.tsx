"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Check, AlertCircle, QrCode, Tag, Smartphone, Building2, CreditCard, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import QRCode from "qrcode";

interface UPIPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (transactionId: string, promoCode?: string) => void;
    courseTitle: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    courseId?: string; // Optional - for courses
    internshipId?: string; // Optional - for internships
}

export function UPIPaymentModal({
    isOpen,
    onClose,
    onSuccess,
    courseTitle,
    price,
    originalPrice,
    discountPercentage,
    courseId,
    internshipId
}: UPIPaymentModalProps) {
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [transactionId, setTransactionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [promoCode, setPromoCode] = useState("");
    const [validatingPromo, setValidatingPromo] = useState(false);
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [finalPrice, setFinalPrice] = useState(price);
    const [errorMessage, setErrorMessage] = useState("");
    const [activeTab, setActiveTab] = useState<'upi' | 'bank' | 'card'>('upi');

    // UPI Configuration - UPDATE THESE WITH YOUR DETAILS
    const UPI_ID = "singm2698-1@okaxis"; // Replace with your UPI ID
    const PAYEE_NAME = "Skill Webory"; // Replace with your name

    useEffect(() => {
        if (isOpen) {
            generateQRCode(finalPrice);
        }
    }, [isOpen, finalPrice]);

    const generateQRCode = async (amount: number) => {
        try {
            // UPI Deep Link Format
            const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Payment for ${courseTitle}`)}`;
            
            const qrDataUrl = await QRCode.toDataURL(upiUrl, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
            
            setQrCodeUrl(qrDataUrl);
        } catch (error) {
            console.error("QR Code generation failed:", error);
            toast.error("Failed to generate QR code");
        }
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
                body: JSON.stringify({ code: promoCode, orderValue: price })
            });

            const data = await res.json();

            if (res.ok && data.valid) {
                setAppliedPromo(data.promoCode);
                setFinalPrice(data.finalPrice);
                toast.success(`Promo code applied! You saved ₹${price - data.finalPrice}`);
            } else {
                setErrorMessage(data.error || "Invalid promo code");
                toast.error(data.error || "Invalid promo code");
            }
        } catch (error) {
            setErrorMessage("Failed to validate promo code");
            toast.error("Failed to validate promo code");
        } finally {
            setValidatingPromo(false);
        }
    };

    const handleRemovePromo = () => {
        setAppliedPromo(null);
        setPromoCode("");
        setFinalPrice(price);
        setErrorMessage("");
        toast.info("Promo code removed");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshot(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!screenshot) {
            toast.error("Please upload payment screenshot");
            return;
        }

        if (!transactionId.trim()) {
            toast.error("Please enter transaction ID");
            return;
        }

        setLoading(true);

        try {
            // First, upload screenshot to get URL
            const formData = new FormData();
            formData.append("file", screenshot);
            
            // Upload to your storage (you can use Cloudinary, AWS S3, or local storage)
            // For now, we'll create a simple data URL
            const reader = new FileReader();
            reader.readAsDataURL(screenshot);
            
            reader.onload = async () => {
                const screenshotUrl = reader.result as string;
                
                const payload = {
                    courseId: courseId,
                    internshipId: internshipId,
                    transactionId,
                    amount: finalPrice,
                    screenshot: screenshotUrl,
                    promoCode: appliedPromo?.code,
                    paymentType: courseId ? "course" : "internship",
                };

                console.log('Submitting payment proof:', payload);
                
                // Submit payment proof for admin verification
                const res = await fetch("/api/payments/submit-proof", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const data = await res.json();
                console.log('API Response:', data);

                if (res.ok) {
                    toast.success(
                        "🎉 Purchase Successful! Your payment has been received. You'll get access within 1-2 hours after admin verification.",
                        { duration: 5000 }
                    );
                    onClose();
                    // Optionally refresh the page or show a pending status
                    setTimeout(() => {
                        window.location.reload();
                    }, 2500);
                } else {
                    toast.error(data.error || "Failed to submit payment");
                    setLoading(false);
                }
            };

            reader.onerror = () => {
                toast.error("Failed to process screenshot");
                setLoading(false);
            };
        } catch (error) {
            console.error("Payment submission failed:", error);
            toast.error("Failed to submit payment");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-6 flex items-center justify-between z-10">
                        <div>
                            <h2 className="text-2xl font-bold text-white">UPI Payment</h2>
                            <p className="text-gray-400 text-sm mt-1">{courseTitle}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <X size={24} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Price Display */}
                        <div className="glass-card p-6 rounded-xl">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-gray-400">Amount to Pay</span>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-white">₹{finalPrice}</div>
                                    {appliedPromo && (
                                        <div className="text-sm text-gray-500 line-through">₹{price}</div>
                                    )}
                                </div>
                            </div>

                            {/* Promo Code Section */}
                            {!appliedPromo ? (
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Have a promo code?</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter code"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
                                        />
                                        <Button
                                            onClick={handleValidatePromo}
                                            disabled={validatingPromo}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            {validatingPromo ? "Checking..." : "Apply"}
                                        </Button>
                                    </div>
                                    {errorMessage && (
                                        <div className="flex items-center gap-2 text-red-400 text-sm">
                                            <AlertCircle size={14} />
                                            {errorMessage}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-green-400">
                                        <Check size={16} />
                                        <span className="font-medium">{appliedPromo.code}</span>
                                        <span className="text-sm">- Saved ₹{price - finalPrice}</span>
                                    </div>
                                    <button onClick={handleRemovePromo} className="text-red-400 hover:text-red-300 text-sm">
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Payment Method Tabs */}
                        <div className="flex p-1 bg-white/5 rounded-xl mb-6">
                            <button
                                type="button"
                                onClick={() => setActiveTab('upi')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                    activeTab === 'upi' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Smartphone size={18} />
                                UPI / QR
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('bank')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                    activeTab === 'bank' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Building2 size={18} />
                                Bank Transfer
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('card')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                                    activeTab === 'card' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <CreditCard size={18} />
                                Card
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="glass-card p-6 rounded-xl text-center mb-6">
                            {activeTab === 'upi' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <QrCode className="text-blue-400" size={24} />
                                        <h3 className="text-xl font-bold text-white">Scan QR Code</h3>
                                    </div>
                                    
                                    {qrCodeUrl && (
                                        <div className="bg-white p-4 rounded-xl inline-block mb-4">
                                            <img src={qrCodeUrl} alt="UPI QR Code" className="w-64 h-64" />
                                        </div>
                                    )}

                                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4">
                                        <p className="text-gray-400 text-xs mb-1">UPI ID</p>
                                        <div className="flex items-center justify-center gap-2">
                                            <code className="text-blue-400 font-mono">{UPI_ID}</code>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(UPI_ID);
                                                    toast.success("UPI ID copied!");
                                                }}
                                                className="text-gray-500 hover:text-white p-1"
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-400">
                                        <p>Scan with any UPI app:</p>
                                        <div className="flex items-center justify-center gap-4 text-xs">
                                            <span>📱 PhonePe</span>
                                            <span>💳 Google Pay</span>
                                            <span>💰 Paytm</span>
                                            <span>🏦 BHIM</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'bank' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                                    <div className="flex items-center gap-2 mb-6 justify-center">
                                        <Building2 className="text-blue-400" size={24} />
                                        <h3 className="text-xl font-bold text-white">Bank Details</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 text-sm">Account Name</span>
                                                <span className="text-white font-medium text-right">Skill Webory Technologies</span>
                                            </div>
                                            <div className="h-px bg-white/10" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 text-sm">Account Number</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-mono">7545684542</span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText("7545684542");
                                                            toast.success("Account Number copied!");
                                                        }}
                                                        className="text-blue-400 hover:text-blue-300 p-1"
                                                    >
                                                        <Copy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="h-px bg-white/10" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 text-sm">IFSC Code</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-mono">KKBK0005658</span>
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText("KKBK0005658");
                                                            toast.success("IFSC Code copied!");
                                                        }}
                                                        className="text-blue-400 hover:text-blue-300 p-1"
                                                    >
                                                        <Copy size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="h-px bg-white/10" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 text-sm">Bank Name</span>
                                                <span className="text-white">Kotak Mahindra Bank</span>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                                            <p className="text-yellow-400 text-xs flex items-start gap-2">
                                                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                                                Please use IMPS for instant transfer. NEFT/RTGS may take 2-4 hours.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'card' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-8">
                                    <CreditCard className="text-gray-600 mx-auto mb-4" size={48} />
                                    <h3 className="text-lg font-bold text-white mb-2">Card Payment</h3>
                                    <p className="text-gray-400 text-sm mb-6">
                                        Direct card payments are currently under maintenance.
                                    </p>
                                    <Button 
                                        type="button"
                                        onClick={() => setActiveTab('upi')}
                                        variant="outline"
                                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                    >
                                        Use UPI Instead
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Payment Proof Upload */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="glass-card p-6 rounded-xl space-y-4">
                                <h3 className="text-lg font-bold text-white">Upload Payment Proof</h3>
                                
                                <div>
                                    <label className="text-sm text-gray-300 block mb-2">Transaction ID / UTR Number *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter 12-digit transaction ID"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-300 block mb-2">Payment Screenshot *</label>
                                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="screenshot-upload"
                                            required
                                        />
                                        <label htmlFor="screenshot-upload" className="cursor-pointer">
                                            {screenshot ? (
                                                <div className="flex items-center justify-center gap-2 text-green-400">
                                                    <Check size={20} />
                                                    <span>{screenshot.name}</span>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <Upload className="mx-auto text-gray-400" size={32} />
                                                    <p className="text-gray-400">Click to upload screenshot</p>
                                                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                    <div className="flex items-start gap-2 text-yellow-400 text-sm">
                                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                        <p>Your enrollment will be activated after payment verification (usually within 1-2 hours)</p>
                                    </div>
                                </div>

                                {/* Refund Policy */}
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <div className="space-y-2 text-sm">
                                        <h4 className="font-semibold text-blue-400 flex items-center gap-2">
                                            <AlertCircle size={16} />
                                            Refund Policy
                                        </h4>
                                        <ul className="text-gray-300 space-y-1 ml-6 list-disc">
                                            <li>Refunds available within 7 days of enrollment</li>
                                            <li>No refund if more than 20% course content accessed</li>
                                            <li>Processing time: 5-7 business days</li>
                                            <li>Contact support@webory.in for refund requests</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    className="flex-1"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                    disabled={loading}
                                >
                                    {loading ? "Submitting..." : "Submit Payment"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
