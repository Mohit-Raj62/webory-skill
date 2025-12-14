
"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Loader2, AlertCircle, Terminal, Copy, Check, Info, Save, FilePlus, FolderOpen, Trash2, FileCode, ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const LANGUAGE_VERSIONS = {
    javascript: "18.15.0",
    typescript: "5.0.3",
    python: "3.10.0",
    java: "15.0.2",
    csharp: "6.12.0",
    php: "8.2.3",
    cpp: "10.2.0",
    go: "1.16.2",
    rust: "1.68.2",
    swift: "5.3.3",
    ruby: "3.0.1",
    kotlin: "1.8.20",
    bash: "5.2.0",
    perl: "5.36.0",
    lua: "5.4.4",
    html: "5",
};

type Language = keyof typeof LANGUAGE_VERSIONS;

const CODE_SNIPPETS: Record<Language, string> = {
    javascript: `// JavaScript Playground
function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("World");
`,
    typescript: `// TypeScript Playground
interface User {
  name: string;
  id: number;
}

const user: User = {
  name: "Webory",
  id: 1,
};

console.log(user);
`,
    python: `# Python Playground
def greet(name):
    print(f"Hello, {name}!")

greet("World")
`,
    java: `// Java Playground
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`,
    csharp: `// C# Playground
using System;

namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
        }
    }
}
`,
    php: `<?php
// PHP Playground
echo "Hello, World!";
?>
`,
    cpp: `// C++ Playground
#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
`,
    go: `// Go Playground
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
`,
    rust: `// Rust Playground
fn main() {
    println!("Hello, World!");
}
`,
    swift: `// Swift Playground
import Foundation

print("Hello, World!")
`,
    ruby: `# Ruby Playground
puts "Hello, World!"
`,
    kotlin: `// Kotlin Playground
fun main() {
    println("Hello, World!")
}
`,
    bash: `# Bash Playground
echo "Hello, World!"
`,
    perl: `# Perl Playground
print "Hello, World!\\n";
`,
    lua: `-- Lua Playground
print("Hello, World!")
`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webory Live Preview</title>
    
    <!-- React & ReactDOM -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Babel for JSX -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <style>
        body { margin: 0; padding: 0; background: white; font-family: sans-serif; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        function App() {
            const [count, setCount] = React.useState(0);

            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 p-4">
                    <h1 className="text-4xl font-bold mb-4 text-blue-600">
                        Hello from Webory DevLab! 🚀
                    </h1>
                    <p className="text-lg mb-6 text-center max-w-md">
                        This is a live React environment with Tailwind CSS support.
                        Edit the code to see changes instantly!
                    </p>
                    <button 
                        onClick={() => setCount(c => c + 1)}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all transform hover:scale-105"
                    >
                        Count is: {count}
                    </button>
                    
                    <div className="mt-8 p-4 bg-white rounded-lg shadow border border-gray-200">
                        <code>
                            You can use standard HTML, CSS, JavaScript, 
                            <br/>or React + Tailwind here!
                        </code>
                    </div>
                </div>
            );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
`
};

interface File {
    _id: string;
    title: string;
    language: string;
    code: string;
    lastModified: string;
}

export default function CodeEditor() {
    const [language, setLanguage] = useState<Language>("python");
    const [code, setCode] = useState(CODE_SNIPPETS["python"]);
    const [output, setOutput] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [copied, setCopied] = useState(false);
    
    // File System State
    const [files, setFiles] = useState<File[]>([]);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [newFileName, setNewFileName] = useState("");
    const [isNewFileOpen, setIsNewFileOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const res = await fetch("/api/code/snippets");
            if (res.ok) {
                const data = await res.json();
                setFiles(data.snippets);
            }
        } catch (error) {
            console.error("Failed to fetch files");
        }
    };

    const handleCreateFile = async () => {
        if (!newFileName) return;
        setIsSaving(true);
        
        // Auto-detect language from extension
        let detectedLanguage: Language = language;
        const extension = newFileName.split('.').pop()?.toLowerCase();
        
        const extensionMap: Record<string, Language> = {
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python',
            'java': 'java',
            'cs': 'csharp',
            'php': 'php',
            'cpp': 'cpp',
            'go': 'go',
            'rs': 'rust',
            'swift': 'swift',
            'rb': 'ruby',
            'kt': 'kotlin',
            'sh': 'bash',
            'pl': 'perl',
            'lua': 'lua',
            'html': 'html'
        };

        if (extension && extensionMap[extension]) {
            detectedLanguage = extensionMap[extension];
        }

        const initialCode = CODE_SNIPPETS[detectedLanguage];

        try {
            const res = await fetch("/api/code/snippets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newFileName,
                    language: detectedLanguage,
                    code: initialCode
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("File created successfully");
                setFiles([data.snippet, ...files]);
                setCurrentFile(data.snippet);
                setLanguage(detectedLanguage); // Switch editor language
                setCode(initialCode); // Reset editor content to template
                setIsNewFileOpen(false);
                setNewFileName("");
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Failed to create file");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveFile = async () => {
        if (!currentFile) {
            setIsNewFileOpen(true);
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch(`/api/code/snippets/${currentFile._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: code,
                    language: language
                })
            });

            if (res.ok) {
                toast.success("File saved");
                fetchFiles(); // Refresh list to update timestamps
            } else {
                toast.error("Failed to save");
            }
        } catch (error) {
            toast.error("Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    const loadFile = async (file: File) => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/code/snippets/${file._id}`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setCurrentFile(data.snippet);
                setCode(data.snippet.code || "");
                setLanguage(data.snippet.language as Language);
                setOutput([]);
                
                // Close sidebar on mobile after selection
                if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false);
                }
            } else {
                throw new Error("Failed to load file");
            }
        } catch (error) {
            toast.error("Failed to load file");
            setCode("// Error loading file content. Please try again.");
            setOutput([]);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteFile = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this file?")) return;

        try {
            const res = await fetch(`/api/code/snippets/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("File deleted");
                setFiles(files.filter(f => f._id !== id));
                if (currentFile?._id === id) {
                    setCurrentFile(null);
                    setCode(CODE_SNIPPETS["python"]);
                }
            }
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const onSelect = (value: string) => {
        const lang = value as Language;
        setLanguage(lang);
        if (!currentFile) {
            setCode(CODE_SNIPPETS[lang]);
        }
        setOutput([]);
        setIsError(false);
    };

    const copyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Code copied to clipboard");
    };

    const runCode = async () => {
        if (!code) return;
        setIsLoading(true);
        setIsError(false);
        setOutput([]);

        try {
            const response = await fetch("/api/code/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language,
                    version: LANGUAGE_VERSIONS[language],
                    content: code,
                }),
            });

            const result = await response.json();

            if (result.error) {
                toast.error(result.error);
                return;
            }

            const { run } = result;
            
            if (run.stderr) {
                setIsError(true);
                setOutput(run.stderr.split("\n"));
            } else {
                setOutput(run.stdout.split("\n"));
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to run code");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-[250px_1fr] lg:gap-0 bg-[#0d1117] h-[85vh] lg:h-[75vh] font-sans border border-[#30363d] rounded-lg overflow-hidden shadow-2xl">
            
            {/* Sidebar / File Explorer - Hidden on Mobile unless toggled (TODO: Add mobile toggle) */}
            <div className={`${isSidebarOpen ? 'flex' : 'hidden'} lg:flex flex-col bg-[#010409] border-r border-[#30363d]`}>
                <div className="p-3 border-b border-[#30363d] flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Explorer</span>
                    <Dialog open={isNewFileOpen} onOpenChange={setIsNewFileOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-[#21262d] text-gray-400 hover:text-white">
                                <FilePlus size={14} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#161b22] border-[#30363d] text-gray-300">
                            <DialogHeader>
                                <DialogTitle>Create New File</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <Input 
                                    placeholder="filename.py" 
                                    value={newFileName}
                                    onChange={(e) => setNewFileName(e.target.value)}
                                    className="bg-[#0d1117] border-[#30363d] text-white"
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateFile} disabled={isSaving} className="bg-green-600 hover:bg-green-700 text-white">
                                    {isSaving ? "Creating..." : "Create"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                
                <div className="flex-1 overflow-auto custom-scrollbar p-2 space-y-1">
                    <div className="flex items-center gap-1 text-gray-400 px-2 py-1 hover:text-white cursor-pointer group">
                        <ChevronDown size={14} />
                        <span className="text-xs font-bold">MY WORKSPACE</span>
                    </div>
                    {files.map(file => (
                        <div 
                            key={file._id}
                            onClick={() => loadFile(file)}
                            className={`
                                flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer text-xs group transition-colors
                                ${currentFile?._id === file._id ? 'bg-[#21262d] text-white' : 'text-gray-400 hover:text-white hover:bg-[#161b22]'}
                            `}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FileCode size={14} className={currentFile?._id === file._id ? "text-blue-400" : "text-gray-500"} />
                                <span className="truncate">{file.title}</span>
                            </div>
                            <Trash2 
                                size={12} 
                                className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                                onClick={(e) => deleteFile(file._id, e)}
                            />
                        </div>
                    ))}
                    {files.length === 0 && (
                        <div className="text-center py-8 px-4 text-gray-600">
                             <p className="text-xs">No files yet.</p>
                             <p className="text-[10px] mt-1">Create one to start saving your work.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:col-start-2 bg-[#0d1117] min-w-0">
                {/* Editor Panel */}
                <div className="flex flex-col flex-1 bg-[#0d1117] border-b lg:border-b-0 lg:border-r border-[#30363d] min-h-0 relative">
                    
                    {/* File Tab Look Header */}
                    <div className="flex items-center justify-between h-10 bg-[#161b22] border-b border-[#30363d] px-4 shrink-0">
                        <div className="flex items-center h-full overflow-hidden">
                            <div className="flex items-center gap-2 px-3 h-full bg-[#0d1117] border-r border-[#30363d] border-t-2 border-t-blue-500 text-gray-300 text-xs font-mono min-w-[100px] max-w-[200px]">
                                <span className="text-blue-400 truncate">{currentFile ? currentFile.title : 'untitled'}</span>
                                {!currentFile && <span className="text-gray-600 text-[10px] ml-1">(unsaved)</span>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                             <div className="flex items-center gap-1 mr-2 border-r border-[#30363d] pr-2">
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={handleSaveFile}
                                    disabled={isSaving}
                                    className="h-7 px-2 text-gray-400 hover:text-white hover:bg-[#30363d] rounded-sm gap-1"
                                    title="Save (Ctrl+S)"
                                >
                                    {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    <span className="text-xs hidden sm:inline">Save</span>
                                </Button>
                            </div>
                             <div className="flex items-center gap-1 mr-2">
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={copyCode}
                                    className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-[#30363d] rounded-sm"
                                    title="Copy"
                                >
                                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                </Button>
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => setCode(CODE_SNIPPETS[language])}
                                    className="h-7 w-7 p-0 text-gray-400 hover:text-white hover:bg-[#30363d] rounded-sm"
                                    title="Reset"
                                >
                                    <RotateCcw size={14} />
                                </Button>
                            </div>

                            <Select value={language} onValueChange={onSelect}>
                                <SelectTrigger className="h-7 w-[140px] bg-[#21262d] border-[#30363d] text-gray-300 text-xs focus:ring-0 focus:ring-offset-0">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#161b22] border-[#30363d] text-gray-300">
                                    {Object.entries(LANGUAGE_VERSIONS).map(([lang, version]) => (
                                        <SelectItem key={lang} value={lang} className="text-xs hover:bg-blue-600 focus:bg-blue-600 cursor-pointer">
                                            {lang} <span className="text-gray-500 ml-2">{version}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Editor Area */}
                    <div className="flex-1 relative group min-h-0 bg-[#0d1117]">
                        <Editor
                            key={currentFile?._id || 'new'} 
                            height="100%"
                            language={language}
                            value={code}
                            theme="vs-dark"
                            onChange={(value) => setCode(value || "")}
                            options={{
                                minimap: { enabled: false }, 
                                fontSize: 13,
                                lineNumbers: "on",
                                automaticLayout: true,
                                padding: { top: 16 },
                                scrollBeyondLastLine: false,
                                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                cursorBlinking: "phase",
                                smoothScrolling: true,
                                contextmenu: true,
                                renderLineHighlight: "line",
                            }}
                        />
                    </div>
                </div>

                {/* Output Panel / Terminal */}
                <div className="flex flex-col h-[35%] lg:h-full bg-[#010409] border-t border-[#30363d] lg:border-t-0">
                    {/* Terminal Header */}
                     <div className="flex items-center justify-between h-10 px-4 bg-[#161b22] border-b border-[#30363d] shrink-0">
                        <div className="flex items-center gap-6">
                            <div className="text-xs font-medium text-gray-300 border-b-2 border-orange-500 h-10 flex items-center px-1">
                                TERMINAL
                            </div>
                            <div className="text-xs font-medium text-gray-500 h-10 flex items-center px-1 hover:text-gray-300 cursor-not-allowed">
                                OUTPUT
                            </div>
                            <div className="text-xs font-medium text-gray-500 h-10 flex items-center px-1 hover:text-gray-300 cursor-not-allowed">
                                DEBUG CONSOLE
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                             {output.length > 0 && language !== "html" && (
                                <button
                                    onClick={() => setOutput([])}
                                    className="text-xs text-gray-500 hover:text-white transition-colors"
                                >
                                    Clear
                                </button>
                            )}
                             <Button 
                                onClick={runCode} 
                                disabled={isLoading}
                                className={`
                                    h-7 px-3 text-xs font-medium rounded-sm transition-all
                                    ${isLoading 
                                        ? "bg-[#21262d] text-gray-500 cursor-not-allowed" 
                                        : "bg-[#238636] hover:bg-[#2ea043] text-white border border-[rgba(240,246,252,0.1)]"
                                    }
                                `}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>Running...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Play className="h-3 w-3 fill-current" />
                                        <span>Run Code</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Terminal Body / Preview Area */}
                    <div className={`flex-1 overflow-auto custom-scrollbar flex flex-col bg-[#0d1117] relative`}>
                        {language === "html" ? (
                            <iframe 
                                title="Preview"
                                srcDoc={output.join("\n") || code}
                                className="w-full h-full bg-white border-0"
                                sandbox="allow-scripts allow-modals"
                            />
                        ) : (
                            <div className={`flex-1 p-4 font-mono text-xs overflow-auto flex flex-col ${isError ? "bg-[rgba(255,0,0,0.02)]" : ""}`}>
                                {output.length > 0 ? (
                                    <div className="space-y-1">
                                        <div className="text-gray-500 mb-2 select-none">
                                            $ {language} main.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language}
                                        </div>
                                        {output.map((line, i) => (
                                            <div key={i} className={`whitespace-pre-wrap break-all ${isError ? "text-red-400" : "text-[#c9d1d9]"}`}>
                                                {line}
                                            </div>
                                        ))}
                                        {isError && (
                                            <div className="mt-4 text-red-400 border-l-2 border-red-500pl-2">
                                                Process exited with code 1
                                            </div>
                                        )}
                                        <div className="mt-2 text-gray-500 animate-pulse">_</div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-[#484f58] select-none">
                                        <Terminal size={32} className="mb-3 opacity-20" />
                                        <p className="text-xs">Terminal Ready</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

