"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { uploadFile, uploadPDFToCloudinary } from "@/lib/upload-utils";

// Sub-components
import { BasicInfoSection } from "@/components/admin/course-edit/BasicInfoSection";
import { CurriculumBenefitsSection } from "@/components/admin/course-edit/CurriculumBenefitsSection";
import { CourseContentSection } from "@/components/admin/course-edit/CourseContentSection";
import { PDFResourceManager } from "@/components/admin/course-edit/PDFResourceManager";
import { SidebarSettingsSection } from "@/components/admin/course-edit/SidebarSettingsSection";
import { SignaturesSection } from "@/components/admin/course-edit/SignaturesSection";

export default function EditCoursePage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [uploadingCertificate, setUploadingCertificate] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        level: "Beginner",
        price: 0,
        originalPrice: 0,
        discountPercentage: 0,
        studentsCount: "0",
        language: "English/Hindi",
        promoVideoUrl: "",
        promoVideoDuration: "",
        lastUpdatedDate: "",
        color: "from-blue-500 to-purple-500",
        icon: "Globe",
        duration: "0h",
        thumbnail: "",
        certificateImage: "",
        curriculum: [] as string[],
        benefits: [] as string[],
        modules: [] as {
            title: string;
            description: string;
            order: number;
            videos: { title: string; url: string; duration: string }[];
        }[],
        collaboration: "",
        signatures: {
            founder: { name: "Mohit Raj", title: "Founder & CEO" },
            director: { name: "Webory Team", title: "Director of Education" },
            partner: { name: "Partner Rep.", title: "Authorized Signatory" }
        },
        isAvailable: true,
        gstPercentage: 0
    });

    const [curriculumInput, setCurriculumInput] = useState("");
    const [benefitsInput, setBenefitsInput] = useState("");
    const [moduleInput, setModuleInput] = useState({ title: "", description: "" });
    const [selectedModuleIndex, setSelectedModuleIndex] = useState<number>(0);
    const [videoInput, setVideoInput] = useState({ title: "", url: "", duration: "" });
    
    // PDF Resources State
    const [pdfs, setPdfs] = useState<any[]>([]);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [pdfInput, setPdfInput] = useState({
        title: "",
        description: "",
        afterModule: 0,
        order: 0
    });

    useEffect(() => {
        fetchCourse();
        fetchPDFs();
    }, []);

    const fetchPDFs = async () => {
        try {
            const res = await fetch(`/api/admin/courses/${params.id}/pdfs`);
            if (res.ok) {
                const data = await res.json();
                setPdfs(data.pdfs || []);
            }
        } catch (error) {
            console.error("Failed to fetch PDFs", error);
        }
    };

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/courses/${params.id}?includeUnavailable=true`);
            if (res.ok) {
                const data = await res.json();
                
                let modules = data.course.modules || [];
                if (modules.length === 0 && data.course.videos && data.course.videos.length > 0) {
                    modules = [{
                        title: "Course Content",
                        description: "All course videos",
                        order: 0,
                        videos: data.course.videos
                    }];
                }
                
                setFormData({
                    ...data.course,
                    modules: modules,
                    signatures: data.course.signatures || {
                        founder: { name: "Mohit Raj", title: "Founder & CEO" },
                        director: { name: "Webory Team", title: "Director of Education" },
                        partner: { name: "Partner Rep.", title: "Authorized Signatory" }
                    }
                });
            }
        } catch (error) {
            console.error("Failed to fetch course", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if(e) e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/admin/courses/${params.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Course updated successfully!");
                await fetchCourse();
            } else {
                alert("Failed to update course");
            }
        } catch (error) {
            console.error("Update course error:", error);
            alert("Failed to update course");
        } finally {
            setSaving(false);
        }
    };

    const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 5 * 1024 * 1024; 
        if (file.size > maxSize) {
            alert(`File too large! Maximum size is 5MB.`);
            return;
        }

        setUploadingThumbnail(true);
        try {
            const data = await uploadFile(file, "/api/upload/image");
            setFormData((prev) => ({ ...prev, thumbnail: data.url }));
        } catch (error: any) {
            alert(error.message || "Failed to upload thumbnail");
        } finally {
            setUploadingThumbnail(false);
        }
    };

    const handleCertificateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingCertificate(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);
            const res = await fetch("/api/upload/image", { method: "POST", body: uploadFormData });
            if (res.ok) {
                const data = await res.json();
                setFormData((prev) => ({ ...prev, certificateImage: data.url }));
            }
        } catch (error: any) {
            alert(error.message || "Certificate upload failed");
        } finally {
            setUploadingCertificate(false);
        }
    };

    const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!videoInput.title) {
            alert("Please enter video title first");
            return;
        }

        const maxSize = 500 * 1024 * 1024; 
        if (file.size > maxSize) {
            alert(`File too large! Maximum size is 500MB.`);
            return;
        }

        setUploadingVideo(true);
        setUploadProgress(0);

        try {
            const data = await uploadFile(file, "/api/upload/video", (progress) => {
                setUploadProgress(progress);
            });

            const newModules = [...formData.modules];
            if (newModules.length === 0) {
                newModules.push({ title: "Course Content", description: "All course videos", order: 0, videos: [] });
                setSelectedModuleIndex(0);
            }
            
            if (!newModules[selectedModuleIndex].videos) {
                newModules[selectedModuleIndex].videos = [];
            }
            
            newModules[selectedModuleIndex].videos.push({
                title: videoInput.title,
                url: data.url,
                duration: videoInput.duration || Math.floor(data.duration || 0).toString() + "s",
            });

            setFormData((prev) => ({ ...prev, modules: newModules }));
            setVideoInput({ title: "", url: "", duration: "" });
            alert("Video uploaded successfully!");
        } catch (error: any) {
            alert(error.message || "Failed to upload video.");
        } finally {
            setUploadingVideo(false);
            setUploadProgress(0);
        }
    };

    const handlePDFUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!pdfInput.title) {
            alert("Please enter PDF title first");
            return;
        }

        const maxSize = 100 * 1024 * 1024; 
        if (file.size > maxSize) {
            alert(`File too large! Maximum size is 100MB.`);
            return;
        }

        setUploadingPdf(true);
        setUploadProgress(0);

        try {
            const targetModule = Number(pdfInput.afterModule);
            const existingInModule = pdfs.filter(p => (p.afterModule || 0) === targetModule);
            const maxOrder = existingInModule.reduce((max, p) => Math.max(max, p.order || 0), 0);
            const nextOrder = maxOrder + 1;
            
            const uploadData = await uploadPDFToCloudinary(file);

            const res = await fetch(`/api/admin/courses/${params?.id}/pdfs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...pdfInput,
                    fileUrl: uploadData.url,
                    fileName: uploadData.fileName,
                    fileSize: uploadData.fileSize,
                    afterModule: targetModule,
                    order: nextOrder,
                    cloudinaryId: uploadData.cloudinaryId
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setPdfs([...pdfs, data.pdf]);
                setPdfInput({ title: "", description: "", afterModule: 0, order: 0 });
                alert("PDF uploaded successfully!");
            }
        } catch (error: any) {
            alert(error.message || "Failed to upload PDF");
        } finally {
            setUploadingPdf(false);
            setUploadProgress(0);
        }
    };

    const handleDeletePDF = async (pdfId: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/admin/courses/${params.id}/pdfs/${pdfId}`, { method: "DELETE" });
            if (res.ok) setPdfs(pdfs.filter(p => p._id !== pdfId));
        } catch (error) {
            alert("Failed to delete PDF");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black/50">
                <div className="flex flex-col items-center gap-4 text-white">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p>Loading course data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/admin/courses">
                        <Button variant="ghost" className="mb-4 text-gray-400 hover:text-white">
                            <ArrowLeft size={18} className="mr-2" />
                            Back to Courses
                        </Button>
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Edit Course</h1>
                </div>
                <Button
                    disabled={saving}
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] text-white px-8 py-6 rounded-xl font-medium text-lg"
                >
                    {saving ? "Saving..." : <span className="flex items-center gap-2"><CheckCircle size={20} /> Update Course</span>}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <BasicInfoSection formData={formData} setFormData={setFormData} />
                    <CurriculumBenefitsSection 
                        formData={formData} 
                        setFormData={setFormData} 
                        curriculumInput={curriculumInput} 
                        setCurriculumInput={setCurriculumInput}
                        benefitsInput={benefitsInput}
                        setBenefitsInput={setBenefitsInput}
                    />
                    <CourseContentSection 
                        formData={formData} 
                        setFormData={setFormData}
                        moduleInput={moduleInput}
                        setModuleInput={setModuleInput}
                        videoInput={videoInput}
                        setVideoInput={setVideoInput}
                        selectedModuleIndex={selectedModuleIndex}
                        setSelectedModuleIndex={setSelectedModuleIndex}
                        uploadingVideo={uploadingVideo}
                        uploadProgress={uploadProgress}
                        handleVideoFileUpload={handleVideoFileUpload}
                    />
                    <PDFResourceManager 
                        pdfs={pdfs}
                        uploadingPdf={uploadingPdf}
                        uploadProgress={uploadProgress}
                        pdfInput={pdfInput}
                        setPdfInput={setPdfInput}
                        handlePDFUpload={handlePDFUpload}
                        handleDeletePDF={handleDeletePDF}
                        modules={formData.modules}
                    />
                    <SignaturesSection formData={formData} setFormData={setFormData} />
                </div>

                <SidebarSettingsSection 
                    formData={formData}
                    setFormData={setFormData}
                    uploadingThumbnail={uploadingThumbnail}
                    uploadingCertificate={uploadingCertificate}
                    handleThumbnailUpload={handleThumbnailUpload}
                    handleCertificateUpload={handleCertificateUpload}
                />
            </div>
        </div>
    );
}
