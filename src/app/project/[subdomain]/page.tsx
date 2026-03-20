import React from "react";
import dbConnect from "@/lib/db";
import CodeSnippet from "@/models/CodeSnippet";
import { Metadata } from "next";
import { Loader2, Globe, Code2, Sparkles, ExternalLink, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface ProjectPageProps {
  params: Promise<{ subdomain: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { subdomain } = await params;
  await dbConnect();
  const snippet = await CodeSnippet.findOne({ subdomain });

  if (!snippet) {
    return { title: "Project Not Found | Webory Skills" };
  }

  return {
    title: `${snippet.title} | Live Project by Webory Student`,
    description: `Check out this live project deployed on Webory Skills. ${snippet.title} built with ${snippet.language}.`,
  };
}

export default async function ProjectLivePage({ params }: ProjectPageProps) {
  const { subdomain } = await params;
  await dbConnect();
  
  const snippet = await CodeSnippet.findOne({ subdomain }).populate("user", "firstName lastName profileImage");

  if (!snippet) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Globe className="w-16 h-16 text-gray-700 mx-auto mb-6 opacity-20" />
          <h1 className="text-4xl font-bold text-white mb-4">404: Project Not Found</h1>
          <p className="text-gray-400 mb-8 font-mono text-sm">
            The project subdomain <span className="text-blue-500">"{subdomain}"</span> does not exist or has been removed.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-bold">
            <ChevronLeft size={20} /> Back to Webory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col text-white selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
        style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #1e293b 1px, transparent 0)',
            backgroundSize: '32px 32px'
        }}
      />

      {/* Header / Banner */}
      <div className="relative z-10 bg-[#161b22]/80 backdrop-blur-md border-b border-[#30363d] px-6 py-4">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Code2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{snippet.title}</h1>
              <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1"><Sparkles size={12} className="text-yellow-500" /> Live Deployment</span>
                <span className="text-gray-600">|</span>
                <span>by {snippet.user?.firstName || "Webory Student"}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
               <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest leading-none">Powered By</span>
                    <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Webory Skills</span>
               </div>
               <Link href="/" className="md:ml-4 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <ExternalLink size={18} className="text-gray-400" />
               </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area (Full Screen Preview) */}
      <main className="relative z-10 flex-1 flex flex-col min-h-0 bg-white">
        <div className="absolute top-4 right-6 pointer-events-none transition-opacity duration-300">
             <div className="px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold text-white/50 tracking-tighter uppercase">
                  Sandboxed Preview Environment
             </div>
        </div>
        
        <iframe
          title="Live Project"
          srcDoc={snippet.code}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-modals allow-forms allow-popups allow-same-origin"
        />
      </main>

      {/* Footer Status Bar */}
      <footer className="relative z-10 bg-[#0d1117] border-t border-[#30363d] px-6 py-2">
           <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-[10px] font-mono text-gray-500 uppercase">Status: Live</span>
                     </div>
                     <span className="text-gray-700">|</span>
                     <span className="text-[10px] font-mono text-gray-500 uppercase">Stack: {snippet.language}</span>
                </div>
                <p className="text-[10px] font-mono text-gray-600 italic">This project was deployed in one-click via Webory DevLab.</p>
           </div>
      </footer>
    </div>
  );
}
