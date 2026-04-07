import React, { useEffect } from "react";
import { DollarSign, Upload, Image, CheckCircle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarSettingsSectionProps {
    formData: any;
    setFormData: (data: any) => void;
    uploadingThumbnail: boolean;
    uploadingCertificate: boolean;
    handleThumbnailUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCertificateUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SidebarSettingsSection: React.FC<SidebarSettingsSectionProps> = ({ 
    formData, 
    setFormData, 
    uploadingThumbnail, 
    uploadingCertificate, 
    handleThumbnailUpload, 
    handleCertificateUpload 
}) => {
    // Auto-calculate final price
    useEffect(() => {
        const originalPrice = Number(formData.originalPrice) || 0;
        const discountPercentage = Number(formData.discountPercentage) || 0;
        const gstPercentage = Number(formData.gstPercentage) || 0;

        const discountedPrice = originalPrice - (originalPrice * (discountPercentage / 100));
        const finalPrice = Math.floor(discountedPrice + (discountedPrice * (gstPercentage / 100)));

        if (formData.price !== finalPrice) {
            setFormData({ ...formData, price: finalPrice });
        }
    }, [formData.originalPrice, formData.discountPercentage, formData.gstPercentage]);

    return (
        <div className="space-y-8">
            {/* 1. Status & Visibility */}
            <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 text-green-500 flex items-center justify-center">
                        <CheckCircle size={18} />
                    </div>
                    Status & Visibility
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-gray-300 text-sm">Course Visible</span>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                            className={`w-12 h-6 rounded-full transition-all relative ${formData.isAvailable ? 'bg-green-600' : 'bg-gray-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isAvailable ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. Pricing & GST */}
            <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-500 flex items-center justify-center">
                        <DollarSign size={18} />
                    </div>
                    Pricing & GST
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block font-bold uppercase">Original Price (₹)</label>
                        <input
                            type="number"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-yellow-500/50 outline-none"
                            value={formData.originalPrice}
                            onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1 block font-bold uppercase">Discount (%)</label>
                        <input
                            type="number"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-yellow-500/50 outline-none"
                            value={formData.discountPercentage}
                            onChange={(e) => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                        />
                    </div>
                    <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                        <p className="text-[10px] text-yellow-500 font-bold uppercase mb-1">Final Price After Discount</p>
                        <p className="text-xl font-black text-white">₹{formData.price}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <label className="text-xs text-gray-500 mb-1 block font-bold uppercase">GST Percentage (%)</label>
                        <input
                            type="number"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-yellow-500/50 outline-none"
                            value={formData.gstPercentage}
                            onChange={(e) => setFormData({ ...formData, gstPercentage: Number(e.target.value) })}
                        />
                    </div>
                </div>
            </div>

            {/* 3. Media & Assets */}
            <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
                        <Image size={18} />
                    </div>
                    Media & Assets
                </h3>
                
                <div className="space-y-6">
                    {/* Thumbnail */}
                    <div>
                        <label className="text-xs text-gray-500 mb-2 block font-bold uppercase">Course Thumbnail</label>
                        {formData.thumbnail ? (
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 group aspect-video">
                                <img src={formData.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, thumbnail: "" })}
                                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-2xl aspect-video cursor-pointer transition-all">
                                {uploadingThumbnail ? (
                                    <Loader2 className="animate-spin text-blue-500" size={32} />
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                            <Upload size={24} />
                                        </div>
                                        <span className="text-gray-500 text-xs font-medium">Upload Thumbnail</span>
                                    </>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleThumbnailUpload} />
                            </label>
                        )}
                    </div>

                    {/* Certificate */}
                    <div>
                        <label className="text-xs text-gray-500 mb-2 block font-bold uppercase">Certificate Mockup</label>
                        {formData.certificateImage ? (
                            <div className="relative rounded-2xl overflow-hidden border border-white/10 group aspect-video">
                                <img src={formData.certificateImage} alt="Certificate" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, certificateImage: "" })}
                                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-2xl aspect-video cursor-pointer transition-all">
                                {uploadingCertificate ? (
                                    <Loader2 className="animate-spin text-blue-500" size={32} />
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                            <Upload size={24} />
                                        </div>
                                        <span className="text-gray-500 text-xs font-medium">Upload Certificate Template</span>
                                    </>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleCertificateUpload} />
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
