"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, Users, TrendingUp, DollarSign, Megaphone, Settings, 
    CheckCircle, XCircle, Clock, Activity, MessageSquare, Play, 
    ChevronRight, Zap, Shield, Search, Bell, Menu, Cpu, ArrowUpRight,
    BarChart3, UserCheck, LayoutDashboard, BrainCircuit, Check, X, Loader2, Code
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type TaskStatus = 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed';

interface Task {
    id: string;
    department: string;
    agentName: string;
    title: string;
    description: string;
    impact: string;
    status: TaskStatus;
    time: string;
    result?: string;
    icon?: React.ReactNode;
    color?: string;
}

interface Department {
    id: string;
    name: string;
    agentName: string;
    icon: React.ReactNode;
    status: 'idle' | 'working' | 'waiting_approval';
    color: string;
    activeTasks: number;
    efficiency: number;
}

const mockDepartments: Department[] = [
    { id: 'sales', name: 'Sales', agentName: 'Atlas', icon: <TrendingUp size={20} />, status: 'waiting_approval', color: 'from-emerald-400 to-emerald-600', activeTasks: 12, efficiency: 98 },
    { id: 'marketing', name: 'Marketing', agentName: 'Nova', icon: <Megaphone size={20} />, status: 'waiting_approval', color: 'from-pink-400 to-rose-600', activeTasks: 8, efficiency: 95 },
    { id: 'finance', name: 'Finance', agentName: 'Ledger', icon: <DollarSign size={20} />, status: 'idle', color: 'from-amber-400 to-orange-600', activeTasks: 3, efficiency: 100 },
    { id: 'developer', name: 'Developer', agentName: 'Cipher', icon: <Code size={20} />, status: 'waiting_approval', color: 'from-cyan-400 to-blue-600', activeTasks: 7, efficiency: 94 },
    { id: 'support', name: 'Support', agentName: 'Echo', icon: <MessageSquare size={20} />, status: 'idle', color: 'from-teal-400 to-emerald-600', activeTasks: 18, efficiency: 96 },
    { id: 'hr', name: 'HR', agentName: 'Harmony', icon: <Users size={20} />, status: 'idle', color: 'from-violet-400 to-purple-600', activeTasks: 5, efficiency: 92 },
    { id: 'ops', name: 'Operations', agentName: 'Orion', icon: <Briefcase size={20} />, status: 'waiting_approval', color: 'from-blue-400 to-indigo-600', activeTasks: 15, efficiency: 89 },
];

const getAgentInfo = (department: string) => {
    switch (department.toLowerCase()) {
        case 'sales': return { icon: <TrendingUp size={18} />, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
        case 'marketing': return { icon: <Megaphone size={18} />, color: 'text-pink-500 bg-pink-500/10 border-pink-500/20' };
        case 'finance': return { icon: <DollarSign size={18} />, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
        case 'developer': return { icon: <Code size={18} />, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20' };
        case 'support': return { icon: <MessageSquare size={18} />, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' };
        case 'hr': return { icon: <Users size={18} />, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20' };
        case 'ops': case 'operations': return { icon: <Briefcase size={18} />, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
        default: return { icon: <BrainCircuit size={18} />, color: 'text-slate-500 bg-slate-500/10 border-slate-500/20' };
    }
}

export default function AgentOS() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [departments, setDepartments] = useState<Department[]>(mockDepartments);
    const [isBooting, setIsBooting] = useState(true);
    const [ceoMessage, setCeoMessage] = useState("Initializing intelligence parameters...");
    const [businessContext, setBusinessContext] = useState("A custom Webory SaaS platform");

    useEffect(() => {
        const fetchBriefing = async () => {
            try {
                const res = await fetch('/api/agent-os/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ context: businessContext })
                });
                const data = await res.json();
                
                if (data.tasks) {
                    const tasksWithUI = data.tasks.map((t: any) => {
                        const info = getAgentInfo(t.department);
                        return { ...t, icon: info.icon, color: info.color };
                    });
                    setTasks(tasksWithUI);
                }
                if (data.ceoMessage) {
                    setCeoMessage(data.ceoMessage);
                }
            } catch (err) {
                console.error("Failed to load OS data", err);
                setCeoMessage("Error connecting to intelligence nexus. Running in offline mode.");
            } finally {
                setIsBooting(false);
            }
        };

        fetchBriefing();
    }, [businessContext]);

    const handleApprove = async (id: string) => {
        const taskToApprove = tasks.find(t => t.id === id);
        if (!taskToApprove) return;

        // Optimistic update
        setTasks(tasks.map(t => t.id === id ? { ...t, status: 'in_progress' } : t));
        setDepartments(departments.map(d => d.id === taskToApprove.department ? { ...d, status: 'working' } : d));

        try {
            const res = await fetch('/api/agent-os/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: taskToApprove, context: businessContext })
            });
            const data = await res.json();

            setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed', result: data.result || "Task completed successfully." } : t));
            
            // Check if department has other active tasks
            setDepartments(prev => prev.map(d => {
                if (d.id === taskToApprove.department) {
                    return { ...d, status: 'idle' };
                }
                return d;
            }));
            
        } catch (err) {
            console.error(err);
            setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'pending' } : t)); // revert
        }
    };

    const handleApproveAll = async () => {
        const pendingTasks = tasks.filter(t => t.status === 'pending');
        if (pendingTasks.length === 0) return;

        // Optimistic update for all
        setTasks(prev => prev.map(t => t.status === 'pending' ? { ...t, status: 'in_progress' } : t));
        
        const activeDepts = Array.from(new Set(pendingTasks.map(t => t.department)));
        setDepartments(prev => prev.map(d => activeDepts.includes(d.id) ? { ...d, status: 'working' } : d));

        // Execute sequentially to avoid API rate limits
        for (const task of pendingTasks) {
            try {
                const res = await fetch('/api/agent-os/execute', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ task, context: businessContext })
                });
                
                if (!res.ok) {
                    throw new Error("API Limit reached or server error");
                }
                
                const data = await res.json();
                
                setTasks(prev => {
                    const newTasks = prev.map(t => t.id === task.id ? { ...t, status: 'completed', result: data.result || "Task completed successfully." } : t);
                    
                    // Keep department working if other tasks are still in progress
                    const isDeptStillWorking = newTasks.some(t => t.department === task.department && t.status === 'in_progress' && t.id !== task.id);
                    if (!isDeptStillWorking) {
                        setDepartments(prevDepts => prevDepts.map(d => d.id === task.department ? { ...d, status: 'idle' } : d));
                    }
                    
                    return newTasks;
                });
            } catch (err) {
                console.error(err);
                alert(`Task "${task.title}" failed. Gemini API rate limit ho sakta hai. Please wait 1 min and try again.`);
                setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'pending' } : t));
                setDepartments(prev => prev.map(d => d.id === task.department ? { ...d, status: 'waiting_approval' } : d));
            }
        }
    };

    const handleReject = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: 'rejected' } : t));
    };

    if (isBooting) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
                </div>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 flex flex-col items-center text-center px-6"
                >
                    <BrainCircuit size={64} className="text-blue-500 mb-6 animate-pulse" />
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
                        Agent OS
                    </h1>
                    <p className="text-slate-400 font-medium tracking-widest text-xs md:text-sm uppercase">Initializing Business Intelligence...</p>
                    
                    <div className="flex gap-2 mt-8">
                        <Loader2 className="animate-spin text-blue-500" size={24} />
                        <span className="text-slate-300">Generating daily briefing...</span>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-emerald-600/5 blur-[100px] rounded-full"></div>
                {/* Grid */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5"></div>
            </div>

            {/* Navbar */}
            <nav className="relative z-20 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <BrainCircuit size={18} className="text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">Agent OS</span>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-400">
                            <span className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><LayoutDashboard size={16} /> Dashboard</span>
                            <span className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><Users size={16} /> Team</span>
                            <span className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors"><BarChart3 size={16} /> Reports</span>
                        </div>
                        <div className="h-6 w-px bg-white/10 hidden md:block"></div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                                <Bell size={18} />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0f1c]"></span>
                            </button>
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                                <span className="text-xs font-bold text-slate-300">CEO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8 md:py-12 flex flex-col gap-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-2">Good morning, Founder.</h1>
                        <p className="text-slate-400 text-lg">Your AI team has drafted <span className="text-emerald-400 font-semibold">{tasks.filter(t => t.status === 'pending').length} tasks</span> requiring approval.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <button onClick={() => window.location.reload()} className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all flex items-center gap-2 backdrop-blur-md">
                            <Activity size={16} /> Refresh Agents
                        </button>
                        <button className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2">
                            <Plus size={16} /> New Initiative
                        </button>
                    </div>
                </div>

                {/* CEO Briefing Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 p-1 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-transparent"></div>
                    <div className="relative bg-slate-950/80 backdrop-blur-xl rounded-[22px] p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-xl shadow-blue-500/20">
                                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-500/20 animate-pulse"></div>
                                    <Cpu size={32} className="text-blue-400 relative z-10" />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-emerald-950 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border border-emerald-400 shadow-lg">
                                ONLINE
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h2 className="text-xl font-bold text-white">Nexus</h2>
                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/20">Chief Executive Agent</span>
                            </div>
                            <p className="text-slate-300 text-lg leading-relaxed">{ceoMessage}</p>
                        </div>

                        <div className="shrink-0 w-full md:w-auto">
                            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400"><TrendingUp size={16} /></div>
                                    <div>
                                        <div className="text-xs text-slate-400 font-medium">Revenue (24h)</div>
                                        <div className="text-sm font-bold text-white">+$4,250</div>
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400"><Activity size={16} /></div>
                                    <div>
                                        <div className="text-xs text-slate-400 font-medium">System Health</div>
                                        <div className="text-sm font-bold text-white">99.8%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Approvals & Completed */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <CheckCircle className="text-blue-500" size={20} />
                                Action Required
                                <span className="bg-red-500/20 text-red-400 text-xs py-0.5 px-2 rounded-full font-bold ml-2">
                                    {tasks.filter(t => t.status === 'pending').length}
                                </span>
                            </h2>
                            <button onClick={handleApproveAll} className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">Approve All</button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <AnimatePresence>
                                {tasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length === 0 && (
                                    <motion.div 
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="bg-slate-900/50 border border-white/5 rounded-2xl p-8 text-center flex flex-col items-center"
                                    >
                                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4">
                                            <CheckCircle size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">You're all caught up!</h3>
                                        <p className="text-slate-400">Your AI team is executing autonomously.</p>
                                    </motion.div>
                                )}
                                
                                {tasks.map((task) => {
                                    if (task.status === 'rejected' || task.status === 'completed') return null;
                                    return (
                                        <motion.div 
                                            key={task.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                            className="bg-slate-900 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group"
                                        >
                                            <div className="flex flex-col md:flex-row gap-5">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className={`p-1.5 rounded-lg border ${task.color}`}>
                                                            {task.icon}
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-300">
                                                            {task.agentName} <span className="text-slate-500 font-normal">({task.department.toUpperCase()})</span>
                                                        </span>
                                                        <span className="text-xs text-slate-500 flex items-center gap-1 ml-auto md:ml-0">
                                                            <Clock size={12} /> {task.time}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white mb-2">{task.title}</h3>
                                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{task.description}</p>
                                                    <div className="inline-flex items-start sm:items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 flex-col sm:flex-row w-full sm:w-auto">
                                                        <div className="flex items-center gap-2">
                                                            <Zap size={14} className="text-yellow-500 shrink-0" />
                                                            <span className="text-xs font-bold text-slate-300 whitespace-nowrap">Expected Impact:</span>
                                                        </div>
                                                        <span className="text-xs font-bold text-emerald-400 sm:ml-1">{task.impact}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex md:flex-col gap-3 justify-center shrink-0 border-t border-white/10 md:border-t-0 md:border-l md:pl-5 pt-4 md:pt-0">
                                                    {task.status === 'in_progress' ? (
                                                        <div className="flex flex-col items-center justify-center gap-2 text-blue-400 p-4">
                                                            <Loader2 size={24} className="animate-spin" />
                                                            <span className="text-xs font-bold">Executing...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button 
                                                                onClick={() => handleApprove(task.id)}
                                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                                            >
                                                                <Check size={18} /> Approve
                                                            </button>
                                                            <button 
                                                                onClick={() => handleReject(task.id)}
                                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 border border-white/10 text-slate-300 px-6 py-2.5 rounded-xl font-bold transition-all"
                                                            >
                                                                <X size={18} /> Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>

                        {/* Completed Tasks (Executed) */}
                        {tasks.filter(t => t.status === 'completed').length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                                    <CheckCircle className="text-emerald-500" size={20} />
                                    Completed Output
                                </h2>
                                <div className="flex flex-col gap-6">
                                    {tasks.map(task => {
                                        if (task.status !== 'completed') return null;
                                        return (
                                            <motion.div 
                                                key={`completed_${task.id}`}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5"
                                            >
                                                <div className="flex flex-wrap items-center gap-3 mb-4 border-b border-white/5 pb-4">
                                                    <div className={`p-1.5 rounded-lg border ${task.color} shrink-0`}>
                                                        {task.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-[200px]">
                                                        <h3 className="font-bold text-white text-sm sm:text-base leading-tight mb-1">{task.title}</h3>
                                                        <span className="text-xs text-slate-400">Executed by {task.agentName}</span>
                                                    </div>
                                                    <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ml-auto shrink-0">
                                                        <Check size={14} /> Done
                                                    </div>
                                                </div>
                                                <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 text-slate-300">
                                                    <ReactMarkdown>{task.result || ""}</ReactMarkdown>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Agents Overview */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Users className="text-purple-500" size={20} />
                                Active Agents
                            </h2>
                            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        <div className="bg-slate-900 border border-white/10 rounded-3xl p-3 flex flex-col gap-2">
                            {departments.map((dept, idx) => (
                                <div key={dept.id} className="group p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5 flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dept.color} p-[1px] shrink-0`}>
                                        <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center relative overflow-hidden">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-20 group-hover:opacity-40 transition-opacity`}></div>
                                            <div className="relative z-10 text-white">{dept.icon}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-bold text-white truncate">{dept.agentName}</h4>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{dept.name}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-2 w-2">
                                                {dept.status === 'working' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                                                <span className={`relative inline-flex rounded-full h-2 w-2 ${dept.status === 'working' ? 'bg-emerald-500' : dept.status === 'waiting_approval' ? 'bg-amber-500' : 'bg-slate-500'}`}></span>
                                            </span>
                                            <span className="text-xs text-slate-400 truncate">
                                                {dept.status === 'working' ? `Executing tasks...` : dept.status === 'waiting_approval' ? 'Awaiting approval' : 'Idle'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight size={14} className="text-slate-300" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Tasks Completed</div>
                                <div className="text-3xl font-black text-white">842</div>
                                <div className="text-emerald-400 text-xs font-bold mt-1 flex items-center gap-1"><ArrowUpRight size={12}/> +12% today</div>
                            </div>
                            <div className="bg-slate-900 border border-white/10 rounded-2xl p-5">
                                <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Hours Saved</div>
                                <div className="text-3xl font-black text-white">124<span className="text-xl text-slate-500">h</span></div>
                                <div className="text-blue-400 text-xs font-bold mt-1 flex items-center gap-1">This week</div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}

function Plus({ size, className }: { size: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    )
}
