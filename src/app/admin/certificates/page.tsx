"use client";

import { useState, useRef, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import { Search, Camera, Upload, CheckCircle, XCircle, Loader2, Award, Plus, Download, Shield, ChevronDown, ShieldAlert, RotateCcw, Ban, RefreshCw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

interface VerificationResult {
  valid: boolean;
  isRevoked?: boolean;
  revokedReason?: string;
  revokedAt?: string;
  type?: 'course' | 'internship' | 'custom' | 'hackathon' | 'ambassador';
  data?: {
    studentName: string;
    title: string;
    company?: string;
    description?: string;
    date: string;
    score?: number;
    certificateId: string;
    certificateKey?: string;
    hackathonTitle?: string;
    projectName?: string;
    rank?: number;
  };
  error?: string;
}

export default function UnifiedCertificateManagementPage() {
  const [activeTab, setActiveTab] = useState<'verify' | 'generate' | 'manage' | 'revoke'>('verify');
  
  // Verification States
  const [certificateId, setCertificateId] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [scannerActive, setScannerActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);



  // Generator States
  const [studentName, setStudentName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hackathonTitle, setHackathonTitle] = useState("");
  const [projectName, setProjectName] = useState("");
  const [certType, setCertType] = useState<'participant' | 'winner'>('participant');
  const [rank, setRank] = useState<string>("");
  const [college, setCollege] = useState("");
  const [generating, setGenerating] = useState(false);
  const [certificate, setCertificate] = useState<{
    id: string;
    key: string;
    studentName: string;
    title: string;
    description: string;
    date: string;
  } | null>(null);

  // Manual Issue States
  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [issuingId, setIssuingId] = useState<string | null>(null);

  // Revocation & Fraud Control States
  const [revokeId, setRevokeId] = useState("");
  const [revokeReason, setRevokeReason] = useState("Payment refunded / Chargeback");
  const [revoking, setRevoking] = useState(false);
  const [revokedList, setRevokedList] = useState<any[]>([]);
  const [recentValidList, setRecentValidList] = useState<any[]>([]);
  const [loadingRegistry, setLoadingRegistry] = useState(false);
  const [registryFilter, setRegistryFilter] = useState<'All' | 'Course' | 'Internship' | 'Hackathon'>('All');
  const [registrySearch, setRegistrySearch] = useState("");

  const fetchRegistry = async () => {
    try {
      setLoadingRegistry(true);
      const res = await fetch("/api/admin/certificates/revoke");
      const data = await res.json();
      if (data.success) {
        setRevokedList(data.revokedList || []);
        setRecentValidList(data.recentValidList || []);
      }
    } catch {
      console.error("Failed to fetch registry");
    } finally {
      setLoadingRegistry(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'revoke') {
      fetchRegistry();
    }
  }, [activeTab]);

  const handleRevokeAction = async (targetId: string, shouldRevoke: boolean, customReason?: string) => {
    if (!targetId.trim()) {
      toast.error("Please enter Certificate ID");
      return;
    }

    const finalReason = customReason || revokeReason.trim() || "Revoked by Superadmin";

    try {
      setRevoking(true);
      const res = await fetch("/api/admin/certificates/revoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificateId: targetId.trim(),
          isRevoked: shouldRevoke,
          reason: finalReason,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        setRevokeId("");
        fetchRegistry();
        if (result && result.data?.certificateId === targetId.trim()) {
          verifyCertificate(targetId.trim());
        }
      } else {
        toast.error(data.error || "Action failed");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setRevoking(false);
    }
  };

  // Verification Functions
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
        if (data.isRevoked) {
          toast.error("⚠️ Warning: This certificate has been REVOKED!");
        } else if (data.valid) {
          toast.success("Certificate verified successfully!");
        } else {
          toast.error(data.error || "Certificate invalid");
        }
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

  // QR Scanner Effect
  useEffect(() => {
    if (scannerActive && !scannerRef.current) {
      // Small delay to ensure DOM element exists
      const timer = setTimeout(() => {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );

        scanner.render(
          (decodedText) => {
            const urlMatch = decodedText.match(/verify-certificate\/([A-Z0-9-]+)/);
            const extractedId = urlMatch ? urlMatch[1] : decodedText;
            
            setCertificateId(extractedId);
            verifyCertificate(extractedId);
            scanner.clear();
            setScannerActive(false);
          },
          (error) => {}
        );

        scannerRef.current = scanner;
      }, 300); // Increased delay for safety

      return () => clearTimeout(timer);
    }
  }, [scannerActive]);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.clear();
        } catch (e) {
          console.error("Failed to clear scanner", e);
        }
      }
    };
  }, []);

  const startScanner = () => {
    setScannerActive(true);
    setResult(null);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (e) {
        console.error("Failed to clear scanner", e);
      }
      scannerRef.current = null;
    }
    setScannerActive(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast.info("Processing file...");

    try {
      // Handle PDF files - disabled
      if (file.type === 'application/pdf') {
        toast.error("PDF upload is currently disabled.");
        return;
      }

      // Handle image files
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUploadedImage(imageData);

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
            const urlMatch = code.data.match(/verify-certificate\/([A-Z0-9-]+)/);
            const extractedId = urlMatch ? urlMatch[1] : code.data;
            
            toast.success("QR Code found! Verifying...");
            setCertificateId(extractedId);
            verifyCertificate(extractedId);
          } else {
            toast.error("No QR code found in the image. Try uploading a clearer image or use manual ID entry.");
          }
        };
        img.onerror = () => {
          toast.error("Failed to load image. Please try another file.");
        };
        img.src = imageData;
      };
      reader.onerror = () => {
        toast.error("Failed to read file. Please try again.");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File processing error:', error);
      toast.error("Failed to process file. Please try again.");
    }
  };




  // Generator Functions
  const generateCertificate = async () => {
    if (!studentName.trim() || !title.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setGenerating(true);

    try {
      const res = await fetch("/api/admin/certificates/generate-custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: studentName.trim(),
          title: title.trim(),
          description: description.trim(),
          hackathonTitle: hackathonTitle.trim(),
          projectName: projectName.trim(),
          type: certType,
          rank: rank ? parseInt(rank) : 0,
          college: college.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setCertificate({
          id: data.certificateId,
          key: data.certificateKey,
          studentName: studentName.trim(),
          title: title.trim(),
          description: description.trim(),
          date: new Date().toISOString(),
        });
        toast.success("Certificate generated successfully!");
      } else {
        toast.error(data.error || "Failed to generate certificate");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setGenerating(false);
    }
  };

  const resetForm = () => {
    setStudentName("");
    setTitle("");
    setDescription("");
    setHackathonTitle("");
    setProjectName("");
    setCertType('participant');
    setRank("");
    setCollege("");
    setCertificate(null);
  };

  const handlePrint = () => {
    window.print();
  };

  // Manual Issue Functions
  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSearching(true);
    setUserData(null);
    try {
      const res = await fetch(`/api/admin/certificates/search-user?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      
      if (res.ok) {
        setUserData(data);
      } else {
        toast.error(data.error || "User not found");
      }
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const handleIssueCertificate = async (type: 'course' | 'internship' | 'hackathon', id: string) => {
    setIssuingId(id);
    try {
      const res = await fetch("/api/admin/certificates/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, id, email }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Certificate issued successfully!");
        const searchRes = await fetch(`/api/admin/certificates/search-user?email=${encodeURIComponent(email)}`);
        if (searchRes.ok) {
            setUserData(await searchRes.json());
        }
      } else {
        toast.error(data.error || "Failed to issue certificate");
      }
    } catch (error) {
      toast.error("Failed to issue certificate");
    } finally {
      setIssuingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Award className="text-purple-400" size={40} />
          Certificate Management
        </h1>
        <p className="text-gray-400">Verify, generate, and manage certificates all in one place</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('verify')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'verify'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Shield className="inline mr-2" size={18} />
          Verify Certificate
        </button>
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'generate'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Plus className="inline mr-2" size={18} />
          Generate Custom
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
            activeTab === 'manage'
              ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
              : 'bg-white/5 text-gray-400 hover:bg-white/10'
          }`}
        >
          <Award className="inline mr-2" size={18} />
          Manual Issue
        </button>
        <button
          onClick={() => setActiveTab('revoke')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'revoke'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/30'
              : 'bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20'
          }`}
        >
          <ShieldAlert size={18} />
          Revoke & Fraud Control
        </button>
      </div>

      {/* Tab Content */}
      <div className="glass-card p-4 md:p-6 rounded-2xl">
        {/* Verify Tab */}
        {activeTab === 'verify' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Verify Certificate Authenticity</h2>
            
            {/* Manual ID Entry */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Enter Certificate ID
              </label>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && verifyCertificate(certificateId)}
                    placeholder="e.g., FSWD-5F3A2B-123456"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button
                  onClick={() => verifyCertificate(certificateId)}
                  disabled={verifying || !certificateId.trim()}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 w-full md:w-auto"
                >
                  {verifying ? <Loader2 className="animate-spin" size={20} /> : "Verify"}
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
              {/* QR Scanner */}
              <div className="w-full">
                <label className="block text-sm font-semibold text-white mb-3">
                  Scan QR Code
                </label>
                {!scannerActive ? (
                  <Button
                    onClick={startScanner}
                    variant="outline"
                    className="w-full border-blue-400/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 py-6 md:py-8 flex flex-col gap-2 h-auto"
                  >
                    <Camera className="mb-1" size={32} />
                    <span>Start QR Scanner</span>
                  </Button>
                ) : (
                  <div className="w-full">
                    <div id="qr-reader" className="w-full rounded-lg overflow-hidden border border-white/20 bg-black/40"></div>
                    <Button
                      onClick={stopScanner}
                      variant="outline"
                      className="w-full mt-3 border-red-400/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                    >
                      Stop Scanner
                    </Button>
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div className="w-full">
                <label className="block text-sm font-semibold text-white mb-3">
                  Upload Certificate Image/PDF
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full border-purple-400/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 py-6 md:py-8 flex flex-col gap-2 h-auto"
                >
                  <Upload className="mb-1" size={32} />
                  <span>Upload Certificate</span>
                </Button>
                {uploadedImage && (
                  <div className="mt-3 relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded certificate"
                      className="w-full max-h-48 object-contain rounded-lg border border-white/20 bg-black/20"
                    />
                    <Button
                      onClick={() => setUploadedImage(null)}
                      size="sm"
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Verification Result */}
            {result && (
              <div className={`p-4 md:p-6 rounded-xl border-2 animate-in fade-in ${
                result.valid ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${result.valid ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {result.valid ? (
                      <CheckCircle className="text-green-400" size={32} />
                    ) : (
                      <XCircle className="text-red-400" size={32} />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className={`text-xl md:text-2xl font-bold ${result.valid ? 'text-green-400' : 'text-red-400'}`}>
                        {result.isRevoked ? "⚠️ Certificate REVOKED" : result.valid ? "✅ Valid Certificate" : "❌ Invalid Certificate"}
                      </h3>
                      {result.valid && result.data?.certificateId && (
                        <button
                          onClick={() => {
                            const r = prompt("Reason for revoking this certificate (e.g. Payment refunded / Fraud):", "Violated platform terms / Refunded");
                            if (r !== null) handleRevokeAction(result.data!.certificateId, true, r);
                          }}
                          disabled={revoking}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-bold transition-colors w-fit"
                        >
                          <Ban size={14} /> Revoke Certificate
                        </button>
                      )}
                      {result.isRevoked && result.data?.certificateId && (
                        <button
                          onClick={() => handleRevokeAction(result.data!.certificateId, false, "Reinstated by Superadmin")}
                          disabled={revoking}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-bold transition-colors w-fit"
                        >
                          <RotateCcw size={14} /> Reinstate Validity
                        </button>
                      )}
                    </div>

                    {result.isRevoked ? (
                      <div className="bg-red-950/60 border border-red-500/40 rounded-xl p-4 mt-3 space-y-2">
                        <p className="text-xs font-black uppercase tracking-wider text-red-300">Official Revocation Notice</p>
                        <p className="text-sm text-white font-semibold">{result.revokedReason || "Revoked by Administration"}</p>
                        {result.data && (
                          <p className="text-xs text-red-200/80">
                            Issued to: <strong>{result.data.studentName}</strong> ({result.data.title})
                          </p>
                        )}
                      </div>
                    ) : result.valid && result.data ? (
                      <div className="space-y-3 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-400 font-medium">Student Name</p>
                            <p className="text-lg font-semibold text-white">{result.data.studentName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 font-medium">
                              {result.type === 'course' ? 'Course' : result.type === 'internship' ? 'Internship' : result.type === 'hackathon' ? 'Hackathon' : 'Achievement'}
                            </p>
                            <p className="text-lg font-semibold text-white">{result.data.title}</p>
                            {result.type === 'hackathon' && result.data.hackathonTitle && (
                              <p className="text-sm text-purple-300">{result.data.hackathonTitle}</p>
                            )}
                          </div>
                        </div>

                        {result.type === 'hackathon' && result.data.projectName && (
                          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <p className="text-xs text-gray-400 uppercase">Project Name</p>
                            <p className="text-sm text-white font-medium">{result.data.projectName}</p>
                          </div>
                        )}

                        {/* Tampering Warning */}
                        <div className="bg-yellow-500/20 p-4 rounded-lg border border-yellow-400/30">
                          <p className="text-xs font-medium text-yellow-300 uppercase tracking-wider mb-1">
                            ⚠️ Anti-Tampering Check
                          </p>
                          <p className="text-sm text-yellow-100">
                            If the name or details on the printed certificate don't match the information shown above, 
                            the certificate has been <span className="font-bold">TAMPERED/EDITED</span> and is <span className="font-bold text-red-400">INVALID</span>.
                          </p>
                        </div>

                        {result.data.certificateKey && (
                          <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-400/30">
                            <p className="text-xs font-medium text-blue-300 uppercase tracking-wider mb-1">
                              Security Key
                            </p>
                            <p className="font-mono text-sm text-blue-100 font-bold">
                              {result.data.certificateKey}
                            </p>
                            <p className="text-xs text-blue-300 mt-2">
                              ✓ This key should match the key printed on the certificate. If different = FAKE!
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-300 mt-2">
                        {result.error || "This certificate could not be verified. It may be fake or tampered."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}


          </div>
        )}

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Generate Custom Certificate</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Student Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Certificate Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Excellence in Web Development"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Additional details about the achievement..."
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    College/Institution (Optional)
                  </label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g., IIT Delhi"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Hackathon Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={hackathonTitle}
                      onChange={(e) => setHackathonTitle(e.target.value)}
                      placeholder="Webory Hackathon 2024"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Project Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Smart Dashboard"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Type
                    </label>
                    <select
                      value={certType}
                      onChange={(e) => setCertType(e.target.value as any)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="participant" className="bg-gray-900">Participant</option>
                      <option value="winner" className="bg-gray-900">Winner</option>
                    </select>
                  </div>
                  {certType === 'winner' && (
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Rank
                      </label>
                      <input
                        type="number"
                        value={rank}
                        onChange={(e) => setRank(e.target.value)}
                        placeholder="1"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={generateCertificate}
                    disabled={generating || !studentName.trim() || !title.trim()}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 py-3"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 animate-spin" size={18} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2" size={18} />
                        Generate Certificate
                      </>
                    )}
                  </Button>
                  {certificate && (
                    <Button onClick={resetForm} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      New
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Preview</h2>
                {certificate && (
                  <Button onClick={handlePrint} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Download className="mr-2" size={16} />
                    Print/Save
                  </Button>
                )}
              </div>

              {certificate ? (
                  <div className="border-2 border-purple-500 rounded-lg p-4 md:p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Award className="text-purple-400" size={32} />
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-white">Webory Skills</h3>
                          <p className="text-[10px] md:text-xs text-purple-300 uppercase tracking-wider">Certificate of Achievement</p>
                        </div>
                      </div>

                      <div className="border-t border-b border-purple-400/30 py-4">
                        <p className="text-xs md:text-sm text-gray-300 mb-2">This is to certify that</p>
                        <h4 className="text-2xl md:text-3xl font-bold text-white mb-2 break-words">{certificate.studentName}</h4>
                        <p className="text-xs md:text-sm text-gray-300 mb-2">has successfully completed</p>
                        <h5 className="text-lg md:text-xl font-semibold text-purple-200 break-words">{certificate.title}</h5>
                        {certificate.description && (
                          <p className="text-xs md:text-sm text-gray-400 mt-3 max-w-md mx-auto">{certificate.description}</p>
                        )}
                      </div>

                    <div className="flex justify-between items-end mt-6">
                      <div className="text-left">
                        <p className="text-xs md:text-sm font-semibold text-white">
                          {new Date(certificate.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-400">Date Issued</p>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="bg-white p-2 rounded border border-purple-400">
                          <QRCodeSVG
                            value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://weboryskills.in'}/verify-certificate/${certificate.id}`}
                            size={80}
                            level="H"
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Scan to Verify</p>
                        <p className="text-[10px] text-gray-500 font-mono">ID: {certificate.id}</p>
                        {certificate.key && (
                          <p className="text-[8px] font-mono text-gray-400 mt-1">
                            Key: {certificate.key}
                          </p>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-3xl md:text-4xl text-purple-300 mb-1" style={{fontFamily: "'Mr De Haviland', cursive"}}>Webory Team</div>
                        <div className="border-t border-gray-400 w-24 md:w-32 mb-1"></div>
                        <p className="text-xs text-gray-400">Authorized Signature</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center border-2 border-dashed border-white/20 rounded-lg">
                  <div className="text-center text-gray-500">
                    <Award size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Fill in the details to generate a certificate</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manual Issue Tab */}
        {activeTab === 'manage' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Manual Certificate Issuance</h2>
            <p className="text-gray-400 mb-6">
              Search for a student by email to manually issue certificates for their enrollments or internships.
            </p>

            <form onSubmit={handleSearchUser} className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="email" 
                  placeholder="Enter student email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <Button type="submit" disabled={searching} className="bg-green-600 hover:bg-green-700 px-6 py-3 w-full md:w-auto">
                {searching ? <Loader2 className="animate-spin" /> : "Search"}
              </Button>
            </form>

            {userData && (
              <div className="space-y-6 animate-in fade-in">
                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <h3 className="font-semibold text-white text-lg">{userData.user.name}</h3>
                  <p className="text-sm text-gray-400">{userData.user.email}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-3">Enrollments, Internships & Hackathons</h3>
                  {userData.enrollments.length === 0 && userData.internships.length === 0 && userData.hackathons.length === 0 ? (
                    <p className="text-gray-500 italic">No enrollments, internships or hackathons found.</p>
                  ) : (
                    <div className="space-y-3">
                      {[...userData.enrollments, ...userData.internships, ...userData.hackathons].map((item: any) => (
                        <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-white/20 rounded-lg bg-white/5 hover:bg-white/10 transition-colors gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                item.type === 'course' ? 'bg-blue-500/20 text-blue-300' : 
                                item.type === 'internship' ? 'bg-purple-500/20 text-purple-300' :
                                'bg-orange-500/20 text-orange-300'
                              }`}>
                                {item.type === 'course' ? 'Course' : item.type === 'internship' ? 'Internship' : 'Hackathon'}
                              </span>
                              <h4 className="font-medium text-white">{item.title}</h4>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {item.type === 'course' ? `Progress: ${Math.round(item.progress)}%` : 
                               item.type === 'internship' ? `Status: ${item.status}` :
                               `Project: ${item.projectName || 'N/A'}`}
                              {' • '}
                              {new Date(item.date).toLocaleDateString()}
                            </p>
                          </div>

                          {item.certificateId ? (
                            <div className="flex items-center gap-2 text-green-400 bg-green-500/20 px-3 py-1.5 rounded-md border border-green-400/30 w-full md:w-auto justify-center md:justify-start">
                              <CheckCircle size={16} />
                              <span className="text-sm font-medium">Issued</span>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => handleIssueCertificate(item.type, item.id)}
                              disabled={issuingId === item.id}
                              className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                            >
                              {issuingId === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Plus className="h-4 w-4 mr-1" />
                                  Issue Certificate
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Revoke & Fraud Control Tab */}
        {activeTab === 'revoke' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="text-red-400" size={26} />
                  Certificate Revocation & Fraud Control
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  Superadmin authority to permanently invalidate fake, refunded, or misused certificates. Revoked certificates immediately show a red alert on public verification links.
                </p>
              </div>
              <button
                onClick={fetchRegistry}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-xs font-semibold w-fit"
              >
                <RefreshCw size={14} className={loadingRegistry ? "animate-spin" : ""} />
                Refresh Registry
              </button>
            </div>

            {/* Quick Revoke Box */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 md:p-6 space-y-4">
              <h3 className="text-base font-bold text-red-300 flex items-center gap-2">
                <Ban size={18} /> Revoke by Certificate ID or Security Key
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Certificate ID / Key *
                  </label>
                  <input
                    type="text"
                    value={revokeId}
                    onChange={(e) => setRevokeId(e.target.value)}
                    placeholder="e.g. FSWD-5F3A2B-123456"
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Official Revocation Reason *
                  </label>
                  <input
                    type="text"
                    value={revokeReason}
                    onChange={(e) => setRevokeReason(e.target.value)}
                    placeholder="e.g. Fee refunded / Forgery detected"
                    className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => handleRevokeAction(revokeId, true)}
                    disabled={revoking || !revokeId.trim()}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl h-[42px]"
                  >
                    {revoking ? <Loader2 className="animate-spin mr-2" size={16} /> : <Ban className="mr-2" size={16} />}
                    Revoke Certificate
                  </Button>
                </div>
              </div>
            </div>

            {/* Split View: Revoked Blacklist vs Recent Valid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revoked Certificates Blacklist */}
              <div className="bg-white/5 border border-red-500/20 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-red-500/10 flex items-center justify-between">
                  <h3 className="font-bold text-red-300 text-sm flex items-center gap-2">
                    <ShieldAlert size={16} /> Revoked / Blacklisted ({revokedList.length})
                  </h3>
                </div>
                <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
                  {loadingRegistry ? (
                    <div className="p-8 text-center text-gray-400 text-xs">Loading registry...</div>
                  ) : revokedList.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-xs">
                      No revoked certificates yet.
                    </div>
                  ) : (
                    revokedList.map((item) => (
                      <div key={item.certificateId} className="p-4 flex items-center justify-between gap-3 hover:bg-white/[0.02]">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                              {item.type}
                            </span>
                            <span className="font-mono text-xs font-bold text-white truncate">
                              {item.certificateId}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-white mt-1">{item.studentName}</p>
                          <p className="text-xs text-gray-400 truncate">{item.title}</p>
                          <p className="text-[11px] text-red-400 mt-1">Reason: {item.revokedReason}</p>
                        </div>
                        <button
                          onClick={() => handleRevokeAction(item.certificateId, false, "Reinstated by Superadmin")}
                          disabled={revoking}
                          className="shrink-0 inline-flex items-center gap-1 text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 px-3 py-1.5 rounded-xl transition-colors"
                        >
                          <RotateCcw size={12} /> Reinstate
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Issued Valid Certificates */}
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/[0.02] space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-400" /> Recent Valid Certificates ({recentValidList.length})
                    </h3>
                    <div className="flex items-center gap-1 bg-black/30 p-1 rounded-lg">
                      {(['All', 'Internship', 'Course', 'Hackathon'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setRegistryFilter(tab)}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                            registryFilter === tab
                              ? 'bg-emerald-600 text-white'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={registrySearch}
                    onChange={(e) => setRegistrySearch(e.target.value)}
                    placeholder="Filter by student name, title, or ID..."
                    className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
                  {loadingRegistry ? (
                    <div className="p-8 text-center text-gray-400 text-xs">Loading certificates...</div>
                  ) : (() => {
                    const filteredValid = recentValidList.filter((item) => {
                      if (registryFilter !== 'All') {
                        if (registryFilter === 'Hackathon' && item.type !== 'Hackathon' && item.type !== 'Custom') return false;
                        if (registryFilter !== 'Hackathon' && item.type !== registryFilter) return false;
                      }
                      if (registrySearch.trim()) {
                        const q = registrySearch.toLowerCase();
                        return (
                          (item.certificateId || "").toLowerCase().includes(q) ||
                          (item.studentName || "").toLowerCase().includes(q) ||
                          (item.title || "").toLowerCase().includes(q)
                        );
                      }
                      return true;
                    });
                    if (filteredValid.length === 0) {
                      return (
                        <div className="p-8 text-center text-gray-400 text-xs">
                          No matching {registryFilter !== 'All' ? registryFilter.toLowerCase() : ''} certificates found.
                        </div>
                      );
                    }
                    return filteredValid.map((item) => (
                      <div key={item.certificateId} className="p-4 flex items-center justify-between gap-3 hover:bg-white/[0.02]">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              item.type === 'Internship'
                                ? 'bg-purple-500/20 text-purple-300'
                                : item.type === 'Course'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {item.type}
                            </span>
                            <span className="font-mono text-xs font-bold text-gray-200 truncate">
                              {item.certificateId}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-white mt-1">{item.studentName}</p>
                          <p className="text-xs text-gray-400 truncate">{item.title}</p>
                        </div>
                        <button
                          onClick={() => {
                            const r = prompt(`Revoke certificate ${item.certificateId} for ${item.studentName}? Enter reason:`, "Payment refunded / Violation");
                            if (r !== null) handleRevokeAction(item.certificateId, true, r);
                          }}
                          disabled={revoking}
                          className="shrink-0 inline-flex items-center gap-1 text-xs font-bold bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 px-3 py-1.5 rounded-xl transition-colors"
                        >
                          <Ban size={12} /> Revoke
                        </button>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Mr+De+Haviland&display=swap');
      `}</style>
    </div>
  );
}
