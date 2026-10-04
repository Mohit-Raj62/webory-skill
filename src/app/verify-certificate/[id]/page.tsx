"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, ShieldCheck, Copy, Check } from "lucide-react";

interface VerificationResult {
  valid: boolean;
  type?: 'course' | 'internship' | 'hackathon' | 'custom' | 'ambassador';
  data?: {
    studentName: string;
    title: string;
    company?: string;
    date: string;
    score?: number;
    certificateId: string;
    certificateKey?: string;
    hackathonTitle?: string;
    projectName?: string;
    domain?: string;
    rank?: number;
    description?: string;
  };
  error?: string;
}

export default function VerifyCertificatePage() {
  const { id } = useParams();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const res = await fetch(`/api/verify-certificate/${id}`);
        const data = await res.json();

        if (res.ok && data.valid) {
          setVerificationResult(data);
        } else {
          setError(data.error || "Failed to verify certificate");
        }
      } catch (err) {
        setError("An error occurred while verifying the certificate");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      verifyCertificate();
    }
  }, [id]);

  const copyToClipboard = (text: string, type: 'key' | 'id') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const getCredentialTypeLabel = () => {
    switch (verificationResult?.type) {
      case 'course':
        return 'Course Completion';
      case 'internship':
        return 'Internship Experience';
      case 'hackathon':
        return 'Hackathon Credential';
      case 'ambassador':
        return 'Campus Ambassador Program';
      default:
        return 'Certificate of Completion';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600 font-medium">Verifying Authenticity with Webory Secure Registry...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-center text-white relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md mb-2">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black tracking-tight uppercase">Credential Verification</h1>
          <p className="text-blue-200 text-xs font-semibold tracking-wider uppercase mt-1">Webory Skills Official Registry</p>
        </div>

        <div className="p-6 sm:p-8">
          {error ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-5">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{error}</p>
              <p className="text-xs text-gray-400">Please verify that the Certificate ID or Security Key is entered correctly.</p>
            </div>
          ) : verificationResult?.valid ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 mb-3">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Verified & Authentic
                </div>
                <h2 className="text-xl font-black text-gray-900">{getCredentialTypeLabel()}</h2>
                <p className="text-xs text-gray-500 mt-1">This record is officially authenticated on the Webory Skills network.</p>
              </div>

              <div className="border-t border-gray-100 pt-5 space-y-4">
                {/* Candidate Name */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Issued To</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{verificationResult.data?.studentName}</p>
                </div>

                {/* Program / Title */}
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    {verificationResult.type === 'course' ? 'Course Title' : 
                     verificationResult.type === 'internship' ? 'Internship Role' : 
                     verificationResult.type === 'hackathon' ? 'Hackathon' : 'Program'}
                  </span>
                  <p className="text-base font-bold text-slate-900 mt-0.5">
                    {verificationResult.data?.hackathonTitle || verificationResult.data?.title}
                  </p>
                  {verificationResult.data?.company && (
                    <p className="text-xs font-semibold text-blue-600 mt-0.5">{verificationResult.data?.company}</p>
                  )}
                  {verificationResult.data?.projectName && (
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">Project: <span className="font-semibold text-slate-900">{verificationResult.data.projectName}</span></p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Date of Issuance</span>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">
                    {verificationResult.data?.date && new Date(verificationResult.data.date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Security Key */}
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Security Key
                    </span>
                    <button
                      onClick={() => copyToClipboard(verificationResult.data?.certificateKey || '', 'key')}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="font-mono text-sm sm:text-base font-bold text-emerald-950 tracking-wider break-all select-all">
                    {verificationResult.data?.certificateKey || 'N/A'}
                  </p>
                </div>

                {/* Certificate ID */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Certificate ID</span>
                    <p className="font-mono text-xs sm:text-sm font-semibold text-slate-800 break-all select-all mt-0.5">
                      {verificationResult.data?.certificateId}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(verificationResult.data?.certificateId || '', 'id')}
                    className="ml-3 text-xs font-semibold text-slate-600 hover:text-slate-900 p-1.5 hover:bg-slate-200/60 rounded-lg transition-colors"
                    title="Copy Certificate ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              Invalid or missing certificate information.
            </div>
          )}
        </div>
        
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} Webory Skills Platform. All credentials digitally signed & verifiable.
          </p>
        </div>
      </div>
    </div>
  );
}
