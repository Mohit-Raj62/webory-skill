import React from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, CheckCircle2, X } from "lucide-react";

interface DocumentUploadSectionProps {
  documents: Record<string, string>;
  uploadingDoc: string | null;
  fileNames: Record<string, string>;
  handleDocUpload: (key: string, file: File) => void;
  removeDocument: (key: string) => void;
  documentFields: any[];
}

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({ 
  documents, 
  uploadingDoc, 
  fileNames, 
  handleDocUpload, 
  removeDocument,
  documentFields
}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
          <Upload size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Document Upload</h2>
          <p className="text-xs text-gray-500">Upload each document separately</p>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-3 mb-5 border border-white/10">
        <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400">
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> PDF / JPG allowed only</span>
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Max file size: 5MB</span>
          <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Auto-renamed to EmpID_Name_Document</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {documentFields.map((doc) => {
          const Icon = doc.icon;
          const isUploaded = !!documents[doc.key];
          const isUploading = uploadingDoc === doc.key;

          return (
            <div key={doc.key} className={`relative rounded-xl border border-dashed transition-all ${
              isUploaded ? "border-green-500/40 bg-green-500/10"
              : isUploading ? "border-blue-500/40 bg-blue-500/10"
              : "border-white/15 bg-white/5 hover:border-blue-500/30 hover:bg-blue-500/5"
            }`}>
              <input type="file" id={`doc-${doc.key}`} accept={doc.accept} className="hidden"
                onChange={(e) => { if (e.target.files?.[0]) handleDocUpload(doc.key, e.target.files[0]); }}
                disabled={isUploading} />

              {isUploading ? (
                <div className="flex items-center gap-4 p-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Loader2 size={18} className="animate-spin" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-blue-300">Uploading...</p>
                    <div className="mt-1.5 h-1 bg-blue-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/4"></div>
                    </div>
                  </div>
                </div>
              ) : isUploaded ? (
                <div className="flex items-center gap-4 p-4">
                  <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-green-300">{doc.label}</p>
                    <p className="text-xs text-green-500/70 truncate">{fileNames[doc.key]}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label htmlFor={`doc-${doc.key}`} className="text-xs text-blue-400 hover:underline cursor-pointer font-medium">Replace</label>
                    <button type="button" onClick={() => removeDocument(doc.key)}
                      className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors">
                      <X size={12} />
                    </button>
                  </div>
                </div>
              ) : (
                <label htmlFor={`doc-${doc.key}`} className="flex items-center gap-4 p-4 cursor-pointer">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-500">
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-300">
                      {doc.label}{doc.required && <span className="text-red-400 ml-1">*</span>}
                    </p>
                    <p className="text-xs text-gray-600">{doc.description}</p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Upload size={13} />
                  </div>
                </label>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${(Object.keys(documents).length / documentFields.filter((d) => d.required).length) * 100}%` }} />
        </div>
        <span className="text-xs font-semibold text-gray-500">
          {Object.keys(documents).length}/{documentFields.filter((d) => d.required).length} required
        </span>
      </div>
    </motion.div>
  );
};
