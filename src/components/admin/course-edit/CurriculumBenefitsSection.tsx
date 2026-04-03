import React from "react";
import { Layers, Plus, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CurriculumBenefitsSectionProps {
    formData: any;
    setFormData: (data: any) => void;
    curriculumInput: string;
    setCurriculumInput: (val: string) => void;
    benefitsInput: string;
    setBenefitsInput: (val: string) => void;
}

export const CurriculumBenefitsSection: React.FC<CurriculumBenefitsSectionProps> = ({ 
    formData, 
    setFormData, 
    curriculumInput, 
    setCurriculumInput, 
    benefitsInput, 
    setBenefitsInput 
}) => {
    const addCurriculumItem = () => {
        if (curriculumInput.trim()) {
            setFormData({
                ...formData,
                curriculum: [...formData.curriculum, curriculumInput.trim()],
            });
            setCurriculumInput("");
        }
    };

    const removeCurriculumItem = (index: number) => {
        setFormData({
            ...formData,
            curriculum: formData.curriculum.filter((_, i) => i !== index),
        });
    };

    const addBenefitsItem = () => {
        if (benefitsInput.trim()) {
            setFormData({
                ...formData,
                benefits: [...formData.benefits, benefitsInput.trim()],
            });
            setBenefitsInput("");
        }
    };

    const removeBenefitsItem = (index: number) => {
        setFormData({
            ...formData,
            benefits: formData.benefits.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                    <Layers size={20} />
                </div>
                Curriculum & Benefits
            </h2>
            
            <div className="space-y-8">
                {/* Topics */}
                <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">What will be learned?</label>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Add a topic and press Enter"
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:border-purple-500/50 outline-none transition-all"
                            value={curriculumInput}
                            onChange={(e) => setCurriculumInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCurriculumItem())}
                        />
                        <Button 
                            type="button" 
                            onClick={addCurriculumItem}
                            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl aspect-square"
                        >
                            <Plus size={20} />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                            {(formData.curriculum || []).map((item: string, index: number) => (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    key={index} 
                                    className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full"
                                >
                                    <span className="text-purple-200 text-sm">{item}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeCurriculumItem(index)}
                                        className="text-purple-400 hover:text-red-400 transition-colors bg-black/20 rounded-full p-0.5"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="h-px bg-white/5 w-full my-6"/>

                {/* Benefits */}
                <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Key Benefits</label>
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="Add a benefit and press Enter"
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:border-green-500/50 outline-none transition-all"
                            value={benefitsInput}
                            onChange={(e) => setBenefitsInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBenefitsItem())}
                        />
                        <Button 
                            type="button" 
                            onClick={addBenefitsItem}
                            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl aspect-square"
                        >
                            <Plus size={20} />
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <AnimatePresence>
                            {(formData.benefits || []).map((item: string, index: number) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    key={index} 
                                    className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 group hover:border-white/10 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle size={16} className="text-green-500" />
                                        <span className="text-gray-200">{item}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeBenefitsItem(index)}
                                        className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X size={18} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
