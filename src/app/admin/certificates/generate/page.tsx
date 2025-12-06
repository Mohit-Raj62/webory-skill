"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award, Plus, Loader2, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export default function CustomCertificateGeneratorPage() {
  const [studentName, setStudentName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [generating, setGenerating] = useState(false);
  const [certificate, setCertificate] = useState<{
    id: string;
    key: string;
    studentName: string;
    title: string;
    description: string;
    date: string;
  } | null>(null);

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

  const handlePrint = () => {
    window.print();
  };

  const resetForm = () => {
    setStudentName("");
    setTitle("");
    setDescription("");
    setCertificate(null);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Award className="text-purple-600" size={32} />
          Custom Certificate Generator
        </h1>
        <p className="text-gray-600 mt-2">
          Generate custom certificates with QR codes and security keys for any achievement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Certificate Details</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Excellence in Web Development"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional details about the achievement..."
                rows={4}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={generateCertificate}
                disabled={generating || !studentName.trim() || !title.trim()}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
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
                <Button onClick={resetForm} variant="outline">
                  New Certificate
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Preview</h2>
            {certificate && (
              <Button onClick={handlePrint} size="sm" variant="outline">
                <Download className="mr-2" size={16} />
                Print/Save
              </Button>
            )}
          </div>

          {certificate ? (
            <div className="border-2 border-purple-500 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-white print:border-purple-900">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Award className="text-purple-600" size={40} />
                  <div>
                    <h3 className="text-2xl font-bold text-purple-900">Webory Skills</h3>
                    <p className="text-xs text-purple-600 uppercase tracking-wider">Certificate of Achievement</p>
                  </div>
                </div>

                <div className="border-t border-b border-purple-200 py-4">
                  <p className="text-sm text-gray-600 mb-2">This is to certify that</p>
                  <h4 className="text-3xl font-bold text-purple-900 mb-2">{certificate.studentName}</h4>
                  <p className="text-sm text-gray-600 mb-2">has successfully completed</p>
                  <h5 className="text-xl font-semibold text-gray-800">{certificate.title}</h5>
                  {certificate.description && (
                    <p className="text-sm text-gray-600 mt-3 max-w-md mx-auto">{certificate.description}</p>
                  )}
                </div>

                <div className="flex justify-between items-end mt-6">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-700">
                      {new Date(certificate.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-xs text-gray-500">Date Issued</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="bg-white p-2 rounded border border-purple-300">
                      <QRCodeSVG
                        value={`${process.env.NEXT_PUBLIC_APP_URL || 'https://webory-skill.vercel.app'}/verify-certificate/${certificate.id}`}
                        size={80}
                        level="H"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Scan to Verify</p>
                    <p className="text-[10px] text-gray-400 font-mono">ID: {certificate.id}</p>
                  </div>

                  <div className="text-right">
                    <div className="font-signature text-2xl text-purple-900 mb-1">Webory Team</div>
                    <div className="border-t border-gray-400 w-32 mb-1"></div>
                    <p className="text-xs text-gray-500">Authorized Signature</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center text-gray-400">
                <Award size={48} className="mx-auto mb-2 opacity-50" />
                <p>Fill in the details to generate a certificate</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .font-signature {
          font-family: 'Great Vibes', cursive;
        }
        
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body > *:not(.print\\:block) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
