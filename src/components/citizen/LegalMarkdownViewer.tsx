import React from 'react';
import Markdown from 'react-markdown';

interface LegalMarkdownViewerProps {
  content: string;
}

export function LegalMarkdownViewer({ content }: LegalMarkdownViewerProps) {
  if (!content) return null;

  return (
    <div className="legal-markdown space-y-3 text-slate-950 text-[14.5px] sm:text-[15.5px] leading-[1.75] font-medium selection:bg-sky-200">
      <Markdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-lg sm:text-xl font-black text-slate-950 mt-4 mb-2.5 flex items-center gap-2 border-b border-sky-200/80 pb-2 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base sm:text-lg font-extrabold text-slate-950 mt-3.5 mb-2 flex items-center gap-2 text-sky-950 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[14px] sm:text-[15px] font-extrabold text-slate-950 mt-3 mb-2 flex items-center gap-1.5 bg-sky-100/90 border border-sky-300/70 px-3 py-1 rounded-xl w-fit shadow-xs">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-2 leading-[1.75] text-slate-950 font-medium">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 space-y-1.5 my-2 text-slate-950 font-medium marker:text-sky-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 space-y-1.5 my-2 text-slate-950 font-medium marker:text-sky-700 marker:font-bold">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-[1.7] pl-1 text-slate-950 font-medium">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-black text-slate-950 bg-sky-500/20 px-1.5 py-0.5 rounded-md border border-sky-400/50">
              {children}
            </strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-sky-600 pl-4 py-2 my-3 bg-gradient-to-r from-sky-500/15 via-sky-500/10 to-transparent rounded-r-2xl italic text-slate-900 font-semibold">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-slate-950 text-sky-200 px-2 py-0.5 rounded-md text-xs font-mono font-bold border border-white/10 shadow-2xs">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-slate-950 text-slate-50 p-4 rounded-2xl overflow-x-auto my-3 text-xs sm:text-sm font-mono border border-white/10 shadow-inner font-semibold">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-xl border border-sky-200 shadow-2xs">
              <table className="min-w-full divide-y divide-sky-200 text-left text-xs sm:text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-sky-100 text-slate-950 font-extrabold">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-sky-100/80 bg-white/80">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-sky-50 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 text-xs font-black text-slate-950 tracking-wider uppercase">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-semibold">{children}</td>
          ),
          hr: () => <hr className="my-3.5 border-sky-200/90" />,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
