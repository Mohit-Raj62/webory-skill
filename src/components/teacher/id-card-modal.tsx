"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Loader2, User, Phone, Mail, MapPin, Globe, CreditCard } from "lucide-react";
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
    phone: string;
    email: string;
    currentAddress: string;
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
                {/* Top Header Bar with Unified SVG Logo */}
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
                        <stop offset="50%" stopColor="#93c5fd" />
                        <stop offset="100%" stopColor="#c084fc" />
                      </linearGradient>
                      <linearGradient id="skillsGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.5"/>
                      </filter>
                    </defs>
                    
                    <g transform="translate(0, 0)" filter="url(#shadow)">
                      <rect width="40" height="40" rx="10" fill="url(#logoIconGrad)" />
                      <text x="20" y="28" textAnchor="middle" fill="white" style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'Inter, sans-serif' }}>W</text>
                    </g>
                    
                    <g transform="translate(55, 0)">
                      <text x="0" y="30" fill="url(#weboryGrad)" style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'Inter, sans-serif' }}>WEBORY</text>
                      <g transform="translate(108, 0)">
                        <circle cx="20" cy="6" r="3" fill="#FF9933" />
                        <circle cx="32" cy="6" r="3" fill="white" />
                        <circle cx="44" cy="6" r="3" fill="#138808" />
                        <text x="0" y="30" fill="url(#skillsGrad)" style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'Inter, sans-serif' }}>SKILLS</text>
                      </g>
                    </g>
                  </svg>
                </div>

                {/* Card Body */}
                <div className="flex h-[76%] p-4 md:p-6 gap-6 md:gap-8 relative">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(#1e293b 0.5px, transparent 0.5px)', backgroundSize: '12px 12px' }}></div>

                  {/* Left Column: Photo & Name */}
                  <div className="w-[30%] h-full flex flex-col justify-start">
                    <div className="w-full aspect-[3/4] bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center mb-4 shrink-0">
                      <User size={64} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-h-0 flex flex-col justify-center">
                      <h3 className="text-[#1e293b] font-extrabold text-xl md:text-2xl leading-none">
                        {formData.fullName || "YOUR NAME"}
                      </h3>
                      <p className="text-[#334155] font-semibold text-sm md:text-base mt-2">
                        {formData.positionApplied || "Job Position"}
                      </p>
                    </div>
                  </div>

                  {/* Center Column: Details Grid */}
                  <div className="flex-1 flex flex-col justify-start gap-2 md:gap-3 border-l-2 border-dashed border-gray-200 pl-6 md:pl-8 pt-6">
                    <div className="flex items-center gap-4">
                      <Phone size={16} className="text-[#1e293b]" strokeWidth={2.5} />
                      <span className="text-sm md:text-base font-bold text-[#334155] whitespace-nowrap">+91 {formData.phone || "123 456 7890"}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Mail size={16} className="text-[#1e293b]" strokeWidth={2.5} />
                      <span className="text-sm md:text-base font-bold text-[#334155] whitespace-nowrap">
                        {formData.email || "name@weboryskills.in"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Globe size={18} className="text-[#1e293b]" />
                      <span className="text-sm md:text-base font-bold text-[#334155]">www.weboryskills.in</span>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin size={20} className="text-[#1e293b] shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base font-bold text-[#334155] leading-snug">
                        {formData.currentAddress || "Company Head Office Address"}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: QR & Meta */}
                  <div className="w-[28%] flex flex-col items-end justify-between py-2 border-l-2 border-dashed border-gray-200 pl-4 md:pl-6">
                    <div className="w-full aspect-square border-4 border-[#1e293b] p-1.5 md:p-2 bg-white flex items-center justify-center">
                      <QRCodeSVG
                        value={`https://www.weboryskills.in/verify/${employeeId || "pending"}`}
                        size={256}
                        bgColor={"#ffffff"}
                        fgColor={"#1e293b"}
                        level={"Q"}
                        style={{ width: "100%", height: "auto", maxWidth: "100%" }}
                      />
                    </div>
                    
                    <div className="w-full mt-2 md:mt-auto">
                      <div className="w-full flex h-10 md:h-12 items-center justify-center gap-[4%] overflow-hidden">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="w-[10%] h-full bg-[#1e293b] flex-shrink-0" />
                        ))}
                      </div>
                      <p className="text-[10px] md:text-[11px] text-center font-bold tracking-widest text-[#334155] mt-1 uppercase">
                        ID: {employeeId || "WS-0000"}
                      </p>
                    </div>

                    <div className="w-full mt-4 space-y-1">
                      <div className="flex justify-between text-[8px] md:text-[10px]">
                        <span className="font-bold text-[#1e293b]">Employee ID</span>
                        <span className="font-medium text-[#334155]">: {employeeId || "WS-XXXX"}</span>
                      </div>
                      <div className="flex justify-between text-[8px] md:text-[10px]">
                        <span className="font-bold text-[#1e293b]">Date of Issue</span>
                        <span className="font-medium text-[#334155]">: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Footer Bar */}
                <div className="h-[12%] w-full bg-[#1e293b] flex items-center justify-center">
                  <p className="text-white font-semibold text-sm md:text-base tracking-widest uppercase">WWW.WEBORYSKILLS.IN</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

