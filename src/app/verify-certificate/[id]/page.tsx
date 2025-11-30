"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface VerificationResult {
  valid: boolean;
  type?: 'course' | 'internship';
  data?: {
    studentName: string;
    title: string;
    company?: string;
    date: string;
    score?: number;
    certificateId: string;
    certificateKey?: string;
  };
  error?: string;
}

export default function VerifyCertificatePage() {
  const { id } = useParams();
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const res = await fetch(`/api/verify-certificate/${id}`);
        const data = await res.json();

        if (res.ok) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Verifying Certificate...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-blue-900 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Certificate Verification</h1>
          <p className="text-blue-200 mt-2">Webory Skills</p>
        </div>

        <div className="p-8">
          {error ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : verificationResult?.valid ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Valid Certificate</h2>
                <p className="text-sm text-gray-500">This certificate is authentic and issued by Webory Skills.</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Issued To</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{verificationResult.data.studentName}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      {verificationResult.type === 'course' ? 'Course' : 'Internship'}
                    </dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {verificationResult.data.title}
                    </dd>
                    {verificationResult.type === 'internship' && (
                       <dd className="text-sm text-gray-600">{verificationResult.data.company}</dd>
                    )}
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date Issued</dt>
                    <dd className="mt-1 text-gray-900">
                      {new Date(verificationResult.data.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                     <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Security Key</dt>
                     <dd className="font-mono text-sm text-gray-800 break-all">
                        {verificationResult.data.certificateKey || 'N/A'}
                     </dd>
                  </div>
                   
                   <div>
                    <dt className="text-sm font-medium text-gray-500">Certificate ID</dt>
                    <dd className="mt-1 font-mono text-gray-600 text-sm">{verificationResult.data.certificateId}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
             <div className="text-center">
               <p>Unknown State</p>
             </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Webory Skills. All rights reserved.
            </p>
        </div>
      </div>
    </div>
  );
}
