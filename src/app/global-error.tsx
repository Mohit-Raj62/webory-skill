'use client'; // Error boundaries must be Client Components

import { AlertCircle, RefreshCcw } from 'lucide-react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Catch the error
  console.error("GLOBAL_ERROR:", error);
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">Critical Error</h2>
              <p className="text-zinc-400 text-sm">
                A fatal error occurred at the application root level. We have logged this issue.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="bg-black/50 p-4 rounded-lg text-left overflow-auto text-xs font-mono text-red-400 border border-red-500/20 max-h-64 space-y-2">
                <p className="font-bold underline">Error Message:</p>
                <p>{error.message || 'Unknown critical error'}</p>
                {error.digest && (
                  <p><span className="font-bold">Digest:</span> {error.digest}</p>
                )}
                {error.stack && (
                  <>
                    <p className="font-bold underline mt-2">Stack Trace:</p>
                    <pre className="whitespace-pre-wrap">{error.stack}</pre>
                  </>
                )}
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={() => reset()}
                className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Reload Application
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
