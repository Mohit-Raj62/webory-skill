"use client";

import { useState, useEffect } from "react";
import { Check, X, Eye, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter, Calendar, User, CreditCard as CreditCardIcon, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PaymentVerificationPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'pending' | 'verified' | 'rejected'>('pending');
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [processing, setProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchPayments();
    }, [filter]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/payments?status=${filter}`);
            if (res.ok) {
                const data = await res.json();
                setPayments(data.paymentProofs);
            }
        } catch (error) {
            console.error("Failed to fetch payments", error);
            toast.error("Failed to load payments");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (paymentId: string) => {
        if (!confirm("Are you sure you want to verify this payment and enroll the student?")) return;

        setProcessing(true);
        try {
            const res = await fetch(`/api/admin/payments/${paymentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "verify" }),
            });

            if (res.ok) {
                toast.success("Payment verified and student enrolled!");
                fetchPayments();
                setSelectedPayment(null);
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to verify payment");
            }
        } catch (error) {
            toast.error("Failed to verify payment");
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async (paymentId: string) => {
        if (!rejectionReason.trim()) {
            toast.error("Please provide a rejection reason");
            return;
        }

        setProcessing(true);
        try {
            const res = await fetch(`/api/admin/payments/${paymentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    action: "reject",
                    rejectionReason 
                }),
            });

            if (res.ok) {
                toast.success("Payment rejected");
                fetchPayments();
                setSelectedPayment(null);
                setRejectionReason("");
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to reject payment");
            }
        } catch (error) {
            toast.error("Failed to reject payment");
        } finally {
            setProcessing(false);
        }
    };

    const filteredPayments = payments.filter(payment => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            payment.student?.firstName?.toLowerCase().includes(query) ||
            payment.student?.lastName?.toLowerCase().includes(query) ||
            payment.student?.email?.toLowerCase().includes(query) ||
            payment.transactionId?.toLowerCase().includes(query) ||
            payment.course?.title?.toLowerCase().includes(query)
        );
    });

    const stats = {
        pending: payments.filter(p => p.status === 'pending').length,
        verified: payments.filter(p => p.status === 'verified').length,
        rejected: payments.filter(p => p.status === 'rejected').length,
    };

    return (
        <div className="p-4 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Payment Verification</h1>
                    <p className="text-gray-400 text-sm md:text-base">Review and verify student payment proofs</p>
                </div>
                
                {/* Search Bar - Mobile Responsive */}
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, TXN ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
            </div>

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="glass-card p-4 md:p-6 rounded-xl border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs md:text-sm mb-1">Pending</p>
                            <p className="text-2xl md:text-3xl font-bold text-white">{stats.pending}</p>
                        </div>
                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                            <Clock className="text-yellow-400" size={24} />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4 md:p-6 rounded-xl border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs md:text-sm mb-1">Verified</p>
                            <p className="text-2xl md:text-3xl font-bold text-white">{stats.verified}</p>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <CheckCircle className="text-green-400" size={24} />
                        </div>
                    </div>
                </div>

                <div className="glass-card p-4 md:p-6 rounded-xl border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-xs md:text-sm mb-1">Rejected</p>
                            <p className="text-2xl md:text-3xl font-bold text-white">{stats.rejected}</p>
                        </div>
                        <div className="p-3 bg-red-500/20 rounded-lg">
                            <XCircle className="text-red-400" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs - Responsive */}
            <div className="flex flex-wrap gap-2">
                <Button
                    onClick={() => setFilter('pending')}
                    size="sm"
                    className={`${filter === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-white/10 hover:bg-white/20'} transition-all`}
                >
                    <Clock size={16} className="mr-2" />
                    <span className="hidden sm:inline">Pending</span>
                    <span className="sm:hidden">Pending ({stats.pending})</span>
                </Button>
                <Button
                    onClick={() => setFilter('verified')}
                    size="sm"
                    className={`${filter === 'verified' ? 'bg-green-600 hover:bg-green-700' : 'bg-white/10 hover:bg-white/20'} transition-all`}
                >
                    <CheckCircle size={16} className="mr-2" />
                    <span className="hidden sm:inline">Verified</span>
                    <span className="sm:hidden">Verified ({stats.verified})</span>
                </Button>
                <Button
                    onClick={() => setFilter('rejected')}
                    size="sm"
                    className={`${filter === 'rejected' ? 'bg-red-600 hover:bg-red-700' : 'bg-white/10 hover:bg-white/20'} transition-all`}
                >
                    <XCircle size={16} className="mr-2" />
                    <span className="hidden sm:inline">Rejected</span>
                    <span className="sm:hidden">Rejected ({stats.rejected})</span>
                </Button>
            </div>

            {/* Payment List */}
            {loading ? (
                <div className="glass-card p-12 rounded-2xl text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading payments...</p>
                </div>
            ) : filteredPayments.length === 0 ? (
                <div className="glass-card p-12 rounded-2xl text-center">
                    <AlertCircle className="mx-auto text-gray-500 mb-4" size={48} />
                    <p className="text-gray-400 text-lg mb-2">No {filter} payments found</p>
                    {searchQuery && (
                        <p className="text-gray-500 text-sm">Try adjusting your search query</p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredPayments.map((payment) => (
                        <div key={payment._id} className="glass-card p-4 md:p-6 rounded-2xl hover:bg-white/5 transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                {/* Payment Info */}
                                <div className="flex-1 space-y-3">
                                    {/* Header */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                                <User className="text-blue-400" size={18} />
                                            </div>
                                            <h3 className="text-lg md:text-xl font-bold text-white">
                                                {payment.student?.firstName} {payment.student?.lastName}
                                            </h3>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            payment.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                            payment.status === 'verified' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                            'bg-red-500/20 text-red-400 border border-red-500/30'
                                        }`}>
                                            {payment.status.toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Details Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <User size={14} className="text-purple-400" />
                                            <span className="truncate">{payment.student?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Package size={14} className="text-blue-400" />
                                            <span className="truncate">{payment.course?.title || payment.internship?.title || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <CreditCardIcon size={14} className="text-green-400" />
                                            <span className="font-mono">₹{payment.amount}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <CreditCardIcon size={14} className="text-yellow-400" />
                                            <span className="font-mono text-xs">{payment.transactionId}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 sm:col-span-2">
                                            <Calendar size={14} className="text-orange-400" />
                                            <span>{new Date(payment.submittedAt).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {payment.promoCode && (
                                        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-1.5 text-sm text-green-400">
                                            <Check size={14} />
                                            Promo: {payment.promoCode}
                                        </div>
                                    )}

                                    {payment.rejectionReason && (
                                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
                                            <strong>Rejection Reason:</strong> {payment.rejectionReason}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex lg:flex-col gap-2 flex-wrap lg:flex-nowrap">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setSelectedPayment(payment)}
                                        className="border-white/20 hover:bg-white/10 flex-1 lg:flex-none"
                                    >
                                        <Eye size={16} className="mr-1" />
                                        View
                                    </Button>
                                    {payment.status === 'pending' && (
                                        <>
                                            <Button
                                                size="sm"
                                                onClick={() => handleVerify(payment._id)}
                                                disabled={processing}
                                                className="bg-green-600 hover:bg-green-700 flex-1 lg:flex-none"
                                            >
                                                <Check size={16} className="mr-1" />
                                                Verify
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedPayment(payment);
                                                    setRejectionReason("");
                                                }}
                                                disabled={processing}
                                                className="bg-red-600 hover:bg-red-700 flex-1 lg:flex-none"
                                            >
                                                <X size={16} className="mr-1" />
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Screenshot Modal - Responsive */}
            {selectedPayment && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-3xl my-8">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-[#0a0a0a] border-b border-white/10 p-4 md:p-6 flex items-center justify-between rounded-t-2xl z-10">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-white">Payment Screenshot</h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    {selectedPayment.student?.firstName} {selectedPayment.student?.lastName}
                                </p>
                            </div>
                            <button 
                                onClick={() => {
                                    setSelectedPayment(null);
                                    setRejectionReason("");
                                }} 
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-4 md:p-6 space-y-6">
                            {/* Screenshot */}
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <img 
                                    src={selectedPayment.screenshot} 
                                    alt="Payment Screenshot" 
                                    className="w-full rounded-lg"
                                />
                            </div>

                            {/* Payment Details */}
                            <div className="glass-card p-4 rounded-xl space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Transaction ID:</span>
                                    <span className="text-white font-mono">{selectedPayment.transactionId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Amount:</span>
                                    <span className="text-white font-bold">₹{selectedPayment.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Course/Internship:</span>
                                    <span className="text-white">{selectedPayment.course?.title || selectedPayment.internship?.title || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Submitted:</span>
                                    <span className="text-white">{new Date(selectedPayment.submittedAt).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            {selectedPayment.status === 'pending' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-300 block mb-2">Rejection Reason (if rejecting)</label>
                                        <textarea
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Enter reason for rejection..."
                                            rows={3}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-red-500 transition-colors resize-none"
                                        />
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button
                                            onClick={() => handleVerify(selectedPayment._id)}
                                            disabled={processing}
                                            className="flex-1 bg-green-600 hover:bg-green-700 h-12"
                                        >
                                            <Check size={18} className="mr-2" />
                                            {processing ? "Processing..." : "Verify & Enroll"}
                                        </Button>
                                        <Button
                                            onClick={() => handleReject(selectedPayment._id)}
                                            disabled={processing || !rejectionReason.trim()}
                                            className="flex-1 bg-red-600 hover:bg-red-700 h-12"
                                        >
                                            <X size={18} className="mr-2" />
                                            {processing ? "Processing..." : "Reject Payment"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
