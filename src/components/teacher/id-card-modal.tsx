"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Loader2, CreditCard, Trophy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface IdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    fullName: string;
    positionApplied: string;
  };
  employeeId: string;
}

export const IdCardModal = ({ isOpen, onClose, formData, employeeId }: IdCardModalProps) => {
  const [downloadingId, setDownloadingId] = useState(false);
  const idCardRef = React.useRef<HTMLDivElement>(null);

  const downloadAsPDF = async () => {
    if (!idCardRef.current) return;
    try {
      setDownloadingId(true);
      toast.info("Preparing ID Card...");
      
      const element = idCardRef.current;
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      const originalHeight = element.style.height;

      // Set fixed dimensions for consistent high-quality capture
      element.style.width = "1012px"; 
      element.style.maxWidth = "none";
      element.style.height = "638px"; 

      const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 1012,
        height: 638,
      });

      // Restore original styles
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      element.style.height = originalHeight;
      
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 53.98], 
      });
      
      pdf.addImage(imgData, "JPEG", 0, 0, 85.6, 53.98);
      pdf.save(`${employeeId || "Employee"}_ID_Card.pdf`);
      toast.success("ID Card downloaded successfully!");
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setDownloadingId(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)] border border-white/10"
          >
            {/* Modal Header */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
              <button
                onClick={downloadAsPDF}
                disabled={downloadingId}
                className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloadingId ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
                {downloadingId ? "Downloading..." : "Download"}
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 bg-white/10 hover:bg-white/20 active:bg-red-500/20 active:text-red-400 rounded-full text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* ID Card Wrapper */}
            <div className="bg-gradient-to-br from-gray-200 to-gray-400 p-2 md:p-8 rounded-3xl pointer-events-auto shadow-2xl overflow-hidden">
              <div 
                ref={idCardRef}
                className="relative w-full bg-white rounded-xl overflow-hidden shadow-xl" 
                style={{ aspectRatio: '1.586/1' }}
              >
                {/* Top Header Bar */}
                <div className="h-[12%] w-full bg-[#1e293b] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <svg width="280" height="40" viewBox="0 0 280 40" className="w-auto h-8 md:h-10 overflow-visible">
                    <defs>
                      <linearGradient id="logoIconGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#9333ea" />
                      </linearGradient>
                      <linearGradient id="weboryGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                    <g transform="translate(0, 4)">
                      <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#logoIconGrad)" />
                      <path d="M8 12 L16 24 L24 12" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="16" cy="14" r="3" fill="white" />
                      <text x="42" y="24" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="26" letterSpacing="-0.02em" fill="url(#weboryGrad)">WEBORY</text>
                      <text x="162" y="24" fontFamily="Inter, system-ui, sans-serif" fontWeight="500" fontSize="24" letterSpacing="0.05em" fill="#94a3b8">SKILLS</text>
                    </g>
                  </svg>
                </div>

                {/* Main Content Area */}
                <div className="h-[88%] w-full flex p-[4%] gap-[4%] relative">
                  {/* Left Column: Photo & QR */}
                  <div className="w-[30%] flex flex-col items-center gap-[6%] pt-[2%]">
                    <div className="w-full aspect-square rounded-lg bg-gray-50 border-2 border-gray-100 p-1 shadow-inner relative group overflow-hidden">
                      <div className="w-full h-full rounded-md bg-gray-100 flex items-center justify-center">
                        <span className="text-4xl font-bold text-gray-300">{formData.fullName?.[0] || 'W'}</span>
                      </div>
                      <div className="absolute top-0 right-0 w-4 h-16 bg-blue-500/10 -rotate-45 translate-x-4"></div>
                    </div>
                    
                    <div className="flex-1 w-full bg-gray-50 border border-gray-100 rounded-lg p-2 flex flex-col items-center justify-center gap-1">
                      <div className="bg-white p-1 rounded-sm shadow-sm border border-gray-100">
                        <QRCodeSVG value={`https://weboryskills.in/verify/${employeeId}`} size={60} level="H" includeMargin={false} />
                      </div>
                      <span className="text-[6px] font-bold text-gray-400 uppercase tracking-tighter">Scan to Verify</span>
                    </div>
                  </div>

                  {/* Right Column: User Data */}
                  <div className="flex-1 flex flex-col justify-between py-[1%]">
                    <div className="space-y-[4%]">
                      <div className="border-l-4 border-blue-500 pl-3">
                        <h2 className="text-[20px] font-black text-[#0f172a] leading-none uppercase tracking-tight mb-1">
                          {formData.fullName || "TEACHER NAME"}
                        </h2>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{formData.positionApplied || "INSTRUCTOR"}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-y-3 pt-2">
                        <div>
                          <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Employee ID</p>
                          <p className="text-[12px] font-mono font-bold text-gray-800 leading-none tracking-wider">{employeeId}</p>
                        </div>
                        <div>
                          <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Valide Since</p>
                          <p className="text-[11px] font-bold text-gray-800 leading-none">2024 - 2025</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center">
                          <Trophy size={8} className="text-blue-500" />
                        </div>
                        <p className="text-[8px] font-bold text-gray-600 leading-none">Official Verified Personnel — Webory Skills Edu-Tech</p>
                      </div>
                    </div>
                  </div>

                  {/* Aesthetic backgrounds */}
                  <div className="absolute bottom-0 right-0 w-[40%] h-[60%] bg-blue-500/5 rounded-tl-[100px] pointer-events-none -z-10"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
