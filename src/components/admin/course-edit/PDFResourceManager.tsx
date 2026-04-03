import React from "react";
import { FileText, Plus, Trash2, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFResourceManagerProps {
    pdfs: any[];
    uploadingPdf: boolean;
    uploadProgress: number;
    pdfInput: { title: string; description: string; afterModule: number; order: number };
    setPdfInput: (val: any) => void;
    handlePDFUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDeletePDF: (id: string) => void;
    modules: any[];
}

export const PDFResourceManager: React.FC<PDFResourceManagerProps> = ({ 
    pdfs, 
    uploadingPdf, 
    uploadProgress, 
    pdfInput, 
    setPdfInput, 
    handlePDFUpload, 
    handleDeletePDF,
    modules 
}) => {
    return (
        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                    <FileText size={20} />
                </div>
                PDF Resources
            </h2>

            {/* Add PDF Box */}
            <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10 mb-8 hover:border-red-500/20 transition-all">
                <h3 className="text-red-200 font-medium mb-4 flex items-center gap-2">
                    Add New PDF Resource
                </h3>
                <div className="space-y-4 mb-4">
                    <input
                        type="text"
                        placeholder="PDF Title"
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-red-500/50 outline-none"
                        value={pdfInput.title}
                        onChange={(e) => setPdfInput({ ...pdfInput, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Description (Optional)"
                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-red-500/50 outline-none"
                        value={pdfInput.description}
                        onChange={(e) => setPdfInput({ ...pdfInput, description: e.target.value })}
                    />
                    <div>
                        <label className="text-sm text-gray-400 mb-2 block">Available after Module:</label>
                        <select
                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-red-500/50 outline-none appearance-none"
                            value={pdfInput.afterModule}
                            onChange={(e) => setPdfInput({ ...pdfInput, afterModule: Number(e.target.value) })}
                        >
                            <option value={0} className="bg-gray-900 text-white">None (Available Immediately)</option>
                            {(modules || []).map((m: any, i: number) => (
                                <option key={i} value={i + 1} className="bg-gray-900 text-white">Module {i + 1}: {m.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {uploadingPdf ? (
                    <div className="bg-red-600/10 border border-red-500/20 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-red-400 text-sm font-medium flex items-center gap-2">
                                <Loader2 className="animate-spin" size={16} /> Uploading PDF...
                            </span>
                            <span className="text-red-400 text-sm font-bold">{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-red-500/10 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                    </div>
                ) : (
                    <label className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl py-4 cursor-pointer transition-all">
                        <Upload size={20} />
                        <span className="font-medium">Upload PDF File</span>
                        <input type="file" className="hidden" accept=".pdf" onChange={handlePDFUpload} />
                    </label>
                )}
            </div>

            {/* PDFs List */}
            <div className="space-y-4">
                {(pdfs || []).map((pdf, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl group hover:border-red-500/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                                <FileText size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm leading-none mb-1">{pdf.title}</h4>
                                <p className="text-[10px] text-gray-500 font-mono tracking-tight uppercase">
                                    Size: {pdf.fileSize ? (pdf.fileSize / 1024 / 1024).toFixed(2) : "0"} MB
                                    <span className="mx-2 opacity-30">|</span>
                                    After Module: {pdf.afterModule || "0"}
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleDeletePDF(pdf._id)}
                            className="bg-black/20 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full w-8 h-8 p-0"
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
