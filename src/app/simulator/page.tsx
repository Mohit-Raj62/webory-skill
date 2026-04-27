"use client";

import { useState, useEffect, useRef } from 'react';
import { Mail, CheckSquare, Code, X, Maximize2, Minus, User, Briefcase, ChevronLeft, ChevronRight, CheckCircle2, Play, AlertCircle, Loader2, Video, Mic, MicOff, RotateCcw, Award, LayoutGrid, Settings, Terminal, Bell, Volume2, Sun, Wifi, Battery, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/session-provider';
import { useRouter } from 'next/navigation';
import Editor from "@monaco-editor/react";

interface SimulatorData {
    _id: string;
    role: string;
    company: string;
    emails: any[];
    tasks: any[];
    initialCode: string;
    expectedRegex: string;
    difficulty?: string;
    timeLimit?: number;
    hints?: string[];
}

export default function JobSimulator() {
    const { user: authUser, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push("/login");
        }
    }, [authUser, authLoading, router]);

    const [scenario, setScenario] = useState<SimulatorData | null>(null);
    const [allScenarios, setAllScenarios] = useState<SimulatorData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openApps, setOpenApps] = useState<string[]>([]);
    const [focusedApp, setFocusedApp] = useState<string | null>(null);
    const [minimizedApps, setMinimizedApps] = useState<string[]>([]);
    const [maximizedApps, setMaximizedApps] = useState<string[]>([]);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
    const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [wallpaper, setWallpaper] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop");
    
    const addNotification = (title: string, msg: string) => {
        const id = Date.now();
        setNotifications(prev => [{ id, title, msg, time: new Date() }, ...prev]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
    };

    const toggleApp = (appName: string) => {
        if (openApps.includes(appName)) {
            if (focusedApp === appName) {
                if (minimizedApps.includes(appName)) {
                    setMinimizedApps(prev => prev.filter(a => a !== appName));
                } else {
                    setMinimizedApps(prev => [...prev, appName]);
                    setFocusedApp(openApps.filter(a => a !== appName && !minimizedApps.includes(a))[0] || null);
                }
            } else {
                setFocusedApp(appName);
                setMinimizedApps(prev => prev.filter(a => a !== appName));
            }
        } else {
            setOpenApps(prev => [...prev, appName]);
            setFocusedApp(appName);
            addNotification("System", `Opening ${appName}...`);
        }
        setIsStartMenuOpen(false);
    };

    const toggleMaximize = (appName: string) => {
        setMaximizedApps(prev => prev.includes(appName) ? prev.filter(a => a !== appName) : [...prev, appName]);
    };

    const closeApp = (appName: string) => {
        setOpenApps(prev => prev.filter(a => a !== appName));
        setMinimizedApps(prev => prev.filter(a => a !== appName));
        if (focusedApp === appName) setFocusedApp(null);
    };

    const [files, setFiles] = useState<Record<string, string>>({
        'index.html': "<h1>Loading...</h1>",
        'styles.css': "/* Write CSS here */",
        'script.js': "// Write JavaScript here"
    });
    const [activeFile, setActiveFile] = useState('index.html');
    const [taskStatus, setTaskStatus] = useState("TODO");
    const [simulationComplete, setSimulationComplete] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mailUnread, setMailUnread] = useState(true);
    const playbackLog = useRef<{offsetSeconds: number, code: string}[]>([]);
    const lastCode = useRef<string>("");

    const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');

    const fetchSimulator = async () => {
        setFetchStatus('loading');
        setLoading(true);
        setError("");
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); 

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const scenarioId = urlParams.get('id');
            const taskId = urlParams.get('taskId');
            
            const url = taskId ? `/api/simulators?taskId=${taskId}` : '/api/simulators';
            const res = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            const json = await res.json();
            
            if (json.success && json.data.length > 0) {
                setAllScenarios(json.data);
                
                let target = null;
                if (taskId || scenarioId) {
                    target = json.data.find((s: any) => s._id === (taskId || scenarioId)) || null;
                }
                if (!target && json.data.length === 1) {
                    target = json.data[0];
                }

                if (target) {
                    setScenario(target);
                    
                    // Resume from last session if available
                    if (target.lastSession) {
                        const savedCode = target.lastSession.code || target.initialCode;
                        setFiles(prev => ({ 
                            ...prev, 
                            'index.html': savedCode,
                            'styles.css': target.lastSession.css || "/* Custom Styles */",
                            'script.js': target.lastSession.js || "// Custom JS"
                        }));
                        // Don't lock the editor even if DONE, let the user keep playing
                        setTaskStatus(target.lastSession.status || "TODO");
                        if (target.lastSession.status === "DONE") setSimulationComplete(true);
                        lastCode.current = savedCode;
                        playbackLog.current = [{ offsetSeconds: 0, code: savedCode }];
                    } else {
                        setFiles({
                            'index.html': target.initialCode || "<h1>Welcome to Webory OS</h1>",
                            'styles.css': "/* Write your CSS here */\n.cta-button {\n  background: #3b82f6;\n  color: white;\n  padding: 12px 24px;\n  border-radius: 8px;\n}",
                            'script.js': "// Write your JavaScript here\nconsole.log('Environment ready');"
                        });
                        setTaskStatus("TODO");
                        lastCode.current = target.initialCode;
                        playbackLog.current = [{ offsetSeconds: 0, code: target.initialCode }];
                    }
                    setTimeLeft((target.timeLimit || 30) * 60);
                }
                setFetchStatus('success');
            } else {
                setError("No simulator scenarios found. Please create one in the Admin Dashboard.");
                setFetchStatus('error');
            }
        } catch (err: any) {
            if (err.name === 'AbortError') {
                setError("Connection timed out. The server is taking too long to respond.");
            } else {
                setError("Failed to load simulator data. Please check your connection.");
            }
            setFetchStatus('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSimulator();
    }, []);

    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    useEffect(() => {
        if (timeLeft === null || simulationComplete || taskStatus === 'FAILED') return;
        if (timeLeft <= 0) {
            setTaskStatus('FAILED');
            return;
        }
        const timerId = setInterval(() => {
            setTimeLeft(prev => prev! - 1);
            setElapsedSeconds(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, simulationComplete, taskStatus]);

    useEffect(() => {
        if (elapsedSeconds > 0 && elapsedSeconds % 5 === 0 && files['index.html'] !== lastCode.current) {
            playbackLog.current.push({ offsetSeconds: elapsedSeconds, code: files['index.html'] });
            lastCode.current = files['index.html'];
        }
    }, [elapsedSeconds, files]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleRunTests = async () => {
        if (!scenario) return;
        
        setFeedback(null);
        setIsSubmitting(true);
        
        // Normalize student code: remove comments and extra whitespace for easier matching
        const normalizedCode = (files['index.html'] || "")
            .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // remove comments
            .replace(/\s+/g, ' ') // normalize whitespace to single space
            .trim();

        let regex;
        try {
            const match = scenario.expectedRegex.match(/^\/(.*?)\/([gimsuy]*)$/);
            if (match) {
                regex = new RegExp(match[1], match[2]);
            } else {
                regex = new RegExp(scenario.expectedRegex);
            }

            // Test against both raw and normalized code for maximum flexibility
            if (regex.test(files['index.html'] || "") || regex.test(normalizedCode)) {
                
                setFeedback({ type: 'success', msg: "Unit tests passed! Awaiting Senior Dev Review..." });
                
                try {
                    const res = await fetch('/api/simulators/review', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code: files['index.html'], scenario })
                    });
                    const aiData = await res.json();
                    
                    if (aiData.passed !== false) { // true or undefined (fallback)
                        setTaskStatus("DONE");
                        setSimulationComplete(true);
                        setShowCompleteModal(true);
                        setFeedback({ type: 'success', msg: "PR Approved & Merged! Feedback: " + (aiData.feedback?.[0] || 'LGTM!') });
                        
                        
                        fetch('/api/simulators/xp', { method: 'POST', body: JSON.stringify({ xp: 30 }), headers: { 'Content-Type': 'application/json' } }).catch(() => {});
                        
                        const urlParams = new URLSearchParams(window.location.search);
                        const taskId = urlParams.get('taskId');

                        fetch('/api/simulators/sessions', { 
                            method: 'POST', 
                            body: JSON.stringify({ 
                                scenarioId: !taskId ? scenario._id : undefined,
                                taskId: taskId || undefined,
                                timeTakenSeconds: elapsedSeconds, 
                                passed: true, 
                                playback: playbackLog.current,
                                finalCode: files['index.html'],
                                taskStatus: "DONE"
                            }),
                            headers: { 'Content-Type': 'application/json' }
                        }).catch(() => {});
                    } else {
                        setFeedback({ type: 'error', msg: "PR Rejected by Senior Dev: " + (aiData.feedback?.[0] || 'Poor code quality.') });
                    }
                } catch (e) {
                    console.error(e);
                    setFeedback({ type: 'error', msg: "Review service unavailable. Try again." });
                }
            } else {
                setFeedback({ type: 'error', msg: "Tests failed! Custom logic requirements not met." });
            }
        } catch (e) {
            console.error("Invalid Regex in DB:", e);
            setFeedback({ type: 'error', msg: "Internal system error in validation logic." });
        }
        setIsSubmitting(false);
    };

    if (loading) {
        return (
            <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
                <Loader2 className="animate-spin text-blue-500" size={48} />
                <p className="text-slate-400 font-medium animate-pulse">Booting WeboryOS...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white gap-4 p-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-2">
                    <AlertCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold">System Error</h1>
                <p className="text-slate-400 max-w-md">{error}</p>
                <div className="flex gap-4">
                    <Button onClick={() => fetchSimulator()} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white border-none">
                        <RotateCcw size={16} className="mr-2" /> Retry Connection
                    </Button>
                    <Button onClick={() => window.location.href = '/'} variant="outline" className="mt-4 border-slate-700 hover:bg-slate-800 text-slate-300">
                        Return to Home
                    </Button>
                </div>
            </div>
        );
    }

    if (!scenario && allScenarios.length > 1) {
        return (
            <div className="min-h-screen w-full bg-slate-950 flex flex-col text-white p-6 md:p-12 overflow-y-auto">
                <div className="max-w-6xl mx-auto w-full pt-12">
                    <h1 className="text-4xl font-bold mb-4">Select a Simulator Scenario</h1>
                    <p className="text-slate-400 mb-12 text-lg">Choose a mock role to test your skills in WeboryOS.</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {allScenarios.map((sim: any) => (
                            <div 
                                key={sim._id} 
                                onClick={() => { 
                                    if (!sim.completed) {
                                        setScenario(sim); 
                                        setCode(sim.initialCode); 
                                        setTimeLeft((sim.timeLimit || 30) * 60); 
                                    }
                                }} 
                                className={`bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col transition-colors ${sim.completed ? 'opacity-70 cursor-not-allowed' : 'hover:border-blue-500/50 cursor-pointer group'}`}
                            >
                                <div className="text-xs font-bold text-blue-400 uppercase mb-3 tracking-widest">{sim.difficulty || 'Beginner'} • {sim.timeLimit || 30} mins</div>
                                <h3 className="text-2xl font-bold mb-2">{sim.role}</h3>
                                <p className="text-slate-500 mb-8 flex-1">{sim.company}</p>
                                <Button 
                                    disabled={sim.completed}
                                    className={`w-full ${sim.completed ? 'bg-green-600/20 text-green-500 border border-green-500/30' : 'bg-slate-800 group-hover:bg-blue-600 group-hover:text-white text-slate-300'}`}
                                >
                                    {sim.completed ? <><CheckCircle2 size={16} className="mr-2" /> Completed</> : "Start Simulator"}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Default fallback to scenario required for the actual simulator UI
    if (!scenario) return null;

    return (
        <div className="h-screen w-full bg-slate-900 bg-cover bg-center overflow-hidden flex flex-col font-sans text-slate-100" style={{ backgroundImage: `url(${wallpaper})` }}>
            {/* Top Menu Bar */}
            <div className="h-8 bg-black/50 backdrop-blur-md px-4 flex items-center justify-between text-xs font-medium z-[100]">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
                        className={`font-bold flex items-center gap-1.5 px-2 py-0.5 rounded transition-colors ${isStartMenuOpen ? 'bg-blue-600 text-white' : 'hover:bg-white/10'}`}
                    >
                        <LayoutGrid size={14} /> Webory
                    </button>
                    <span className="opacity-60 cursor-default hidden sm:inline">File</span>
                    <span className="opacity-60 cursor-default hidden sm:inline">Edit</span>
                    <span className="opacity-60 cursor-default hidden sm:inline">View</span>
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                    <button onClick={() => setIsControlCenterOpen(!isControlCenterOpen)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                        <Wifi size={14} className="text-blue-400" />
                    </button>
                    <button onClick={() => setIsControlCenterOpen(!isControlCenterOpen)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                        <Battery size={14} className="text-green-400" />
                    </button>
                    {timeLeft !== null && (
                        <div className={`font-mono font-bold px-2 py-0.5 rounded ${timeLeft < 300 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-200'}`}>
                            {formatTime(timeLeft)}
                        </div>
                    )}
                    <span className="hidden md:inline">{scenario.role} @ {scenario.company}</span>
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <button onClick={() => setIsControlCenterOpen(!isControlCenterOpen)} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors ml-2">
                        <div className="flex flex-col gap-0.5">
                            <div className="w-4 h-0.5 bg-white/60"></div>
                            <div className="w-4 h-0.5 bg-white/60"></div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Notifications Overlay */}
            <div className="fixed top-12 right-4 z-[200] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {notifications.map(n => (
                        <motion.div 
                            key={n.id}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl w-80 pointer-events-auto"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Bell size={14} className="text-blue-400" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{n.title}</span>
                                <span className="ml-auto text-[10px] text-slate-500">{n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p className="text-sm font-medium text-slate-200">{n.msg}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Control Center */}
            <AnimatePresence>
                {isControlCenterOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="absolute top-10 right-4 w-80 bg-slate-950/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-[150] p-6"
                    >
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-blue-600 p-4 rounded-2xl flex flex-col gap-2">
                                <Wifi size={20} />
                                <div className="text-xs font-bold">Webory_5G</div>
                            </div>
                            <div className="bg-white/10 p-4 rounded-2xl flex flex-col gap-2">
                                <Volume2 size={20} />
                                <div className="text-xs font-bold">100%</div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-2xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <Sun size={18} className="text-yellow-400" />
                                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="w-3/4 h-full bg-white"></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Volume2 size={18} className="text-blue-400" />
                                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="w-1/2 h-full bg-blue-500"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Start Menu */}
            <AnimatePresence>
                {isStartMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-10 left-4 w-72 bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden p-2"
                    >
                        <div className="p-4 border-b border-white/5 mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                                    {authUser?.name?.[0] || 'U'}
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{authUser?.name || 'User'}</div>
                                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Webory OS Pro</div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <button onClick={() => toggleApp('settings')} className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl transition-colors text-sm">
                                <Settings size={18} className="text-slate-400" /> System Settings
                            </button>
                            <button onClick={() => window.location.reload()} className="w-full flex items-center gap-3 p-3 hover:bg-white/10 rounded-xl transition-colors text-sm">
                                <RotateCcw size={18} className="text-slate-400" /> Restart Simulator
                            </button>
                            <div className="h-[1px] bg-white/5 my-2"></div>
                            <button onClick={() => router.push('/')} className="w-full flex items-center gap-3 p-3 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors text-sm">
                                <X size={18} /> Shutdown (Return Home)
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Workspace */}
            <div className="flex-1 relative overflow-hidden" onClick={() => setIsStartMenuOpen(false)}>
                {showCompleteModal && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-slate-900 p-8 rounded-2xl shadow-2xl z-[200] text-center max-w-md animate-in zoom-in duration-300 border border-slate-200">
                        <button 
                            onClick={() => setShowCompleteModal(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Award size={32} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Scenario Complete!</h2>
                        <p className="text-slate-600 mb-6 font-medium">Great job fixing that bug. You've earned +30 XP and leveled up your {scenario.role} skills!</p>
                        <div className="flex gap-3">
                            <Button onClick={() => router.push('/')} className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 text-white">Return Home</Button>
                            <Button onClick={() => setShowCompleteModal(false)} variant="outline" className="flex-1 border-slate-200 h-11">Stay & Explore</Button>
                        </div>
                    </div>
                )}
                
                {taskStatus === 'FAILED' && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-slate-900 p-8 rounded-2xl shadow-2xl z-[200] text-center max-w-md animate-in zoom-in duration-300">
                        <h2 className="text-2xl font-bold mb-2 text-red-600">Time's Up!</h2>
                        <p className="text-slate-600 mb-6">You ran out of time. Try again!</p>
                        <Button onClick={() => window.location.reload()} className="w-full bg-red-600">Retry</Button>
                    </div>
                )}

                {/* Windows Overlay */}
                {openApps.map(app => (
                    <div key={app} style={{ zIndex: focusedApp === app ? 50 : 10, display: minimizedApps.includes(app) ? 'none' : 'block' }}>
                        {app === 'mail' && <MailWindow scenario={scenario} onClose={() => closeApp('mail')} onFocus={() => setFocusedApp('mail')} onMinimize={() => setMinimizedApps(prev => [...prev, 'mail'])} onMaximize={() => toggleMaximize('mail')} isMaximized={maximizedApps.includes('mail')} />}
                        {app === 'jira' && <JiraWindow scenario={scenario} onClose={() => closeApp('jira')} onFocus={() => setFocusedApp('jira')} onMinimize={() => setMinimizedApps(prev => [...prev, 'jira'])} onMaximize={() => toggleMaximize('jira')} isMaximized={maximizedApps.includes('jira')} taskStatus={taskStatus} setTaskStatus={(s: string) => {
                            setTaskStatus(s);
                            const taskId = new URLSearchParams(window.location.search).get('taskId');
                            fetch('/api/simulators/sessions', { 
                                method: 'POST', 
                                body: JSON.stringify({ 
                                    scenarioId: !taskId ? scenario._id : undefined,
                                    taskId: taskId || undefined,
                                    timeTakenSeconds: elapsedSeconds, 
                                    passed: false, 
                                    playback: playbackLog.current,
                                    finalCode: files['index.html'],
                                    taskStatus: s
                                }),
                                headers: { 'Content-Type': 'application/json' }
                            }).catch(() => {});
                        }} hintsUsed={hintsUsed} setHintsUsed={setHintsUsed} />}
                        {app === 'code' && <CodeWindow onClose={() => closeApp('code')} onFocus={() => setFocusedApp('code')} onMinimize={() => setMinimizedApps(prev => [...prev, 'code'])} onMaximize={() => toggleMaximize('code')} isMaximized={maximizedApps.includes('code')} files={files} setFiles={setFiles} activeFile={activeFile} setActiveFile={setActiveFile} onRun={handleRunTests} taskStatus={taskStatus} feedback={feedback} isSubmitting={isSubmitting} />}
                        {app === 'chat' && <ChatWindow scenario={scenario} hintsUsed={hintsUsed} setHintsUsed={setHintsUsed} onClose={() => closeApp('chat')} onFocus={() => setFocusedApp('chat')} onMinimize={() => setMinimizedApps(prev => [...prev, 'chat'])} onMaximize={() => toggleMaximize('chat')} isMaximized={maximizedApps.includes('chat')} />}
                        {app === 'browser' && <BrowserWindow onClose={() => closeApp('browser')} onFocus={() => setFocusedApp('browser')} onMinimize={() => setMinimizedApps(prev => [...prev, 'browser'])} onMaximize={() => toggleMaximize('browser')} isMaximized={maximizedApps.includes('browser')} files={files} />}
                        {app === 'meet' && <MeetWindow scenario={scenario} files={files} onClose={() => closeApp('meet')} onFocus={() => setFocusedApp('meet')} onMinimize={() => setMinimizedApps(prev => [...prev, 'meet'])} onMaximize={() => toggleMaximize('meet')} isMaximized={maximizedApps.includes('meet')} />}
                        {app === 'terminal' && <TerminalWindow onClose={() => closeApp('terminal')} onFocus={() => setFocusedApp('terminal')} onMinimize={() => setMinimizedApps(prev => [...prev, 'terminal'])} onMaximize={() => toggleMaximize('terminal')} isMaximized={maximizedApps.includes('terminal')} />}
                        {app === 'settings' && (
                            <WindowTemplate title="System Settings" icon={<Settings size={16}/>} onClose={() => closeApp('settings')} onFocus={() => setFocusedApp('settings')} onMinimize={() => setMinimizedApps(prev => [...prev, 'settings'])} onMaximize={() => toggleMaximize('settings')} isMaximized={maximizedApps.includes('settings')}>
                                <div className="p-8">
                                    <h2 className="text-xl font-bold mb-6">Personalization</h2>
                                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Desktop Wallpaper</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[
                                            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
                                            "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2670&auto=format&fit=crop",
                                            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop",
                                            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2670&auto=format&fit=crop"
                                        ].map(url => (
                                            <div 
                                                key={url} 
                                                onClick={() => setWallpaper(url)}
                                                className={`h-24 rounded-lg bg-cover bg-center cursor-pointer border-2 transition-all ${wallpaper === url ? 'border-blue-500 scale-95 shadow-lg' : 'border-transparent hover:border-white/20'}`}
                                                style={{ backgroundImage: `url(${url})` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </WindowTemplate>
                        )}
                    </div>
                ))}
            </div>

            {/* macOS-style Dock */}
            <div className="h-24 pb-4 flex justify-center w-full z-50">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-2 flex items-center gap-4 shadow-2xl mb-4">
                    <DockIcon 
                        icon={<Mail size={28} />} 
                        name="Mail" 
                        active={openApps.includes('mail')} 
                        focused={focusedApp === 'mail'}
                        onClick={() => { toggleApp('mail'); setMailUnread(false); }} 
                        badge={mailUnread ? "1" : null}
                    />
                    <DockIcon 
                        icon={<CheckSquare size={28} />} 
                        name="Tasks" 
                        active={openApps.includes('jira')} 
                        focused={focusedApp === 'jira'}
                        onClick={() => toggleApp('jira')} 
                        badge={(taskStatus === 'TODO' || taskStatus === 'IN_PROGRESS') ? "1" : null}
                    />
                    <div className="w-[1px] h-10 bg-white/20 mx-2"></div>
                    <DockIcon 
                        icon={<Video size={28} />} 
                        name="Webory Meet" 
                        active={openApps.includes('meet')} 
                        focused={focusedApp === 'meet'}
                        onClick={() => toggleApp('meet')} 
                        badge={taskStatus === 'DONE' ? "Join" : null}
                        pulse={taskStatus === 'DONE'}
                    />
                    <DockIcon 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.95" x2="8.54" y1="6.06" y2="14"/><line x1="10.88" x2="15.46" y1="21.94" y2="14"/></svg>} 
                        name="Browser" 
                        active={openApps.includes('browser')} 
                        focused={focusedApp === 'browser'}
                        onClick={() => toggleApp('browser')} 
                    />
                    <DockIcon 
                        icon={<Code size={28} />} 
                        name="VS Code" 
                        active={openApps.includes('code')} 
                        focused={focusedApp === 'code'}
                        onClick={() => toggleApp('code')} 
                    />
                    <DockIcon 
                        icon={<Settings size={28} />} 
                        name="Settings" 
                        active={openApps.includes('settings')} 
                        focused={focusedApp === 'settings'}
                        onClick={() => toggleApp('settings')} 
                    />
                    <DockIcon 
                        icon={<Terminal size={28} />} 
                        name="Terminal" 
                        active={openApps.includes('terminal')} 
                        focused={focusedApp === 'terminal'}
                        onClick={() => toggleApp('terminal')} 
                    />
                </div>
            </div>
        </div>
    );
}

// Sub-components

function DockIcon({ icon, name, active, focused, onClick, badge, pulse }: any) {
    return (
        <div className="relative group flex flex-col items-center">
            <button 
                onClick={onClick}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${focused ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' : active ? 'bg-white/20 text-slate-100' : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:scale-110 active:scale-95'} ${pulse && !active ? 'animate-pulse ring-2 ring-green-500' : ''}`}
            >
                {icon}
            </button>
            {active && <div className="w-1.5 h-1.5 bg-slate-100 rounded-full mt-1.5 absolute -bottom-3"></div>}
            {badge && (
                <div className={`absolute -top-1 -right-1 min-w-5 h-5 px-1 ${badge === 'Join' ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md`}>
                    {badge}
                </div>
            )}
            <div className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-[100]">
                {name}
            </div>
        </div>
    );
}

function WindowTemplate({ title, icon, onClose, onFocus, onMinimize, onMaximize, isMaximized, children, className = "" }: any) {
    const windowVariants = {
        normal: {
            width: "85%",
            height: "75%",
            maxWidth: "1000px",
            maxHeight: "700px",
            top: "40px",
            left: "7.5%",
            borderRadius: "16px",
            scale: 1,
            opacity: 1,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        },
        maximized: {
            width: "100%",
            height: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            top: "0px",
            left: "0px",
            borderRadius: "0px",
            scale: 1,
            opacity: 1,
            boxShadow: "0 0 0px 0px rgba(0, 0, 0, 0)"
        }
    };

    return (
        <motion.div 
            drag={!isMaximized}
            dragMomentum={false}
            onMouseDown={onFocus}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={isMaximized ? "maximized" : "normal"}
            variants={windowVariants}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className={`absolute bg-slate-900 border border-slate-700 overflow-hidden flex flex-col shadow-2xl ${className}`} 
        >
            {/* Window Header */}
            <div className={`h-10 bg-slate-800/80 backdrop-blur border-b border-slate-700 flex items-center justify-between px-4 select-none ${isMaximized ? '' : 'cursor-move'}`}>
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group"><X size={8} className="opacity-0 group-hover:opacity-100 text-red-900"/></button>
                        <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group"><Minus size={8} className="opacity-0 group-hover:opacity-100 text-yellow-900"/></button>
                        <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group"><Maximize2 size={8} className="opacity-0 group-hover:opacity-100 text-green-900"/></button>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-[13px] font-medium">
                    {icon} {title}
                </div>
                <div className="w-12"></div>
            </div>
            {/* Window Content */}
            <div className="flex-1 overflow-hidden bg-slate-900 text-slate-200" onMouseDown={(e) => e.stopPropagation()}>
                {children}
            </div>
        </motion.div>
    );
}

function TerminalWindow({ onClose, onFocus, onMinimize, onMaximize, isMaximized }: any) {
    const [lines, setLines] = useState<string[]>(["Webory Terminal v1.0.0", "Type 'help' to see available commands."]);
    const [input, setInput] = useState("");

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = input.trim().toLowerCase();
        let reply = "";
        
        if (cmd === 'help') reply = "Available: help, clear, whoami, ls, date, neofetch";
        else if (cmd === 'whoami') reply = "webory_user";
        else if (cmd === 'ls') reply = "documents/  downloads/  projects/  secrets.txt";
        else if (cmd === 'date') reply = new Date().toString();
        else if (cmd === 'clear') { setLines([]); setInput(""); return; }
        else if (cmd === 'neofetch') reply = "Webory OS v1.0\nKernel: React 19\nUptime: 2h 45m\nShell: WeboryShell";
        else if (cmd !== "") reply = `Command not found: ${cmd}`;

        setLines(prev => [...prev, `> ${input}`, reply].filter(l => l !== ""));
        setInput("");
    };

    return (
        <WindowTemplate title="Terminal" icon={<Terminal size={16} className="text-green-400"/>} onClose={onClose} onFocus={onFocus} onMinimize={onMinimize} onMaximize={onMaximize} isMaximized={isMaximized} className="bg-black">
            <div className="p-4 font-mono text-sm text-green-500 h-full flex flex-col">
                <div className="flex-1 overflow-y-auto mb-2">
                    {lines.map((l, i) => <div key={i} className="whitespace-pre-wrap">{l}</div>)}
                </div>
                <form onSubmit={handleCommand} className="flex gap-2">
                    <span>$</span>
                    <input 
                        autoFocus
                        className="flex-1 bg-transparent border-none outline-none text-green-400"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </form>
            </div>
        </WindowTemplate>
    );
}

function BrowserWindow({ onClose, onFocus, onMinimize, onMaximize, isMaximized, files }: any) {
    const html = files['index.html'] || "";
    const css = files['styles.css'] || "";
    const js = files['script.js'] || "";

    const combinedCode = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    body { font-family: -apple-system, sans-serif; margin: 0; padding: 40px; background: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; }
                    /* System Defaults */
                    .cta-button { padding: 16px 40px; }
                    .card-preview { padding: 40px; }
                    
                    /* User Styles (Overrides) */
                    ${css}
                </style>
            </head>
            <body>
                <div id="root" class="w-full flex flex-col items-center">
                    ${html.includes('<') ? html : `
                        <div class="flex flex-col items-center gap-10 py-12 animate-in fade-in zoom-in duration-500">
                            <div class="text-center">
                                <p class="text-slate-400 text-[10px] mb-8 uppercase tracking-[0.2em] font-black">Design Playground</p>
                                <button class="cta-button bg-slate-900 text-white rounded-2xl font-bold shadow-2xl transition-all hover:scale-105 active:scale-95">
                                    Action Button
                                </button>
                            </div>
                            <div class="card-preview bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl max-w-sm text-center relative overflow-hidden group">
                                <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div class="w-16 h-16 bg-blue-600 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/20">W</div>
                                <h3 class="text-slate-900 font-black text-xl">Object Preview</h3>
                                <p class="text-slate-500 text-sm mt-3 leading-relaxed">Target <b>.cta-button</b> or <b>.card-preview</b> in your <i>styles.css</i> to see the magic happen!</p>
                            </div>
                        </div>
                    `}
                </div>
                <script>
                    try {
                        ${js}
                    } catch (e) {
                        console.error("Script Error:", e);
                    }
                </script>
            </body>
        </html>
    `;

    return (
        <WindowTemplate title="Webory Browser" icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.95" x2="8.54" y1="6.06" y2="14"/><line x1="10.88" x2="15.46" y1="21.94" y2="14"/></svg>} onClose={onClose} onFocus={onFocus} onMinimize={onMinimize} onMaximize={onMaximize} isMaximized={isMaximized}>
            <div className="flex flex-col h-full bg-white">
                <div className="h-12 bg-slate-100 border-b flex items-center px-4 gap-4 shrink-0">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    </div>
                    <div className="flex gap-2">
                        <ChevronLeft size={18} className="text-slate-400" />
                        <ChevronRight size={18} className="text-slate-400" />
                        <RotateCcw size={16} className="text-slate-400 ml-1" />
                    </div>
                    <div className="flex-1 bg-white rounded-full border border-slate-200 px-4 py-1.5 text-xs text-slate-500 flex items-center gap-2 shadow-sm">
                        <Lock size={10} className="text-green-500" />
                        <span className="opacity-50 font-medium">https://</span>webory.preview/app
                    </div>
                </div>
                <div className="flex-1 bg-[#f1f5f9] relative overflow-hidden">
                    <div className="absolute inset-0 overflow-auto p-8 flex flex-col items-center">
                        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden min-h-[400px] flex flex-col">
                            <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-1.5 shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400/20"></div>
                                <div className="ml-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Live Output</div>
                            </div>
                            <div className="flex-1 relative">
                                <iframe 
                                    key="browser-v4"
                                    title="Browser Preview"
                                    srcDoc={combinedCode}
                                    className="w-full h-full border-none"
                                    sandbox="allow-scripts"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </WindowTemplate>
    );
}

function MeetWindow({ scenario, files, onClose, onFocus, onMinimize, onMaximize, isMaximized }: any) {
    const [messages, setMessages] = useState<{sender: 'bot'|'user', text: string}[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [callStarted, setCallStarted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Stop speaking when window closes
    useEffect(() => {
        return () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const speakManager = (text: string) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang === 'en-US' && v.name.includes("Google")) || voices.find(v => v.lang.startsWith('en'));
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.rate = 1.0;
        utterance.pitch = 0.9;
        utterance.onerror = (e) => console.warn("Speech synthesis error suppressed:", e);
        window.speechSynthesis.speak(utterance);
    };

    const startCall = () => {
        setCallStarted(true);
        const greeting = `Hi! I'm the Engineering Manager at ${scenario.company}. I saw you just submitted a PR for the ${scenario.role} task. The code works, but can you walk me through your logic? Why did you approach it this way?`;
        setMessages([{
            sender: 'bot',
            text: greeting
        }]);
        speakManager(greeting);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        const newHistory = [...messages, { sender: 'user', text: userMsg }];
        setMessages(newHistory as any);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch('/api/simulators/interview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: files['index.html'], scenario, history: newHistory })
            });
            const data = await res.json();
            if (data.reply) {
                setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
                speakManager(data.reply);
            }
        } catch(e: any) {
            console.error("Meet AI Error:", e?.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <WindowTemplate title="Webory Meet - Interview" icon={<Video size={16} className="text-green-400"/>} onClose={onClose} onFocus={onFocus} onMinimize={onMinimize} onMaximize={onMaximize} isMaximized={isMaximized} className="bg-[#202124]">
            <div className="flex flex-col md:flex-row h-full bg-[#202124] text-white">
                {/* Video Area */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 relative bg-[#3c4043]">
                    {!callStarted ? (
                        <div className="text-center space-y-6">
                            <div className="w-32 h-32 bg-slate-800 rounded-full mx-auto flex items-center justify-center border-4 border-slate-700 shadow-xl relative overflow-hidden">
                                <Video size={48} className="text-slate-500" />
                            </div>
                            <h2 className="text-2xl font-serif">Ready to Join?</h2>
                            <p className="text-slate-400 max-w-sm mx-auto">Your manager is waiting in the core meeting room to discuss your recently merged PR.</p>
                            <Button onClick={startCall} className="bg-blue-600 hover:bg-blue-700 rounded-full px-8 h-12 text-lg shadow-lg hover:shadow-blue-500/25">Join Interview Call</Button>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                            <div className="relative w-64 h-64 md:w-96 md:h-96">
                                {/* Pulsing rings for "Talking" */}
                                {!loading && messages[messages.length-1]?.sender === 'bot' && (
                                    <>
                                        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                                        <div className="absolute inset-4 border-4 border-blue-400/50 rounded-full animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.2s' }}></div>
                                    </>
                                )}
                                <div className="absolute inset-0 bg-slate-800 rounded-full flex items-center justify-center border-4 border-slate-700 shadow-2xl overflow-hidden z-10">
                                    <User size={120} className="text-slate-500" />
                                </div>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-1 rounded-full text-sm z-20 backdrop-blur-sm whitespace-nowrap">
                                    Hiring Manager
                                </div>
                            </div>
                            
                            {/* Call Controls */}
                            <div className="flex gap-4 mt-8">
                                <button 
                                    className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-105" 
                                    onClick={onClose}
                                >
                                    <X size={24} />
                                </button>
                                <button 
                                    className={`w-14 h-14 ${isMuted ? 'bg-slate-300 text-slate-800' : 'bg-[#3c4043] border border-[#5f6368] hover:bg-[#4a4d51] text-slate-300'} rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-colors`}
                                    onClick={() => setIsMuted(!isMuted)}
                                >
                                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat / Captions Area */}
                {callStarted && (
                    <div className="w-full md:w-96 bg-white flex flex-col border-l border-slate-300 shadow-[-10px_0_20px_rgba(0,0,0,0.1)]">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 font-medium text-slate-800 flex items-center justify-between">
                            In-Call Messages
                            <div className="flex items-center gap-2 text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded-full"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Recorded</div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className="text-[11px] text-slate-500 mb-1 font-medium">{m.sender === 'user' ? 'You' : 'Manager'}</div>
                                    <div className={`text-[14px] p-3 rounded-2xl max-w-[85%] leading-relaxed ${m.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 rounded-bl-none border border-slate-200 shadow-sm'}`} style={{ color: m.sender === 'user' ? 'white' : '#0f172a' }}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex flex-col items-start animate-in fade-in">
                                    <div className="text-[11px] text-slate-500 mb-1 font-medium">Manager</div>
                                    <div className="text-[14px] px-4 py-3 bg-slate-100 rounded-2xl rounded-bl-none border border-slate-200 flex items-center gap-2 shadow-sm" style={{ color: '#475569' }}>
                                        <Loader2 size={14} className="animate-spin" /> Thinking...
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-white border-t border-slate-200">
                            <form onSubmit={handleSend} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Type your response..."
                                    className="w-full bg-slate-100 border border-slate-200 rounded-full px-5 py-3 pr-12 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
                                />
                                <button type="submit" disabled={!input.trim() || loading} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition-colors">
                                    <ChevronRight size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </WindowTemplate>
    );
}

function MailWindow({ scenario, onClose, onFocus, onMinimize, onMaximize, isMaximized }: any) {
    const emails = scenario.emails?.length > 0 ? scenario.emails : [{ sender: "System", subject: "Welcome", body: "No emails in this scenario." }];
    const [activeIndex, setActiveIndex] = useState(0);
    const activeEmail = emails[activeIndex] || emails[0];

    return (
        <WindowTemplate title="Mail" icon={<Mail size={16}/>} onClose={onClose} onFocus={onFocus} onMinimize={onMinimize} onMaximize={onMaximize} isMaximized={isMaximized}>
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-64 border-r border-slate-700 bg-slate-800/50 flex flex-col hidden md:flex h-full overflow-y-auto">
                    <div className="p-4 font-bold text-slate-300 text-sm tracking-wider uppercase sticky top-0 bg-slate-800/90 backdrop-blur z-10">Inbox</div>
                    {emails.map((email: any, idx: number) => (
                        <div 
                            key={idx} 
                            onClick={() => setActiveIndex(idx)}
                            className={`p-4 cursor-pointer border-l-4 transition-colors ${idx === activeIndex ? 'bg-blue-500/10 border-blue-500' : 'border-transparent hover:bg-slate-700/50 text-slate-400'}`}
                        >
                            <div className="flex justify-between items-start mb-1 gap-2">
                                <span className={`font-bold truncate ${idx === activeIndex ? 'text-slate-200' : 'text-slate-300'}`}>{email.sender}</span>
                                <span className="text-[10px] text-blue-400 whitespace-nowrap">{email.time || "Just now"}</span>
                            </div>
                            <div className={`text-sm font-medium truncate ${idx === activeIndex ? 'text-slate-300' : 'text-slate-400'}`}>{email.subject}</div>
                            <div className="text-xs text-slate-500 truncate mt-1">{email.body.substring(0, 30)}...</div>
                        </div>
                    ))}
                </div>
                {/* Mail Content */}
                <div className="flex-1 p-6 md:p-10 bg-white text-slate-900 overflow-y-auto h-full">
                    <h1 className="text-2xl md:text-3xl font-bold mb-6">{activeEmail.subject}</h1>
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                            {activeEmail.sender[0]}
                        </div>
                        <div className="min-w-0">
                            <div className="font-bold truncate">{activeEmail.sender} <span className="text-slate-500 text-sm font-normal ml-2">&lt;{activeEmail.sender.toLowerCase().replace(/\s+/g, '.')}@{scenario.company.toLowerCase().replace(/\s+/g, '')}.com&gt;</span></div>
                            <div className="text-sm text-slate-500 truncate">to me, team</div>
                        </div>
                    </div>
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-[15px] md:text-lg">
                        {activeEmail.body}
                    </div>
                </div>
            </div>
        </WindowTemplate>
    );
}

function JiraWindow({ scenario, onClose, onFocus, onMinimize, onMaximize, isMaximized, taskStatus, hintsUsed, setHintsUsed, setTaskStatus }: any) {
    const task = scenario.tasks[0] || { title: "Untitled", id: "000", desc: "No description." };
    return (
        <WindowTemplate title="Jira Work Management" icon={<Briefcase size={16}/>} onClose={onClose} onFocus={onFocus} onMinimize={onMinimize} onMaximize={onMaximize} isMaximized={isMaximized}>
            <div className="p-8 h-full bg-[#f4f5f7] text-[#172b4d] overflow-y-auto">
                <div className="flex items-center gap-2 text-sm text-[#5e6c84] font-medium mb-6">
                    Projects <ChevronRight size={16}/> {scenario.company} <ChevronRight size={16}/> Board
                </div>
                <h1 className="text-2xl font-bold mb-8">Active Sprints</h1>

                <div className="flex gap-6 h-full min-h-[400px]">
                    {/* TO DO Column */}
                    <div className="flex-1 bg-[#ebecf0] rounded-xl p-3 flex flex-col min-w-[250px]">
                        <h3 className="text-sm font-bold text-[#5e6c84] uppercase mb-3 px-2">To Do {taskStatus === 'TODO' ? '(1)' : '(0)'}</h3>
                        {taskStatus === 'TODO' && (
                            <div 
                                onClick={() => setTaskStatus('IN_PROGRESS')}
                                className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all active:scale-95 group relative"
                            >
                                <div className="absolute top-2 right-2 text-xs font-bold text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Click to Start
                                </div>
                                <div className="text-sm font-medium mb-2">{task.title}</div>
                                <div className="text-xs text-[#0052cc] bg-[#deebff] inline-block px-2 py-1 rounded font-bold mb-3">{task.id}</div>
                                <p className="text-sm text-slate-600 mb-3">{task.desc || scenario.emails[0]?.body}</p>
                                <div className="flex items-center justify-between text-[#5e6c84]">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle size={14} className="text-red-500" />
                                        <span className="text-xs">{task.priority || "High"}</span>
                                    </div>
                                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-[10px]">YOU</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* IN PROGRESS Column */}
                    <div className="flex-1 bg-[#ebecf0] rounded-xl p-3 flex flex-col min-w-[250px]">
                        <h3 className="text-sm font-bold text-[#5e6c84] uppercase mb-3 px-2">In Progress {taskStatus === 'IN_PROGRESS' ? '(1)' : '(0)'}</h3>
                        
                        {taskStatus === 'IN_PROGRESS' && (
                            <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500 cursor-default animate-in zoom-in duration-300">
                                <div className="text-sm font-medium mb-2">{task.title}</div>
                                <div className="text-xs text-[#0052cc] bg-[#deebff] inline-block px-2 py-1 rounded font-bold mb-3">{task.id}</div>
                                <p className="text-sm text-slate-600 mb-3 line-clamp-2">{task.desc || scenario.emails[0]?.body}</p>
                                <div className="flex items-center justify-between text-[#5e6c84]">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                        <span className="text-xs font-medium text-blue-600">Working</span>
                                    </div>
                                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-[10px]">YOU</div>
                                </div>
                            </div>
                        )}

                        {/* Highlights and Hints */}
                        {(taskStatus === 'TODO' || taskStatus === 'IN_PROGRESS') && scenario.hints && scenario.hints.length > 0 && (
                            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm animate-in fade-in">
                                <h4 className="text-xs font-bold text-yellow-800 uppercase mb-3 tracking-wider flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg> Available Hints</h4>
                                <div className="space-y-2">
                                    {scenario.hints.slice(0, hintsUsed).map((h: string, i: number) => (
                                        <div key={i} className="text-sm text-yellow-900 bg-yellow-100 p-2.5 rounded border border-yellow-200 leading-relaxed font-medium">{h}</div>
                                    ))}
                                    {hintsUsed < scenario.hints.length && (
                                        <Button variant="outline" size="sm" onClick={() => setHintsUsed((prev: number) => prev + 1)} className="w-full text-xs font-bold text-yellow-700 border-yellow-300 hover:bg-yellow-200 mt-2 bg-yellow-100/50">Reveal Next Hint</Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* DONE Column */}
                    <div className="flex-1 bg-[#ebecf0] rounded-xl p-3 flex flex-col min-w-[250px]">
                        <h3 className="text-sm font-bold text-[#5e6c84] uppercase mb-3 px-2">Done {taskStatus === 'DONE' ? '(1)' : '(0)'}</h3>
                        {taskStatus === 'DONE' && (
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 animate-in zoom-in duration-300">
                                <div className="text-sm font-medium mb-2 line-through text-slate-500">{task.title}</div>
                                <div className="text-xs text-[#0052cc] bg-[#deebff] inline-block px-2 py-1 rounded font-bold mb-3">{task.id}</div>
                                <div className="flex items-center justify-between text-[#5e6c84]">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-green-500" />
                                    </div>
                                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-[10px]">YOU</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </WindowTemplate>
    );
}

function CodeWindow({ onClose, onFocus, onMinimize, onMaximize, isMaximized, files, setFiles, activeFile, setActiveFile, onRun, taskStatus, feedback, isSubmitting }: any) {
    const fileIcons: Record<string, any> = {
        'index.html': <span className="text-orange-400">{'<>'}</span>,
        'styles.css': <span className="text-blue-400">#</span>,
        'script.js': <span className="text-yellow-400">JS</span>
    };

    return (
        <WindowTemplate title="Visual Studio Code" icon={<Code size={16} className="text-blue-400"/>} onClose={onClose} onFocus={onFocus} onMinimize={onMinimize} onMaximize={onMaximize} isMaximized={isMaximized}>
            <div className="flex h-full bg-[#181818] text-[#cccccc] font-sans">
                {/* Activity Bar (Far Left) */}
                <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-6 shrink-0">
                    <div className="text-white opacity-100 cursor-pointer"><LayoutGrid size={24} strokeWidth={1.5} /></div>
                    <div className="opacity-50 hover:opacity-100 cursor-pointer"><Briefcase size={22} strokeWidth={1.5} /></div>
                    <div className="opacity-50 hover:opacity-100 cursor-pointer"><Mail size={22} strokeWidth={1.5} /></div>
                    <div className="mt-auto opacity-50 hover:opacity-100 cursor-pointer"><Settings size={22} strokeWidth={1.5} /></div>
                    <div className="opacity-50 hover:opacity-100 cursor-pointer"><User size={22} strokeWidth={1.5} /></div>
                </div>

                {/* Sidebar (Explorer) */}
                <div className="w-48 bg-[#252526] flex flex-col shrink-0 border-r border-black/20">
                    <div className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider opacity-60">Explorer</div>
                    <div className="flex-1">
                        <div className="px-4 py-1 text-[11px] font-bold opacity-40 mb-1">WEBORY-PROJECT</div>
                        {Object.keys(files).map(fileName => (
                            <div 
                                key={fileName}
                                onClick={() => setActiveFile(fileName)}
                                className={`px-4 py-1.5 flex items-center gap-2 text-sm cursor-pointer transition-colors ${activeFile === fileName ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e]'}`}
                            >
                                <span className="w-4 flex justify-center text-[10px]">{fileIcons[fileName]}</span>
                                {fileName}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Tabs */}
                    <div className="h-9 bg-[#252526] flex overflow-x-auto no-scrollbar">
                        {Object.keys(files).map(fileName => (
                            <div 
                                key={fileName}
                                onClick={() => setActiveFile(fileName)}
                                className={`px-4 h-full flex items-center gap-2 text-xs cursor-pointer border-r border-black/10 transition-all ${activeFile === fileName ? 'bg-[#1e1e1e] text-white border-t border-t-blue-500' : 'bg-[#2d2d2d] opacity-50 hover:opacity-80'}`}
                            >
                                <span className="text-[10px]">{fileIcons[fileName]}</span>
                                {fileName}
                                <X size={10} className="ml-2 opacity-0 hover:opacity-100" />
                            </div>
                        ))}
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1 relative">
                        <Editor
                            height="100%"
                            language={activeFile.endsWith('.html') ? 'html' : activeFile.endsWith('.css') ? 'css' : 'javascript'}
                            theme="vs-dark"
                            value={files[activeFile]}
                            onChange={(val) => setFiles((prev: any) => ({ ...prev, [activeFile]: val || "" }))}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                lineNumbers: "on",
                                automaticLayout: true,
                                padding: { top: 12 },
                                scrollBeyondLastLine: false,
                                readOnly: false
                            }}
                        />
                    </div>

                    {/* Action Bar / Footer */}
                    <div className="h-6 bg-[#007acc] flex items-center justify-between px-3 text-[10px] font-medium shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 hover:bg-white/10 px-1 rounded cursor-pointer">
                                <CheckSquare size={10} /> Main*
                            </span>
                            <span className="opacity-70">Ln 1, Col 1</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {feedback && <span className="bg-white/20 px-2 py-0.5 rounded">{feedback.msg}</span>}
                            <button 
                                onClick={onRun}
                                disabled={isSubmitting || taskStatus === 'DONE'}
                                className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 px-2 py-0.5 rounded transition-colors"
                            >
                                <Play size={10} fill="currentColor" /> {isSubmitting ? "Testing..." : "Submit Code"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </WindowTemplate>
    );
}

function ChatWindow({ scenario, hintsUsed, setHintsUsed, onClose, onFocus, onMinimize, onMaximize, isMaximized }: any) {
    const [messages, setMessages] = useState<{sender: 'bot'|'user', text: string}[]>([
        { sender: 'bot', text: `Hi there! I'm your virtual manager at ${scenario.company}. Let me know if you need any help or hints with your current task.` }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        const newHistory = [...messages, { sender: 'user', text: userMsg }];
        setMessages(newHistory as any);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch('/api/simulators/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMsg, 
                    history: newHistory,
                    hints: scenario.hints || [],
                    currentHintIndex: hintsUsed,
                    scenario: scenario
                })
            });
            const data = await res.json();
            
            if (data.reply) {
                setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
                if (data.hintUsed && hintsUsed < (scenario.hints?.length || 0)) {
                    setHintsUsed((prev: number) => prev + 1);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <WindowTemplate title="Team Chat" icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>} onClose={onClose} onFocus={onFocus} onMinimize={onMinimize} onMaximize={onMaximize} isMaximized={isMaximized} className="bg-[#1e1e2e]">
            <div className="flex flex-col h-full bg-[#1e1e2e] text-slate-200">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl text-[15px] shadow-sm leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-in fade-in duration-300">
                            <div className="p-4 rounded-2xl text-[15px] shadow-sm bg-slate-800 border border-slate-700 text-slate-400 rounded-bl-none flex items-center gap-3">
                                <Loader2 size={16} className="animate-spin text-blue-400" /> Typing...
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-slate-800 bg-[#1e1e2e]">
                    <form onSubmit={handleSend} className="flex gap-3">
                        <input 
                            type="text" 
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-blue-500 shadow-inner" 
                            placeholder="Message your manager..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <Button type="submit" disabled={loading || !input.trim()} className="h-auto bg-blue-600 hover:bg-blue-700 px-6 rounded-xl font-medium">Send</Button>
                    </form>
                </div>
            </div>
        </WindowTemplate>
    );
}
