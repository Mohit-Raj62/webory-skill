"use client";

import { CheckCircle, Download } from "lucide-react";
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
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <div className="bg-white text-gray-900 w-full max-w-md p-8 rounded-2xl shadow-2xl relative">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
                    <p className="text-gray-500">Thank you for your purchase.</p>
                </div>

                <div className="border-t border-b border-gray-200 py-4 mb-6 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Transaction ID</span>
                        <span className="font-mono font-medium">{transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Date</span>
                        <span className="font-medium">{date}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Billed To</span>
                        <span className="font-medium">{userEmail}</span>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-8 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-500">Course</p>
                        <p className="font-bold text-gray-900">{courseTitle}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-bold text-xl text-gray-900">${amount}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.print()}>
                        <Download className="mr-2 h-4 w-4" /> Download Invoice
                    </Button>
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50" onClick={onClose}>
                        Continue to Course
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
