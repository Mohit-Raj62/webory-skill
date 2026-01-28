
"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, RotateCcw, Loader2, AlertCircle, Terminal, Copy, Check, Info, Save, FilePlus, FolderOpen, Trash2, FileCode, ChevronRight, ChevronDown, Share2, Code2, Folder } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
    c: "10.2.0",
    cpp: "10.2.0",
    csharp: "6.12.0",
    php: "8.2.3",
    go: "1.16.2",
    rust: "1.68.2",
    swift: "5.3.3",
    ruby: "3.0.1",
    kotlin: "1.8.20",
    bash: "5.2.0",
    perl: "5.36.0",
    lua: "5.4.4",
    html: "5",
    css: "3",
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
    c: `// C Playground
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
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
`,
    css: `/* CSS Playground */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
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
    const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
    const [runOutput, setRunOutput] = useState<string[]>([]);
    const [debugOutput, setDebugOutput] = useState<string[]>([]);
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
    const [activeTab, setActiveTab] = useState<"terminal" | "output" | "debug">("terminal");
    const [terminalInput, setTerminalInput] = useState("");
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareLink, setShareLink] = useState("");
    const [isSharing, setIsSharing] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    
    // Resizable Layout State
    // Resizable Layout State
    const [editorWidth, setEditorWidth] = useState(60); // Percentage width
    const [isDragging, setIsDragging] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true); 
    
    // Mobile Tab State
    const [activeMobileTab, setActiveMobileTab] = useState<"files" | "editor" | "output">("editor");

    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    useEffect(() => {
        fetchFiles();
    }, []);

    // Handle Monaco Editor mount
    const handleEditorDidMount = (editor: any, monaco: any) => {
        // Register HTML snippets for Emmet-like abbreviations
        monaco.languages.registerCompletionItemProvider('html', {
            triggerCharacters: ['!', 'h', 'd', 'p', 's', 'a', 'u', 'o', 'l', 'i', 'b', 'f', 't', 'n'],
            provideCompletionItems: (model: any, position: any) => {
                const textUntilPosition = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 1,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                });

                const word = textUntilPosition.trim();
                const suggestions = [];

                // HTML5 Boilerplate
                if (word === '!') {
                    suggestions.push({
                        label: '!',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            '<!DOCTYPE html>',
                            '<html lang="en">',
                            '<head>',
                            '    <meta charset="UTF-8">',
                            '    <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                            '    <title>${1:Document}</title>',
                            '</head>',
                            '<body>',
                            '    $0',
                            '</body>',
                            '</html>'
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'HTML5 boilerplate',
                        detail: 'HTML5 Boilerplate Template'
                    });
                }

                // Common HTML tags
                const htmlTags = [
                    // Headings
                    { tag: 'h1', desc: 'Heading 1' },
                    { tag: 'h2', desc: 'Heading 2' },
                    { tag: 'h3', desc: 'Heading 3' },
                    { tag: 'h4', desc: 'Heading 4' },
                    { tag: 'h5', desc: 'Heading 5' },
                    { tag: 'h6', desc: 'Heading 6' },
                    
                    // Container Elements
                    { tag: 'div', desc: 'Division' },
                    { tag: 'span', desc: 'Span' },
                    { tag: 'p', desc: 'Paragraph' },
                    
                    // Text Formatting
                    { tag: 'strong', desc: 'Strong/Bold' },
                    { tag: 'b', desc: 'Bold' },
                    { tag: 'em', desc: 'Emphasis/Italic' },
                    { tag: 'i', desc: 'Italic' },
                    { tag: 'u', desc: 'Underline' },
                    { tag: 'small', desc: 'Small Text' },
                    { tag: 'mark', desc: 'Marked/Highlighted' },
                    { tag: 'del', desc: 'Deleted Text' },
                    { tag: 'ins', desc: 'Inserted Text' },
                    { tag: 'sub', desc: 'Subscript' },
                    { tag: 'sup', desc: 'Superscript' },
                    { tag: 'code', desc: 'Code' },
                    { tag: 'pre', desc: 'Preformatted Text' },
                    { tag: 'kbd', desc: 'Keyboard Input' },
                    { tag: 'samp', desc: 'Sample Output' },
                    { tag: 'var', desc: 'Variable' },
                    { tag: 'blockquote', desc: 'Block Quote' },
                    { tag: 'q', desc: 'Inline Quote' },
                    { tag: 'abbr', desc: 'Abbreviation' },
                    { tag: 'cite', desc: 'Citation' },
                    
                    // Links & Media
                    { tag: 'a', desc: 'Anchor/Link' },
                    { tag: 'img', desc: 'Image' },
                    { tag: 'video', desc: 'Video' },
                    { tag: 'audio', desc: 'Audio' },
                    { tag: 'source', desc: 'Media Source' },
                    { tag: 'track', desc: 'Text Track' },
                    { tag: 'iframe', desc: 'Inline Frame' },
                    { tag: 'embed', desc: 'Embed' },
                    { tag: 'object', desc: 'Object' },
                    { tag: 'picture', desc: 'Picture' },
                    { tag: 'figure', desc: 'Figure' },
                    { tag: 'figcaption', desc: 'Figure Caption' },
                    
                    // Lists
                    { tag: 'ul', desc: 'Unordered List' },
                    { tag: 'ol', desc: 'Ordered List' },
                    { tag: 'li', desc: 'List Item' },
                    { tag: 'dl', desc: 'Description List' },
                    { tag: 'dt', desc: 'Description Term' },
                    { tag: 'dd', desc: 'Description Details' },
                    
                    // Tables
                    { tag: 'table', desc: 'Table' },
                    { tag: 'thead', desc: 'Table Head' },
                    { tag: 'tbody', desc: 'Table Body' },
                    { tag: 'tfoot', desc: 'Table Footer' },
                    { tag: 'tr', desc: 'Table Row' },
                    { tag: 'th', desc: 'Table Header' },
                    { tag: 'td', desc: 'Table Data' },
                    { tag: 'caption', desc: 'Table Caption' },
                    { tag: 'col', desc: 'Table Column' },
                    { tag: 'colgroup', desc: 'Column Group' },
                    
                    // Forms
                    { tag: 'form', desc: 'Form' },
                    { tag: 'input', desc: 'Input Field' },
                    { tag: 'button', desc: 'Button' },
                    { tag: 'label', desc: 'Label' },
                    { tag: 'select', desc: 'Select Dropdown' },
                    { tag: 'option', desc: 'Option' },
                    { tag: 'optgroup', desc: 'Option Group' },
                    { tag: 'textarea', desc: 'Text Area' },
                    { tag: 'fieldset', desc: 'Field Set' },
                    { tag: 'legend', desc: 'Legend' },
                    { tag: 'datalist', desc: 'Data List' },
                    { tag: 'output', desc: 'Output' },
                    { tag: 'progress', desc: 'Progress Bar' },
                    { tag: 'meter', desc: 'Meter' },
                    
                    // Semantic HTML5
                    { tag: 'header', desc: 'Header' },
                    { tag: 'nav', desc: 'Navigation' },
                    { tag: 'main', desc: 'Main Content' },
                    { tag: 'section', desc: 'Section' },
                    { tag: 'article', desc: 'Article' },
                    { tag: 'aside', desc: 'Aside' },
                    { tag: 'footer', desc: 'Footer' },
                    { tag: 'details', desc: 'Details' },
                    { tag: 'summary', desc: 'Summary' },
                    { tag: 'dialog', desc: 'Dialog' },
                    { tag: 'data', desc: 'Data' },
                    { tag: 'time', desc: 'Time' },
                    
                    // Head Elements
                    { tag: 'link', desc: 'Link (CSS/Resource)' },
                    { tag: 'script', desc: 'Script' },
                    { tag: 'style', desc: 'Style' },
                    { tag: 'meta', desc: 'Meta Tag' },
                    { tag: 'title', desc: 'Title' },
                    { tag: 'base', desc: 'Base URL' },
                    { tag: 'noscript', desc: 'No Script' },
                    
                    // Other
                    { tag: 'br', desc: 'Line Break' },
                    { tag: 'hr', desc: 'Horizontal Rule' },
                    { tag: 'wbr', desc: 'Word Break' },
                    { tag: 'canvas', desc: 'Canvas' },
                    { tag: 'svg', desc: 'SVG' },
                    { tag: 'template', desc: 'Template' },
                    { tag: 'slot', desc: 'Slot' },
                ];

                htmlTags.forEach(({ tag, desc }) => {
                    if (word === tag) {
                        suggestions.push({
                            label: tag,
                            kind: monaco.languages.CompletionItemKind.Snippet,
                            insertText: `<${tag}>$0</${tag}>`,
                            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: `${desc} element`,
                            detail: `Emmet: ${tag}`
                        });
                    }
                });

                return { suggestions };
            }
        });
    };

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
            'c': 'c',
            'cpp': 'cpp',
            'cc': 'cpp',
            'cxx': 'cpp',
            'cs': 'csharp',
            'php': 'php',
            'go': 'go',
            'rs': 'rust',
            'swift': 'swift',
            'rb': 'ruby',
            'kt': 'kotlin',
            'sh': 'bash',
            'pl': 'perl',
            'lua': 'lua',
            'html': 'html',
            'htm': 'html',
            'css': 'css'
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
                setRunOutput([]);
                setTerminalOutput([]);
                setDebugOutput([]);
                
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
            setRunOutput([]);
            setTerminalOutput([]);
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

    const handleShare = async () => {
        if (!currentFile) {
            toast.error("Please save your code first before sharing");
            return;
        }

        setIsSharing(true);
        try {
            const res = await fetch("/api/code/share", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ snippetId: currentFile._id }),
            });

            const data = await res.json();

            if (res.ok) {
                setShareLink(data.shareUrl);
                setIsShareModalOpen(true);
                toast.success("Share link created!");
            } else {
                toast.error(data.error || "Failed to create share link");
            }
        } catch (error) {
            console.error("Share error:", error);
            toast.error("Failed to create share link");
        } finally {
            setIsSharing(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink);
        setIsCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const onSelect = (value: string) => {
        const lang = value as Language;
        setLanguage(lang);
        if (!currentFile) {
            setCode(CODE_SNIPPETS[lang]);
        }
        setRunOutput([]);
        setTerminalOutput([]);
        setDebugOutput([]);
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
        setRunOutput(["Running code..."]);
        setActiveTab("output"); // Switch to output tab on run

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

            if (!run) {
                if (result.message) {
                     setRunOutput([`Error: ${result.message}`]);
                     toast.error(result.message);
                } else {
                     setRunOutput(["Error: execution failed"]);
                     toast.error("Execution failed");
                }
                return;
            }

            const outputLines = run.stderr ? run.stderr.split("\n") : run.stdout.split("\n");
            
            if (run.stderr) {
                setIsError(true);
            }

            // 1. Update Output Tab (Clean result)
            setRunOutput(outputLines);

            // 2. Update Terminal Tab (History)
            setTerminalOutput(prev => [
                ...prev, 
                `$ ${language} main.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : language}`,
                ...outputLines,
                "" // Empty line spacer
            ]);

            // 3. Update Debug Console (Simulated logs)
            setDebugOutput(prev => [
                ...prev,
                `[${new Date().toLocaleTimeString()}] Process exited with code ${run.code || 0}`,
                `[${new Date().toLocaleTimeString()}] Execution time: ${run.signal || 'N/A'}`,
            ]);

        } catch (error) {
            console.error(error);
            toast.error("Failed to run code");
            setRunOutput(["Error: Failed to execute code"]);
        } finally {
            setIsLoading(false);
        }
    };

    // Resize Handlers
    const startResizing = React.useCallback((mouseDownEvent: React.MouseEvent) => {
        setIsDragging(true);
    }, []);

    const stopResizing = React.useCallback(() => {
        setIsDragging(false);
    }, []);

    const resize = React.useCallback((mouseMoveEvent: MouseEvent) => {
        if (isDragging) {
            const container = document.getElementById("editor-container");
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const newWidth = ((mouseMoveEvent.clientX - containerRect.left) / containerRect.width) * 100;
                
                // Limit width between 30% and 90%
                if (newWidth >= 30 && newWidth <= 90) {
                    setEditorWidth(newWidth);
                }
            }
        }
    }, [isDragging]);

    useEffect(() => {
        window.addEventListener("mousemove", resize);
        window.addEventListener("mouseup", stopResizing);
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [resize, stopResizing]);

    return (
        <div className="flex flex-col lg:grid lg:grid-cols-[250px_1fr] lg:gap-0 bg-[#0d1117] h-[calc(100dvh-180px)] lg:h-[75vh] font-sans border border-[#30363d] rounded-lg overflow-hidden shadow-2xl relative">
            
            {/* Sidebar / File Explorer */}
            <AnimatePresence mode="wait">
                {(isDesktop || activeMobileTab === 'files') && (
                    <motion.div 
                        initial={!isDesktop ? { opacity: 0, x: -20 } : undefined}
                        animate={!isDesktop ? { opacity: 1, x: 0 } : undefined}
                        exit={!isDesktop ? { opacity: 0, x: -20 } : undefined}
                        className={`${activeMobileTab === 'files' ? 'flex w-full absolute inset-0 z-20' : 'hidden'} lg:flex lg:static lg:w-auto flex-col bg-[#010409] border-r border-[#30363d] h-full`}
                    >
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
                        <div className="text-center py-10 px-4 text-gray-600 flex flex-col items-center">
                             <p className="text-xs mb-3">No files found.</p>
                             <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setIsNewFileOpen(true)}
                                className="text-xs border-dashed border-gray-600 text-gray-400 hover:text-white hover:bg-[#21262d] gap-2 h-8"
                            >
                                <FilePlus size={14} />
                                Create New File
                             </Button>
                        </div>
                    )}
                    
                    {/* Mobile Floating Action Button for New File */}
                    {!isDesktop && activeMobileTab === 'files' && files.length > 0 && (
                        <motion.button
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsNewFileOpen(true)}
                            className="absolute bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 z-50 border border-white/10"
                        >
                            <FilePlus size={20} />
                        </motion.button>
                    )}
                    </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div id="editor-container" className={`${activeMobileTab === 'editor' || activeMobileTab === 'output' ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row lg:col-start-2 bg-[#0d1117] min-w-0 h-full overflow-hidden`}>
                {/* Editor Panel */}
                <AnimatePresence mode="wait">
                    {(isDesktop || activeMobileTab === 'editor') && (
                        <motion.div 
                            initial={!isDesktop ? { opacity: 0, y: 10 } : false}
                            animate={!isDesktop ? { opacity: 1, y: 0 } : false}
                            exit={!isDesktop ? { opacity: 0, y: -10 } : false}
                            className={`${activeMobileTab === 'editor' ? 'flex' : 'hidden'} lg:flex flex-col bg-[#0d1117] min-h-0 relative h-full lg:h-auto w-full lg:w-[var(--editor-width)] transition-[width] duration-0 lg:border-r border-[#30363d]`}
                            style={{ '--editor-width': `${editorWidth}%` } as React.CSSProperties}
                        >
                    
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
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={handleShare}
                                    disabled={isSharing || !currentFile}
                                    className="h-7 px-2 text-gray-400 hover:text-white hover:bg-[#30363d] rounded-sm gap-1"
                                    title="Share Code"
                                >
                                    {isSharing ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
                                    <span className="text-xs hidden sm:inline">Share</span>
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
                                <SelectTrigger className="h-7 w-[110px] sm:w-[140px] bg-[#21262d] border-[#30363d] text-gray-300 text-xs focus:ring-0 focus:ring-offset-0">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#161b22] border-[#30363d] text-gray-300">
                                    {Object.entries(LANGUAGE_VERSIONS).map(([lang, version]) => (
                                        <SelectItem key={lang} value={lang} className="text-xs hover:bg-blue-600 focus:bg-blue-600 cursor-pointer">
                                            {lang} <span className="text-gray-500 ml-2 hidden sm:inline">{version}</span>
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
                            onMount={handleEditorDidMount}
                            options={{
                                // IntelliSense & Autocomplete
                                quickSuggestions: {
                                    other: true,
                                    comments: true,
                                    strings: true
                                },
                                suggestOnTriggerCharacters: true,
                                acceptSuggestionOnCommitCharacter: true,
                                acceptSuggestionOnEnter: "on",
                                tabCompletion: "on",
                                wordBasedSuggestions: true,
                                parameterHints: {
                                    enabled: true,
                                    cycle: true
                                },
                                
                                // Code Actions & Refactoring
                                lightbulb: {
                                    enabled: true
                                },
                                codeActionsOnSave: true,
                                formatOnPaste: true,
                                formatOnType: true,
                                
                                // Snippets
                                snippetSuggestions: "top",
                                
                                // Bracket Matching & Colorization
                                matchBrackets: "always",
                                bracketPairColorization: {
                                    enabled: true
                                },
                                guides: {
                                    bracketPairs: true,
                                    indentation: true
                                },
                                
                                // Auto-closing & Wrapping
                                autoClosingBrackets: "always",
                                autoClosingQuotes: "always",
                                autoClosingOvertype: "always",
                                autoSurround: "languageDefined",
                                
                                // Indentation & Formatting
                                autoIndent: "full",

                                tabSize: 4,
                                insertSpaces: true,
                                detectIndentation: true,
                                
                                // Code Lens & Hints
                                codeLens: true,
                                inlayHints: {
                                    enabled: "on"
                                },
                                
                                // Hover & Tooltips
                                hover: {
                                    enabled: true,
                                    delay: 300,
                                    sticky: true
                                },
                                
                                // Find & Replace
                                find: {
                                    seedSearchStringFromSelection: "always",
                                    autoFindInSelection: "always"
                                },
                                
                                // Multi-cursor & Selection
                                multiCursorModifier: "ctrlCmd",
                                selectionHighlight: true,
                                occurrencesHighlight: true,
                                
                                // Scrolling & Navigation
                                smoothScrolling: true,
                                mouseWheelZoom: true,
                                scrollBeyondLastLine: false,
                                
                                // Visual Enhancements
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineHeight: 22,
                                fontLigatures: true,
                                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                                cursorBlinking: "smooth",
                                cursorSmoothCaretAnimation: "on",
                                cursorStyle: "line",
                                cursorWidth: 2,
                                renderLineHighlight: "all",
                                renderWhitespace: "selection",
                                
                                // Line Numbers & Folding
                                lineNumbers: "on",
                                lineNumbersMinChars: 3,
                                folding: true,
                                foldingStrategy: "indentation",
                                showFoldingControls: "mouseover",
                                
                                // Layout & Padding
                                automaticLayout: true,
                                padding: { top: 16, bottom: 16 },
                                
                                // Context Menu & Interactions
                                contextmenu: true,
                                links: true,
                                
                                // Performance
                                fastScrollSensitivity: 5,
                                
                                // Accessibility
                                accessibilitySupport: "auto",
                            }}
                        />
                    </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Resizer Handle (Desktop Only) */}
                <div
                    className="hidden lg:flex w-1 bg-[#161b22] hover:bg-blue-500 cursor-col-resize items-center justify-center transition-colors group z-10"
                    onMouseDown={startResizing}
                >
                    <div className="w-[1px] h-4 bg-gray-600 group-hover:bg-white" />
                </div>

                {/* Output Panel / Terminal */}
                <AnimatePresence mode="wait">
                    {(isDesktop || activeMobileTab === 'output') && (
                        <motion.div 
                            initial={!isDesktop ? { opacity: 0, x: 20 } : false}
                            animate={!isDesktop ? { opacity: 1, x: 0 } : false}
                            exit={!isDesktop ? { opacity: 0, x: 20 } : false}
                            className={`${activeMobileTab === 'output' ? 'flex' : 'hidden'} lg:flex flex-col h-full lg:h-full lg:flex-1 bg-[#010409] border-t border-[#30363d] lg:border-t-0 min-w-0`}
                        >
                     {/* Terminal Header */}
                     <div className="flex items-center justify-between h-10 px-4 bg-[#161b22] border-b border-[#30363d] shrink-0">
                        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
                            <button 
                                onClick={() => setActiveTab("terminal")}
                                className={`text-xs font-medium h-10 flex items-center px-1 whitespace-nowrap transition-colors ${
                                    activeTab === "terminal" ? "text-gray-300 border-b-2 border-orange-500" : "text-gray-500 hover:text-gray-300"
                                }`}
                            >
                                TERMINAL
                            </button>
                            <button 
                                onClick={() => setActiveTab("output")}
                                className={`text-xs font-medium h-10 items-center px-1 transition-colors hidden sm:flex ${
                                    activeTab === "output" ? "text-gray-300 border-b-2 border-green-500" : "text-gray-500 hover:text-gray-300"
                                }`}
                            >
                                OUTPUT
                            </button>
                            <button 
                                onClick={() => setActiveTab("debug")}
                                className={`text-xs font-medium h-10 items-center px-1 transition-colors hidden sm:flex ${
                                    activeTab === "debug" ? "text-gray-300 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-300"
                                }`}
                            >
                                DEBUG CONSOLE
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                             {language !== "html" && (
                                <button
                                    onClick={() => {
                                        if (activeTab === 'terminal') setTerminalOutput([]);
                                        if (activeTab === 'output') setRunOutput([]);
                                        if (activeTab === 'debug') setDebugOutput([]);
                                    }}
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
                                        <span className="hidden sm:inline">Run Code</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Terminal Body / Preview Area */}
                    <div className={`flex-1 overflow-auto custom-scrollbar flex flex-col bg-[#0d1117] relative ${
                        activeTab !== "terminal" && language !== "html" ? "pb-0" : ""
                    }`}>
                        {language === "html" ? (
                            <iframe 
                                title="Preview"
                                srcDoc={runOutput.join("\n") || code}
                                className="w-full h-full bg-white border-0"
                                sandbox="allow-scripts allow-modals"
                            />
                        ) : (
                            <div className={`flex-1 p-4 font-mono text-xs overflow-auto flex flex-col ${isError && activeTab === 'output' ? "bg-[rgba(255,0,0,0.02)]" : ""}`}>
                                {/* Active Tab Label for Clarity */}
                                <div className="mb-2 uppercase text-[10px] font-bold tracking-wider text-gray-600 select-none border-b border-[#30363d] pb-1 w-full">
                                    {activeTab === 'terminal' ? 'Terminal History' : activeTab === 'output' ? 'Run Result' : 'Debug Logs'}
                                </div>

                                {(() => {
                                    const currentOutput = activeTab === "terminal" ? terminalOutput : activeTab === "output" ? runOutput : debugOutput;
                                    
                                    if (currentOutput.length > 0) {
                                        return (
                                            <div className="space-y-1">
                                                {currentOutput.map((line, i) => (
                                                    <div key={i} className={`whitespace-pre-wrap break-all ${
                                                        isError && activeTab === 'output' ? "text-red-400" : 
                                                        line.startsWith("Error:") ? "text-red-400" :
                                                        line.startsWith("$") ? "text-green-400 font-bold" :
                                                        line.startsWith("[") ? "text-blue-400" : // Debug timestamps
                                                        "text-[#c9d1d9]"
                                                    }`}>
                                                        {line}
                                                    </div>
                                                ))}
                                                {isError && activeTab === 'output' && (
                                                    <div className="mt-4 text-red-400 border-l-2 border-red-500 pl-2">
                                                        Process exited with code 1
                                                    </div>
                                                )}
                                                <div className="mt-2 text-gray-500 animate-pulse">_</div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className="h-full flex flex-col items-center justify-center text-[#484f58] select-none">
                                                <Terminal size={32} className="mb-3 opacity-20" />
                                                <p className="text-xs">{
                                                    activeTab === "terminal" ? "Terminal Ready - Type commands below" :
                                                    activeTab === "output" ? "Output Panel - Run your code to see results" :
                                                    "Debug Console - Debugging information will appear here"
                                                }</p>
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        )}
                        
                        {/* Terminal Input (only for terminal tab and non-HTML) */}
                        {activeTab === "terminal" && language !== "html" && (
                            <div className="border-t border-[#30363d] bg-[#161b22] p-3 flex items-center gap-2 shrink-0">
                                <span className="text-green-400 text-xs font-mono select-none">$</span>
                                <input 
                                    type="text"
                                    value={terminalInput}
                                    onChange={(e) => setTerminalInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && terminalInput.trim()) {
                                            setTerminalOutput(prev => [...prev, `$ ${terminalInput}`, "Command execution not yet implemented. Use 'Run Code' button to execute your code."]);
                                            setTerminalInput("");
                                        }
                                    }}
                                    placeholder="Type a command and press Enter..."
                                    className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-gray-300 placeholder-gray-600"
                                    autoComplete="off"
                                />
                            </div>
                        )}
                </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Bottom Navigation - Glassmorphism */}
            <div className="lg:hidden flex items-center justify-around bg-[#161b22]/95 backdrop-blur-md border-t border-[#30363d] h-14 shrink-0 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.3)] pb-2">
                <button
                    onClick={() => setActiveMobileTab('files')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative ${activeMobileTab === 'files' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Folder size={20} strokeWidth={activeMobileTab === 'files' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Files</span>
                    {activeMobileTab === 'files' && <motion.div layoutId="mobileTabIndicator" className="absolute top-0 w-8 h-1 bg-blue-500 rounded-b-md" />}
                </button>
                <button
                    onClick={() => setActiveMobileTab('editor')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative ${activeMobileTab === 'editor' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Code2 size={20} strokeWidth={activeMobileTab === 'editor' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Code</span>
                    {activeMobileTab === 'editor' && <motion.div layoutId="mobileTabIndicator" className="absolute top-0 w-8 h-1 bg-blue-500 rounded-b-md" />}
                </button>
                <button
                    onClick={() => setActiveMobileTab('output')}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative ${activeMobileTab === 'output' ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    <Terminal size={20} strokeWidth={activeMobileTab === 'output' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">Terminal</span>
                    {activeMobileTab === 'output' && <motion.div layoutId="mobileTabIndicator" className="absolute top-0 w-8 h-1 bg-blue-500 rounded-b-md" />}
                </button>
                <button
                    onClick={runCode}
                    disabled={isLoading}
                    className="flex flex-col items-center justify-center w-full h-full space-y-1 text-green-500 hover:text-green-400 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95 transition-transform"
                >
                    <div className="bg-green-500/10 p-1.5 rounded-full group-hover:bg-green-500/20 transition-colors">
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} className="fill-current" />}
                    </div>
                    <span className="text-[10px] font-bold">Run</span>
                </button>
            </div>

            {/* Share Modal */}
            {isShareModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Share2 size={20} className="text-blue-400" />
                                Share Your Code
                            </h3>
                            <button
                                onClick={() => setIsShareModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <p className="text-sm text-gray-400 mb-4">
                            Anyone with this link can view your code (read-only)
                        </p>

                        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={shareLink}
                                    readOnly
                                    className="flex-1 bg-transparent text-sm text-gray-300 outline-none font-mono"
                                />
                                <Button
                                    size="sm"
                                    onClick={handleCopyLink}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md transition-colors"
                                >
                                    {isCopied ? (
                                        <>
                                            <Check size={14} className="mr-1" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={14} className="mr-1" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Share link created successfully</span>
                            <button
                                onClick={() => setIsShareModalOpen(false)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
