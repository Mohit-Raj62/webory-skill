"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { 
  Play, 
  Pause,
  ChevronRight, 
  ChevronLeft,
  RotateCcw, 
  Settings, 
  Layout, 
  Share2, 
  Maximize2,
  Code,
  Sun,
  Moon,
  Check,
  Layers,
  Sparkles,
  Terminal,
  Activity,
  Brain,
  X,
  Loader2,
  Type,
  ClipboardPaste,
  Wand2,
  HelpCircle,
  BookOpen,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { VizEngine, ExecutionStep } from "@/lib/viz/engine";

const ALGORITHM_GALLERY = [
  { 
    id: "bubble_sort", 
    name: "Bubble Sort", 
    desc: "Visualize how elements swap to sort an array.",
    code: "// Bubble Sort\nlet arr = [5, 2, 8, 1, 9];\nfor (let i = 0; i < arr.length; i++) {\n  for (let j = 0; j < arr.length - i - 1; j++) {\n    if (arr[j] > arr[j + 1]) {\n      let temp = arr[j];\n      arr[j] = arr[j+1];\n      arr[j+1] = temp;\n    }\n  }\n}"
  },
  { 
    id: "fibonacci", 
    name: "Fibonacci Sequence", 
    desc: "See the recursive or iterative growth of numbers.",
    code: "// Fibonacci (Iterative)\nlet n = 7;\nlet a = 0, b = 1;\nlet fib = [0, 1];\nfor (let i = 2; i < n; i++) {\n  let next = a + b;\n  a = b;\n  b = next;\n  fib.push(next);\n}"
  },
  { 
    id: "selection_sort", 
    name: "Selection Sort", 
    desc: "Repeatedly find the minimum element in the unsorted part.",
    code: "// Selection Sort\nlet arr = [29, 10, 14, 37, 13];\nfor (let i = 0; i < arr.length - 1; i++) {\n  let minIdx = i;\n  for (let j = i + 1; j < arr.length; j++) {\n    if (arr[j] < arr[minIdx]) minIdx = j;\n  }\n  let temp = arr[i];\n  arr[i] = arr[minIdx];\n  arr[minIdx] = temp;\n}"
  },
  { 
    id: "factorial", 
    name: "Factorial (Recursion)", 
    desc: "Calculate n! using a recursive call stack.",
    code: "// Recursive Factorial\nfunction fact(n) {\n  if (n <= 1) return 1;\n  return n * fact(n - 1);\n}\nlet result = fact(5);"
  },
  { 
    id: "linear_search", 
    name: "Linear Search", 
    desc: "Scan through an array one by one.",
    code: "// Linear Search\nlet arr = [10, 50, 30, 70, 80, 20];\nlet target = 70;\nlet foundAt = -1;\nfor (let i = 0; i < arr.length; i++) {\n  if (arr[i] == target) {\n    foundAt = i;\n    break;\n  }\n}"
  },
  { 
    id: "reverse_string", 
    name: "String Reversal", 
    desc: "Learn how to swap characters in a string.",
    code: "// String Reversal\nlet str = ['h','e','l','l','o'];\nlet n = str.length;\nfor (let i = 0; i < Math.floor(n / 2); i++) {\n  let temp = str[i];\n  str[i] = str[n - i - 1];\n  str[n - i - 1] = temp;\n}"
  }
];

export default function CodeViz() {
  const [code, setCode] = useState(ALGORITHM_GALLERY[0].code);
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [zoom, setZoom] = useState(1);
  const [language, setLanguage] = useState("javascript");
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [accentColor, setAccentColor] = useState({ name: "Cyan", hex: "#06b6d4", color: "cyan" });
  const [useClassicEditor, setUseClassicEditor] = useState(false);

  const [activeTab, setActiveTab] = useState<"code" | "viz" | "ai">("code");
  const [isMobile, setIsMobile] = useState(false);

  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [isExplainOpen, setIsExplainOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const templates = {
    javascript: "// Write your JS here\nlet x = 10;\nlet y = 20;\nlet sum = x + y;",
    python: "# Simple Python\nx = 10\ny = 20\nresult = x + y",
    cpp: "// C++ Code\nint x = 10;\nint y = 20;\nint sum = x + y;",
    java: "// Java Code\nint x = 10;\nint y = 20;\nint sum = x + y;"
  };

  const explainCode = useCallback(async () => {
     setIsExplaining(true);
     if (isMobile) setActiveTab("ai");
     else setIsExplainOpen(true);
     
     try {
        const res = await fetch("/api/ai/explain", {
           method: "POST",
           body: JSON.stringify({ code, language }),
           headers: { "Content-Type": "application/json" }
        });
        const data = await res.json();
        setExplanation(data.explanation);
     } catch (e) {
        setExplanation("Failed to connect to AI Mentor. Please try again.");
     } finally {
        setIsExplaining(false);
     }
  }, [code, language, isMobile]);

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    if (templates[lang as keyof typeof templates]) {
       setCode(templates[lang as keyof typeof templates]);
    }
  }, []);

  // Share Logic: Encode code/lang to URL
  const generateShareLink = useCallback(() => {
    try {
      const state = { code, language };
      const encoded = btoa(encodeURIComponent(JSON.stringify(state)));
      const url = `${window.location.origin}${window.location.pathname}?state=${encoded}`;
      navigator.clipboard.writeText(url);
      alert("Shareable link copied to clipboard!");
    } catch (e) {
      console.error("Failed to generate share link", e);
    }
  }, [code, language]);

  // Load state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stateEncoded = params.get("state");
    if (stateEncoded) {
       try {
          const decoded = JSON.parse(decodeURIComponent(atob(stateEncoded)));
          if (decoded.code) setCode(decoded.code);
          if (decoded.language) setLanguage(decoded.language);
          if (isMobile) setActiveTab("viz");
       } catch (e) {
          console.error("Failed to decode state", e);
       }
    }
  }, []);

  const runCode = useCallback(() => {
    try {
      const engine = new VizEngine(code, language === "c/c++" ? "cpp" : language);
      const result = engine.getSteps();
      if (result.length > 0) {
        setSteps(result);
        setCurrentStep(0);
        return true;
      }
    } catch (e) {
      console.error("Execution failed", e);
    }
    return false;
  }, [code, language]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setCode(text);
    } catch (err) {
      alert("Please allow clipboard access or paste normally using Ctrl+V");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runCode();
    }, 300);
    return () => clearTimeout(timer);
  }, [code, language, runCode]);

  useEffect(() => {
    let timer: any;
    if (isRunning && currentStep < steps.length - 1) {
      timer = setTimeout(() => { setCurrentStep(prev => prev + 1); }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsRunning(false);
    }
    return () => clearTimeout(timer);
  }, [isRunning, currentStep, steps, speed]);

  const currentStepData = steps[currentStep] || { 
    line: 1, variables: {}, callStack: ["global"], nodeType: "Ready", memory: []
  };

  const colors = [
    { name: "Cyan", color: "cyan", hex: "#06b6d4" },
    { name: "Emerald", color: "emerald", hex: "#10b981" },
    { name: "Indigo", color: "indigo", hex: "#6366f1" },
    { name: "Rose", color: "rose", hex: "#f43f5e" },
    { name: "Amber", color: "amber", hex: "#f59e0b" },
    { name: "Violet", color: "violet", hex: "#8b5cf6" },
  ];

  return (
    <div className={`flex flex-col h-[100dvh] ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-[#fcfcfc] text-gray-900'} font-sans overflow-hidden select-none transition-all duration-500`}>
      {/* Responsive Navbar */}
      <nav className={`flex items-center justify-between px-4 lg:px-8 py-3 lg:py-4 border-b border-white/5 z-20 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white shadow-xl shadow-black/5'}`}>
         <div className="flex items-center gap-4 lg:gap-10">
            <div className="flex items-center gap-2 lg:gap-3 group cursor-pointer">
               <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg shadow-2xl flex items-center justify-center text-[9px] lg:text-[11px] font-black tracking-tighter text-white" style={{ backgroundColor: accentColor.hex }}>LR</div>
               <div className="flex flex-col leading-none">
                  <div className="flex items-center gap-1.5 lg:gap-2">
                     <span className={`text-base lg:text-lg font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}>LogicRoom</span>
                     <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest mt-1">BETA</span>
                  </div>
                  {!isMobile && <span className="text-[8px] lg:text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">by webory skills</span>}
               </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-6">
                <div className="relative">
                  <button onClick={() => setIsGalleryOpen(!isGalleryOpen)} className="flex items-center gap-2 px-2.5 lg:px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 group">
                      <BookOpen className="w-4 h-4 text-gray-400 group-hover:text-white" />
                      {!isMobile && <span className="text-[10px] lg:text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">Learn Logic</span>}
                      <ChevronDown className="w-3 h-3 text-gray-600" />
                  </button>
                  <AnimatePresence>
                    {isGalleryOpen && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} 
                        className={`absolute top-12 ${isMobile ? '-right-10 w-[280px]' : 'left-0 w-[240px]'} bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50`}>
                          <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 px-2">Popular Algorithms</div>
                          <div className="space-y-1">
                            {ALGORITHM_GALLERY.map(algo => (
                              <button key={algo.id} onClick={() => { setCode(algo.code); setIsGalleryOpen(false); }} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all group">
                                  <div className="text-[11px] font-black text-gray-300 group-hover:text-white">{algo.name}</div>
                                  <div className="text-[9px] text-gray-600 line-clamp-1">{algo.desc}</div>
                              </button>
                            ))}
                          </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <button onClick={() => { 
                  if (explanation) { isMobile ? setActiveTab("ai") : setIsExplainOpen(true); } 
                  else explainCode(); 
                }} className="flex items-center gap-2 group">
                   <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
                      <Brain className="w-4 h-4 text-indigo-400" />
                   </div>
                   {!isMobile && (
                     <div className="flex flex-col items-start leading-none gap-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">AI Logic Mentor</span>
                        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Ask for help</span>
                     </div>
                   )}
                </button>
            </div>
         </div>

            <div className="flex items-center gap-2 lg:gap-4">
               <button onClick={generateShareLink} className="flex items-center gap-2 px-3 lg:px-6 py-2 lg:py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl transition-all border border-indigo-500/20 group">
                  <Share2 className="w-3.5 h-3.5 lg:w-4 h-4" />
                  <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Share</span>
               </button>
               <button onClick={handlePaste} className="flex items-center gap-2 px-3 lg:px-6 py-2 lg:py-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-gray-400 group">
                  <ClipboardPaste className="w-3.5 h-3.5 lg:w-4 h-4" />
                  <span className="hidden md:inline text-[10px] font-black uppercase tracking-widest">Paste</span>
               </button>
               <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2 lg:p-2.5 hover:bg-white/5 rounded-xl text-gray-500"><Settings className="w-4 h-4 lg:w-5 h-5" /></button>
            </div>
      </nav>

      {/* Mobile Tabs */}
      {isMobile && (
        <div className="flex border-b border-white/5 bg-black/40">
           {["code", "viz", "ai"].map(tab => (
             <button 
               key={tab} 
               onClick={() => setActiveTab(tab as any)}
               className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-white' : 'text-gray-600'}`}
             >
                {tab}
                {activeTab === tab && <motion.div layoutId="mTab" className="absolute bottom-0 left-0 w-full h-0.5" style={{ backgroundColor: accentColor.hex }} />}
             </button>
           ))}
        </div>
      )}

      {/* Settings (Same as before but responsive) */}
      <AnimatePresence>
         {isSettingsOpen && (
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={`fixed top-24 right-4 lg:right-8 w-72 lg:w-80 rounded-[32px] border shadow-2xl p-6 lg:p-8 z-50 backdrop-blur-3xl ${theme === 'dark' ? 'bg-black/90 border-white/10 text-white' : 'bg-white/95 border-gray-200 text-gray-900'}`}>
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                 <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Preferences</div>
                 <button onClick={() => setIsSettingsOpen(false)}><X className="w-4 h-4" /></button>
              </div>
              <div className="space-y-6 lg:space-y-8">
                 <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Accent</div>
                    <div className="grid grid-cols-3 gap-2">
                       {colors.map((c) => (
                         <button key={c.name} onClick={() => setAccentColor(c)} className={`p-4 rounded-xl border transition-all ${accentColor.name === c.name ? 'border-white/20 bg-white/10 scale-105' : 'border-transparent'}`}>
                            <div className="w-4 h-4 rounded-full mx-auto" style={{ backgroundColor: c.hex }} />
                         </button>
                       ))}
                    </div>
                 </div>
                 <button onClick={() => setUseClassicEditor(!useClassicEditor)} className="w-full py-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                    {useClassicEditor ? "Use Pro Monaco" : "Use Classic Editor"}
                 </button>
                 <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-full py-4 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest">
                    Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
                 </button>
              </div>
           </motion.div>
         )}
      </AnimatePresence>

      <main className={`flex-1 flex ${isMobile ? 'flex-col overflow-y-auto' : 'flex-row overflow-hidden'} relative`}>
        {/* Editor Panel */}
        <section className={`${isMobile ? (activeTab === 'code' ? 'flex h-[70vh]' : 'hidden') : 'w-[45%] h-full'} flex flex-col border-r transition-all duration-500 ${theme === 'dark' ? 'bg-[#121212] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
           <div className={`flex items-center justify-between px-6 lg:px-8 py-3 lg:py-4 border-b border-white/5 ${isMobile ? 'bg-black/20' : 'bg-black/10'}`}>
              <div className="flex items-center gap-3">
                 {!isMobile && <Terminal className="w-4 h-4 text-gray-500" />}
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{language}</span>
              </div>
              <div className="flex bg-black/20 rounded-xl p-0.5">
                 {["javascript", "python"].map(lang => (
                   <button key={lang} onClick={() => handleLanguageChange(lang)} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${language === lang ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-600'}`}>{lang}</button>
                 ))}
                 {!isMobile && ["cpp", "java"].map(lang => (
                   <button key={lang} onClick={() => handleLanguageChange(lang)} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${language === lang ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-600'}`}>{lang}</button>
                 ))}
              </div>
           </div>
           
           <div className="flex-1 overflow-hidden relative flex flex-col">
              {useClassicEditor ? (
                 <div className="flex-1 p-6 lg:p-10">
                    <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-full bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed" />
                 </div>
              ) : (
                 <div className="flex-1">
                    <Editor
                      height="100%"
                      language={language === "cpp" ? "cpp" : language}
                      value={code}
                      theme={theme === 'dark' ? 'vs-dark' : 'light'}
                      onChange={(v) => setCode(v || "")}
                      options={{ fontSize: 13, minimap: { enabled: false } }}
                    />
                 </div>
              )}
           </div>
           
           <div className="p-4 lg:p-8 border-t border-white/5 bg-black/20">
              <button onClick={() => { 
                const success = runCode(); 
                if (success) {
                  setCurrentStep(0);
                  setTimeout(() => setIsRunning(true), 50);
                }
                if(isMobile) setActiveTab("viz"); 
              }} className="w-full py-4 lg:py-5 rounded-2xl flex items-center justify-center gap-3 text-[11px] lg:text-[13px] font-black uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95" style={{ backgroundColor: accentColor.hex }}>
                 <Activity className={`w-4 h-4 ${isRunning ? 'animate-spin' : 'animate-pulse'}`} /> {isRunning ? "VIZ RUNNING..." : "START VIZ"}
              </button>
           </div>
        </section>

        {/* Visualization Panel */}
        <section className={`${isMobile ? (activeTab === 'viz' ? 'flex flex-col flex-1' : 'hidden') : 'flex-1 flex flex-col relative overflow-hidden'} transition-all duration-1000 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-[#fcfcfc]'}`}>
           <div className="flex items-center justify-between px-6 lg:px-10 py-4 lg:py-6 border-b border-white/5 bg-black/5 backdrop-blur-3xl">
              <div className="flex flex-col">
                 <span className="text-[10px] lg:text-[12px] font-black uppercase tracking-widest text-gray-200">Execution Map</span>
                 <span className="text-[8px] text-gray-600 font-bold uppercase mt-1 tracking-widest italic">{steps.length} Steps Found</span>
              </div>
              <div className="flex items-center gap-4 lg:gap-10">
                 <div className="flex flex-col items-end">
                    <span className="text-[18px] lg:text-2xl font-black tabular-nums" style={{ color: accentColor.hex }}>{currentStep + 1}<span className="text-gray-800 text-xs">/{steps.length}</span></span>
                 </div>
                 {!isMobile && (
                    <div className="w-[120px] lg:w-[150px] space-y-2">
                      <div className="h-1.5 bg-black/30 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setSpeed(Math.max(50, 1000 - ((e.clientX - rect.left) / rect.width) * 950));
                      }}>
                          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((1000-speed)/950)*100}%`, backgroundColor: accentColor.hex }} />
                      </div>
                    </div>
                 )}
              </div>
           </div>

           <div className="flex-1 relative flex items-start justify-center overflow-y-auto pt-6 lg:pt-10 pb-48 lg:pb-64 custom-scrollbar">
              <AnimatePresence mode="wait">
                 <motion.div key={currentStep} className={`flex ${isMobile ? 'flex-col px-4 gap-8' : 'flex-row gap-16 px-10'} items-start z-10 w-full`} style={{ transform: isMobile ? 'none' : `scale(${zoom})`, transformOrigin: 'top center' }}>
                    
                    {/* Simplified scope for mobile */}
                    <div className={`${isMobile ? 'flex flex-wrap gap-2' : 'flex flex-col gap-6'} w-full lg:w-auto`}>
                       {currentStepData.callStack.slice().reverse().map((frame, i) => (
                          <div key={`${frame}-${i}`} className={`px-6 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'border-white/20 text-white' : 'border-white/5 text-gray-700'}`} style={{ backgroundColor: i === 0 ? accentColor.hex : 'transparent' }}>
                             {frame}
                          </div>
                       ))}
                    </div>

                    <div className={`p-6 lg:p-10 rounded-[32px] lg:rounded-[48px] border backdrop-blur-[100px] w-full lg:min-w-[420px] shadow-2xl space-y-8 ${theme === 'dark' ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-100'}`}>
                       <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                          <Sparkles className="w-3.5 h-3.5" /> Virtual Memory
                       </div>

                       <div className="space-y-6">
                          {currentStepData.error && (
                             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-[28px] bg-red-500/10 border border-red-500/20 flex flex-col gap-4">
                                <div className="flex items-center gap-3 text-red-400">
                                   <X className="w-5 h-5" />
                                   <span className="text-[11px] font-black uppercase tracking-widest">Runtime Error Detected</span>
                                </div>
                                <div className="text-sm font-medium text-red-200/80 leading-relaxed">
                                   "{currentStepData.error}" on line {currentStepData.errorLine}
                                </div>
                                <div className="pt-4 border-t border-red-500/10 flex items-center justify-between">
                                   <span className="text-[9px] font-black text-red-400/50 uppercase tracking-widest italic">Logic suggests a check here</span>
                                   <button onClick={explainCode} className="text-[9px] font-black text-white bg-red-500 px-4 py-1.5 rounded-full uppercase tracking-widest">Get AI Fix</button>
                                </div>
                             </motion.div>
                          )}

                          {Object.entries(currentStepData.variables).map(([name, value]) => {
                             const isArray = Array.isArray(value);
                             return (
                               <div key={name} className={`p-5 rounded-3xl border ${theme === 'dark' ? 'bg-black/40 border-white/5' : 'bg-white border-gray-100'}`}>
                                  <div className="flex justify-between items-center mb-4">
                                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{name}</span>
                                     <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">{isArray ? `Array` : typeof value}</span>
                                  </div>
                                  {isArray ? (
                                     <div className="flex gap-2 flex-wrap">
                                        {value.map((v, i) => (
                                          <div key={i} className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center font-black text-sm lg:text-lg border border-white/5 bg-black/50 text-white`}>
                                             {v}
                                          </div>
                                        ))}
                                     </div>
                                  ) : (
                                     <span className={`text-4xl lg:text-6xl font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{String(value)}</span>
                                  )}
                               </div>
                             );
                          })}
                          {Object.keys(currentStepData.variables).length === 0 && (
                            <div className="py-20 flex flex-col items-center gap-6 text-gray-800 opacity-20">
                               <Wand2 className="w-12 h-12" />
                            </div>
                          )}
                       </div>
                    </div>
                 </motion.div>
              </AnimatePresence>
           </div>
        </section>

        {/* AI Mental Model Section (Panel or Mobile Tab) */}
        <section className={`${isMobile ? (activeTab === 'ai' ? 'flex flex-col flex-1' : 'hidden') : (isExplainOpen ? 'fixed top-0 right-0 w-[550px] h-full z-[100] shadow-2xl flex flex-col backdrop-blur-3xl border-l' : 'hidden')} ${theme === 'dark' ? 'bg-black/95 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className={`p-8 lg:p-12 border-b border-white/5 flex items-center justify-between ${isMobile ? 'bg-indigo-500/5' : ''}`}>
               <div className="flex items-center gap-4">
                  <Brain className="w-8 h-8 text-indigo-400" />
                  <div>
                     <div className="text-xl font-black tracking-tighter">AI Mentor</div>
                     <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Logic Analysis</div>
                  </div>
               </div>
               {!isMobile && <button onClick={() => setIsExplainOpen(false)}><X className="w-6 h-6 text-gray-500 hover:text-white" /></button>}
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
               {isExplaining ? (
                  <div className="h-full flex flex-col items-center justify-center gap-8">
                     <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
                     <span className="text-[11px] font-black uppercase tracking-widest text-gray-700">De-Coding Logic...</span>
                  </div>
               ) : (
                  <div className="h-full">
                     {!explanation ? (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center gap-8">
                           <Wand2 className="w-12 h-12 text-indigo-400 opacity-20" />
                           <p className="text-sm text-gray-600 font-medium">Click "Explain My Code" to get a beginner-friendly logic breakdown.</p>
                           <button onClick={explainCode} className="px-10 py-5 bg-indigo-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">Explain Now</button>
                        </div>
                     ) : (
                        <div className="prose prose-invert max-w-none prose-sm prose-p:text-gray-500 prose-headings:text-indigo-400 prose-headings:font-black">
                           <ReactMarkdown>{explanation}</ReactMarkdown>
                        </div>
                     )}
                  </div>
               )}
            </div>
            {explanation && (
              <div className="p-8 border-t border-white/5">
                 <button onClick={explainCode} className="w-full py-5 bg-indigo-500 text-white rounded-3xl text-[11px] font-black uppercase tracking-widest shadow-xl">Refresh Insight</button>
              </div>
            )}
        </section>

        {/* Premium Floating Playback Island */}
        <AnimatePresence>
          {activeTab !== 'code' && (
            <motion.div 
              initial={{ y: 100, x: "-50%", opacity: 0 }}
              animate={{ y: 0, x: "-50%", opacity: 1 }}
              exit={{ y: 100, x: "-50%", opacity: 0 }}
              className={`fixed bottom-24 lg:bottom-12 left-1/2 z-[60] px-6 py-4 border rounded-[40px] flex items-center gap-6 lg:gap-10 shadow-2xl backdrop-blur-3xl ${theme === 'dark' ? 'bg-black/60 border-white/10' : 'bg-white/80 border-gray-200 shadow-xl shadow-black/5 text-gray-900'}`}
            >
               <button onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-75 text-gray-400 hover:text-white">
                  <ChevronLeft className="w-6 h-6 lg:w-7 lg:h-7" />
               </button>
               <button 
                  onClick={() => setIsRunning(!isRunning)} 
                  className="w-14 h-14 lg:w-16 lg:h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 text-white"
                  style={{ backgroundColor: accentColor.hex }}
               >
                  {isRunning ? <Pause className="w-6 h-6 lg:w-7 lg:h-7 fill-current" /> : <Play className="w-6 h-6 lg:w-7 lg:h-7 fill-current ml-1" />}
               </button>
               <button onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))} className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-75 text-gray-400 hover:text-white">
                  <ChevronRight className="w-6 h-6 lg:w-7 lg:h-7" />
               </button>

               {!isMobile && (
                  <div className="flex items-center gap-6 pl-8 border-l border-white/10">
                     <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-2xl">
                        <button onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))} className="text-gray-500 hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></button>
                        <span className="text-[10px] font-black tabular-nums">{Math.round(zoom * 100)}%</span>
                        <button onClick={() => setZoom(prev => Math.min(2, prev + 0.1))} className="text-gray-500 hover:text-white transition-all"><ChevronRight className="w-4 h-4" /></button>
                     </div>
                     <button onClick={() => { setCurrentStep(0); setIsRunning(false); }} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all hover:rotate-[-180deg] duration-500">
                        <RotateCcw className="w-5 h-5" />
                     </button>
                  </div>
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modern High-End Footer */}
      <footer className={`px-8 py-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 ${theme === 'dark' ? 'bg-[#0a0a0a]' : 'bg-white shadow-top shadow-black/5'}`}>
         <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
               <span className={`text-[11px] font-black tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-black'}`}>LogicRoom</span>
               <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">BETA</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-600 hidden sm:inline" />
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest leading-none">by webory skills</span>
         </div>
         
         <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-widest text-gray-500">
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">Terms</span>
            <span className="text-gray-700 hidden sm:inline">© 2026 Webory Academy</span>
         </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=JetBrains+Mono:wght@700&display=swap');
        body { font-family: 'Inter', sans-serif; letter-spacing: -0.01em; margin: 0; padding: 0; background: #000; overflow: hidden; }
        .font-mono { font-family: 'JetBrains Mono', monospace !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .prose strong { color: #818cf8 !important; }
        .prose pre { background: rgba(0,0,0,0.3) !important; border: 1px solid rgba(255,255,255,0.05); }
      `}</style>
    </div>
  );
}
