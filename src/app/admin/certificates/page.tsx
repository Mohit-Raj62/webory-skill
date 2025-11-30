"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminCertificatesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; updatedCount?: number; error?: string } | null>(null);

  const handleGenerateKeys = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/certificates/generate", {
        method: "POST",
      });
      const data = await res.json();
      
      if (res.ok) {
        setResult({ success: true, updatedCount: data.updatedCount });
      } else {
        setResult({ success: false, error: data.error || "Failed to generate keys" });
      }
    } catch (error) {
      setResult({ success: false, error: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Certificate Management</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Certificate Security Updates</h2>
        <p className="text-gray-600 mb-6">
          Use this tool to generate unique security keys and QR codes for older certificates that were issued before the security update.
          This will scan all completed enrollments and internships and add missing keys.
        </p>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleGenerateKeys} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Missing Keys
              </>
            )}
          </Button>
        </div>

        {result && (
          <div className={`mt-6 p-4 rounded-md ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              )}
              <span className={result.success ? 'text-green-800' : 'text-red-800'}>
                {result.success 
                  ? `Successfully updated ${result.updatedCount} certificates with new security keys.` 
                  : `Error: ${result.error}`
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
