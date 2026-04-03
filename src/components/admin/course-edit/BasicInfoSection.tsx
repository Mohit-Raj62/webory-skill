import React from "react";
import { Tag } from "lucide-react";

interface BasicInfoSectionProps {
    formData: any;
    setFormData: (data: any) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ formData, setFormData }) => {
    return (
        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Tag size={20} />
                </div>
                Basic Information
            </h2>
            <div className="space-y-6">
                <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Course Title *</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all focus:bg-white/10 focus:ring-1 focus:ring-blue-500/20 text-lg"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Full Stack Web Development"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-400 font-medium mb-2 block">Description *</label>
                    <textarea
                        required
                        rows={6}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all focus:bg-white/10 focus:ring-1 focus:ring-blue-500/20 resize-y"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Detailed description of the course..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-400 font-medium mb-2 block">Level *</label>
                        <select
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500/50 outline-none transition-all focus:bg-white/10 appearance-none cursor-pointer"
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        >
                            <option value="Beginner" className="bg-gray-900">Beginner</option>
                            <option value="Intermediate" className="bg-gray-900">Intermediate</option>
                            <option value="Advanced" className="bg-gray-900">Advanced</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 font-medium mb-2 block">Duration</label>
                        <input
                            type="text"
                            placeholder="e.g., 10h 30m"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all focus:bg-white/10"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-400 font-medium mb-2 block">Language</label>
                        <input
                            type="text"
                            placeholder="e.g., English, Hindi"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all focus:bg-white/10"
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 font-medium mb-2 block">Students Enrolled</label>
                        <input
                            type="text"
                            placeholder="e.g., 15,400+"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all focus:bg-white/10"
                            value={formData.studentsCount}
                            onChange={(e) => setFormData({ ...formData, studentsCount: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-400 font-medium mb-2 block">Promo Video URL</label>
                        <input
                            type="text"
                            placeholder="e.g., YouTube Link"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all focus:bg-white/10"
                            value={formData.promoVideoUrl}
                            onChange={(e) => setFormData({ ...formData, promoVideoUrl: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 font-medium mb-2 block">Promo Video Duration</label>
                        <input
                            type="text"
                            placeholder="e.g., 02:45 MINS"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all focus:bg-white/10"
                            value={formData.promoVideoDuration}
                            onChange={(e) => setFormData({ ...formData, promoVideoDuration: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm text-gray-400 font-medium mb-2 block">Last Updated Date (Override)</label>
                        <input
                            type="text"
                            placeholder="e.g. 9/12/2025"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-blue-500/50 outline-none transition-all focus:bg-white/10"
                            value={formData.lastUpdatedDate}
                            onChange={(e) => setFormData({ ...formData, lastUpdatedDate: e.target.value })}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
