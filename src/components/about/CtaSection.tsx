"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
    return (
        <section className="py-24 px-4 md:px-8 relative z-10 overflow-hidden">
            <div className="max-w-5xl mx-auto relative glass-card p-12 md:p-16 rounded-3xl text-center border border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
                </div>
                
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                        Join thousands of students who have transformed their careers with Webory Skills.
                    </p>
                    <Link href="/signup">
                        <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-black hover:bg-gray-200 transition-colors font-bold shadow-xl shadow-white/5">
                            Get Started Today <ArrowRight className="ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
