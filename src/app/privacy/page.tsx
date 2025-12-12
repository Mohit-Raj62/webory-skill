"use client";

import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 md:px-8 pt-32 pb-20">
                <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
                <p className="text-gray-400 mb-8">Last updated: November 27, 2024</p>

                <div className="space-y-8 text-gray-300 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                        <p>
                            Welcome to Webory Skills ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at privacyskillwebory@gmail.com .
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                        <p className="mb-4">
                            We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li>Personal Information Provided by You: Names, email addresses, passwords, contact preferences, etc.</li>
                            <li>Payment Data: We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                        <p>
                            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Sharing Your Information</h2>
                        <p>
                            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Security of Your Information</h2>
                        <p>
                            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                        <p>
                            If you have questions or comments about this policy, you may email us at privacyskillwebory@gmail.com or by post to:
                        </p>
                        <address className="mt-4 not-italic text-gray-400">
                            Webory Skills Inc.<br />
                           Near by jbit college Dehradun<br />
                            Dehradun, Uttarakhand 248197<br />
                            India
                        </address>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
