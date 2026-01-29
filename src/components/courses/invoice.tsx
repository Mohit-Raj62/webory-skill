import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface InvoiceProps {
    transactionId: string;
    courseTitle: string;
    amount: number;
    gstPercentage?: number;
    gstAmount?: number;
    date: string;
    userEmail: string;
    onClose: () => void;
}

export function Invoice({ transactionId, courseTitle, amount, gstPercentage = 0, gstAmount = 0, date, userEmail, onClose }: InvoiceProps) {
    const [mounted, setMounted] = useState(false);
    const invoiceNumber = `INV-${transactionId.substring(4, 12)}`;
    
    // Calculate Base Amount (Amount - GST)
    const calculatedGstAmount = gstAmount > 0 
        ? gstAmount 
        : gstPercentage > 0 
            ? Math.round(amount - (amount / (1 + gstPercentage / 100))) 
            : 0;
            
    const baseAmount = amount - calculatedGstAmount;
    
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
                <div className="bg-white border-b border-gray-200 p-8 print:p-0 print:border-b-2 print:border-gray-800 print:mb-6 relative overflow-hidden">
                    {/* PAID Stamp */}
                    <div className="absolute top-4 right-32 transform rotate-12 opacity-10 pointer-events-none select-none">
                        <div className="border-[8px] border-green-600 rounded-lg p-2">
                             <span className="text-8xl font-black text-green-600 uppercase tracking-widest">PAID</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-start mb-8 relative z-10">
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
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-1">INVOICE</h1>
                            <p className="text-sm text-gray-500 font-medium">#{invoiceNumber}</p>
                        </div>
                    </div>
                    
                     <div className="grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Billed To</h3>
                            <p className="text-gray-900 font-semibold text-lg">{userEmail.split('@')[0]}</p>
                            <p className="text-gray-500 text-sm">{userEmail}</p>
                        </div>
                        <div className="text-right">
                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date Issued</h3>
                             <p className="text-gray-900 font-semibold text-lg">{date}</p>
                        </div>
                    </div>
                </div>

                {/* Invoice Details */}
                <div className="p-8 print:p-0 print:pt-4">
                    
                    {/* Items Table */}
                    <div className="mb-8 print:mb-4">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-900">
                                    <th className="text-left py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Item Description</th>
                                    <th className="text-right py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Price</th>
                                    <th className="text-right py-4 text-xs font-bold text-gray-900 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="py-6">
                                        <p className="font-bold text-gray-900 text-lg mb-1">{courseTitle}</p>
                                        <p className="text-sm text-gray-500">Lifetime Access • Course Materials • Certificate</p>
                                    </td>
                                     <td className="py-6 text-right text-gray-600">₹{baseAmount.toLocaleString('en-IN')}</td>
                                    <td className="py-6 text-right font-bold text-gray-900">₹{baseAmount.toLocaleString('en-IN')}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Total Section */}
                    <div className="flex justify-end mb-12 print:mb-8">
                        <div className="w-64">
                            <div className="flex justify-between py-2 text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{baseAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-2 text-gray-600">
                                <span>Tax ({gstPercentage}%)</span>
                                <span>₹{calculatedGstAmount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-4 border-t-2 border-gray-900 mt-2">
                                <span className="font-bold text-xl text-gray-900">Total</span>
                                <span className="font-bold text-xl text-blue-600">₹{amount.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 pt-8 print:pt-4">
                        <div className="flex justify-between items-end">
                            <div>
                                <h4 className="font-bold text-gray-900 mb-2">Thank you for your business!</h4>
                                <p className="text-sm text-gray-500 w-2/3">
                                    This invoice serves as proof of payment for your enrollment. 
                                    Confirmation of your lifetime access to the course materials.
                                </p>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                                <p>support@weboryskills.in</p>
                                <p>www.weboryskills.in</p>
                            </div>
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
                        
                        /* 2. Hide EVERYTHING on the body (The nuclear option) */
                        body > * {
                            display: none !important;
                        }

                        /* 3. But wait! The Portal is a direct child of body, or close to it. */
                        /* We need to use specific selector logic or just accept that we need to 
                           make sure the portal root is NOT hidden. 
                           However, createPortal usually appends to body. 
                           So 'body > *' hides it too if we aren't careful.
                           Strategy: Hide everything, then show the specific print target.
                        */

                        /* Let's try to only hide the main 'next' root if we can identify it. Usually #__next or body > div:first-child */
                        /* Better approach: layout isolation. */
                        
                        body, html {
                            height: auto !important;
                            overflow: visible !important;
                            background: white !important;
                        }
                    }
                `}</style>
                {/* Specific global style to hide siblings when this is mounted, simpler than logic */ }
                 <style jsx global>{`
                    @media print {
                       body > *:not([class*="invoice-portal-root"]) {
                           display: none !important;
                       }
                       
                       /* Ensure the portal itself is visible */
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
