"use client";

import { Award, Clock, CalendarDays } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState, useRef } from "react";

interface InternshipCertificateProps {
  studentName?: string;
  internshipRole?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  certificateId?: string;
  collaborations?: { name: string, logo?: string }[];
  signatures?: {
    founder?: { name: string, title: string },
    director?: { name: string, title: string, credential?: string },
    partner?: { name: string, title: string },
  };
}

export default function InternshipCertificate({
  studentName = "Student Name",
  internshipRole = "Internship Position",
  duration = "N/A",
  startDate = "N/A",
  endDate = "N/A",
  certificateId = "",
  collaborations,
  signatures
}: InternshipCertificateProps) {
  const [isMobile, setIsMobile] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  let collabs = collaborations || [];
  
  return (
    <div 
        className="relative mx-auto overflow-hidden shadow-2xl print:shadow-none print:overflow-visible"
        ref={wrapperRef}
        style={{
            width: isMobile ? window.innerWidth - 32 : '297mm',
            height: isMobile ? (window.innerWidth - 32) * (210/297) : '210mm',
        }}
    >
        <div 
            id="certificate-container"
            style={{
                width: '1122px',
                height: '794px',
                transform: isMobile ? `scale(${(window.innerWidth - 32) / 1122})` : 'none',
                transformOrigin: 'top left',
            }}
            className="bg-white text-black relative print:transform-none print:w-full print:h-full"
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

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
                <Award size={600} />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-between pt-16 pb-10 px-24">
                
                {/* Header */}
                <div className="text-center w-full">
                    <div className="flex items-center justify-center gap-6 mb-2">
                        <Award className="text-[#c5a059]" size={42} />
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
                        </div>
                        
                        {/* MSME Details */}
                        <div className="flex flex-col items-start border-l border-gray-200 pl-4 py-1">
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wide">Govt. Recognized Startup</p>
                            <p className="text-[8px] text-[#c5a056] font-bold font-mono tracking-wider">MSME: UDYAM-BR-26-0208472</p>
                        </div>
                    </div>

                    {/* Collaborations Section */}
                    {collabs.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-4 mb-4 px-12">
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent flex-1 max-w-[100px]"></div>
                            <div className="flex items-center gap-3">
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em]">In Association With</p>
                                <div className="h-4 w-px bg-[#c5a059]/40 mt-0.5"></div>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                                {collabs.map((collab: any, index: number) => (
                                    <div key={index} className="flex items-center">
                                        {index > 0 && <span className="text-[#c5a059]/40 font-light mx-2 text-[10px]">|</span>}
                                        <div className="flex items-center gap-1.5 group">
                                            {collab.logo && <img src={collab.logo} alt={collab.name} className="h-5 object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />}
                                            <p className="text-[10px] text-[#1a237e] font-black font-serif tracking-widest uppercase">{collab.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent flex-1 max-w-[100px]"></div>
                        </div>
                    )}

                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#1a237e] to-transparent mb-2 opacity-30"></div>

                    <h1 className="text-5xl font-serif font-bold text-[#1a237e] mb-1 tracking-tight certificate-title">
                        Certificate of Completion
                    </h1>
                    <p className="text-lg text-gray-500 italic font-serif">This is to certify that</p>
                </div>

                {/* Recipient */}
                <div className="text-center w-full my-2">
                    <h2 className="text-5xl font-serif font-bold text-[#1a237e] mb-2 px-8 py-2 inline-block border-b-2 border-[#c5a059] min-w-[400px] capitalize">
                        {studentName}
                    </h2>
                </div>

                {/* Course Details */}
                <div className="text-center w-full space-y-1">
                    <p className="text-lg text-gray-600 font-serif">has successfully completed the internship program as a</p>
                    <h3 className="text-4xl font-bold text-black font-serif tracking-wide mb-2">
                        {internshipRole}
                    </h3>

                    <div className="flex justify-center gap-12 mb-2 border-y border-gray-200 py-1.5 mx-10">
                        {/* Duration */}
                        <div className="flex flex-col items-center px-2">
                            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                <Clock size={14} />
                                <span className="text-[10px] uppercase tracking-widest font-semibold">Duration</span>
                            </div>
                            <span className="font-sans text-base font-bold text-[#1a237e] tracking-wide">{duration}</span>
                        </div>

                        {/* Joining Date */}
                        <div className="flex flex-col items-center px-2 border-l border-gray-200 pl-12">
                            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                <CalendarDays size={14} />
                                <span className="text-[10px] uppercase tracking-widest font-semibold">Enrolled</span>
                            </div>
                            <span className="font-sans text-base font-bold text-[#1a237e] tracking-wide">
                                {startDate}
                            </span>
                        </div>

                        {/* Date Issued */}
                        <div className="flex flex-col items-center px-2 border-l border-gray-200 pl-12">
                            <div className="flex items-center gap-1.5 text-gray-500 mb-1">
                                <Award size={14} />
                                <span className="text-[10px] uppercase tracking-widest font-semibold">Completed</span>
                            </div>
                            <span className="font-sans text-base font-bold text-[#1a237e] tracking-wide">
                                {endDate}
                            </span>
                        </div>
                    </div>
                   
                    <p className="text-lg text-gray-600 font-serif max-w-2xl mx-auto">
                        demonstrating proficiency and dedication to excellence.
                    </p>
                </div>

                {/* Footer / Signatures */}
                <div className="w-full flex flex-col items-center mt-2 mb-12">
                    {/* Seal with QR Code - Centered Top */}
                    <div className="flex flex-col items-center justify-center mb-0.5">
                        <div className="relative w-28 h-28 flex items-center justify-center mb-1">
                            <div className="absolute inset-0 border-4 border-[#c5a059] border-dashed rounded-full animate-[spin_10s_linear_infinite] opacity-20"></div>
                            <div className="bg-white p-1 rounded-lg shadow-sm">
                            {certificateId ? (
                                <QRCodeSVG 
                                    value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://weboryskills.in'}/verify-certificate/${certificateId}`}
                                    size={100}
                                    level="H"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-[10px] text-gray-400 text-center leading-tight p-2">
                                    Verifying...
                                </div>
                            )}
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                            {certificateId ? "Scan to Verify" : "Generating ID..."}
                        </p>
                        <p className="text-[8px] text-[#2e7d32] font-bold uppercase tracking-widest mt-0.5">Govt. Recognized</p>
                    </div>

                    {/* Signatures Grid */}
                    <div className={`w-full grid ${signatures?.partner ? 'grid-cols-3' : 'grid-cols-2'} gap-8 items-end px-12`}>
                        {/* Signature 1 (Left) - Founder */}
                        <div className="text-center">
                            <div className="h-12 flex items-end justify-center mb-1">
                                <span className="font-signature text-4xl text-[#1a237e] whitespace-nowrap px-2">
                                    {signatures?.founder?.name || "Mohit Sinha"}
                                </span>
                            </div>
                            <div className="border-b border-gray-400 w-full mb-1"></div>
                            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">{signatures?.founder?.title || "Founder & CEO"}</p>
                        </div>

                        {/* Signature 2 */}
                        <div className="text-center">
                            <div className="h-12 flex items-end justify-center mb-1">
                                <span className="font-signature text-4xl text-[#1a237e] whitespace-nowrap px-2">
                                    {signatures?.director?.name || "Vijay Kumar"}
                                </span>
                            </div>
                            <div className="border-b border-gray-400 w-full mb-1"></div>
                            <div className="space-y-0.5">
                                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">{signatures?.director?.title || "Director of Education, Webory"}</p>
                                <p className="text-[10px] text-[#1a237e] font-bold">{signatures?.director?.credential || "Alumnus, IIT Mandi"}</p>
                            </div>
                        </div>

                        {/* Signature 3 (Partner) - Only if collaboration */}
                        {signatures?.partner && (
                            <div className="text-center">
                                <div className="h-12 flex items-end justify-center mb-1">
                                    <span className="font-signature text-4xl text-[#c5a059] whitespace-nowrap px-2">
                                        {signatures?.partner?.name || "Partner Rep."}
                                    </span>
                                </div>
                                <div className="border-b border-gray-400 w-full mb-1"></div>
                                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">{signatures?.partner?.title || "Authorized Signatory"}</p>
                            </div>
                        )}

                    </div>

                    {/* OFFICIAL SEAL */}
                    <div className="absolute bottom-64 right-16 opacity-90 print:block z-10">
                        <div className="w-32 h-32 rounded-full border-4 border-[#c5a059] flex items-center justify-center p-1 shadow-lg bg-[#fffbe6]">
                            <div className="w-full h-full rounded-full border-2 border-[#c5a059] border-dashed flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full flex items-center justify-center">
                                    <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow-static">
                                        <path id="curve" d="M 20,50 A 30,30 0 1,1 80,50 A 30,30 0 1,1 20,50" fill="none" />
                                        <text width="100" className="text-[11px] font-bold uppercase tracking-widest fill-[#b8860b]">
                                            <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">
                                                Webory Official Seal
                                            </textPath>
                                        </text>
                                    </svg>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Award size={32} className="text-[#c5a059]" />
                                    <span className="text-[10px] font-bold text-[#b8860b] uppercase mt-1">Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Certificate ID - Top Left */}
                <div className="absolute top-10 left-10 z-20">
                    <p className="text-sm font-mono tracking-wider text-[#a5c098] font-bold">
                        ID: {certificateId}
                    </p>
                </div>
            </div>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Mr+De+Haviland&display=swap');
                .font-serif {
                    font-family: 'Playfair Display', serif;
                }
                .font-signature {
                    font-family: 'Mr De Haviland', cursive;
                }
            `}</style>
        </div>
    </div>
  );
}

