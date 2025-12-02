"use client";

import { useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import { Search, Camera, Upload, CheckCircle, XCircle, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

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

export default function AdminVerifyCertificatePage() {
  const [certificateId, setCertificateId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const verifyCertificate = async (id: string) => {
    if (!id.trim()) {
      toast.error("Please enter a Certificate ID");
      return;
    }

    setVerifying(true);
    setResult(null);

    try {
      const res = await fetch(`/api/verify-certificate/${id.trim()}`);
      const data = await res.json();

      if (res.ok) {
        setResult(data);
        toast.success("Certificate verified successfully!");
      } else {
        setResult({ valid: false, error: data.error || "Certificate not found" });
        toast.error("Certificate verification failed");
      }
    } catch (error) {
      setResult({ valid: false, error: "Verification failed" });
      toast.error("An error occurred");
    } finally {
      setVerifying(false);
    }
  };

  const startScanner = () => {
    setScannerActive(true);
    setResult(null);

    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          // Extract Certificate ID from URL or use directly
          const urlMatch = decodedText.match(/verify-certificate\/([A-Z0-9-]+)/);
          const extractedId = urlMatch ? urlMatch[1] : decodedText;
          
          setCertificateId(extractedId);
          verifyCertificate(extractedId);
          scanner.clear();
          setScannerActive(false);
        },
        (error) => {
          // Ignore scan errors
        }
      );

      scannerRef.current = scanner;
    }, 100);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setScannerActive(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setUploadedImage(imageData);

      // Create image element to extract QR code
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          toast.error("Failed to process image");
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          // Extract Certificate ID from QR code
          const urlMatch = code.data.match(/verify-certificate\/([A-Z0-9-]+)/);
          const extractedId = urlMatch ? urlMatch[1] : code.data;
          
          setCertificateId(extractedId);
          verifyCertificate(extractedId);
          toast.success("QR Code extracted successfully!");
        } else {
          toast.error("No QR code found in the image. Please try again.");
        }
      };
      img.src = imageData;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Shield className="text-blue-600" size={32} />
          Certificate Verification
        </h1>
        <p className="text-gray-600 mt-2">
          Verify the authenticity of certificates using QR code scanner or manual ID entry.
        </p>
      </div>

      {/* Verification Methods */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Verification Methods</h2>

        {/* Manual ID Entry */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Certificate ID
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && verifyCertificate(certificateId)}
                placeholder="e.g., FSWD-5F3A2B-123456"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={() => verifyCertificate(certificateId)}
              disabled={verifying || !certificateId.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {verifying ? <Loader2 className="animate-spin" size={18} /> : "Verify"}
            </Button>
          </div>
        </div>

        {/* QR Scanner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scan QR Code
          </label>
          {!scannerActive ? (
            <Button
              onClick={startScanner}
              variant="outline"
              className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Camera className="mr-2" size={18} />
              Start QR Scanner
            </Button>
          ) : (
            <div>
              <div id="qr-reader" className="rounded-lg overflow-hidden border border-gray-300"></div>
              <Button
                onClick={stopScanner}
                variant="outline"
                className="w-full mt-3 border-red-200 text-red-600 hover:bg-red-50"
              >
                Stop Scanner
              </Button>
            </div>
          )}
        </div>

        {/* Image Upload */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Certificate Image
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Upload className="mr-2" size={18} />
            Upload Certificate Image
          </Button>
          {uploadedImage && (
            <div className="mt-3 relative">
              <img
                src={uploadedImage}
                alt="Uploaded certificate"
                className="w-full max-h-64 object-contain rounded-lg border border-gray-300"
              />
              <Button
                onClick={() => setUploadedImage(null)}
                variant="outline"
                size="sm"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Verification Result */}
      {result && (
        <div className={`bg-white p-6 rounded-lg shadow-md border-2 animate-in fade-in slide-in-from-top-4 ${
          result.valid ? 'border-green-500' : 'border-red-500'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${result.valid ? 'bg-green-100' : 'bg-red-100'}`}>
              {result.valid ? (
                <CheckCircle className="text-green-600" size={32} />
              ) : (
                <XCircle className="text-red-600" size={32} />
              )}
            </div>

            <div className="flex-1">
              <h3 className={`text-2xl font-bold mb-2 ${result.valid ? 'text-green-700' : 'text-red-700'}`}>
                {result.valid ? "✅ Valid Certificate" : "❌ Invalid Certificate"}
              </h3>

              {result.valid && result.data ? (
                <div className="space-y-3 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Student Name</p>
                      <p className="text-lg font-semibold text-gray-900">{result.data.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        {result.type === 'course' ? 'Course' : 'Internship'}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">{result.data.title}</p>
                    </div>
                  </div>

                  {result.type === 'internship' && result.data.company && (
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Company</p>
                      <p className="text-gray-900">{result.data.company}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Date Issued</p>
                      <p className="text-gray-900">
                        {new Date(result.data.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Certificate ID</p>
                      <p className="font-mono text-sm text-gray-900">{result.data.certificateId}</p>
                    </div>
                  </div>

                  {result.data.certificateKey && (
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                      <p className="text-xs font-medium text-blue-700 uppercase tracking-wider mb-1">
                        Security Key
                      </p>
                      <p className="font-mono text-sm text-blue-900 font-bold">
                        {result.data.certificateKey}
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        ✓ This key is stored securely in the database and cannot be forged.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600 mt-2">
                  {result.error || "This certificate could not be verified. It may be fake or tampered."}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2">How to Verify</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Scan the QR code on the certificate using the scanner above</li>
          <li>Or upload a certificate image to automatically extract the QR code</li>
          <li>Or manually enter the Certificate ID printed on the certificate</li>
          <li>The system will check the database and show the security key</li>
          <li>If the certificate is valid, you'll see the student details and security key</li>
        </ul>
      </div>
    </div>
  );
}
