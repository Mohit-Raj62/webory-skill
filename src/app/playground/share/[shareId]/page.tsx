"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Loader2, AlertCircle, Share2, Eye, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SharedCodePage() {
    const params = useParams();
    const router = useRouter();
    const shareId = params.shareId as string;

    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [viewCount, setViewCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSharedCode();
    }, [shareId]);

    const fetchSharedCode = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/code/share/${shareId}`);
            const data = await res.json();

            if (res.ok) {
                setCode(data.snippet.code);
                setLanguage(data.snippet.language);
                setTitle(data.snippet.title);
                setAuthor(data.snippet.author);
                setViewCount(data.snippet.viewCount);
            } else {
                setError(data.error || "Failed to load shared code");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            setError("Failed to load shared code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenInDevLab = () => {
        router.push("/playground");
        toast.info("Open DevLab and create a new file to start coding!");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading shared code...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
                <div className="text-center max-w-md mx-4">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Code Not Found</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Button
                        onClick={() => router.push("/playground")}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Go to DevLab
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0d1117] flex flex-col">
            {/* Header */}
            <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Share2 className="text-blue-400" size={24} />
                        <div>
                            <h1 className="text-lg font-semibold text-white">{title}</h1>
                            <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                                <span>by {author}</span>
                                <span className="flex items-center gap-1">
                                    <Eye size={12} />
                                    {viewCount} views
                                </span>
                                <span className="px-2 py-0.5 bg-[#21262d] rounded text-blue-400">
                                    {language}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleOpenInDevLab}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                        <Code2 size={16} />
                        Open in DevLab
                    </Button>
                </div>
            </div>

            {/* Editor (Read-only) */}
            <div className="flex-1 p-4 flex flex-col gap-4">
                <div className="max-w-7xl mx-auto w-full h-full min-h-[500px] bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden flex flex-col">
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            language={language}
                            value={code}
                            theme="vs-dark"
                            key={code ? "loaded" : "empty"} 
                            options={{
                                readOnly: true,
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineHeight: 22,
                                fontFamily: "'Fira Code', 'Cascadia Code', 'JetBrains Mono', Consolas, 'Courier New', monospace",
                                fontLigatures: true,
                                scrollBeyondLastLine: false,
                                renderLineHighlight: "line",
                                lineNumbers: "on",
                                folding: true,
                                bracketPairColorization: { enabled: true },
                                matchBrackets: "always",
                                automaticLayout: true,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-[#161b22] border-t border-[#30363d] px-4 py-3">
                <div className="max-w-7xl mx-auto text-center text-xs text-gray-500">
                    <p>
                        This code is shared via <span className="text-blue-400 font-semibold">Webory DevLab</span> • Read-only view
                    </p>
                </div>
            </div>
        </div>
    );
}
