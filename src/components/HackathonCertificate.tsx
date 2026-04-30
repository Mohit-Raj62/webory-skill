"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle2, QrCode, ShieldCheck, Trophy, Sparkles, Code2, Medal } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";

interface HackathonCertificateProps {
  type: "winner" | "participant";
  studentName: string;
  hackathonTitle: string;
  projectName: string;
  rank?: number;
  issueDate: string;
  certificateId: string;
  domain?: string;
  collaborations?: { name: string, logo?: string }[];
  signatures?: {
    founder: { name: string, title: string },
    director: { name: string, title: string },
    partner: { name: string, title: string },
  };
}

export default function HackathonCertificate({
  type,
  studentName,
  hackathonTitle,
  projectName,
  rank,
  issueDate,
  certificateId,
  domain,
  collaborations,
  signatures
}: HackathonCertificateProps) {
  const isWinner = type === "winner";
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [qrUrl, setQrUrl] = useState(`https://weboryskills.in/certificates/${certificateId}`);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        setQrUrl(`${window.location.origin}/certificates/${certificateId}`);
    }
  }, [certificateId]);

  // Define theme colors based on rank/participation
  const themeAccent = isWinner ? (rank === 1 ? 'from-amber-400 to-yellow-600' : rank === 2 ? 'from-slate-300 to-slate-500' : 'from-orange-400 to-orange-600') : 'from-blue-600 to-indigo-600';
  const themeBg = isWinner ? (rank === 1 ? 'bg-amber-50' : rank === 2 ? 'bg-slate-50' : 'bg-orange-50') : 'bg-blue-50';
  const themeText = isWinner ? (rank === 1 ? 'text-amber-700' : rank === 2 ? 'text-slate-700' : 'text-orange-800') : 'text-blue-800';
  const themeBorder = isWinner ? (rank === 1 ? 'border-amber-200' : rank === 2 ? 'border-slate-300' : 'border-orange-300') : 'border-blue-200';

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        const containerWidth = wrapperRef.current.offsetWidth;
        const certificateWidth = 1122; // Fixed base width
        // Add some padding to avoid edge clipping
        const newScale = Math.min(1, (containerWidth - 32) / certificateWidth);
        setScale(newScale);
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    
    // Fallback for older browsers
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      className="w-full flex flex-col items-center justify-center p-4 overflow-hidden print:overflow-visible print:block !print:p-0 !print:m-0" 
      ref={wrapperRef}
    >
      <div 
        className="origin-top transition-transform duration-300 ease-out print:transform-none !print:m-0 !print:p-0"
        style={{
          transform: `scale(${scale})`,
          width: '1122px',
          height: '794px',
          marginBottom: scale < 1 ? `-${794 * (1 - scale)}px` : '0px'
        }}
      >
        <div 
          id="certificate-container"
          className="bg-white relative shadow-2xl flex flex-col items-center justify-between p-8 md:p-12 print-exact overflow-hidden h-full w-full !print:p-8"
          style={{ 
            width: '1122px',
            height: '794px',
            WebkitPrintColorAdjust: "exact", 
            printColorAdjust: "exact" 
          }}
        >
          {/* Background Graphic Patterns */}
          <div className="absolute inset-0 pointer-events-none opacity-5" style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}></div>

          {/* Webory Center Logo Watermark */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-[0.08]">
            <div className="flex flex-col items-center transform scale-[3] md:scale-[3.5]">
                <div className="text-center font-black">
                    <h1 className="text-5xl tracking-tighter text-slate-900 leading-none">WEBORY SKILLS</h1>
                    <div className="relative mt-2">
                        <div className="flex gap-1 items-center justify-center mb-1">
                            <div className="w-2 h-2 rounded-full bg-[#FF9933]"></div>
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            <div className="w-2 h-2 rounded-full bg-[#138808]"></div>
                        </div>
                        <span className="text-2xl tracking-[0.2em] text-slate-800 uppercase block">Skills</span>
                    </div>
                </div>
            </div>
          </div>
          
          {/* Angled Tech Slashes */}
          <div className={`absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br ${themeAccent} opacity-10 rotate-45 transform origin-center`}></div>
          <div className={`absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br ${themeAccent} opacity-10 rotate-45 transform origin-center`}></div>

          {/* Main Beautiful Border inside */}
          <div className={`w-full h-full relative z-10 border-[12px] border-double ${themeBorder} flex flex-col justify-between p-8 bg-white/80 backdrop-blur-sm`}>
            
            {/* Header Section */}
            <div className="w-full flex flex-col items-center">
              <div className="flex justify-between items-start w-full mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${themeAccent} p-[2px] shadow-lg`}>
                    <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                      <ShieldCheck className={themeText} size={24} />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tighter uppercase leading-none flex items-center">
                      <span className="mr-[0.2em] text-[#3B82F6]">WEBORY</span>
                      <div className="flex relative text-[#16A34A]">
                          <div className="relative flex flex-col items-center">
                            <div className="absolute -top-2 w-2.5 h-2.5 rounded-full bg-[#F97316]"></div>
                            <span>S</span>
                          </div>
                          <div className="relative flex flex-col items-center">
                            <div className="absolute -top-2 w-2.5 h-2.5 rounded-full bg-[#FFFFFF] border-[0.5px] border-slate-300 shadow-sm"></div>
                            <span>K</span>
                          </div>
                          <div className="relative flex flex-col items-center">
                            <div className="absolute -top-2 w-2.5 h-2.5 rounded-full bg-[#16A34A]"></div>
                            <span>I</span>
                          </div>
                          <div className="relative flex flex-col items-center">
                            <span>L</span>
                          </div>
                          <div className="relative flex flex-col items-center">
                            <span>L</span>
                          </div>
                          <div className="relative flex flex-col items-center">
                            <span>S</span>
                          </div>
                      </div>
                    </h1>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-block text-[8px] font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded-md ${themeBg} ${themeText} border ${themeBorder}`}>
                        {domain || "Skills Hackathon"}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        <span className="text-[9px] text-amber-500 font-black uppercase tracking-[0.2em]">Govt. Recognized Startup</span>
                    </div>
                  </div>
                </div>

                {/* Verification QR - Absolute Below Logo */}
                <div className="absolute top-[130px] left-8 flex flex-col items-center gap-2">
                  <div className="p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <QRCodeSVG 
                      value={qrUrl} 
                      size={70}
                      level="M"
                    />
                  </div>
                  <div className="text-center">
                    <span className="block text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Verify ID</span>
                    <span className="block text-[9px] font-bold text-slate-800 tracking-tighter">{certificateId}</span>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className={`mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${themeBg} border ${themeBorder} shadow-sm`}>
                    {isWinner ? <Trophy size={14} className={themeText} /> : <Code2 size={14} className={themeText} />}
                    <span className={`text-[9px] font-black uppercase tracking-widest ${themeText}`}>
                      {isWinner ? 'Certificate of Excellence' : 'Certificate of Participation'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Collaborations Section - NOW BELOW AND CENTERED */}
              {collaborations && collaborations.length > 0 && (
                <div className="flex items-center justify-center gap-6 mb-8 w-full">
                  <div className="h-px bg-slate-100 flex-1"></div>
                  <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">In Association With</span>
                    <div className="h-4 w-px bg-slate-300 mt-0.5"></div>
                  </div>
                    <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                      {collaborations.map((collab, index) => (
                        <div key={index} className="flex items-center">
                          {index > 0 && <span className="text-slate-300 font-light mx-2 text-[10px]">|</span>}
                          <div className="flex items-center gap-1.5 group">
                            {collab.logo && <img src={collab.logo} alt={collab.name} className="h-5 object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />}
                            <span className="text-[13px] font-black tracking-widest uppercase text-amber-600 drop-shadow-sm">{collab.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>
              )}
            </div>

            {/* Core Content */}
            <div className="relative w-full text-center flex-1 flex flex-col items-center justify-center py-6">
              {/* Issue Date & Seal - Back to original right side position */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${themeAccent} flex items-center justify-center shadow-lg p-1`}>
                  <div className="w-full h-full border-2 border-white/50 rounded-full border-dashed flex items-center justify-center">
                    <Sparkles size={24} className="text-white" />
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Issued On</span>
                  <span className="block text-xs font-bold text-slate-800" suppressHydrationWarning>
                    {new Date(issueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.4em] mb-4">Proudly Presented To</p>
              
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight capitalize mb-2 border-b-2 border-slate-100 pb-1 px-12">
                {studentName}
              </h2>

              <div className="max-w-2xl mx-auto space-y-2">
                <p className="text-base text-slate-600 font-medium leading-relaxed">
                  For demonstrating exceptional coding skills, creativity, and problem-solving abilities 
                  during the official software development hackathon event.
                </p>
                
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-2 relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${themeAccent}`}></div>
                  
                  <h3 className={`text-xl font-black uppercase tracking-wide mb-1 ${themeText}`}>
                    {hackathonTitle}
                  </h3>
                  
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-2">
                    <div className={`flex items-center gap-2 bg-white px-4 py-2 rounded-xl border ${themeBorder} shadow-sm group-hover:shadow-md transition-shadow`}>
                      <Code2 size={16} className={themeText} />
                      <span className="text-xs font-black text-slate-700 uppercase tracking-widest truncate max-w-[250px]">
                        Project: <span className={themeText}>{projectName}</span>
                      </span>
                    </div>
                    
                    {isWinner && rank && (
                      <div className={`flex items-center gap-2 bg-white px-4 py-2 rounded-xl border ${themeBorder} shadow-[0_0_15px_rgba(0,0,0,0.05)]`}>
                        <Medal size={16} className={themeText} />
                        <span className={`text-xs font-black uppercase tracking-widest ${themeText}`}>
                          {rank === 1 ? '1ST PLACE CHAMPION' : rank === 2 ? '2ND PLACE SILVER' : '3RD PLACE BRONZE'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Area */}
            <div className="w-full grid grid-cols-3 items-end border-t-2 border-slate-100 pt-4 mt-1 px-4">
              
              {/* Left: Founder Signature */}
              <div className="flex items-end justify-start">
                <div className="flex flex-col items-center gap-1">
                  <div className="text-2xl italic text-slate-800" style={{ fontFamily: "'Dancing Script', cursive" }}>
                      {signatures?.founder?.name || "Mohit Sinha"}
                  </div>
                  <div className="w-36 h-[2px] bg-slate-200 mt-1 mb-1"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                      {signatures?.founder?.title || "CEO & Founder"}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Webory Skills Platform</span>
                </div>
              </div>

              {/* Center: Director Signature */}
              <div className="flex items-end justify-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="text-2xl italic text-slate-800" style={{ fontFamily: "'Dancing Script', cursive" }}>
                      {signatures?.director?.name || "Vijay Kumar"}
                  </div>
                  <div className="w-36 h-[2px] bg-slate-200 mt-1 mb-1"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                      {signatures?.director?.title || "Director of Education"}
                  </span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Webory Skills Platform</span>
                </div>
              </div>

              {/* Right: Partner Signature */}
              <div className="flex items-end justify-end pr-8">
                {signatures?.partner && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-2xl italic text-slate-800" style={{ fontFamily: "'Dancing Script', cursive" }}>
                        {signatures.partner.name}
                    </div>
                    <div className="w-36 h-[2px] bg-slate-200 mt-1 mb-1"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                        {signatures.partner.title}
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">Authorized Signatory</span>
                  </div>
                )}
              </div>
            </div>

            {/* Accreditations & Legal Footer */}
            <div className="w-full text-center mt-8 border-t border-slate-100/50 pt-3">
              <span className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                ISO 9001:2015 Certified • MSME Registered • Recognized by Startup India • Verify at weboryskills.in
              </span>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        
        .print-exact {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        @media print {
          .origin-top {
            transform: none !important;
            margin-bottom: 0 !important;
          }
        }
      ` }} />
    </div>
  );
}
