"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { motion } from "framer-motion";
import { Shield, Clock, CreditCard, CheckCircle, XCircle, Mail } from "lucide-react";

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
            <Navbar />
            
            <div className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
                            <Shield className="text-blue-400" size={20} />
                            <span className="text-blue-400 text-sm font-medium">Refund Policy</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Refund & Cancellation Policy
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="glass-card rounded-2xl p-8 md:p-12 space-y-8">
                        {/* Overview */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                            <p className="text-gray-300 leading-relaxed">
                                At Webory, we strive to provide high-quality courses and internships. We understand that sometimes a course or program may not meet your expectations. This refund policy outlines the conditions under which refunds are available.
                            </p>
                        </section>

                        {/* Eligibility */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <CheckCircle className="text-green-400" size={24} />
                                Refund Eligibility
                            </h2>
                            <div className="space-y-4">
                                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                                    <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <Clock className="text-green-400" size={18} />
                                        7-Day Money-Back Guarantee
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        You can request a full refund within <strong>7 days</strong> of enrollment if you are not satisfied with the course or internship program.
                                    </p>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <h3 className="text-white font-semibold mb-2">Conditions for Refund:</h3>
                                    <ul className="text-gray-300 text-sm space-y-2 ml-4 list-disc">
                                        <li>Request must be made within 7 days of enrollment</li>
                                        <li>Less than 20% of course content has been accessed</li>
                                        <li>No certificates have been generated or downloaded</li>
                                        <li>No assignments have been submitted</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Non-Refundable */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <XCircle className="text-red-400" size={24} />
                                Non-Refundable Situations
                            </h2>
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                <ul className="text-gray-300 text-sm space-y-2 ml-4 list-disc">
                                    <li>Refund request made after 7 days of enrollment</li>
                                    <li>More than 20% of course content has been accessed</li>
                                    <li>Certificate has been generated or downloaded</li>
                                    <li>Assignments or projects have been submitted</li>
                                    <li>Promotional or discounted courses (unless otherwise stated)</li>
                                    <li>Internship programs after the start date</li>
                                </ul>
                            </div>
                        </section>

                        {/* How to Request */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <Mail className="text-blue-400" size={24} />
                                How to Request a Refund
                            </h2>
                            <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
                                <p className="text-gray-300">
                                    To request a refund, please email us at:
                                </p>
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                    <p className="text-blue-400 font-semibold text-lg">supporrtwebory@gmail.com</p>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    Please include the following information in your email:
                                </p>
                                <ul className="text-gray-300 text-sm space-y-2 ml-4 list-disc">
                                    <li>Your full name and registered email address</li>
                                    <li>Course or internship name</li>
                                    <li>Transaction ID or payment reference number</li>
                                    <li>Reason for refund request</li>
                                </ul>
                            </div>
                        </section>

                        {/* Processing Time */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                <CreditCard className="text-purple-400" size={24} />
                                Refund Processing
                            </h2>
                            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                                <ul className="text-gray-300 text-sm space-y-2">
                                    <li><strong>Review Time:</strong> 2-3 business days</li>
                                    <li><strong>Processing Time:</strong> 5-7 business days after approval</li>
                                    <li><strong>Refund Method:</strong> Original payment method (UPI/Bank Account)</li>
                                    <li><strong>Notification:</strong> You will receive an email confirmation once processed</li>
                                </ul>
                            </div>
                        </section>

                        {/* Special Cases */}
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Special Cases</h2>
                            <div className="space-y-4 text-gray-300 text-sm">
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-white font-semibold mb-2">Technical Issues</h3>
                                    <p>
                                        If you experience technical issues that prevent you from accessing the course content, please contact our support team immediately. We will work to resolve the issue or provide a full refund if the problem cannot be fixed.
                                    </p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                    <h3 className="text-white font-semibold mb-2">Course Cancellation by Webory</h3>
                                    <p>
                                        If we cancel a course or internship program, you will receive a full refund within 5-7 business days.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Contact */}
                        <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-3">Questions?</h2>
                            <p className="text-gray-300 mb-4">
                                If you have any questions about our refund policy, please don't hesitate to contact us:
                            </p>
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-300">
                                    📧 Email: <a href="mailto:supporrtwebory@gmail.com" className="text-blue-400 hover:underline">supporrtwebory@gmail.com</a>
                                </p>
                                <p className="text-gray-300">
                                    📞 Phone: +91 620 594 7359
                                </p>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}
