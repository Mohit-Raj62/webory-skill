import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { FAQ } from "@/components/landing/faq";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";

export const metadata = {
    title: "Frequently Asked Questions (FAQ) | Webory Skills",
    description: "Got questions about Webory Skills? Explore our FAQs on AI roadmaps, courses, internships, and mentorship.",
};

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col justify-between">
            <Navbar />

            <div className="pt-24 pb-12 flex-1">
                <FAQ />

                {/* Additional Help / Contact Box */}
                <div className="max-w-4xl mx-auto px-4 -mt-8 pb-16">
                    <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center gap-4 backdrop-blur-md">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                            <MessageSquare size={22} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">Still Have Questions?</h3>
                            <p className="text-sm text-gray-400 max-w-md">
                                Can't find the answer you're looking for? Reach out to our student support team and we'll help you right away.
                            </p>
                        </div>
                        <Link href="/contact">
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6 font-semibold">
                                Contact Support <ArrowRight size={15} className="ml-1.5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
