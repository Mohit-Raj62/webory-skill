import ReactMarkdown from "react-markdown";

export const SyllabusRenderer = ({ content }: { content: string }) => {
  return (
    <div className="relative border-l-2 border-blue-500/20 ml-3 pl-6 py-2">
      <ReactMarkdown
        components={{
          h2: ({ node, ...props }) => (
            <h2 
              className="relative text-xl md:text-2xl font-bold text-white mt-10 mb-4 flex items-center" 
              {...props} 
            >
              <span className="absolute -left-[33px] w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] border-2 border-[#020617]" />
              {props.children}
            </h2>
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-bold text-blue-300 mt-6 mb-2" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-none space-y-3 mb-6" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-gray-300 flex items-start text-sm md:text-base" {...props}>
              <span className="mr-3 text-blue-500 mt-0.5 flex-shrink-0 text-lg leading-none">•</span>
              <span>{props.children}</span>
            </li>
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-400 mb-4 leading-relaxed text-sm md:text-base" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="text-white font-bold" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
