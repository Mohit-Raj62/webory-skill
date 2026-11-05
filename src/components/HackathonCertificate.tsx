"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState, useRef } from "react";

interface HackathonCertificateProps {
  studentName?: string;
  hackathonName?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  certificateId?: string;
  certificateKey?: string;
  type?: "winner" | "participant" | string;
  rank?: number;
  awardTitle?: string;
  projectName?: string;
  collaborations?: { name: string, logo?: string }[];
  signatures?: {
    founder?: { name?: string, title?: string, image?: string },
    director?: { name?: string, title?: string, credential?: string, image?: string },
    partner?: { name?: string, title?: string, image?: string },
  };
}

export default function HackathonCertificate({
  studentName = "Mohit Raj",
  hackathonName = "National AI & Web3 Innovation Hackathon",
  duration = "48 Hours",
  startDate = "11 Aug 2026",
  endDate = "09 Oct 2026",
  certificateId = "WS/HCK/2026/08437",
  certificateKey = "",
  type = "participant",
  rank,
  awardTitle,
  projectName,
  collaborations,
  signatures
}: HackathonCertificateProps) {
  const [scale, setScale] = useState(1);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const updateSize = () => {
      if (typeof window !== "undefined") {
        const availableWidth = window.innerWidth - 32;
        if (availableWidth < 1122) {
          setScale(Math.max(0.2, availableWidth / 1122));
        } else {
          setScale(1);
        }
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    window.addEventListener("orientationchange", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("orientationchange", updateSize);
    };
  }, []);

  const collabs = collaborations || [];
  const hasDirector = Boolean(signatures?.director?.name?.trim());
  const hasPartner = Boolean(signatures?.partner?.name?.trim());

  const renderedWidth = mounted && scale < 1 ? Math.round(1122 * scale) : 1122;
  const renderedHeight = mounted && scale < 1 ? Math.round(794 * scale) : 794;
  
  return (
    <div 
        className="certificate-wrapper relative mx-auto overflow-hidden shadow-2xl print:shadow-none print:!overflow-visible print:!w-[1122px] print:!h-[794px] print:!max-w-none print:!m-0 print:!p-0"
        ref={wrapperRef}
        style={{
            width: mounted && scale < 1 ? `${renderedWidth}px` : "1122px",
            maxWidth: "100%",
            height: mounted && scale < 1 ? `${renderedHeight}px` : "794px",
            touchAction: "pan-y",
        }}
    >
        <div 
            id="certificate-container"
            style={{
                width: "1122px",
                height: "794px",
                transform: mounted && scale < 1 ? `scale(${scale})` : "none",
                transformOrigin: "top left",
                WebkitTransform: mounted && scale < 1 ? `scale(${scale})` : "none",
                WebkitTransformOrigin: "top left",
            }}
            className="bg-[#fafaf8] text-black relative print:!transform-none print:!w-full print:!h-full overflow-hidden select-none font-sans"
        >
            {/* Pristine Clean Base Template (Border, Floral Divider, Laurel Wreath, Building Sketch & Signature Underline) */}
            <img 
                src="/assets/certificate-clean-format.png" 
                alt="Certificate Template" 
                className="absolute inset-0 w-[1122px] h-[794px] object-cover pointer-events-none z-0"
            />

            {/* Subtle Security Brand Watermark */}
            <div className="absolute top-[430px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] pointer-events-none select-none flex items-center justify-center opacity-[0.065] print:opacity-[0.08]">
                <img 
                    src="/assets/webory-watermark.png" 
                    alt="Webory Watermark" 
                    className="w-[390px] h-auto object-contain"
                />
            </div>

            {/* Left Body: Seamless Transparent QR Code & Verification Details (Enlarged size, stacked vertically) */}
            <div className="absolute left-[88px] top-[270px] z-10 flex flex-col items-center text-center bg-transparent w-[130px]">
                <div className="shrink-0 bg-transparent mb-1.5">
                    {certificateId ? (
                        <QRCodeSVG 
                            value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://weboryskills.in'}/verify-certificate/${certificateId}`}
                            size={102}
                            level="H"
                            bgColor="transparent"
                            fgColor="#0b1c3d"
                        />
                    ) : (
                        <div className="w-[102px] h-[102px] flex items-center justify-center text-[10px] text-gray-400">
                            Verifying...
                        </div>
                    )}
                </div>

                <p className="text-[11px] font-bold text-[#111827] tracking-wider uppercase leading-tight">
                    Scan to Verify
                </p>
                <p className="text-[10px] font-mono font-bold text-gray-800 leading-tight mt-0.5">
                    ID: <span className="font-extrabold text-[#0b1c3d]">{certificateId || "WS/HCK/2026/08437"}</span>
                </p>
                {certificateKey && (
                    <p className="text-[8.5px] font-mono text-gray-500 leading-none mt-0.5">
                        Key: <span className="font-bold text-gray-700">{certificateKey.length > 16 ? `SEC-${certificateKey.slice(0, 4).toUpperCase()}-${certificateKey.slice(-4).toUpperCase()}` : certificateKey}</span>
                    </p>
                )}
            </div>

            {/* Top Header: Brand Identity & MSME Recognition (Slightly reduced for balanced hierarchy) */}
            <div className="absolute top-[82px] left-0 right-0 flex items-center justify-center z-10 px-8 pointer-events-none">
                {/* Brand Typography */}
                <div className="flex flex-col text-left pointer-events-auto">
                    <div className="flex items-center">
                        <span className="text-[31px] font-bold text-[#0b1c3d] tracking-wide font-serif leading-none">
                            WEBORY
                        </span>
                        <span className="text-[31px] font-bold text-[#0b1c3d] tracking-wide font-serif leading-none ml-2 relative">
                            {/* Indian Tricolor Dots above the I of SKILLS */}
                            <span className="absolute -top-3 left-[58%] -translate-x-1/2 flex gap-1">
                                <span className="w-2 h-2 rounded-full bg-[#FF9933] shadow-sm"></span>
                                <span className="w-2 h-2 rounded-full bg-white border border-gray-300 shadow-sm"></span>
                                <span className="w-2 h-2 rounded-full bg-[#138808] shadow-sm"></span>
                            </span>
                            SKILLS
                        </span>
                    </div>
                    <p className="text-[10.5px] font-bold text-[#c5a059] tracking-[0.26em] uppercase mt-1.5 leading-none">
                        Excellence in Education
                    </p>
                </div>

                {/* Vertical Divider */}
                <div className="h-10 w-[1.5px] bg-[#94a3b8] mx-6 shrink-0 pointer-events-auto"></div>

                {/* Govt. Recognition & MSME */}
                <div className="flex flex-col text-left justify-center pointer-events-auto">
                    <span className="text-[12px] font-bold text-[#0b1c3d] uppercase tracking-wider leading-tight">
                        Govt. Recognized Startup
                    </span>
                    <span className="text-[10.5px] font-bold font-mono text-[#b8860b] tracking-wider mt-0.5 leading-tight">
                        MSME : UDYAM-BR-26-0208472
                    </span>
                </div>
            </div>

            {/* Official Seal (High-Definition Official Seal with W Emblem) */}
            <div className="absolute top-[164px] right-[62px] z-10 pointer-events-none">
                <img 
                    src="/assets/webory-official-seal.png" 
                    alt="Webory Official Seal" 
                    className="w-[132px] h-[132px] object-contain drop-shadow-md select-none"
                />
            </div>

            {/* Collaborations (In Association With) - Elegantly placed in clear upper section above floral divider */}
            {collabs.length > 0 && (
                <div className="absolute top-[142px] left-0 right-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="flex items-center gap-2.5 px-4 py-1 rounded-full bg-white/95 border border-[#c5a059]/40 shadow-sm backdrop-blur-[1px]">
                        <span className="text-[10px] text-[#8a6d3b] font-serif font-bold uppercase tracking-[0.16em]">
                            In Association With :
                        </span>
                        <div className="h-3.5 w-[1px] bg-[#c5a059]/50"></div>
                        <div className="flex items-center gap-3">
                            {collabs.map((collab: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-1.5">
                                    {collab.logo ? (
                                        <img 
                                            src={collab.logo} 
                                            alt={collab.name} 
                                            className="h-[16px] w-auto max-w-[80px] object-contain"
                                        />
                                    ) : null}
                                    <span className="text-[12px] font-serif font-bold text-[#0b1c3d] tracking-wide">
                                        {collab.name}
                                    </span>
                                    {idx < collabs.length - 1 && (
                                        <span className="text-[#c5a059] font-bold mx-1">•</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Title: CERTIFICATE OF EXCELLENCE / PARTICIPATION */}
            <div className="absolute top-[222px] left-0 right-0 text-center z-10 px-12">
                <h1 className="text-[34px] font-serif font-bold text-[#0b1c3d] tracking-[0.12em] uppercase leading-none">
                    {type === "winner" || (rank && rank > 0) ? "CERTIFICATE OF EXCELLENCE" : "CERTIFICATE OF PARTICIPATION"}
                </h1>
            </div>

            {/* Subtitle: This is proudly presented to (Enlarged) */}
            <div className="absolute top-[266px] left-0 right-0 text-center z-10 px-12">
                <p className="font-serif italic text-[23px] text-gray-800 leading-none">
                    This is proudly presented to
                </p>
            </div>

            {/* Recipient Name */}
            <div className="absolute top-[310px] left-0 right-0 text-center z-10 px-12">
                <h2 className="text-[44px] font-serif font-bold text-[#0b1c3d] tracking-wide capitalize leading-none">
                    {studentName}
                </h2>
            </div>

            {/* Program Completion Line (Enlarged) */}
            <div className="absolute top-[376px] left-0 right-0 text-center z-10 px-12">
                <p className="font-serif italic text-[22px] text-gray-800 leading-none">
                    {rank === 1
                        ? "for securing 1st Place (Champion) in"
                        : rank === 2
                        ? "for securing 2nd Place (1st Runner Up) in"
                        : rank === 3
                        ? "for securing 3rd Place (2nd Runner Up) in"
                        : type === "winner"
                        ? "for exemplary performance and winning honors in"
                        : "for outstanding performance and participation in"}
                </p>
            </div>

            {/* Hackathon Name */}
            <div className="absolute top-[420px] left-0 right-0 text-center z-10 px-12">
                <h3 className="text-[28px] font-serif font-bold text-[#0b1c3d] tracking-wide leading-none">
                    {hackathonName}
                </h3>
            </div>

            {/* Conducted By & Dates Line (Larger, Darker, High Contrast) */}
            <div className="absolute top-[474px] left-0 right-0 text-center z-10 px-12">
                <p className="font-sans text-[15px] text-[#0b1c3d] font-bold tracking-wide leading-none">
                    organized by Webory Skills from {startDate} to {endDate} (Duration: {duration}).
                </p>
            </div>

            {/* Commendation Paragraph (Larger, Darker, High Contrast over Watermark) */}
            <div className="absolute top-[510px] left-0 right-0 text-center z-10 px-20">
                <p className="font-serif italic text-[15px] font-semibold text-[#1e293b] max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                    {projectName 
                        ? `Recognized for the project '${projectName}', demonstrating exemplary problem-solving, innovative engineering, and technical mastery.`
                        : "Recognized for remarkable problem-solving ability, creative engineering skills, and exemplary technical excellence demonstrated throughout the competition."}
                </p>
            </div>

            {/* Bottom-Left: Director of Education Signature */}
            <div className="absolute left-[114px] top-[594px] text-center w-[164px] flex flex-col items-center z-10">
                <div className="h-[52px] flex items-end justify-center mb-1">
                    <img 
                        src={signatures?.director?.image || "/signatures/vijay-kumar-signature.png"} 
                        alt={signatures?.director?.name || "Vijay Kumar"} 
                        className="h-[48px] w-auto max-w-[145px] object-contain select-none pointer-events-none"
                    />
                </div>
                <div className="border-b border-[#0b1c3d] w-full mb-1.5"></div>
                <p className="text-[13.5px] font-serif font-bold text-[#0b1c3d] leading-snug">
                    {signatures?.director?.name || "Vijay Kumar"}
                </p>
                <p className="text-[11px] text-gray-600 font-medium leading-tight">
                    {signatures?.director?.title || "Director of Education"}
                </p>
                <p className="text-[10px] text-gray-500 leading-tight">
                    Webory Skills
                </p>
                <p className="text-[9px] text-[#0b1c3d] font-semibold leading-tight mt-0.5">
                    {signatures?.director?.credential || "Alumnus, IIT Mandi"}
                </p>
            </div>

            {/* Optional Partner Signature (Center if provided) */}
            {hasPartner && (
                <div className="absolute left-1/2 -translate-x-1/2 top-[594px] text-center w-[164px] flex flex-col items-center z-10">
                    <div className="h-[52px] flex items-end justify-center mb-1">
                        {signatures?.partner?.image ? (
                            <img 
                                src={signatures.partner.image} 
                                alt={signatures.partner.name} 
                                className="h-[48px] w-auto max-w-[145px] object-contain select-none pointer-events-none"
                            />
                        ) : (
                            <span className="font-serif italic text-xl text-[#0b1c3d] whitespace-nowrap px-2 leading-none">
                                {signatures?.partner?.name}
                            </span>
                        )}
                    </div>
                    <div className="border-b border-[#0b1c3d] w-full mb-1.5"></div>
                    <p className="text-[13.5px] font-serif font-bold text-[#0b1c3d] leading-snug">
                        {signatures?.partner?.name}
                    </p>
                    <p className="text-[11px] text-gray-600 font-medium leading-tight">
                        {signatures?.partner?.title || "Authorized Signatory"}
                    </p>
                </div>
            )}

            {/* Bottom-Right: Founder & CEO Signature (Line removed per user request) */}
            <div className="absolute right-[114px] top-[594px] text-center w-[164px] flex flex-col items-center z-10">
                <div className="h-[52px] flex items-end justify-center mb-1">
                    <img 
                        src={signatures?.founder?.image || "/signatures/mohit-sinha-signature.png"} 
                        alt={signatures?.founder?.name || "Mohit Sinha"} 
                        className="h-[52px] w-auto max-w-[155px] object-contain select-none pointer-events-none"
                    />
                </div>
                <p className="text-[13.5px] font-serif font-bold text-[#0b1c3d] leading-snug mt-1">
                    {signatures?.founder?.name || "Mohit Sinha"}
                </p>
                <p className="text-[11px] text-gray-600 font-medium leading-tight">
                    {signatures?.founder?.title || "Founder & CEO"}
                </p>
                <p className="text-[10px] text-gray-500 leading-tight">
                    Webory Skills
                </p>
            </div>

        </div>
    </div>
  );
}