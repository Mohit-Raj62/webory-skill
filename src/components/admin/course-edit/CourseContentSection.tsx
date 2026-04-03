import React from "react";
import { Video, Plus, Trash2, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseContentSectionProps {
    formData: any;
    setFormData: (data: any) => void;
    moduleInput: { title: string; description: string };
    setModuleInput: (val: { title: string; description: string }) => void;
    videoInput: { title: string; url: string; duration: string };
    setVideoInput: (val: { title: string; url: string; duration: string }) => void;
    selectedModuleIndex: number;
    setSelectedModuleIndex: (val: number) => void;
    uploadingVideo: boolean;
    uploadProgress: number;
    handleVideoFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CourseContentSection: React.FC<CourseContentSectionProps> = ({ 
    formData, 
    setFormData, 
    moduleInput, 
    setModuleInput, 
    videoInput, 
    setVideoInput, 
    selectedModuleIndex, 
    setSelectedModuleIndex, 
    uploadingVideo, 
    uploadProgress, 
    handleVideoFileUpload 
}) => {
    const addModule = () => {
        if (moduleInput.title.trim()) {
            const newModule = {
                title: moduleInput.title,
                description: moduleInput.description,
                order: formData.modules.length,
                videos: []
            };
            setFormData({
                ...formData,
                modules: [...formData.modules, newModule]
            });
            setModuleInput({ title: "", description: "" });
            setSelectedModuleIndex(formData.modules.length);
        }
    };

    const removeModule = (index: number) => {
        if (confirm("Are you sure you want to delete this module and all its videos?")) {
            const newModules = formData.modules.filter((_: any, i: number) => i !== index);
            newModules.forEach((module: any, i: number) => {
                module.order = i;
            });
            setFormData({
                ...formData,
                modules: newModules
            });
            if (selectedModuleIndex >= newModules.length) {
                setSelectedModuleIndex(Math.max(0, newModules.length - 1));
            }
        }
    };

    const removeVideoFromModule = (moduleIndex: number, videoIndex: number) => {
        const newModules = [...formData.modules];
        newModules[moduleIndex].videos = newModules[moduleIndex].videos.filter((_: any, i: number) => i !== videoIndex);
        setFormData({
            ...formData,
            modules: newModules
        });
    };

    return (
        <div className="glass-card border border-white/10 bg-black/40 backdrop-blur-xl p-8 rounded-3xl shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                    <Video size={20} />
                </div>
                Course Content
            </h2>

            {/* Add Module Box */}
            <div className="bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/10 mb-8 hover:border-indigo-500/20 transition-all">
                <h3 className="text-indigo-200 font-medium mb-4 flex items-center gap-2">
                    Add New Module
                </h3>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Module Title"
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500/50 outline-none"
                        value={moduleInput.title}
                        onChange={(e) => setModuleInput({ ...moduleInput, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Description (Optional)"
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500/50 outline-none"
                        value={moduleInput.description}
                        onChange={(e) => setModuleInput({ ...moduleInput, description: e.target.value })}
                    />
                </div>
                <Button 
                    type="button" 
                    onClick={addModule} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-6"
                >
                    <Plus size={20} className="mr-2" />
                    Create Module
                </Button>
            </div>

            {/* Video Input Box */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
                <h3 className="text-gray-300 font-medium mb-4">Add Video to Selected Module</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Video Title"
                        className="bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                        value={videoInput.title}
                        onChange={(e) => setVideoInput({ ...videoInput, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Duration (e.g., 5:30)"
                        className="bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500/50 outline-none"
                        value={videoInput.duration}
                        onChange={(e) => setVideoInput({ ...videoInput, duration: e.target.value })}
                    />
                </div>
                
                {uploadingVideo ? (
                    <div className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-blue-400 text-sm font-medium">Uploading Video...</span>
                            <span className="text-blue-400 text-sm font-bold">{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-blue-500/10 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <label className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-xl py-4 cursor-pointer transition-all">
                            <Upload size={20} className="text-gray-400" />
                            <span className="text-gray-400">Upload Video File</span>
                            <input type="file" className="hidden" accept="video/*" onChange={handleVideoFileUpload} />
                        </label>
                    </div>
                )}
            </div>

            {/* Modules List */}
            <div className="space-y-6">
                {(formData.modules || []).map((module: any, moduleIndex: number) => (
                    <div key={moduleIndex} className={`bg-black/40 border ${selectedModuleIndex === moduleIndex ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 'border-white/10'} rounded-2xl overflow-hidden transition-all duration-300`}>
                        <div 
                            className="p-5 flex items-start justify-between bg-white/5 border-b border-white/5 cursor-pointer"
                            onClick={() => setSelectedModuleIndex(moduleIndex)}
                        >
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">Module {moduleIndex + 1}: {module.title}</h4>
                                <p className="text-gray-400 text-sm">{module.description || "No description"}</p>
                                <span className="inline-block mt-2 px-2 py-1 bg-white/5 rounded text-[10px] text-gray-500 font-mono uppercase">
                                    {module.videos?.length || 0} Videos
                                </span>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={(e) => { e.stopPropagation(); removeModule(moduleIndex); }}
                                className="text-gray-500 hover:text-red-500 hover:bg-red-500/10"
                            >
                                <Trash2 size={18} />
                            </Button>
                        </div>
                        
                        {selectedModuleIndex === moduleIndex && (
                            <div className="p-5 space-y-3">
                                {module.videos?.length === 0 ? (
                                    <p className="text-center py-8 text-gray-600 text-sm italic">No videos in this module yet.</p>
                                ) : (
                                    module.videos.map((video: any, videoIndex: number) => (
                                        <div key={videoIndex} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-white/10 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                                                    <Video size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-200">{video.title}</p>
                                                    <p className="text-[10px] text-gray-500 font-mono">{video.duration}</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeVideoFromModule(moduleIndex, videoIndex)}
                                                className="text-gray-500 hover:text-red-500 transition-colors bg-white/5 rounded-full p-1 opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
