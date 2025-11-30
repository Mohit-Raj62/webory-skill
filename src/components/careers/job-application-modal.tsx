"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: string;
}

export function JobApplicationModal({ isOpen, onClose, position }: JobApplicationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: ""
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("position", position);
      formDataToSend.append("coverLetter", formData.coverLetter);
      formDataToSend.append("resume", resumeFile);

      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: formDataToSend
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Application submitted successfully!");
        setFormData({ name: "", email: "", phone: "", coverLetter: "" });
        setResumeFile(null);
        onClose();
      } else {
        toast.error(data.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Application error:", error);
      toast.error("Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Apply for Position</h2>
            <p className="text-gray-400 mt-1">{position}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-white/5 border-white/10 text-white"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="bg-white/5 border-white/10 text-white"
              placeholder="+91 1234567890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter" className="text-white">Cover Letter (Optional)</Label>
            <textarea
              id="coverLetter"
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us why you're a great fit for this position..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume" className="text-white">Resume *</Label>
            <div className="relative">
              <input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                required
                className="hidden"
              />
              <label
                htmlFor="resume"
                className="flex items-center justify-center gap-2 w-full p-4 bg-white/5 border-2 border-dashed border-white/10 rounded-lg cursor-pointer hover:border-white/20 transition-colors"
              >
                <Upload size={20} className="text-gray-400" />
                <span className="text-gray-400">
                  {resumeFile ? resumeFile.name : "Upload Resume (PDF, DOC, DOCX)"}
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
