import React from "react";
import { Users, PenTool } from "lucide-react";

interface SignaturesSectionProps {
    formData: any;
    setFormData: (data: any) => void;
}

export const SignaturesSection: React.FC<SignaturesSectionProps> = ({ formData, setFormData }) => {
    const updateSignature = (role: string, field: string, value: string) => {
        setFormData({
            ...formData,
            signatures: {
                ...formData.signatures,
                [role]: {
                    ...formData.signatures[role],
                    [field]: value
                }
            }
        });
    };

    return (
        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
                    <PenTool size={20} />
                </div>
                Signatures & Partnerships
            </h2>
            <div className="space-y-6">
                <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Collaboration / Partnership Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Google Developers Group"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-pink-500/50 outline-none transition-all"
                        value={formData.collaboration}
                        onChange={(e) => setFormData({ ...formData, collaboration: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Founder Signature */}
                    <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <h4 className="text-pink-400 text-xs font-bold uppercase tracking-wider">Founder Signature</h4>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm"
                            value={formData.signatures?.founder?.name || ""}
                            onChange={(e) => updateSignature("founder", "name", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm"
                            value={formData.signatures?.founder?.title || ""}
                            onChange={(e) => updateSignature("founder", "title", e.target.value)}
                        />
                    </div>
                    {/* Director Signature */}
                    <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <h4 className="text-pink-400 text-xs font-bold uppercase tracking-wider">Director Signature</h4>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm"
                            value={formData.signatures?.director?.name || ""}
                            onChange={(e) => updateSignature("director", "name", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm"
                            value={formData.signatures?.director?.title || ""}
                            onChange={(e) => updateSignature("director", "title", e.target.value)}
                        />
                    </div>
                    {/* Partner Signature */}
                    <div className="space-y-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <h4 className="text-pink-400 text-xs font-bold uppercase tracking-wider">Partner Signature</h4>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm"
                            value={formData.signatures?.partner?.name || ""}
                            onChange={(e) => updateSignature("partner", "name", e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm"
                            value={formData.signatures?.partner?.title || ""}
                            onChange={(e) => updateSignature("partner", "title", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
