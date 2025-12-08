"use client";

import { CheckCircle, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface InvoiceProps {
    transactionId: string;
    courseTitle: string;
    amount: number;
    date: string;
    userEmail: string;
    onClose: () => void;
}

export function Invoice({ transactionId, courseTitle, amount, date, userEmail, onClose }: InvoiceProps) {
    const invoiceNumber = `INV-${transactionId.substring(4, 12)}`;
    const currentDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4"
        >
            <div className="bg-white text-gray-900 w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-xl sm:rounded-2xl shadow-2xl relative print:shadow-none print:rounded-none print:max-h-none invoice-container">
                
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 md:p-8 print:p-4 print:bg-blue-600">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6 mb-4 sm:mb-6 print:gap-3 print:mb-3">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 print:text-2xl print:mb-1">INVOICE</h1>
                            <p className="text-blue-100 text-xs sm:text-sm print:text-xs">Payment Receipt</p>
                        </div>
                        <div className="w-full sm:w-auto">
                            <div className="bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg border border-white/30 print:px-2 print:py-1">
                                <p className="text-xs text-blue-100 mb-1">Invoice Number</p>
                                <p className="font-mono font-bold text-base sm:text-lg print:text-sm">{invoiceNumber}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 print:gap-2">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold mb-1 print:text-lg">Webory Skill</h2>
                            <p className="text-blue-100 text-xs sm:text-sm print:text-xs">Excellence in Education</p>
                            <p className="text-blue-100 text-xs sm:text-sm print:text-xs">www.weboryskills.in</p>
                        </div>
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 print:w-10 print:h-10">
                            <CheckCircle size={24} className="text-white sm:w-8 sm:h-8 print:w-5 print:h-5" />
                        </div>
                    </div>
                </div>

                {/* Invoice Details */}
                <div className="p-4 sm:p-6 md:p-8 print:p-4">
                    {/* Bill To & Invoice Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 print:gap-3 print:mb-4">
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 print:mb-2">Bill To</h3>
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 print:p-2">
                                <p className="font-semibold text-gray-900 text-sm sm:text-base break-all print:text-sm">{userEmail}</p>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 print:text-xs">Student Account</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 print:mb-2">Invoice Details</h3>
                            <div className="space-y-2 print:space-y-1">
                                <div className="flex justify-between text-xs sm:text-sm print:text-xs">
                                    <span className="text-gray-600">Invoice Date:</span>
                                    <span className="font-semibold text-gray-900">{date}</span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm print:text-xs">
                                    <span className="text-gray-600">Transaction ID:</span>
                                    <span className="font-mono text-[10px] sm:text-xs font-semibold text-gray-900 break-all">{transactionId}</span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm print:text-xs">
                                    <span className="text-gray-600">Payment Status:</span>
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                        <CheckCircle size={12} className="mr-1" /> Paid
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-6 sm:mb-8 print:mb-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 sm:mb-3 print:mb-2">Course Details</h3>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Desktop Table */}
                            <table className="w-full hidden sm:table">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                                        <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t border-gray-200">
                                        <td className="py-4 px-4">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 p-2 rounded-lg mt-1 flex-shrink-0">
                                                    <FileText className="text-blue-600" size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{courseTitle}</p>
                                                    <p className="text-sm text-gray-600 mt-1">Full Course Access • Lifetime Validity</p>
                                                    <p className="text-xs text-gray-500 mt-1">Includes: Videos, Quizzes, Assignments & Certificate</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <p className="text-xl font-bold text-gray-900">₹{amount.toLocaleString('en-IN')}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Mobile Card */}
                            <div className="sm:hidden p-4">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="bg-blue-100 p-2 rounded-lg flex-shrink-0">
                                        <FileText className="text-blue-600" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 text-sm">{courseTitle}</p>
                                        <p className="text-xs text-gray-600 mt-1">Full Course Access • Lifetime Validity</p>
                                        <p className="text-xs text-gray-500 mt-1">Includes: Videos, Quizzes, Assignments & Certificate</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                    <span className="text-sm text-gray-600">Amount:</span>
                                    <p className="text-xl font-bold text-gray-900">₹{amount.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Total Section */}
                    <div className="flex justify-end mb-6 sm:mb-8 print:mb-4">
                        <div className="w-full sm:w-80">
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 rounded-lg border-2 border-blue-200 print:p-3">
                                <div className="flex justify-between items-center mb-2 sm:mb-3 text-sm sm:text-base print:mb-1 print:text-sm">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold text-gray-900">₹{amount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2 sm:mb-3 text-sm sm:text-base print:mb-1 print:text-sm">
                                    <span className="text-gray-600">Tax (GST 18%):</span>
                                    <span className="font-semibold text-gray-900">₹0</span>
                                </div>
                                <div className="border-t-2 border-blue-300 pt-2 sm:pt-3 mt-2 sm:mt-3 print:pt-2 print:mt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base sm:text-lg font-bold text-gray-900 print:text-base">Total Amount:</span>
                                        <span className="text-xl sm:text-2xl font-bold text-blue-600 print:text-xl">₹{amount.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Notes */}
                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 mb-4 sm:mb-6 print:p-3 print:mb-3">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 print:text-xs print:mb-1">Payment Information</h4>
                        <p className="text-xs text-gray-600 leading-relaxed print:text-[10px]">
                            Thank you for your purchase! This invoice confirms your enrollment in <strong>{courseTitle}</strong>. 
                            You now have lifetime access to all course materials including videos, assignments, quizzes, and certificate upon completion.
                        </p>
                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 print:mt-2 print:pt-2">
                            <p className="text-xs text-gray-500 print:text-[10px]">
                                For any queries, please contact us at <strong>support@weboryskills.in</strong>
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 print:hidden">
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
                        @page {
                            size: A4;
                            margin: 10mm;
                        }
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        /* Prevent page breaks */
                        * {
                            page-break-inside: avoid;
                            break-inside: avoid;
                        }
                        /* Scale down to fit */
                        .invoice-container {
                            transform: scale(0.95);
                            transform-origin: top center;
                        }
                    }
                `}</style>
            </div>
        </motion.div>
    );
}
