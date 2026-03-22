"use client";

import { useState, useEffect, useRef } from 'react';
import { Mail, CheckSquare, Code, X, Maximize2, Minus, User, Briefcase, ChevronRight, CheckCircle2, Play, AlertCircle, Loader2, Video, Mic, MicOff } from 'lucide-react';
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
    const [activeApp, setActiveApp] = useState<'mail' | 'jira' | 'code' | 'chat' | 'browser' | 'meet' | null>(null);
    const [code, setCode] = useState("");
    const [taskStatus, setTaskStatus] = useState("TODO");
    const [simulationComplete, setSimulationComplete] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const playbackLog = useRef<{offsetSeconds: number, code: string}[]>([]);
    const lastCode = useRef<string>("");

    useEffect(() => {
        const fetchSimulator = async () => {
            try {
                // Try to get latest simulator if no ID provided
                const res = await fetch('/api/simulators');
                const json = await res.json();
                
                if (json.success && json.data.length > 0) {
                    setAllScenarios(json.data);
                    const urlParams = new URLSearchParams(window.location.search);
                    const scenarioId = urlParams.get('id');
                    
                    const target = scenarioId ? (json.data.find((s: any) => s._id === scenarioId) || json.data[0]) : json.data[0];
                    setScenario(target);
                    setCode(target.initialCode);
                    lastCode.current = target.initialCode;
                    playbackLog.current = [{ offsetSeconds: 0, code: target.initialCode }];
                    setTimeLeft((target.timeLimit || 30) * 60);
                } else {
                    setError("No simulator scenarios found. Please create one in the Admin Dashboard.");
                }
            } catch (err) {
                setError("Failed to load simulator data.");
            } finally {
                setLoading(false);
            }
        };

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
        if (elapsedSeconds > 0 && elapsedSeconds % 5 === 0 && code !== lastCode.current) {
            playbackLog.current.push({ offsetSeconds: elapsedSeconds, code });
            lastCode.current = code;
        }
    }, [elapsedSeconds, code]);

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
        const normalizedCode = code
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
            if (regex.test(code) || regex.test(normalizedCode)) {
                
                setFeedback({ type: 'success', msg: "Unit tests passed! Awaiting Senior Dev Review..." });
                
                try {
                    const res = await fetch('/api/simulators/review', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ code, scenario })
                    });
                    const aiData = await res.json();
                    
                    if (aiData.passed !== false) { // true or undefined (fallback)
                        setTaskStatus("DONE");
                        setSimulationComplete(true);
                        setFeedback({ type: 'success', msg: "PR Approved & Merged! Feedback: " + (aiData.feedback?.[0] || 'LGTM!') });
                        
                        fetch('/api/simulators/xp', { method: 'POST', body: JSON.stringify({ xp: 50 }), headers: { 'Content-Type': 'application/json' } });
                        fetch('/api/simulators/sessions', { 
                            method: 'POST', 
                            body: JSON.stringify({ 
                                scenarioId: scenario._id, 
                                timeTakenSeconds: elapsedSeconds, 
                                passed: true, 
                                playback: playbackLog.current 
                            }),
                            headers: { 'Content-Type': 'application/json' }
                        });
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
                <Button onClick={() => window.location.href = '/'} variant="outline" className="mt-4 border-slate-700 hover:bg-slate-800">Return to Home</Button>
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
                            <div key={sim._id} onClick={() => { setScenario(sim); setCode(sim.initialCode); setTimeLeft((sim.timeLimit || 30) * 60); }} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl flex flex-col hover:border-blue-500/50 transition-colors cursor-pointer group">
                                <div className="text-xs font-bold text-blue-400 uppercase mb-3 tracking-widest">{sim.difficulty || 'Beginner'} • {sim.timeLimit || 30} mins</div>
                                <h3 className="text-2xl font-bold mb-2">{sim.role}</h3>
                                <p className="text-slate-500 mb-8 flex-1">{sim.company}</p>
                                <Button className="w-full bg-slate-800 group-hover:bg-blue-600 group-hover:text-white text-slate-300">Start Simulator</Button>
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
        <div className="h-screen w-full bg-slate-900 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center overflow-hidden flex flex-col font-sans text-slate-100">
            {/* Top Menu Bar */}
            <div className="h-8 bg-black/50 backdrop-blur-md px-4 flex items-center justify-between text-xs font-medium z-50">
                <div className="flex items-center gap-4">
                    <span className="font-bold">WeboryOS</span>
                    <span className="opacity-60 cursor-default">File</span>
                    <span className="opacity-60 cursor-default">Edit</span>
                    <span className="opacity-60 cursor-default">View</span>
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                    {timeLeft !== null && (
                        <div className={`font-mono font-bold px-2 py-0.5 rounded ${timeLeft < 300 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-200'}`}>
                            {formatTime(timeLeft)}
                        </div>
                    )}
                    <span className="hidden sm:inline">{scenario.role} @ {scenario.company}</span>
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

            {/* Desktop Workspace */}
            <div className="flex-1 relative p-4 lg:p-12">
                {simulationComplete && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-slate-900 p-8 rounded-2xl shadow-2xl z-[100] text-center max-w-md animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AwardIcon size={32} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Scenario Complete!</h2>
                        <p className="text-slate-600 mb-6 font-medium">Great job fixing that bug. You've earned +50 XP and leveled up your {scenario.role} skills!</p>
                        <Button onClick={() => window.location.href = '/'} className="w-full bg-blue-600 hover:bg-blue-700 h-11">Return Home</Button>
                    </div>
                )}
                
                {taskStatus === 'FAILED' && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-slate-900 p-8 rounded-2xl shadow-2xl z-[100] text-center max-w-md animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Time's Up!</h2>
                        <p className="text-slate-600 mb-6 font-medium">You ran out of time for this scenario. Real jobs have tight deadlines. Try again and work faster!</p>
                        <Button onClick={() => window.location.reload()} className="w-full bg-red-600 hover:bg-red-700 h-11 text-white">Retry Scenario</Button>
                    </div>
                )}

                {/* Windows Overlay */}
                {activeApp === 'mail' && <MailWindow scenario={scenario} onClose={() => setActiveApp(null)} />}
                {activeApp === 'jira' && <JiraWindow scenario={scenario} onClose={() => setActiveApp(null)} taskStatus={taskStatus} hintsUsed={hintsUsed} setHintsUsed={setHintsUsed} />}
                {activeApp === 'code' && <CodeWindow onClose={() => setActiveApp(null)} code={code} setCode={setCode} onRun={handleRunTests} taskStatus={taskStatus} feedback={feedback} isSubmitting={isSubmitting} />}
                {activeApp === 'chat' && <ChatWindow scenario={scenario} hintsUsed={hintsUsed} setHintsUsed={setHintsUsed} onClose={() => setActiveApp(null)} />}
                {activeApp === 'browser' && <BrowserWindow onClose={() => setActiveApp(null)} code={code} />}
                {activeApp === 'meet' && <MeetWindow scenario={scenario} code={code} onClose={() => setActiveApp(null)} />}
            </div>

            {/* macOS-style Dock */}
            <div className="h-24 pb-4 flex justify-center w-full z-50">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-2 flex items-center gap-4 shadow-2xl mb-4">
                    <DockIcon 
                        icon={<Mail size={28} />} 
                        name="Mail" 
                        active={activeApp === 'mail'} 
                        onClick={() => setActiveApp('mail')} 
                        badge="1"
                    />
                    <DockIcon 
                        icon={<CheckSquare size={28} />} 
                        name="Tasks" 
                        active={activeApp === 'jira'} 
                        onClick={() => setActiveApp('jira')} 
                        badge={taskStatus === 'TODO' ? "1" : null}
                    />
                    <div className="w-[1px] h-10 bg-white/20 mx-2"></div>
                    <DockIcon 
                        icon={<Video size={28} />} 
                        name="Webory Meet" 
                        active={activeApp === 'meet'} 
                        onClick={() => setActiveApp('meet')} 
                        badge={taskStatus === 'DONE' ? "Join" : null}
                        pulse={taskStatus === 'DONE'}
                    />
                    <DockIcon 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.95" x2="8.54" y1="6.06" y2="14"/><line x1="10.88" x2="15.46" y1="21.94" y2="14"/></svg>} 
                        name="Browser" 
                        active={activeApp === 'browser'} 
                        onClick={() => setActiveApp('browser')} 
                    />
                    <DockIcon 
                        icon={<Code size={28} />} 
                        name="VS Code" 
                        active={activeApp === 'code'} 
                        onClick={() => setActiveApp('code')} 
                    />
                </div>
            </div>
        </div>
    );
}

// Sub-components

function DockIcon({ icon, name, active, onClick, badge, pulse }: any) {
    return (
        <div className="relative group flex flex-col items-center">
            <button 
                onClick={onClick}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${active ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:scale-110 active:scale-95'} ${pulse && !active ? 'animate-pulse ring-2 ring-green-500' : ''}`}
            >
                {icon}
            </button>
            {active && <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5 absolute -bottom-3"></div>}
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

function WindowTemplate({ title, icon, onClose, children, className = "" }: any) {
    return (
        <div className={`absolute top-0 left-0 right-0 bottom-0 m-auto bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 ${className}`} style={{ width: '90%', maxWidth: '1000px', height: '80%', maxHeight: '700px', borderRadius: '12px' }}>
            {/* Window Header */}
            <div className="h-12 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 select-none">
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        <button onClick={onClose} className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group"><X size={10} className="opacity-0 group-hover:opacity-100 text-red-900"/></button>
                        <button className="w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center group"><Minus size={10} className="opacity-0 group-hover:opacity-100 text-yellow-900"/></button>
                        <button className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group"><Maximize2 size={10} className="opacity-0 group-hover:opacity-100 text-green-900"/></button>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                    {icon} {title}
                </div>
                <div className="w-16"></div> {/* Spacer for centering */}
            </div>
            {/* Window Content */}
            <div className="flex-1 overflow-hidden bg-slate-900 text-slate-200">
                {children}
            </div>
        </div>
    );
}

function MailWindow({ scenario, onClose }: any) {
    const email = scenario.emails[0] || { sender: "System", subject: "Welcome", body: "No emails in this scenario." };
    return (
        <WindowTemplate title="Mail" icon={<Mail size={16}/>} onClose={onClose}>
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-64 border-r border-slate-700 bg-slate-800/50 hidden md:block">
                    <div className="p-4 font-bold text-slate-300 text-sm tracking-wider uppercase">Inbox</div>
                    <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 cursor-pointer">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-slate-200 truncate">{email.sender}</span>
                            <span className="text-xs text-blue-400">{email.time || "Just now"}</span>
                        </div>
                        <div className="text-sm font-medium text-slate-300 truncate">{email.subject}</div>
                        <div className="text-xs text-slate-500 truncate mt-1">{email.body.substring(0, 30)}...</div>
                    </div>
                </div>
                {/* Mail Content */}
                <div className="flex-1 p-6 md:p-10 bg-white text-slate-900 overflow-y-auto">
                    <h1 className="text-3xl font-bold mb-6">{email.subject}</h1>
                    <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                            {email.sender[0]}
                        </div>
                        <div>
                            <div className="font-bold">{email.sender}</div>
                            <div className="text-sm text-slate-500">to me, team</div>
                        </div>
                    </div>
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-lg">
                        {email.body}
                    </div>
                </div>
            </div>
        </WindowTemplate>
    );
}

function JiraWindow({ scenario, onClose, taskStatus, hintsUsed, setHintsUsed }: any) {
    const task = scenario.tasks[0] || { title: "Untitled", id: "000", desc: "No description." };
    return (
        <WindowTemplate title="Jira Work Management" icon={<Briefcase size={16}/>} onClose={onClose}>
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
                            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 cursor-pointer">
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
                        <h3 className="text-sm font-bold text-[#5e6c84] uppercase mb-3 px-2">In Progress (0)</h3>
                        {/* Highlights and Hints */}
                        {taskStatus === 'TODO' && scenario.hints && scenario.hints.length > 0 && (
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

function CodeWindow({ onClose, code, setCode, onRun, taskStatus, feedback, isSubmitting }: any) {
    const [executing, setExecuting] = useState(false);
    const [output, setOutput] = useState<{ stdout: string, stderr: string } | null>(null);

    const handleExecute = async () => {
        setExecuting(true);
        setOutput(null);
        try {
            const res = await fetch('/api/code/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: 'javascript', content: code })
            });
            const data = await res.json();
            if (data.run) {
                setOutput({ stdout: data.run.stdout, stderr: data.run.stderr });
            } else if (data.error) {
                setOutput({ stdout: '', stderr: String(data.error) });
            }
        } catch (error) {
            setOutput({ stdout: '', stderr: 'Execution Failed' });
        } finally {
            setExecuting(false);
        }
    };

    return (
        <WindowTemplate title="Visual Studio Code - styles.css" icon={<Code size={16} className="text-blue-400"/>} onClose={onClose} className="bg-[#1e1e1e]">
            <div className="flex flex-col h-full bg-[#1e1e1e]">
                {/* Explorer/Sidebar */}
                <div className="flex flex-1 overflow-hidden">
                    <div className="w-48 bg-[#252526] border-r border-[#333] hidden md:block">
                        <div className="text-[11px] uppercase font-bold text-[#ccc] p-3 tracking-wider">Explorer</div>
                        <div className="px-3 py-1 flex items-center gap-2 text-sm text-[#ccc] hover:bg-[#37373d] cursor-pointer bg-[#37373d]">
                            <span className="text-blue-400">#</span> styles.css
                        </div>
                        <div className="px-3 py-1 flex items-center gap-2 text-sm text-[#ccc] hover:bg-[#37373d] cursor-pointer">
                            <span className="text-yellow-400">JS</span> index.js
                        </div>
                        <div className="px-3 py-1 flex items-center gap-2 text-sm text-[#ccc] hover:bg-[#37373d] cursor-pointer">
                            <span className="text-orange-400">{'<>'}</span> index.html
                        </div>
                    </div>
                    
                    {/* Editor Area */}
                    <div className="flex-1 flex flex-col items-start bg-[#1e1e1e] relative">
                         {/* Tabs */}
                        <div className="w-full flex bg-[#2d2d2d] justify-between pr-4 items-center">
                            <div className="px-4 py-2 bg-[#1e1e1e] text-[#ccc] text-sm border-t-2 border-blue-500 flex items-center gap-2">
                                <span className="text-blue-400">#</span> code.html
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={handleExecute}
                                    disabled={executing || taskStatus === 'DONE'}
                                    className="px-4 py-1.5 bg-[#1e1e1e] hover:bg-[#333] text-slate-300 text-xs rounded border border-[#444] flex items-center gap-2 transition-all disabled:opacity-50 z-10"
                                >
                                    {executing ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} className="text-green-400" />} Run Code (Piston)
                                </button>
                            </div>
                        </div>
                        
                        {/* Monaco Editor */}
                        <div className="flex-1 w-full relative">
                            <Editor
                                height="100%"
                                defaultLanguage="html"
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value || "")}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    wordWrap: "on",
                                    readOnly: taskStatus === 'DONE',
                                    padding: { top: 16 }
                                }}
                            />
                        </div>

                        {/* Terminal Output */}
                        <div className="w-full h-48 bg-[#0f0f0f] border-t border-[#333] p-4 font-mono text-[13px] overflow-y-auto">
                            <div className="text-slate-500 mb-2 select-none flex justify-between text-xs tracking-wider">
                                <span>TERMINAL</span>
                                {executing && <span className="text-blue-400 animate-pulse">Running...</span>}
                            </div>
                            {output ? (
                                <div>
                                    {output.stdout && <pre className="text-slate-300 whitespace-pre-wrap">{output.stdout}</pre>}
                                    {output.stderr && <pre className="text-red-400 whitespace-pre-wrap">{output.stderr}</pre>}
                                    {!output.stdout && !output.stderr && <pre className="text-slate-500 italic">Finished executing.</pre>}
                                </div>
                            ) : (
                                <div className="text-slate-600">Click 'Run Code' to see Output here. Wait 3 seconds for results.</div>
                            )}
                        </div>

                        {/* Status Bar / Submit PR Button */}
                        <div className="absolute bottom-52 right-4 flex flex-col items-end gap-3 z-10 p-2 pointer-events-none">
                            {feedback && (
                                <div className={`px-4 py-2 rounded-lg text-sm font-medium animate-in slide-in-from-bottom-2 shadow-2xl pointer-events-auto ${feedback.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {feedback.type === 'error' && <AlertCircle className="inline mr-2" size={14} />}
                                    {feedback.msg}
                                </div>
                            )}
                            
                            {taskStatus === 'TODO' ? (
                                <div className="flex gap-2 pointer-events-auto">
                                    <button 
                                        onClick={onRun}
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded font-medium flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                                    >
                                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} 
                                        {isSubmitting ? "Reviewing..." : "Run Tests & Submit PR"}
                                    </button>
                                </div>
                            ) : (
                                <div className="px-6 py-2 bg-green-600 text-white rounded font-medium flex items-center gap-2 shadow-lg animate-in zoom-in duration-300">
                                    <CheckCircle2 size={16} /> Merged Successfully!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </WindowTemplate>
    );
}

function ChatWindow({ scenario, hintsUsed, setHintsUsed, onClose }: any) {
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
        <WindowTemplate title="Team Chat" icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>} onClose={onClose} className="bg-[#1e1e2e]">
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

function BrowserWindow({ code, onClose }: any) {
    // Basic heuristic: if the code doesn't look like HTML (no tags), assume it's CSS and wrap it.
    const isLikelyCss = !code.includes('<') && (code.includes('{') || code.includes(':'));
    const wrappedCode = isLikelyCss ? `
        <style>
            ${code}
        </style>
        <div class="cta-button">Preview CTA Button</div>
        <div class="container">Preview Container</div>
    ` : code;

    const srcDoc = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
                .cta-button { background-color: #3b82f6; color: white; border: none; border-radius: 4px; display: inline-block; cursor: pointer; }
            </style>
        </head>
        <body>
            ${wrappedCode}
        </body>
        </html>
    `;

    return (
        <WindowTemplate title="Chrome - Live Preview" icon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" x2="12" y1="8" y2="8"/><line x1="3.95" x2="8.54" y1="6.06" y2="14"/><line x1="10.88" x2="15.46" y1="21.94" y2="14"/></svg>} onClose={onClose} className="bg-white">
            <div className="flex flex-col h-full bg-white">
                <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-4">
                    <div className="flex gap-2 text-slate-400">
                        <ChevronRight className="rotate-180" size={16} />
                        <ChevronRight className="text-slate-300" size={16} />
                    </div>
                    <div className="flex-1 bg-white border border-slate-200 rounded-full h-6 px-3 text-xs text-slate-500 font-medium flex items-center">
                        localhost:3000/preview
                    </div>
                </div>
                <div className="flex-1 bg-white relative">
                    <iframe 
                        srcDoc={srcDoc}
                        title="browser preview"
                        className="w-full h-full border-none"
                        sandbox="allow-scripts"
                    />
                </div>
            </div>
        </WindowTemplate>
    );
}

function MeetWindow({ scenario, code, onClose }: any) {
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
                body: JSON.stringify({ code, scenario, history: newHistory })
            });
            const data = await res.json();
            if (data.reply) {
                setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
                speakManager(data.reply);
            }
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <WindowTemplate title="Webory Meet - Interview" icon={<Video size={16} className="text-green-400"/>} onClose={onClose} className="bg-[#202124]">
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

function AwardIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
    )
}
