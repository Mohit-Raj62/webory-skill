"use client";

import { useState, useEffect } from 'react';
import { Mail, CheckSquare, Code, X, Maximize2, Minus, User, Briefcase, ChevronRight, CheckCircle2, Play, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/session-provider';
import { useRouter } from 'next/navigation';

interface SimulatorData {
    _id: string;
    role: string;
    company: string;
    emails: any[];
    tasks: any[];
    initialCode: string;
    expectedRegex: string;
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeApp, setActiveApp] = useState<'mail' | 'jira' | 'code' | null>(null);
    const [code, setCode] = useState("");
    const [taskStatus, setTaskStatus] = useState("TODO");
    const [simulationComplete, setSimulationComplete] = useState(false);

    useEffect(() => {
        const fetchSimulator = async () => {
            try {
                // Try to get latest simulator if no ID provided
                const res = await fetch('/api/simulators');
                const json = await res.json();
                
                if (json.success && json.data.length > 0) {
                    const data = json.data[0];
                    setScenario(data);
                    setCode(data.initialCode);
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

    const handleRunTests = () => {
        if (!scenario) return;
        
        setFeedback(null);
        
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
                setTaskStatus("DONE");
                setSimulationComplete(true);
                setFeedback({ type: 'success', msg: "All tests passed! PR merged successfully." });
            } else {
                setFeedback({ type: 'error', msg: "Tests failed! The code doesn't match the requirements. Check your padding value." });
            }
        } catch (e) {
            console.error("Invalid Regex in DB:", e);
            setFeedback({ type: 'error', msg: "Internal system error in validation logic." });
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-white gap-4">
                <Loader2 className="animate-spin text-blue-500" size={48} />
                <p className="text-slate-400 font-medium animate-pulse">Booting WeboryOS...</p>
            </div>
        );
    }

    if (error || !scenario) {
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

                {/* Windows Overlay */}
                {activeApp === 'mail' && <MailWindow scenario={scenario} onClose={() => setActiveApp(null)} />}
                {activeApp === 'jira' && <JiraWindow scenario={scenario} onClose={() => setActiveApp(null)} taskStatus={taskStatus} />}
                {activeApp === 'code' && <CodeWindow onClose={() => setActiveApp(null)} code={code} setCode={setCode} onRun={handleRunTests} taskStatus={taskStatus} feedback={feedback} />}
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

function DockIcon({ icon, name, active, onClick, badge }: any) {
    return (
        <div className="relative group flex flex-col items-center">
            <button 
                onClick={onClick}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${active ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:scale-110 active:scale-95'}`}
            >
                {icon}
            </button>
            {active && <div className="w-1.5 h-1.5 bg-slate-300 rounded-full mt-1.5 absolute -bottom-3"></div>}
            {badge && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                    {badge}
                </div>
            )}
            <div className="absolute -top-10 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
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

function JiraWindow({ scenario, onClose, taskStatus }: any) {
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
                        {/* Empty */}
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

function CodeWindow({ onClose, code, setCode, onRun, taskStatus, feedback }: any) {
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
                        <div className="w-full flex bg-[#2d2d2d]">
                            <div className="px-4 py-2 bg-[#1e1e1e] text-[#ccc] text-sm border-t-2 border-blue-500 flex items-center gap-2">
                                <span className="text-blue-400">#</span> styles.css
                            </div>
                        </div>
                        
                        {/* Textarea disguised as code editor */}
                        <textarea 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                            className="w-full h-full p-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm leading-relaxed resize-none focus:outline-none"
                            disabled={taskStatus === 'DONE'}
                            placeholder="Type your code here..."
                        />

                        {/* Status Bar / Run Button */}
                        <div className="absolute bottom-4 right-4 flex flex-col items-end gap-3">
                            {feedback && (
                                <div className={`px-4 py-2 rounded-lg text-sm font-medium animate-in slide-in-from-bottom-2 ${feedback.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {feedback.type === 'error' && <AlertCircle className="inline mr-2" size={14} />}
                                    {feedback.msg}
                                </div>
                            )}
                            
                            {taskStatus === 'TODO' ? (
                                <button 
                                    onClick={onRun}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                                >
                                    <Play size={16} /> Run Tests & Submit PR
                                </button>
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
