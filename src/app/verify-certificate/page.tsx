"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export default function VerificationSearchPage() {
  const [certificateId, setCertificateId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certificateId.trim()) {
      window.location.href = `/verify-certificate/${certificateId.trim()}`;
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="w-full max-w-2xl text-center space-y-8">
          <div className="mx-auto w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 mb-6">
            <ShieldCheck size={40} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Verify Certificate
          </h1>
          
          <p className="text-xl text-gray-400 max-w-lg mx-auto">
            Enter the unique certificate ID to verify the authenticity of a Webory Skills certificate.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="Enter Certificate ID (e.g., REACT-123...)"
                className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-32 text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              <Button 
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full bg-blue-600 hover:bg-blue-700 px-6"
              >
                Verify
              </Button>
            </div>
          </form>

          <div className="pt-8 text-sm text-gray-500">
            <p>
              Having trouble? Contact <a href="mailto:support@webory.in" className="text-blue-400 hover:underline">support@webory.in</a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
