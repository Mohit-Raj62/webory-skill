"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Award, Trophy, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: any;
  stats: any;
  user: any;
}

export const CertificateModal = ({ isOpen, onClose, reward, stats, user }: CertificateModalProps) => {
  const [certScale, setCertScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      // Calculate space needed for modal padding and fixed banners
      const paddingX = window.innerWidth < 768 ? 32 : 64; 
      const paddingY = 180; // Space for the top close button and bottom Print banner
      
      const availableWidth = window.innerWidth - paddingX;
      const availableHeight = window.innerHeight - paddingY;
      
      const scaleX = availableWidth / 1122;
      const scaleY = availableHeight / 794;
      
      // Scale down to fit the smallest dimension, but cap at 1 to prevent enlarging past native size
      setCertScale(Math.min(scaleX, scaleY, 1));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200 print:absolute print:inset-auto print:p-0 print:bg-transparent print:backdrop-blur-none">
      <div className="bg-[#111] border border-white/10 p-2 text-center rounded-3xl max-w-6xl w-full shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:p-0">
        <div className="absolute top-4 right-4 z-20 text-gray-500 hover:text-white cursor-pointer bg-black/50 p-2 rounded-full print:hidden" onClick={onClose}>
          <AlertCircle size={24} className="rotate-45" />
        </div>
        
        {reward.id === "cert" ? (
          <div className="relative w-full overflow-hidden bg-[#111] p-0 md:p-8 flex justify-center pb-24 print:pb-0 print:p-0 print:bg-white print:overflow-visible my-12 md:my-0 print:m-0">
            {/* Flexible Scaling Container */}
            <div 
                id="certificate-container-parent"
                className="relative mx-auto overflow-hidden shadow-2xl print:shadow-none print:overflow-visible"
                style={{
                    width: `${1122 * certScale}px`,
                    height: `${794 * certScale}px`,
                    maxWidth: '100%',
                }}
            >
                <div 
                    id="certificate-container"
                    style={{
                        width: '1122px', 
                        height: '794px', 
                        transform: `scale(${certScale})`,
                        transformOrigin: 'top left',
                        background: 'radial-gradient(circle at center, #ffffff 0%, #f9f7f2 100%)',
                    }}
                    className="text-black absolute top-0 left-0 print:!scale-100 print:relative print:transform-none shadow-[0_0_50px_rgba(0,0,0,0.1)] overflow-hidden"
                >
                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                {/* Main Borders */}
                <div className="absolute inset-0 p-8">
                    <div className="w-full h-full border-[16px] border-[#1a237e] relative shadow-inner">
                        {/* Gold Inner Line */}
                        <div className="absolute inset-1 border-[2px] border-[#c5a059]"></div>
                        {/* White Spacer */}
                        <div className="absolute inset-2 border-[1px] border-white/50"></div>
                        
                        {/* Corner Decorative Elements */}
                        <div className="absolute -top-4 -left-4 w-32 h-32 flex items-center justify-center">
                            <div className="w-16 h-16 border-t-4 border-l-4 border-[#c5a059] rounded-tl-xl font-serif text-[#c5a059] text-4xl flex items-center justify-center">✧</div>
                        </div>
                        <div className="absolute -top-4 -right-4 w-32 h-32 flex items-center justify-center">
                            <div className="w-16 h-16 border-t-4 border-r-4 border-[#c5a059] rounded-tr-xl font-serif text-[#c5a059] text-4xl flex items-center justify-center">✧</div>
                        </div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 flex items-center justify-center">
                            <div className="w-16 h-16 border-b-4 border-l-4 border-[#c5a059] rounded-bl-xl font-serif text-[#c5a059] text-4xl flex items-center justify-center">✧</div>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 flex items-center justify-center">
                            <div className="w-16 h-16 border-b-4 border-r-4 border-[#c5a059] rounded-br-xl font-serif text-[#c5a059] text-4xl flex items-center justify-center">✧</div>
                        </div>
                    </div>
                </div>

                {/* Background Watermark and Texture */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-[#fdfaf5] opacity-90 blur-[1px]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
                        <Award size={650} className="text-[#1a237e]" strokeWidth={0.5} />
                    </div>
                </div>

                {/* Content Layer */}
                <div className="relative z-10 h-full flex flex-col items-center justify-between pt-20 pb-16 px-32">
                    <div className="absolute top-20 right-24 text-right">
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Date: {new Date(reward.redeemedAt || new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        <p className="text-[8px] text-[#c5a059] font-bold tracking-widest uppercase mt-0.5">ID: WB-AMB-{new Date(reward.redeemedAt || new Date()).getFullYear()}-{(Math.random() * 10000).toFixed(0).padStart(4, '0')}</p>
                    </div>

                    {/* Header Section */}
                    <div className="text-center w-full">
                        <div className="flex items-start justify-center gap-4 mb-2">
                            <Award className="text-[#c5a059] mt-1" size={40} strokeWidth={1.5} />
                            <div className="text-left">
                                <h2 className="text-3xl font-bold text-[#1a237e] tracking-wide uppercase font-serif">
                                    WEBORY <span className="relative inline-block ml-2">
                                        <span className="absolute -top-1.5 left-[30%] -translate-x-1/2 flex gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-white border border-gray-200"></span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"></span>
                                        </span>
                                        SKILLS
                                    </span>
                                </h2>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-[#c5a059] tracking-[0.2em] uppercase font-bold">Excellence in Education</p>
                                    <span className="text-[9px] bg-[#1a237e]/5 text-[#1a237e] px-2 py-0.5 rounded-full font-black border border-[#1a237e]/10 tracking-widest uppercase ml-2 animate-pulse">
                                        Elite Member
                                    </span>
                                </div>
                                <div className="flex gap-4 mt-1">
                                    <div className="flex flex-col items-start border-l-2 border-[#c5a059] pl-2">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide leading-tight">Govt. of India Recognized</p>
                                        <p className="text-[9px] text-[#c5a056] font-bold font-mono tracking-wider">MSME Reg: UDYAM-BR-26-0208472</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#1a237e] to-transparent mb-6 opacity-30 mt-3"></div>

                        <h1 className="text-[2.6rem] leading-none font-serif font-black text-[#1a237e] mb-2 tracking-tight drop-shadow-sm">
                            Certificate of Excellence
                        </h1>
                        <p className="text-lg text-gray-400 italic font-serif mt-2 mb-2">This proudly certifies that</p>
                    </div>

                    <div className="text-center w-full my-0 py-0 relative z-10 flex items-center justify-center">
                        <h2 className="text-5xl font-serif font-black px-12 pb-2 pt-2 inline-block relative group">
                            <span className="relative z-10 capitalize drop-shadow-md tracking-wide text-[#c5a059]">
                                {`${stats?.firstName || user?.firstName || ''} ${stats?.lastName || user?.lastName || ''}`.trim() || "Campus Ambassador"}
                            </span>
                            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent"></div>
                        </h2>
                    </div>

                    <div className="text-center w-full mt-2 relative z-10 px-8">
                        <p className="text-lg text-gray-700 font-serif leading-relaxed tracking-wide">
                            is recognized as a <span className="font-extrabold text-[#1a237e] border-b-2 border-[#c5a059]/50">Campus Ambassador</span> for Webory Skills from <br/>
                            <span className="font-black text-[#1a237e] text-2xl block mt-2 mb-2 tracking-wider uppercase drop-shadow-sm">{stats?.college || "their institution"}</span> 
                            for demonstrating exceptional leadership, professional dedication, and outstanding community contributions.
                        </p>
                    </div>

                    {/* Skills & Competencies Section */}
                    <div className="w-full flex justify-center gap-12 my-2 py-4 border-y border-[#c5a059]/10 relative">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fcfaf7] px-4">
                            <span className="text-[10px] text-[#c5a059] font-black uppercase tracking-[0.3em]">Competencies Earned</span>
                        </div>
                        
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full bg-[#1a237e]/5 flex items-center justify-center text-[#1a237e]">
                                <Users size={14} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Leadership</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full bg-[#1a237e]/5 flex items-center justify-center text-[#1a237e]">
                                <Trophy size={14} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Brand Growth</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full bg-[#1a237e]/5 flex items-center justify-center text-[#1a237e]">
                                <Award size={14} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Networking</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-full bg-[#1a237e]/5 flex items-center justify-center text-[#1a237e]">
                                <Truck size={14} />
                            </div>
                            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Event Ops</span>
                        </div>
                    </div>

                    <div className="w-full flex justify-between items-end px-12 mt-4 relative">
                        {/* Verification QR (Prominent & Top-Left Inset) */}
                        <div className="absolute -left-12 top-[-340px] text-left opacity-95 transition-all hover:opacity-100 group/qr z-20">
                            <div className="p-3 border-2 border-[#c5a059] rounded-2xl bg-white shadow-2xl backdrop-blur-md relative overflow-hidden transform hover:scale-110 transition-all duration-300">
                                <QRCodeSVG 
                                    value={`https://www.weboryskills.in/verify-certificate/${reward.historyId || reward.id}`}
                                    size={100}
                                    level="H"
                                    includeMargin={false}
                                    imageSettings={{
                                        src: "/favicon.ico", // Or a small logo if available
                                        x: undefined,
                                        y: undefined,
                                        height: 12,
                                        width: 12,
                                        excavate: true,
                                    }}
                                />
                                {/* Security Overlay */}
                                <div className="absolute inset-0 border border-[#1a237e]/5 rounded-xl pointer-events-none"></div>
                            </div>
                            <p className="text-[7px] text-[#1a237e] font-black uppercase mt-1.5 tracking-[0.2em] text-center drop-shadow-sm">Scan to Verify</p>
                        </div>

                        {/* Director Signature (Left) */}
                        <div className="text-center w-72 mb-4">
                            <div className="h-16 flex items-end justify-center mb-1">
                                <span className="font-signature text-4xl text-[#1a237e] opacity-90 drop-shadow-sm transform -rotate-2 select-none">
                                    Vijay Kumar
                                </span>
                            </div>
                            <div className="w-full h-[1.5px] bg-[#c5a059]/40 mb-2 max-w-[160px] mx-auto"></div>
                            <p className="text-[10px] text-[#1a237e] font-black uppercase tracking-[0.2em]">Director of Education</p>
                            <p className="text-[8px] text-[#c5a059] font-bold tracking-widest uppercase">Webory Skills</p>
                        </div>

                        {/* Professional Seal (Center) */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
                            <div className="relative w-36 h-36 flex items-center justify-center">
                                {/* Outer Glow */}
                                <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-2xl animate-pulse"></div>
                                
                                {/* Metallic Gold Seal Base */}
                                <div className="absolute inset-0 rounded-full border-[6px] border-[#c5a059] bg-gradient-to-br from-[#fcf9f2] via-[#c5a059] to-[#806020] shadow-2xl flex items-center justify-center p-1">
                                    <div className="w-full h-full rounded-full border border-[#1a237e]/20 flex items-center justify-center bg-white shadow-inner">
                                         {/* Seal Content */}
                                        <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-2">
                                            <Award className="text-[#c5a059] mb-1" size={24} strokeWidth={1.5} />
                                            <span className="text-[10px] font-black uppercase text-[#1a237e] tracking-wider leading-none">OFFICIAL<br/>VERIFIED</span>
                                            <div className="mt-1 flex gap-1 items-center">
                                                <div className="w-1 h-1 rounded-full bg-[#FF9933]"></div>
                                                <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                                                <div className="w-1 h-1 rounded-full bg-[#138808]"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative outer rings */}
                                <div className="absolute inset-[-4px] rounded-full border border-[#c5a059] opacity-30"></div>
                                <div className="absolute inset-[-8px] rounded-full border border-[#c5a059] opacity-10"></div>
                            </div>
                        </div>

                        {/* CEO Signature (Right) */}
                        <div className="text-center w-72 mb-4">
                            <div className="h-16 flex items-end justify-center mb-1">
                                <span className="font-signature text-4xl text-[#1a237e] opacity-90 drop-shadow-sm transform rotate-1 select-none">
                                    Mohit Sinha
                                </span>
                            </div>
                            <div className="w-full h-[1.5px] bg-[#c5a059]/40 mb-2 max-w-[160px] mx-auto"></div>
                            <p className="text-[10px] text-[#1a237e] font-black uppercase tracking-[0.2em]">CEO & Founder</p>
                            <p className="text-[8px] text-[#c5a059] font-bold tracking-widest uppercase">Webory Skills • MSME Certified</p>
                        </div>
                    </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
          <div className="p-10 text-center text-white print:hidden">
            <span className="text-6xl block mb-6">{reward.image}</span>
            <h3 className="text-2xl font-bold mb-4">Your {reward.name}</h3>
            <p className="text-gray-400 mb-8">This digital reward is currently active on your account.</p>
            <Button onClick={onClose} variant="outline" className="border-white/10 hover:bg-white/5">Close</Button>
          </div>
        )}
        
        {reward.id === "cert" && (
          <div className="absolute inset-x-0 bottom-0 bg-black/80 backdrop-blur-md p-4 flex justify-center gap-4 border-t border-white/10 z-30 print:hidden">
            <div className="flex flex-col items-center gap-2">
                <Button 
                    className="bg-white text-black hover:bg-gray-200"
                    onClick={() => window.print()}
                >
                    Print / Save as PDF
                </Button>
                <p className="text-[10px] text-yellow-400/60 font-medium animate-pulse">
                    Tip: Enable "Background graphics" in print settings for the best look!
                </p>
            </div>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white" onClick={onClose}>Close</Button>
          </div>
        )}

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Mr+De+Haviland&family=Cinzel:wght@400;700;900&display=swap');

          .font-serif {
              font-family: 'Playfair Display', serif;
          }
          .font-cinzel {
              font-family: 'Cinzel', serif;
          }
          .font-signature {
              font-family: 'Mr De Haviland', cursive;
          }

          @media print {
              @page {
                  size: A4 landscape;
                  margin: 0;
              }
              html, body {
                  width: 100% !important;
                  height: 100% !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow: visible !important;
                  background-color: white !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
              }
              body {
                  visibility: hidden !important;
              }
              /* Reset all potential parent containers that might shift the certificate */
              main, .container, #certificate-container-parent {
                  display: block !important;
                  visibility: hidden !important;
                  position: static !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  width: auto !important;
                  height: auto !important;
                  overflow: visible !important;
              }
              #certificate-container, 
              #certificate-container * {
                  visibility: visible !important;
                  -webkit-print-color-adjust: exact !important;
              }
              #certificate-container {
                  position: fixed !important;
                  left: 0 !important;
                  top: 0 !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 297mm !important;
                  height: 210mm !important;
                  display: block !important;
                  z-index: 9999999 !important;
                  background: radial-gradient(circle at center, #ffffff 0%, #f9f7f2 100%) !important;
                  transform: scale(1) !important;
                  transform-origin: top left !important;
                  page-break-after: avoid !important;
              }
          }
        `}</style>
      </div>
    </div>
  );
};
