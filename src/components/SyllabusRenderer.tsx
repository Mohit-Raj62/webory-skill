import ReactMarkdown from "react-markdown";
import { CheckCircle2, ChevronRight } from "lucide-react";

export const SyllabusRenderer = ({ content }: { content: string }) => {
  return (
    <div className="relative pl-8 py-2">
      {/* Animated Gradient Vertical Line */}
      <div className="absolute left-[11px] top-6 bottom-4 w-[2px] bg-gradient-to-b from-blue-500 via-indigo-500/50 to-transparent rounded-full" />
      
      <ReactMarkdown
        components={{
          h2: ({ node, ...props }) => (
            <div className="relative group mt-10 mb-5 first:mt-2">
              {/* Outer glowing ring */}
              <div className="absolute left-[-33px] top-[2px] w-6 h-6 rounded-full bg-blue-500/20 animate-pulse" />
              {/* Inner solid dot */}
              <div className="absolute left-[-29px] top-[6px] w-4 h-4 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-400 shadow-[0_0_15px_rgba(59,130,246,0.6)] border-2 border-[#0f172a] transition-transform duration-300 group-hover:scale-125" />
              
              <h2 
                className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 flex items-center" 
                {...props} 
              />
            </div>
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-bold text-indigo-300 mt-6 mb-3 flex items-center gap-2" {...props}>
              <ChevronRight size={18} className="text-indigo-400" />
              {props.children}
            </h3>
          ),
          ul: ({ node, ...props }) => (
            <ul className="space-y-3.5 mb-8 relative" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="flex items-start gap-3 text-slate-300 group transition-all duration-300 hover:translate-x-1" {...props}>
              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-500/40 group-hover:bg-blue-400 transition-colors flex-shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
              <span className="text-sm md:text-base leading-relaxed group-hover:text-white transition-colors">{props.children}</span>
            </li>
          ),
          p: ({ node, ...props }) => (
            <p className="text-slate-400 mb-5 leading-relaxed text-sm md:text-base" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="text-white font-bold bg-white/10 px-1.5 py-0.5 rounded-md text-[0.9em] border border-white/5" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
