"use client";

import { Award, Trophy, CheckCircle2, QrCode, Download, Share2, ShieldCheck, Star } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import Image from "next/image";

interface HackathonCertificateProps {
  type: "winner" | "participant";
  studentName: string;
  hackathonTitle: string;
  projectName: string;
  rank?: number;
  issueDate: string;
  certificateId: string;
}

export default function HackathonCertificate({
  type,
  studentName,
  hackathonTitle,
  projectName,
  rank,
  issueDate,
  certificateId
}: HackathonCertificateProps) {
  const isWinner = type === "winner";

  return (
    <div className="certificate-container p-6 md:p-12 bg-white text-black relative overflow-hidden aspect-[1.414/1] w-full max-w-4xl mx-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-[20px] border-double border-gray-100">
      {/* Premium Watermark Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden rotate-12 scale-150">
        <div className="grid grid-cols-4 gap-20">
            {Array.from({ length: 16 }).map((_, i) => (
                <h1 key={i} className="text-6xl font-black whitespace-nowrap uppercase tracking-[0.5em]">WEBORY</h1>
            ))}
        </div>
      </div>

      {/* Decorative Foil Corners */}
      <div className={`absolute top-0 left-0 w-40 h-40 opacity-10 ${isWinner ? 'bg-yellow-500' : 'bg-blue-500'} blur-[80px]`} />
      <div className={`absolute bottom-0 right-0 w-40 h-40 opacity-10 ${isWinner ? 'bg-orange-500' : 'bg-indigo-500'} blur-[80px]`} />
      
      {/* Corner Ornaments */}
      <div className={`absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 ${isWinner ? 'border-yellow-600' : 'border-blue-600'}`} />
      <div className={`absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 ${isWinner ? 'border-yellow-600' : 'border-blue-600'}`} />
      <div className={`absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 ${isWinner ? 'border-yellow-600' : 'border-blue-600'}`} />
      <div className={`absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 ${isWinner ? 'border-yellow-600' : 'border-blue-600'}`} />

      {/* Main Content Frame */}
      <div className={`relative z-10 h-full border-[1px] ${isWinner ? 'border-yellow-200' : 'border-blue-200'} p-8 md:p-12 flex flex-col items-center justify-between text-center bg-white/40 backdrop-blur-[2px]`}>
        
        {/* Official Header with Logo */}
        <div className="w-full flex flex-col items-center gap-4">
            <div className="flex items-center space-x-3 group">
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 transition-shadow duration-300">
                    <span className="font-black text-2xl text-white">W</span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent" />
                </div>
                <span className="text-2xl font-bold tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600">WEBORY </span>
                    <span className="relative">
                        <span className="absolute -top-2 left-[30%] -translate-x-1/2 flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#FF9933]"></span>
                            <span className="w-2 h-2 rounded-full bg-white border border-gray-100"></span>
                            <span className="w-2 h-2 rounded-full bg-[#138808]"></span>
                        </span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-700 font-extrabold">SKILLS</span>
                    </span>
                </span>
            </div>
            <div className="flex items-center justify-center gap-2">
                <div className="h-[1px] w-8 bg-gray-200" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Industry Recognition</p>
                <div className="h-[1px] w-8 bg-gray-200" />
            </div>
        </div>

        {/* Award Type Badge */}
        <div className={`mt-4 px-6 py-2 rounded-full border-2 ${
            isWinner ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-blue-50 border-blue-200 text-blue-800'
        } flex items-center gap-2 shadow-sm`}>
            {isWinner ? <Trophy size={16} /> : <CheckCircle2 size={16} />}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {isWinner ? 'Certificate of Excellence' : 'Certificate of Participation'}
            </span>
        </div>

        {/* Recipient Section */}
        <div className="space-y-4 my-6">
            <p className="text-xs font-semibold text-gray-500 italic font-serif">This is to officially certify that</p>
            <div className="relative inline-block">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none px-4">
                    {studentName}
                </h2>
                <div className={`h-1.5 w-full mt-2 rounded-full ${isWinner ? 'bg-yellow-500' : 'bg-blue-600'} opacity-20`} />
            </div>
            <p className="text-xs font-medium text-gray-500 max-w-sm mx-auto">
                has {isWinner ? 'been declared a WINNER (Top Tier Performer)' : 'successfully PARTICIPATED and demonstrated core technical competencies'} in the
            </p>
        </div>

        {/* Event Detail Section */}
        <div className="w-full max-w-2xl px-8 py-6 rounded-3xl bg-gray-50/50 border border-gray-100 flex flex-col items-center gap-2">
            <h3 className={`text-xl font-black uppercase tracking-tight text-gray-900`}>
                {hackathonTitle}
            </h3>
            {isWinner && rank && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-yellow-200 rounded-lg shadow-sm">
                    <Star size={10} className="fill-yellow-500 text-yellow-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-yellow-800">
                        Ranked Top {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'} {rank === 1 ? '1st' : rank === 2 ? '2nd' : '3rd'} Place
                    </span>
                </div>
            )}
            <div className="mt-4 flex flex-col items-center gap-1">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Project Developed</span>
                <p className={`text-sm font-bold text-gray-800 break-all leading-tight max-w-md ${projectName.length > 50 ? 'text-[10px]' : ''}`}>
                    {projectName}
                </p>
            </div>
        </div>

        {/* Institutional Footer */}
        <div className="w-full flex items-end justify-between mt-8 pt-8 border-t border-gray-100 relative">
            {/* Security Seals */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-lg">
                    <ShieldCheck size={20} className="text-emerald-500" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-lg">
                    <Award size={20} className="text-blue-500" />
                </div>
            </div>

            {/* Verification QR */}
            <div className="flex flex-col items-center gap-2 scale-90 md:scale-100 origin-bottom-left">
                <div className={`p-1.5 bg-white border-2 rounded-xl shadow-lg ${isWinner ? 'border-yellow-200' : 'border-blue-200'}`}>
                    <QRCodeSVG 
                        value={`https://weboryskills.in/verify/${certificateId}`} 
                        size={80}
                        level="H"
                    />
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Digital Auth ID</span>
                    <span className="text-[9px] font-bold text-gray-900 tracking-tighter">{certificateId}</span>
                </div>
            </div>

            {/* Signature Area */}
            <div className="flex flex-col items-center gap-2 mb-2">
                <div className="text-3xl font-signature italic text-gray-800" style={{ fontFamily: "'Dancing Script', cursive" }}>Mohit Sinha</div>
                <div className="w-32 h-[1px] bg-gray-300" />
                <div className="flex flex-col items-center">
                    <span className="text-[9px] font-black text-gray-900 uppercase tracking-tighter">Founder & CEO</span>
                    <span className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Webory Skills Platform</span>
                </div>
            </div>

            {/* Issue Date */}
            <div className="text-right flex flex-col items-end gap-1 origin-bottom-right">
                <span className="text-[8px] font-black text-gray-400 tracking-widest uppercase">Issued on</span>
                <span className="text-xs font-bold text-gray-900">{new Date(issueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <div className={`w-8 h-1 rounded-full ${isWinner ? 'bg-yellow-500' : 'bg-blue-600'} mt-1`} />
            </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
      `}</style>
    </div>
  );
}
