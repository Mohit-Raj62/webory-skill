import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface InvoiceProps {
    transactionId: string;
    courseTitle: string;
    amount: number;
    originalAmount?: number;
    discountAmount?: number;
    gstPercentage?: number;
    gstAmount?: number;
    date: string;
    userEmail: string;
    userName?: string;
    userPhone?: string;
    couponCode?: string;
    couponDiscount?: number;
    onClose: () => void;
}

export function Invoice({ 
    transactionId, 
    courseTitle, 
    amount, 
    originalAmount, 
    discountAmount, 
    gstPercentage = 0, 
    gstAmount = 0, 
    date, 
    userEmail, 
    userName, 
    userPhone, 
    couponCode,
    couponDiscount = 0,
    onClose 
}: InvoiceProps) {
    const [mounted, setMounted] = useState(false);
    const invoiceNumber = `INV-${transactionId.substring(4, 12)}`;
    
    // Calculate Base Amount (Amount - GST)
    const calculatedGstAmount = gstAmount > 0 
        ? gstAmount 
        : gstPercentage > 0 
            ? Math.round(amount - (amount / (1 + gstPercentage / 100))) 
            : 0;
            
    const netAmount = amount - calculatedGstAmount;
    
    // Determine original subtotal and discount for display
    const displayOriginalAmount = originalAmount || (discountAmount ? amount + discountAmount : amount);
    const displayDiscountAmount = discountAmount || (originalAmount ? originalAmount - amount : 0);
    const subtotalBeforeDiscount = displayOriginalAmount / (1 + gstPercentage / 100);
    const discountBeforeTax = displayDiscountAmount / (1 + gstPercentage / 100);

    useEffect(() => {
        setMounted(true);
        // Lock body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!mounted) return null;

    return createPortal(
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:p-0 print:bg-white print:block print:relative invoice-portal-root"
        >
            <div className="bg-white text-gray-900 w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl relative print:shadow-none print:rounded-none print:max-h-none print:w-full print:max-w-none invoice-container">
                
                {/* Header Section */}
                <div className="bg-white border-b border-gray-200 p-8 print:p-2 print:border-b-2 print:border-gray-800 print:mb-2 relative overflow-hidden">
                    {/* PAID Stamp */}
                    <div className="absolute top-4 right-32 transform rotate-12 opacity-10 pointer-events-none select-none print:hidden">
                        <div className="border-[8px] border-green-600 rounded-lg p-2">
                             <span className="text-8xl font-black text-green-600 uppercase tracking-widest">PAID</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-start mb-8 print:mb-2 relative z-10">
                        <div className="flex items-center gap-3">
                             <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">W</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Webory Skills</h2>
                                <p className="text-sm text-gray-500">Excellence in Education</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h1 className="text-4xl print:text-2xl font-extrabold text-gray-900 tracking-tight mb-1">INVOICE</h1>
                            <p className="text-sm print:text-xs text-gray-500 font-medium">#{invoiceNumber}</p>
                        </div>
                    </div>
                    
                     <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Billed To</h3>
                            <p className="text-gray-900 font-semibold text-lg">{userName || userEmail.split('@')[0]}</p>
                            <p className="text-gray-500 text-sm">{userEmail}</p>
                            {userPhone && <p className="text-gray-500 text-sm">{userPhone}</p>}
                        </div>
                        <div className="text-right">
                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date Issued</h3>
                             <p className="text-gray-900 font-semibold text-lg print:text-base">{date}</p>
                        </div>
                    </div>
                </div>

                {/* Invoice Details */}
                <div className="p-8 print:p-2 print:pt-1">
                    
                    <div className="grid grid-cols-2 gap-8 mb-10 print:mb-2">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Issued By</h3>
                            <p className="text-gray-900 font-bold">Webory Skills India</p>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                BR-01, janpara, patna<br />
                                Bihar, 841112<br />
                            </p>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Verification</h3>
                            <div className="w-20 h-20 print:w-16 print:h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 mb-1 p-1">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://weboryskills.in/verify/${transactionId}`} 
                                    alt="QR Code" 
                                    className="w-full h-full grayscale opacity-70"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 uppercase font-medium">Scan to Verify</p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-10 print:mb-2">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-900">
                                    <th className="text-left py-4 print:py-2 text-xs font-bold text-gray-900 uppercase tracking-wider">Item Description</th>
                                    <th className="text-right py-4 print:py-2 text-xs font-bold text-gray-900 uppercase tracking-wider">Price</th>
                                    <th className="text-right py-4 print:py-2 text-xs font-bold text-gray-900 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="py-6 print:py-3">
                                        <p className="font-bold text-gray-900 text-lg print:text-base mb-1">{courseTitle}</p>
                                        <p className="text-sm print:text-xs text-gray-500 mb-2">Lifetime Access • Course Materials • Certification</p>
                                        <div className="flex gap-2">
                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-blue-100">Course</span>
                                            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider border border-green-100">Premium</span>
                                        </div>
                                    </td>
                                     <td className="py-6 print:py-3 text-right">
                                        {displayDiscountAmount > 0 ? (
                                            <div className="flex flex-col items-end">
                                                <span className="text-gray-400 line-through text-sm print:text-xs">₹{subtotalBeforeDiscount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                                <span className="text-gray-900 print:text-sm">₹{(subtotalBeforeDiscount - discountBeforeTax).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-600 print:text-sm">₹{netAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                        )}
                                     </td>
                                    <td className="py-6 print:py-3 text-right font-bold text-gray-900 print:text-sm">₹{(subtotalBeforeDiscount - discountBeforeTax).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Summary and Signature Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 print:mb-4">
                        <div className="flex flex-col justify-end">
                             <div className="mt-4 flex flex-col items-start">
                                <style dangerouslySetInnerHTML={{ __html: `
                                    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap');
                                `}} />
                                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Authorized Signatory</p>
                                <div className="h-12 flex items-center">
                                    <span style={{ fontFamily: '"Dancing Script", cursive' }} className="text-2xl text-gray-800 opacity-90 select-none">
                                        Mohit sinha
                                    </span>
                                </div>
                                <div className="w-40 h-px bg-gray-300"></div>
                                <span className="mt-1 text-[10px] text-gray-400 uppercase tracking-wider">
                                        Founder, Webory Skills
                                    </span>
                             </div>
                        </div>

                        <div className="flex justify-end">
                            <div className="w-full max-w-[280px] space-y-3">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotalBeforeDiscount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                </div>
                                
                                {displayDiscountAmount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
                                        <span>Course Discount Applied</span>
                                        <span>-₹{discountBeforeTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                    </div>
                                )}

                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-sm text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                                        <span>Coupon ({couponCode || 'PROMO'})</span>
                                        <span>-₹{(couponDiscount / (1 + gstPercentage / 100)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Taxable Value</span>
                                    <span>₹{netAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                </div>

                                <div className="flex justify-between text-sm text-gray-600 border-b border-gray-100 pb-2">
                                    <span>GST ({gstPercentage}%)</span>
                                    <span>₹{calculatedGstAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                </div>
                                
                                <div className="flex justify-between items-baseline pt-2">
                                    <span className="font-extrabold text-lg print:text-base text-gray-900 uppercase tracking-tighter">Amount Paid</span>
                                    <div className="text-right">
                                        <span className="font-black text-3xl print:text-xl text-blue-600">₹{amount.toLocaleString('en-IN')}</span>
                                        <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Total inclusive of taxes</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 pt-8 print:pt-2">
                        <div className="flex justify-between items-start mb-6 print:mb-2">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Webory Skills</h4>
                                <p className="text-sm text-gray-500">Transforming Careers through Practical Learning</p>
                            </div>
                            <div className="text-right text-xs text-gray-400 space-y-1">
                                <p>Email: support@weboryskills.in</p>
                                <p>Web: www.weboryskills.in</p>
                                <p className="font-bold text-gray-500"> janpara • Patna •Bihar </p>
                            </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-100 text-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2 font-bold">Important Notes</p>
                            <p className="text-[10px] text-gray-500 leading-relaxed italic max-w-2xl mx-auto">
                                This is a computer-generated invoice and does not require a physical signature. 
                                All disputes are subject to Dehradun (Uttarakhand) jurisdiction. Thank you for choosing Webory Skills.
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8 print:hidden">
                        <Button 
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-11 sm:h-12 font-semibold text-sm sm:text-base" 
                            onClick={() => window.print()}
                        >
                            <Download className="mr-2 h-4 w-4" /> Download PDF
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 h-11 sm:h-12 font-semibold text-sm sm:text-base" 
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                </div>

                {/* Print Styles */}
                <style jsx global>{`
                    @media print {
                        /* 1. Reset Page */
                        @page {
                            size: A4;
                            margin: 10mm;
                        }
                        
                        body, html {
                            height: auto !important;
                            overflow: visible !important;
                            background: white !important;
                        }
                    }
                `}</style>
                <style jsx global>{`
                    @media print {
                       body > *:not([class*="invoice-portal-root"]) {
                           display: none !important;
                       }
                       
                       .invoice-portal-root {
                           display: block !important;
                           position: absolute !important;
                           top: 0 !important;
                           left: 0 !important;
                           width: 100% !important;
                           height: auto !important;
                           z-index: 9999 !important;
                           background: white !important;
                       }

                       .invoice-container {
                            box-shadow: none !important;
                            border: none !important;
                       }
                    }
                `}</style>
            </div>
        </motion.div>,
        document.body
    );
}
