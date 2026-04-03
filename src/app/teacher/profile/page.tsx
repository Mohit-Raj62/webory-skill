"use client";

import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  FileText,
  Shield,
  Camera,
  CreditCard,
  GraduationCap,
  Award,
  FileCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Internal Sub-components
import { VerificationHeader } from "@/components/teacher/profile/VerificationHeader";
import { ProgressBar } from "@/components/teacher/profile/ProgressBar";
import { IdCardView } from "@/components/teacher/profile/IdCardView";
import { PersonalInfoForm } from "@/components/teacher/profile/PersonalInfoForm";
import { BankDetailsForm } from "@/components/teacher/profile/BankDetailsForm";
import { DocumentUploadSection } from "@/components/teacher/profile/DocumentUploadSection";
import { DeclarationSection } from "@/components/teacher/profile/DeclarationSection";

const IdCardModal = dynamic(() => import("@/components/teacher/id-card-modal").then(mod => (mod as any).IdCardModal), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm shadow-inner"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
});

// Document config
const DOCUMENT_FIELDS = [
  { key: "resume", label: "Upload Resume", accept: ".pdf", required: true, icon: FileText, description: "PDF format only" },
  { key: "aadharFront", label: "Aadhar Card (Front)", accept: ".pdf,.jpg,.jpeg,.png", required: true, icon: CreditCard, description: "PDF or JPG" },
  { key: "aadharBack", label: "Aadhar Card (Back)", accept: ".pdf,.jpg,.jpeg,.png", required: true, icon: CreditCard, description: "PDF or JPG" },
  { key: "panCard", label: "PAN Card", accept: ".pdf,.jpg,.jpeg,.png", required: true, icon: CreditCard, description: "PDF or JPG" },
  { key: "marksheet10th", label: "10th Marksheet", accept: ".pdf,.jpg,.jpeg,.png", required: true, icon: GraduationCap, description: "PDF or JPG" },
  { key: "marksheet12th", label: "12th Marksheet", accept: ".pdf,.jpg,.jpeg,.png", required: true, icon: GraduationCap, description: "PDF or JPG" },
  { key: "degree", label: "Degree / Certificate", accept: ".pdf,.jpg,.jpeg,.png", required: true, icon: Award, description: "PDF or JPG" },
  { key: "passportPhoto", label: "Passport Size Photo", accept: ".jpg,.jpeg,.png", required: true, icon: Camera, description: "JPG/PNG only" },
  { key: "cancelledCheque", label: "Cancelled Cheque / Passbook", accept: ".pdf,.jpg,.jpeg,.png", required: false, icon: CreditCard, description: "Optional — PDF or JPG" },
  { key: "experienceLetter", label: "Experience Letter", accept: ".pdf,.jpg,.jpeg,.png", required: false, icon: FileCheck, description: "Optional — PDF or JPG" },
];

export default function TeacherProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    positionApplied: "",
    dateOfBirth: "",
    currentAddress: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });
  
  const [documents, setDocuments] = useState<any>({});
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [fileNames, setFileNames] = useState<any>({});
  const [declaration, setDeclaration] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [currentStep, setCurrentStep] = useState(2);
  const [loading, setLoading] = useState(true);
  const [showIdModal, setShowIdModal] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/employee-verification/me");
        const json = await res.json();
        if (json.success && json.data) {
          setEmployeeId(json.data.employeeId);
          setCurrentStep(json.data.currentStep || 2);
          setFormData({
            fullName: json.data.fullName || "",
            phone: json.data.phone || "",
            email: json.data.email || "",
            positionApplied: json.data.positionApplied || "",
            dateOfBirth: json.data.dateOfBirth ? new Date(json.data.dateOfBirth).toISOString().split('T')[0] : "",
            currentAddress: json.data.currentAddress || "",
            bankName: json.data.bankDetails?.bankName || "",
            accountNumber: json.data.bankDetails?.accountNumber || "",
            ifscCode: json.data.bankDetails?.ifscCode || "",
          });
          setSubmitted(true);
        } else if (json.success && json.userDefaults) {
          setFormData((prev) => ({
            ...prev,
            fullName: json.userDefaults.fullName || "",
            email: json.userDefaults.email || "",
            phone: json.userDefaults.phone || "",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDocUpload = useCallback(
    async (key, file) => {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF and JPG/PNG files are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be under 5MB.");
        return;
      }

      setUploadingDoc(key);
      try {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("empId", "TEMP");
        uploadData.append("empName", formData.fullName || "Applicant");
        uploadData.append("documentType", key);

        const res = await fetch("/api/upload/kyc-document", { method: "POST", body: uploadData });
        const result = await res.json();

        if (!result.success) throw new Error(result.error || "Upload failed");

        setDocuments((prev) => ({ ...prev, [key]: result.url }));
        setFileNames((prev) => ({ ...prev, [key]: file.name }));
        toast.success(`${file.name} uploaded successfully!`);
      } catch (err) {
        toast.error(err.message || "Failed to upload document");
      } finally {
        setUploadingDoc(null);
      }
    },
    [formData.fullName]
  );

  const removeDocument = (key: string) => {
    setDocuments((prev: any) => { const c = { ...prev }; delete c[key]; return c; });
    setFileNames((prev: any) => { const c = { ...prev }; delete c[key]; return c; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phone)) { toast.error("Phone number must be exactly 10 digits."); return; }
    
    if (!formData.bankName || !formData.accountNumber || !formData.ifscCode) { toast.error("Please fill in complete bank details."); return; }

    const missingDocs = DOCUMENT_FIELDS.filter((d) => d.required && !documents[d.key]);
    if (missingDocs.length > 0) { toast.error(`Please upload: ${missingDocs.map((d) => d.label).join(", ")}`); return; }
    if (!declaration) { toast.error("Please accept the declaration."); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        documents,
        declaration,
        bankDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
        },
      };

      const res = await fetch("/api/employee-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Submission failed");

      setEmployeeId(data.data.employeeId);
      setCurrentStep(2);
      setSubmitted(true);
      toast.success(data.message);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit verification");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {!submitted && (
        <>
          <VerificationHeader />
          <ProgressBar currentStep={currentStep} />
        </>
      )}

      {/* Content */}
      <div className="px-4 md:px-8 py-6">
        {submitted ? (
          <>
            <IdCardView 
              formData={formData} 
              employeeId={employeeId} 
              currentStep={currentStep} 
              setShowIdModal={setShowIdModal} 
            />
            
            {/* Verification Success View */}
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 text-green-500">
                  <Award size={24} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Verification Submitted!</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Your documents are being reviewed. Our team will update your status within 24-48 hours.
                </p>
                
                <button 
                  type="button"
                  onClick={() => setShowIdModal(true)}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 mx-auto"
                >
                  <CreditCard size={20} /> View ID Card
                </button>
              </motion.div>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <PersonalInfoForm 
              formData={formData} 
              handleInputChange={handleInputChange} 
              setFormData={setFormData} 
            />
            
            <BankDetailsForm 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
            
            <DocumentUploadSection 
              documents={documents} 
              uploadingDoc={uploadingDoc} 
              fileNames={fileNames} 
              handleDocUpload={handleDocUpload} 
              removeDocument={removeDocument} 
              documentFields={DOCUMENT_FIELDS} 
            />
            
            <DeclarationSection 
              declaration={declaration} 
              setDeclaration={setDeclaration} 
            />

            {/* Submit Button */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <button type="submit" disabled={submitting || !declaration}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.99] text-lg">
                {submitting ? (
                  <span className="flex items-center justify-center gap-3"><Loader2 className="animate-spin" size={22} /> Submitting...</span>
                ) : (
                  <span className="flex items-center justify-center gap-3"><Shield size={22} /> Submit Verification</span>
                )}
              </button>
            </motion.div>
          </form>
        )}
      </div>

      <IdCardModal
        isOpen={showIdModal}
        onClose={() => setShowIdModal(false)}
        formData={formData}
        employeeId={employeeId}
      />
    </div>
  );
}
