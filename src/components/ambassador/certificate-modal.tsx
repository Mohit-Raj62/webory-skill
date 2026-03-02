"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Award, Trophy, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

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
                    }}
                    className="bg-white text-black absolute top-0 left-0 print:!scale-100 print:relative print:transform-none"
                >
                {/* Outer Border */}
                <div className="absolute inset-0 p-[12px]">
                    <div className="w-full h-full border-[12px] border-double border-[#1a237e] relative">
                        {/* Inner Ornamental Border */}
                        <div className="absolute inset-1 border border-[#c5a059]"></div>
                        <div className="absolute inset-3 border-2 border-[#1a237e]"></div>

                        {/* Corner Ornaments */}
                        <div className="absolute top-0 left-0 w-24 h-24 border-t-[12px] border-l-[12px] border-[#c5a059] rounded-tl-sm"></div>
                        <div className="absolute top-0 right-0 w-24 h-24 border-t-[12px] border-r-[12px] border-[#c5a059] rounded-tr-sm"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-[12px] border-l-[12px] border-[#c5a059] rounded-bl-sm"></div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-[12px] border-r-[12px] border-[#c5a059] rounded-br-sm"></div>
                    </div>
                </div>

                {/* Background Watermark and Texture */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 bg-[#fdfaf5] opacity-90 blur-[1px]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03]">
                        <Award size={650} className="text-[#1a237e]" strokeWidth={0.5} />
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-between pt-14 pb-8 px-24 border-[1px] border-transparent">
                    <div className="text-center w-full">
                        <div className="flex items-start justify-center gap-4 mb-2">
                            <Award className="text-[#c5a059] mt-1" size={40} />
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
                                <p className="text-sm text-[#c5a059] tracking-[0.2em] uppercase">Excellence in Education</p>
                                <div className="flex gap-4 mt-1">
                                    <div className="flex flex-col items-start border-l-2 border-[#c5a059] pl-2">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Govt. of India Recognized</p>
                                        <p className="text-[9px] text-[#c5a056] font-bold font-mono tracking-wider">MSME Reg: UDYAM-BR-26-0208472</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#1a237e] to-transparent mb-6 opacity-30 mt-3"></div>

                        <h1 className="text-[2.8rem] leading-none font-serif font-extrabold text-[#1a237e] mb-2 tracking-tight certificate-title drop-shadow-sm">
                            Certificate of Excellence
                        </h1>
                        <p className="text-xl text-gray-500 italic font-serif mt-2 mb-2">This proudly certifies that</p>
                    </div>

                    <div className="text-center w-full my-0 py-0 relative z-10">
                        <h2 className="text-6xl font-serif font-bold text-[#1a237e] px-12 pb-2 pt-2 inline-block border-b-2 border-[#c5a059] min-w-[500px] capitalize tracking-wide shadow-black/5 drop-shadow-sm">
                            {`${stats?.firstName || user?.firstName || ''} ${stats?.lastName || user?.lastName || ''}`.trim() || "Campus Ambassador"}
                        </h2>
                    </div>

                    <div className="text-center w-full mt-2 relative z-10 px-8">
                        <p className="text-[1.3rem] text-gray-700 font-serif max-w-4xl mx-auto leading-[1.8] tracking-wide">
                            is a recognized <span className="font-extrabold text-[#1a237e]">Campus Ambassador</span> for Webory Skills from <br/>
                            <span className="font-bold text-[#1a237e] text-3xl block mt-2 mb-2 tracking-wider uppercase">{stats?.college || "their institution"}</span> 
                            demonstrating exceptional leadership, dedication, and community participation.
                        </p>
                    </div>

                    <div className="w-full flex justify-between items-end px-16 mt-4">
                        <div className="text-center w-64">
                            <div className="border-b border-gray-400 w-full mb-1 pb-3 text-2xl font-bold text-[#1a237e] font-sans">
                                {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </div>
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Date of Issue</p>
                        </div>

                        <div className="w-64 flex justify-center pb-2">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <div className="absolute inset-0 border-4 border-[#c5a059] border-dashed rounded-full animate-[spin_10s_linear_infinite] opacity-30"></div>
                                <div className="w-28 h-28 rounded-full border-4 border-[#c5a059] flex items-center justify-center bg-yellow-50/90 shadow-inner">
                                    <div className="text-center">
                                        <Trophy className="mx-auto text-[#c5a059] mb-1" size={28} />
                                        <span className="text-xs font-bold uppercase text-[#c5a059] tracking-wider block leading-tight">Official<br/>Ambassador</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center w-64">
                            <div className="h-16 flex items-end justify-center mb-1 pb-2">
                                <span className="font-signature text-5xl text-[#1a237e] whitespace-nowrap px-2">
                                    Vijay Kumar
                                </span>
                            </div>
                            <div className="border-t border-gray-400 w-full pt-2">
                                <p className="text-sm text-gray-600 font-bold uppercase tracking-widest mt-2">Director of Education</p>
                                <p className="text-xs text-[#1a237e] font-bold">Webory Skills</p>
                            </div>
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
            <Button 
                className="bg-white text-black hover:bg-gray-200"
                onClick={() => window.print()}
            >
                Print / Save as PDF
            </Button>
            <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white" onClick={onClose}>Close</Button>
          </div>
        )}

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Mr+De+Haviland&display=swap');

          .font-serif {
              font-family: 'Playfair Display', serif;
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
                  width: 100%;
                  height: 100%;
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow: hidden !important;
                  background-color: white !important;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
              }
              #certificate-container {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 1122px !important;
                  height: 794px !important;
                  background-color: white !important;
                  display: block !important;
              }
          }
        `}</style>
      </div>
    </div>
  );
};
